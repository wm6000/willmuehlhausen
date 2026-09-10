import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import type { Layer, Map as LeafletMap } from "leaflet";

import { Button, MountPoint, Range, Row, Stack, Text } from "@/ui";
import { loadMaps, loadMigration, loadShipping, MONTHS, type FlatPoints } from "@/lib/whales/load";

/**
 * The post's three maps, rebuilt from the data the original Folium exports carried.
 *
 * Two decisions here are load-bearing:
 *
 *  - **Canvas, not SVG.** 34,932 sightings under Leaflet's default renderer means
 *    34,932 DOM nodes, which is what made the original unusable on a phone. One shared
 *    canvas renderer draws them in a single pass.
 *  - **Two fingers to pan.** A full-width map inside an article traps the scroll on a
 *    touchscreen: a reader swiping to read on instead drags the map. Leaflet has no
 *    option for this, so dragging starts disabled and is driven from the touch count.
 *
 * Leaflet is imported dynamically, so its ~42KB loads only for a reader who reaches
 * this post rather than riding along in every page's bundle.
 */

export type Variant = "intro" | "la" | "migration";

type Status = "loading" | "ready" | "error";

/**
 * The original's colours, and they are not arbitrary: everything on these maps is drawn
 * on a dark basemap, where saturated red, cyan and orange separate cleanly from each
 * other and from the green shipping raster. Muting them to the site palette — which is
 * tuned for text on a pale page — made the sightings almost invisible against water.
 */
const DOT = { gray: "#ff3b30", blue: "#22d3ee" } as const;
const REROUTE = "#ff9f1c";

/**
 * Heat settings for the migration map, measured rather than guessed.
 *
 * leaflet.heat weights every point by `1 / 2 ** (maxZoom - currentZoom)`, sums those
 * weights per bin of `(radius + blur) / 2` pixels, and clips the total at `max`. The
 * previous `maxZoom: 9` against a map that opens at zoom 3 meant a weight of 1/64, so a
 * bin needed 64 sightings before it reached full colour. January's densest bins hold
 * thousands and saturated flat; everything else fell to the 0.05 floor, and quiet months
 * — November has 97 sightings all year — drew nothing at all.
 *
 * `maxZoom: 8` is chosen because it makes the 90th-percentile bin total roughly constant
 * across the zooms this map is actually read at: 3.2 at zoom 3, 4.5 at zoom 5, 5.0 at
 * zoom 8. One `max` can then serve all of them, and 5 is that number — high enough that
 * Monterey and the Channel Islands resolve as separate nodes instead of one red band,
 * low enough that the median bin still registers.
 *
 * The scale is shared across months rather than normalised per month, because the post
 * compares them: December to March really is where the sightings are. That is also why
 * the slider prints the count — a nearly empty November is the finding, not a fault, and
 * the number is what says so.
 */
const HEAT = { radius: 18, blur: 22, maxZoom: 8, max: 5 } as const;

/**
 * A dark basemap, because the shipping-density raster is a translucent green wash and
 * needs something dark behind it to read at all.
 *
 * The original used Thunderforest's transport-dark with an API key baked into the URL.
 * A key in frontend code is public the moment the page loads, so this uses Esri's Dark
 * Gray Canvas instead: same job, no key. CARTO's dark_matter was the first choice and is
 * not usable any more — it still answers 200, but the tile it returns is stamped
 * "API KEY REQUIRED", which is only visible if you actually look at the map.
 *
 * Note the {z}/{y}/{x} order: Esri puts row before column, unlike almost everyone else.
 */
const TILES =
  "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";
const ATTRIBUTION =
  "Tiles &copy; Esri | Sightings: OBIS-SEAMAP | Shipping traffic: World Bank";

/**
 * Load Leaflet, and the heat plugin when the migration map needs it.
 *
 * leaflet.heat is a UMD plugin: it reads `L` off `window` and writes `heatLayer` back
 * onto it. Under a bundler, `import * as L` is an ES module namespace, which is frozen
 * — the plugin's assignment throws, and `L.heatLayer is not a function` follows. So the
 * namespace is copied into a plain object first, and that is what both the plugin and
 * this component use. Same function references either way; only the container differs.
 *
 * Both copies are memoised, and that part is load-bearing rather than an optimisation.
 * A module body runs once per process no matter how many times it is imported, so the
 * plugin attaches `heatLayer` to whichever object was on `window.L` the first time and
 * never again. Building a fresh copy per call therefore worked exactly once: StrictMode
 * double-invokes effects, and the second pass got a copy the plugin had never seen, so
 * the migration map died with `L.heatLayer is not a function` while the other two — not
 * needing the plugin — carried on fine. Sharing one object keeps the plugin's single
 * assignment pointed at the object every map actually uses.
 */
let leafletPromise: Promise<typeof Leaflet> | null = null;
let heatPromise: Promise<unknown> | null = null;

async function loadLeaflet(withHeat: boolean) {
  leafletPromise ??= import("leaflet").then((namespace) => {
    const L = { ...namespace };
    (window as unknown as { L: typeof L }).L = L;
    return L;
  });
  const L = await leafletPromise;
  if (withHeat) {
    heatPromise ??= import("leaflet.heat");
    await heatPromise;
  }
  return L;
}

/** "January — 9,096 sightings", or just the month before the counts have loaded. */
function label(month: string | undefined, count: number | undefined): string {
  if (month === undefined) return "";
  if (count === undefined) return month;
  return `${month} — ${count.toLocaleString()} sighting${count === 1 ? "" : "s"}`;
}

function pairs(flat: FlatPoints): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i + 1 < flat.length; i += 2) {
    out.push([flat[i] as number, flat[i + 1] as number]);
  }
  return out;
}

export function WhaleMap({ variant }: { variant: Variant }) {
  const container = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const monthLayers = useRef<Layer[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const [month, setMonth] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [counts, setCounts] = useState<number[]>([]);

  useEffect(() => {
    let live = true;
    let map: LeafletMap | null = null;
    let detach = () => {};

    const build = async () => {
      const L = await loadLeaflet(variant === "migration");
      const maps = await loadMaps();
      const shipping = await loadShipping();
      const migration = variant === "migration" ? await loadMigration() : null;

      const element = container.current;
      if (!live || element === null) return;

      const view = maps.views[variant];
      map = L.map(element, {
        center: view.center,
        zoom: view.zoom,
        // One finger scrolls the page; the touch handler below re-enables panning for
        // two. Scroll-zoom stays off until the reader clicks in.
        dragging: false,
        scrollWheelZoom: false,
      });
      mapRef.current = map;

      L.tileLayer(TILES, { maxZoom: 18, attribution: ATTRIBUTION }).addTo(map);

      const renderer = L.canvas({ padding: 0.5 });
      const overlays: Record<string, Layer> = {};

      // Two rasters, one control: the whole world at a coarse scale, and the west-coast
      // window at full resolution on top. They tile rather than stack — the world layer
      // has that window punched out — so one opacity applies cleanly across the join.
      overlays["Shipping density"] = L.layerGroup(
        shipping.layers.flatMap((layer) => {
          const [[south, west], [north, east]] = layer.bounds;
          // A world layer is drawn once per world copy, since panning past the
          // antimeridian is otherwise the same as panning off the edge of it.
          const shifts = layer.wrap ? [-360, 0, 360] : [0];
          return shifts.map((shift) =>
            L.imageOverlay(
              layer.image,
              [
                [south, west + shift],
                [north, east + shift],
              ],
              { opacity: 0.75 }
            )
          );
        })
      ).addTo(map);

      if (variant !== "migration") {
        for (const [key, colour, label] of [
          ["gray-whale", DOT.gray, "Gray whale"],
          ["blue-whale", DOT.blue, "Blue whale"],
        ] as const) {
          const points = maps.sightings[key];
          if (points === undefined) continue;
          overlays[label] = L.layerGroup(
            pairs(points).map((latlng) =>
              L.circleMarker(latlng, {
                renderer,
                radius: 1,
                color: colour,
                weight: 3,
                opacity: 1,
                fill: false,
              })
            )
          ).addTo(map);
        }
      }

      if (variant !== "intro" && maps.reroute.length > 0) {
        overlays["Reroute"] = L.layerGroup(
          maps.reroute.map((line) =>
            L.polyline(line, { renderer, color: REROUTE, weight: 4, opacity: 1 })
          )
        ).addTo(map);
      }

      if (migration !== null) {
        // A heat layer rather than dots, because the original was a heatmap and the
        // prose asks the reader to watch density change rather than count sightings.
        monthLayers.current = migration.months.map((points) =>
          // heatLayer wants [lat, lon, intensity]; every sighting counts once.
          L.heatLayer(
            pairs(points).map(([lat, lon]): [number, number, number] => [lat, lon, 1]),
            HEAT
          )
        );
        setCounts(migration.months.map((points) => points.length / 2));
        const first = monthLayers.current[0];
        if (first !== undefined) map.addLayer(first);
      }

      L.control
        .layers(undefined, overlays, { collapsed: false, position: "topright" })
        .addTo(map);

      const onTouchStart = (event: TouchEvent) => {
        if (event.touches.length > 1) map?.dragging.enable();
        else map?.dragging.disable();
      };
      const onTouchEnd = () => map?.dragging.disable();
      element.addEventListener("touchstart", onTouchStart, { passive: true });
      element.addEventListener("touchend", onTouchEnd, { passive: true });

      const onEnter = () => map?.scrollWheelZoom.enable();
      const onLeave = () => map?.scrollWheelZoom.disable();
      // A mouse has none of the scroll ambiguity a finger does, so give it dragging
      // outright and scroll-zoom while the pointer is over the map.
      if (window.matchMedia("(pointer: fine)").matches) {
        map.dragging.enable();
        element.addEventListener("mouseenter", onEnter);
        element.addEventListener("mouseleave", onLeave);
      }

      detach = () => {
        element.removeEventListener("touchstart", onTouchStart);
        element.removeEventListener("touchend", onTouchEnd);
        element.removeEventListener("mouseenter", onEnter);
        element.removeEventListener("mouseleave", onLeave);
      };

      setStatus("ready");
    };

    build().catch((error: unknown) => {
      if (!live) return;
      setMessage(error instanceof Error ? error.message : "Unknown error");
      setStatus("error");
    });

    return () => {
      live = false;
      detach();
      map?.remove();
      mapRef.current = null;
      monthLayers.current = [];
    };
  }, [variant]);

  // Swapping the month is kept out of the mount effect so it doesn't tear the map down.
  useEffect(() => {
    const map = mapRef.current;
    if (map === null || monthLayers.current.length === 0) return;
    monthLayers.current.forEach((layer, index) => {
      if (index === month) map.addLayer(layer);
      else map.removeLayer(layer);
    });
  }, [month]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setMonth((m) => (m + 1) % MONTHS.length), 900);
    return () => window.clearInterval(timer);
  }, [playing]);

  return (
    <Stack gap={3} className="whale-map">
      <MountPoint elementRef={container} ariaLabel={LABELS[variant]} className="whale-map__canvas" />

      {status === "loading" ? (
        <Text size="sm" tone="muted">
          Loading the map…
        </Text>
      ) : null}

      {status === "error" ? (
        <Text size="sm" tone="muted">
          The map didn&rsquo;t load. {message}
        </Text>
      ) : null}

      {variant === "migration" && status === "ready" ? (
        <Row gap={3} wrap align="center">
          <Button onClick={() => setPlaying(!playing)}>{playing ? "Pause" : "Play"}</Button>
          <Range
            id="whale-month"
            value={month}
            min={0}
            max={MONTHS.length - 1}
            ariaLabel="Month"
            valueText={label(MONTHS[month], counts[month])}
            className="whale-map__slider"
            onChange={(value) => {
              setPlaying(false);
              setMonth(value);
            }}
          />
          <Text inline size="sm" weight="medium">
            {label(MONTHS[month], counts[month])}
          </Text>
        </Row>
      ) : null}

      <Text size="xs" tone="subtle">
        Two fingers to move the map on a touchscreen, so one finger still scrolls the page.
      </Text>
    </Stack>
  );
}

const LABELS: Record<Variant, string> = {
  intro: "Map of gray and blue whale sightings against global shipping traffic density",
  la: "Map of whale sightings, shipping lanes and proposed reroutes around Los Angeles",
  migration: "Map of gray whale sighting density by month along the west coast",
};

