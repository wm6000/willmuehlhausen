/**
 * The whale-blog map data, fetched on demand.
 *
 * The original post embedded three Folium maps as iframes totalling 40.4MB, almost all
 * of it generated JavaScript: 34,932 `L.circleMarker` calls written out one at a time,
 * duplicated across two of the files. scripts/extract-whale-maps.mjs pulls the data out
 * of those files; what is left is coordinates.
 *
 * Both sighting maps draw the same set, so maps.json is fetched once and shared. The
 * monthly migration data is a separate file because only the third map needs it.
 */

export type Provenance = {
  source: string;
  files: string[];
  extracted: string;
  precision: number;
};

/** Flat [lat, lon, lat, lon, ...] — half the bytes of an array of pairs. */
export type FlatPoints = number[];

export type MapView = { center: [number, number]; zoom: number };

export type MapsFile = {
  provenance: Provenance;
  sightings: Record<string, FlatPoints>;
  reroute: [number, number][][];
  views: { intro: MapView; la: MapView; migration: MapView };
};

/** A raster overlay: an image and the box Leaflet should stretch it across. */
export type ShippingLayer = {
  image: string;
  bounds: [[number, number], [number, number]];
  /**
   * True for the world layer, which has to be drawn in the neighbouring world copies as
   * well as its own. Basemap tiles repeat forever as you pan east or west; a single
   * image overlay does not, so without this it stops dead at the antimeridian — which
   * the migration map reaches immediately, since it opens centred on the Pacific.
   */
  wrap: boolean;
};

export type ShippingFile = {
  provenance: {
    source: string;
    file: string;
    generated: string;
    cell: number;
    fullScale: number;
  };
  /**
   * In draw order: the coarse Pacific wash, then the full-resolution west-coast window
   * on top of it. The coarse layer has that window punched out rather than being drawn
   * under it, so the two never blend over each other.
   */
  layers: ShippingLayer[];
};

export type MigrationFile = {
  provenance: Provenance;
  /** Twelve entries, January first, each a flat point list. */
  months: FlatPoints[];
};

const BASE = "/whales";

async function getJson<T>(name: string): Promise<T> {
  const response = await fetch(`${BASE}/${name}`);
  if (!response.ok) throw new Error(`Could not load ${name} (${response.status})`);
  return (await response.json()) as T;
}

let mapsPromise: Promise<MapsFile> | null = null;
let migrationPromise: Promise<MigrationFile> | null = null;
let shippingPromise: Promise<ShippingFile> | null = null;

export function loadMaps(): Promise<MapsFile> {
  // Memoised on the promise so the two sighting maps on one page share a request
  // rather than racing each other for the same 500KB.
  mapsPromise ??= getJson<MapsFile>("maps.json");
  return mapsPromise;
}

export function loadShipping(): Promise<ShippingFile> {
  // Separate from maps.json because a different script generates it, and memoised for
  // the same reason: all three maps draw the same rasters.
  shippingPromise ??= getJson<ShippingFile>("shipping.json");
  return shippingPromise;
}

export function loadMigration(): Promise<MigrationFile> {
  migrationPromise ??= getJson<MigrationFile>("migration.json");
  return migrationPromise;
}

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;
