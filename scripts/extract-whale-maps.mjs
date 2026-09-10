/**
 * Extract the whale-blog map data out of the old site's Folium exports.
 *
 * The original post embedded three Folium maps as iframes: 18.8MB, 18.8MB and 2.6MB.
 * Almost all of that is 34,932 separate `L.circleMarker(...)` calls, each carrying a
 * full options blob, repeated across two of the files. The actual information is small
 * -- coordinate pairs, five polylines and twelve months of heat points -- so this pulls
 * the data out and leaves the generated JavaScript behind.
 *
 * One-off migration, not a pipeline: the old site is retired and this data will not
 * change. It lives here rather than in a scratch directory so the provenance of
 * everything under public/whales/ is auditable.
 *
 * The shipping-density raster used to come out of here too, decoded from a base64 data
 * URI in 002_LA.html. It is built from the World Bank source instead now — see
 * scripts/reproject-shipping-raster.mjs, which owns public/whales/shipping.json and the
 * two .webp layers beside it.
 *
 * Usage:
 *   node scripts/extract-whale-maps.mjs <path-to-Website-WillsWebsite-checkout>
 *
 * Source: https://github.com/wm6000/Website-WillsWebsite
 *         willswebsiteapp/static/{001_Intro,002_LA,004_Heatmap}.html
 */

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(ROOT, "public", "whales");

const source = process.argv[2];
if (!source) {
  console.error("Usage: node scripts/extract-whale-maps.mjs <path-to-Website-WillsWebsite>");
  process.exit(1);
}
// The Flask app was rearranged partway through that repo's life, so the exports sit
// under willswebsiteapp/static in some checkouts and plain static/ in others.
const STATIC = [join(source, "willswebsiteapp", "static"), join(source, "static")].find((dir) =>
  existsSync(join(dir, "002_LA.html"))
);
if (STATIC === undefined) {
  console.error(`No Folium exports under ${source} (looked for 002_LA.html)`);
  process.exit(1);
}

// 3 decimal places is ~110m at the equator. These are opportunistic sightings logged to
// far less precision than that, so the extra digits Folium wrote out are noise.
const PRECISION = 3;
const round = (n) => Number(Number(n).toFixed(PRECISION));

const read = (name) => readFileSync(join(STATIC, name), "utf8");

/** Every circleMarker, tagged with the feature group it joined. */
function markers(html) {
  const found = new Map();
  const re =
    /L\.circleMarker\(\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\][\s\S]{0,600}?\)\.addTo\((\w+)\)/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const group = m[3];
    if (!found.has(group)) found.set(group, []);
    found.get(group).push(round(m[1]), round(m[2]));
  }
  return found;
}

/** Map the layer-control labels ("Gray Whale") onto their feature-group variables. */
function layerNames(html) {
  const names = new Map();
  const re = /"([A-Za-z][A-Za-z0-9 &'-]{2,40})"\s*:\s*(feature_group_\w+|image_overlay_\w+)/g;
  let m;
  while ((m = re.exec(html)) !== null) names.set(m[2], m[1]);
  return names;
}

function polylines(html) {
  const out = [];
  const re = /L\.polyline\(\s*(\[\[[\s\S]{0,400}?\]\])\s*,/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    out.push(JSON.parse(m[1]).map(([lat, lon]) => [round(lat), round(lon)]));
  }
  return out;
}

function view(html) {
  const m = html.match(/center:\s*\[(-?[\d.]+),\s*(-?[\d.]+)\][\s\S]{0,200}?zoom:\s*([\d.]+)/);
  return m ? { center: [Number(m[1]), Number(m[2])], zoom: Number(m[3]) } : null;
}

/** The twelve monthly point sets behind the TimeDimension heatmap. */
function monthlyHeat(html) {
  const start = html.indexOf("new TDHeatmap(");
  if (start < 0) return null;
  const open = html.indexOf("[", start);
  let depth = 0;
  let end = open;
  for (let i = open; i < html.length; i += 1) {
    if (html[i] === "[") depth += 1;
    else if (html[i] === "]") {
      depth -= 1;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  return JSON.parse(html.slice(open, end)).map((month) =>
    month.flatMap(([lat, lon]) => [round(lat), round(lon)])
  );
}

// ---------------------------------------------------------------------------------

mkdirSync(OUT, { recursive: true });

const la = read("002_LA.html");
const intro = read("001_Intro.html");
const heat = read("004_Heatmap.html");

const laGroups = markers(la);
const laNames = layerNames(la);

const sightings = {};
for (const [group, coords] of laGroups) {
  const name = laNames.get(group);
  if (!name) continue;
  sightings[name.toLowerCase().replace(/\s+/g, "-")] = coords;
}

// The Intro map draws the same sighting set; confirm rather than assume, so the two
// maps can share one download.
const introTotal = [...markers(intro).values()].reduce((n, a) => n + a.length, 0);
const laTotal = [...laGroups.values()].reduce((n, a) => n + a.length, 0);

const provenance = {
  source: "https://github.com/wm6000/Website-WillsWebsite",
  files: ["001_Intro.html", "002_LA.html", "004_Heatmap.html"],
  extracted: new Date().toISOString().slice(0, 10),
  precision: PRECISION,
};

const data = {
  provenance,
  sightings,
  reroute: polylines(la),
  views: { intro: view(intro), la: view(la), migration: view(heat) },
};

writeFileSync(join(OUT, "maps.json"), JSON.stringify(data));

const months = monthlyHeat(heat);
writeFileSync(
  join(OUT, "migration.json"),
  JSON.stringify({ provenance, months })
);

copyFileSync(join(STATIC, "NSmigration.jpg"), join(OUT, "gray-whale-migration.jpg"));

// ---------------------------------------------------------------------------------

console.log("sightings by layer:");
for (const [name, coords] of Object.entries(sightings)) {
  console.log(`  ${name.padEnd(14)} ${(coords.length / 2).toLocaleString()} points`);
}
console.log(`  intro map has the same set: ${introTotal === laTotal}`);
console.log(`reroute polylines: ${data.reroute.length}`);
console.log(`views: ${JSON.stringify(data.views)}`);
console.log(
  `monthly heat points: ${months.map((m) => m.length / 2).join(", ")}`
);
