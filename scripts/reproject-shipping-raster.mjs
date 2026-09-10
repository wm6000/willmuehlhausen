/**
 * Build the whale post's shipping-density layers from the World Bank GeoTIFF.
 *
 * The post draws two rasters over its maps: the whole world at a coarse scale, and the
 * west-coast window the post is about at full resolution on top of it. Both come from
 * the same source through the same curve here, so the join between them is invisible.
 *
 * Three things this fixes about the raster that shipped before it.
 *
 * **Projection.** The source is equirectangular — a flat 0.005 degrees per pixel in both
 * axes. Leaflet's `imageOverlay` does not reproject; it stretches the image linearly
 * across the *Web Mercator* box its bounds project to. Handing it an unwarped raster
 * puts every latitude too far north, worst in the middle of the frame: over this window
 * that peaked at 5.1% of frame height, about 170km, right where the Channel Islands are.
 * Sighting markers are real coordinates and land correctly, so the mismatch showed up
 * precisely as a lane/sighting offset — the thing the post is about. `toMercatorRows`
 * pre-warps the pixels so the linear stretch lands them where they belong.
 *
 * **Extent.** The old PNG was 6101 rows, but its recorded bounds describe 6073 rows of
 * 0.005-degree grid. Something in the original export stretched it by 28 rows, a further
 * 0.14 degrees — about 15km — of drift. Cropping from the source grid here means the
 * bounds and the pixels are the same statement.
 *
 * **Channels.** Density is one number per cell drawn as one translucent green wash, but
 * the old PNG carried it as RGBA with `rgb(0,255,0)` repeated in all 29 million pixels
 * and only alpha ever varying. Three of the four channels were a constant.
 *
 * Nearest-neighbour in the row warp, not interpolation: across these latitudes Mercator
 * only stretches, so resampling is upsampling and blending only invents values that were
 * never measured. Those invented values also cost real bytes, because they break the
 * runs of identical pixels lossless WebP leans on — 2084KB interpolated against 942KB
 * nearest, for the same visible map.
 *
 * Usage:
 *   node scripts/reproject-shipping-raster.mjs <path-to-shipdensity_global.tif>
 *
 * Source: https://datacatalog.worldbank.org/search/dataset/0037580
 *   "Global Shipping Traffic Density" — IMF analysis of hourly AIS positions, Jan-2015
 *   to Feb-2021, 0.005 degree cells. Download `shipdensity_global.zip` (the combined
 *   all-categories layer, 535MB) and point this at the .tif inside it. The archive is
 *   not committed: it expands to 13GB.
 */

import { openSync, readSync, closeSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(ROOT, "public", "whales");

/**
 * The values are sharply bimodal, which is what makes them drawable at all. Three
 * quarters of the non-zero cells hold single digits — an AIS position or four across six
 * years, which is noise — and the shipping lanes hold hundreds of thousands to tens of
 * millions. Almost nothing sits between, so a floor at 100k separates lanes from noise
 * without needing a threshold tuned by eye.
 *
 * Above that floor the scale is logarithmic, not linear. The original was linear —
 * recovered by matching quantiles against the old PNG, which put 5.43M at alpha 29 and
 * 16.7M at 90, within a couple of levels of `value / 185000`. But linear spends almost
 * the whole 0-255 range on the handful of cells inside major ports and leaves everything
 * else near zero: the median lane came out at alpha 29, which is 11% opacity over a dark
 * basemap before the layer's own 0.75 is applied. Legible only if you already know where
 * to look. Log over the same range puts that median lane near 160 instead.
 *
 * FULL_SCALE is the largest value across the wider Pacific window rather than each
 * layer's own maximum, so both layers share one scale and the join can't change
 * brightness.
 */
const NOISE_FLOOR = 100000;
const FULL_SCALE = 51238734;
const LOG_RANGE = Math.log(FULL_SCALE / NOISE_FLOOR);

/**
 * Density to alpha, applied at full resolution and before any downsampling.
 *
 * The order matters and getting it wrong is what made the first version of the coarse
 * layer invisible. Downsampling averages, and a lane one cell wide inside a 4x4 block is
 * a sixteenth of that block. Average the *values* first and the lane loses 16x of its
 * magnitude before the curve ever sees it; average the *alpha* and it loses 16x of its
 * opacity, which is exactly what a browser does when it scales the detailed layer down
 * to the same zoom. Doing what the browser does is what keeps the two layers agreeing —
 * and with a linear curve the two orders are identical, which is precisely why the
 * mistake survived a seam check.
 */
function toAlpha(value) {
  if (value < NOISE_FLOOR) return 0;
  return Math.min(255, Math.round((Math.log(value / NOISE_FLOOR) / LOG_RANGE) * 255));
}

const MERCATOR_LIMIT = 85.05112878;

/**
 * The world layer is the base. An earlier version covered only the eastern North
 * Pacific, which left a hard rectangular edge running through the Gulf of Mexico the
 * moment anyone panned east or south — a bounded layer always has an edge to find, so
 * the fix is to not bound it. At 1/8 its cells are about 4.5km: sub-pixel at the zooms
 * these maps open at, and coarse but continuous if a reader zooms into open water.
 *
 * The crop is the west-coast window at full resolution, drawn on top, and the only part
 * that survives zooming in.
 *
 * The two are cross-faded into each other rather than one being drawn over the other.
 * Stacking them outright doubles the ink where they overlap — measured, the detailed
 * window came out 1.96x the surrounding ocean, a bright rectangle. Cutting a clean hole
 * fixes the brightness (1.04x) but trades it for a visible join, which is what `blendOut`
 * and `blendIn` exist to avoid.
 */
const LAYERS = [
  {
    name: "shipping-density-world.webp",
    // The raster's own full extent. It already stops just inside the Web Mercator limit
    // at a little over 85 degrees, so there is nothing to clamp.
    bounds: { south: -84.987352063, north: 85.002647937, west: -180, east: 180 },
    downsample: 8,
    blend: "out",
    wrap: true,
  },
  {
    name: "shipping-density.webp",
    bounds: { south: 21.677647937, north: 52.042647937, west: -130.505311275, east: -106.720311275 },
    downsample: 1,
    blend: "in",
    wrap: false,
  },
];

const mercator = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

// --------------------------------------------------------------------------------
// A windowed reader for the source, which is a 9.8GB tiled BigTIFF of signed 32-bit
// counts. sharp cannot be used to read it — libvips converts 32-bit samples down to
// 8-bit RGB on the way in, which throws away the values this whole script is about. It
// is uncompressed and tiled 128x128 though, so a window costs one seek per tile.
// --------------------------------------------------------------------------------

const TAG = {
  WIDTH: 256, LENGTH: 257, BITS: 258, COMPRESSION: 259, TILE_W: 322, TILE_L: 323,
  TILE_OFF: 324, TILE_CNT: 325, SAMPLE_FORMAT: 339, PIXEL_SCALE: 33550, TIE_POINT: 33922,
};

/** GDAL writes the raster's no-data as INT32_MAX rather than leaving the tag empty. */
const NO_DATA = 2147483647;

function openRaster(path) {
  const fd = openSync(path, "r");
  const rd = (off, len) => {
    const b = Buffer.alloc(len);
    readSync(fd, b, 0, len, off);
    return b;
  };

  const head = rd(0, 16);
  if (head.toString("ascii", 0, 2) !== "II" || head.readUInt16LE(2) !== 43) {
    throw new Error("expected a little-endian BigTIFF");
  }
  const ifd = Number(head.readBigUInt64LE(8));
  const count = Number(rd(ifd, 8).readBigUInt64LE(0));
  const entries = rd(ifd + 8, 20 * count);

  const tags = new Map();
  for (let i = 0; i < count; i += 1) {
    const o = i * 20;
    tags.set(entries.readUInt16LE(o), Number(entries.readBigUInt64LE(o + 12)));
  }
  const tag = (t) => {
    const v = tags.get(t);
    if (v === undefined) throw new Error(`source is missing TIFF tag ${t}`);
    return v;
  };

  if (tag(TAG.COMPRESSION) !== 1) throw new Error("expected an uncompressed raster");
  if (tag(TAG.BITS) !== 32 || tag(TAG.SAMPLE_FORMAT) !== 2) {
    throw new Error("expected signed 32-bit samples");
  }

  const width = tag(TAG.WIDTH);
  const height = tag(TAG.LENGTH);
  const tileW = tag(TAG.TILE_W);
  const tileL = tag(TAG.TILE_L);
  const across = Math.ceil(width / tileW);
  const offsets = tag(TAG.TILE_OFF);
  const counts = tag(TAG.TILE_CNT);

  const scale = rd(tag(TAG.PIXEL_SCALE), 24);
  const tie = rd(tag(TAG.TIE_POINT), 48);
  // The tie point is the outer corner of pixel (0,0). The sidecar .tfw quotes its centre
  // instead, half a cell away; using the wrong one shifts everything by 250m.
  const geo = {
    cell: scale.readDoubleLE(0),
    originLon: tie.readDoubleLE(24),
    originLat: tie.readDoubleLE(32),
  };

  const tile = Buffer.alloc(tileW * tileL * 4);

  function readWindow(left, top, w, h) {
    const out = new Int32Array(w * h);
    for (let ty = Math.floor(top / tileL); ty <= Math.floor((top + h - 1) / tileL); ty += 1) {
      for (let tx = Math.floor(left / tileW); tx <= Math.floor((left + w - 1) / tileW); tx += 1) {
        const index = ty * across + tx;
        const at = Number(rd(offsets + index * 8, 8).readBigUInt64LE(0));
        readSync(fd, tile, 0, rd(counts + index * 4, 4).readUInt32LE(0), at);

        const px = tx * tileW;
        const py = ty * tileL;
        const x0 = Math.max(left, px);
        const x1 = Math.min(left + w, px + tileW);
        for (let y = Math.max(top, py); y < Math.min(top + h, py + tileL); y += 1) {
          const from = (y - py) * tileW;
          const to = (y - top) * w - left;
          for (let x = x0; x < x1; x += 1) {
            const value = tile.readInt32LE((from + (x - px)) * 4);
            out[to + x] = value > 0 && value !== NO_DATA ? value : 0;
          }
        }
      }
    }
    return out;
  }

  return { width, height, geo, readWindow, close: () => closeSync(fd) };
}

/** Snap a lat/lon box onto the source's own grid, so no half-cell offset creeps in. */
function windowFor(geo, { south, north, west, east }) {
  if (north > MERCATOR_LIMIT || south < -MERCATOR_LIMIT) {
    throw new Error(`bounds ${south}..${north} leave the Web Mercator range`);
  }
  const left = Math.round((west - geo.originLon) / geo.cell);
  const top = Math.round((geo.originLat - north) / geo.cell);
  const right = Math.round((east - geo.originLon) / geo.cell);
  const bottom = Math.round((geo.originLat - south) / geo.cell);
  return {
    left,
    top,
    width: right - left,
    height: bottom - top,
    // The snapped box, which is what the overlay must be told its bounds are.
    bounds: {
      west: geo.originLon + left * geo.cell,
      east: geo.originLon + right * geo.cell,
      north: geo.originLat - top * geo.cell,
      south: geo.originLat - bottom * geo.cell,
    },
  };
}

/**
 * Read a window, curve it to alpha, and reduce it — a band of rows at a time.
 *
 * The world layer covers 2.45 billion cells, which is 9.8GB as int32 and not something
 * to hold at once. Working in bands keeps the peak in the tens of megabytes no matter
 * how large the window is, and costs nothing: the source is tiled 128x128, so a band of
 * whole tile rows is the access pattern the file is already laid out for.
 *
 * Bands are cut on output-row boundaries so every block a reduction averages is inside
 * one band, and no block straddles a seam between two of them.
 */
function buildAlpha(raster, box, factor) {
  const width = Math.floor(box.width / factor);
  const height = Math.floor(box.height / factor);
  const out = new Uint8Array(width * height);
  const per = factor * factor;
  const chunk = Math.max(1, Math.floor(256 / factor)); // output rows per band

  for (let top = 0; top < height; top += chunk) {
    const rows = Math.min(chunk, height - top);
    const values = raster.readWindow(box.left, box.top + top * factor, box.width, rows * factor);
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < width; x += 1) {
        let total = 0;
        for (let j = 0; j < factor; j += 1) {
          const row = (y * factor + j) * box.width + x * factor;
          for (let i = 0; i < factor; i += 1) total += toAlpha(values[row + i]);
        }
        out[(top + y) * width + x] = per === 1 ? total : Math.round(total / per);
      }
    }
  }
  return { data: out, width, height };
}

/**
 * Rebuild equirectangular rows onto a Web Mercator row grid.
 *
 * Sized so the output pixels stay square in Mercator, which means more rows than went in
 * — Mercator stretches latitude by 1/cos(lat) — so nothing is lost at the top of the
 * frame where the stretch is largest.
 */
function toMercatorRows(data, width, height, { south, north }) {
  const ys = mercator(south);
  const yn = mercator(north);
  const rows = Math.round((height * (yn - ys) * 180) / ((north - south) * Math.PI));
  const out = new Uint8Array(width * rows);
  for (let j = 0; j < rows; j += 1) {
    const y = yn - ((j + 0.5) / rows) * (yn - ys);
    const lat = (Math.atan(Math.exp(y)) * 360) / Math.PI - 90;
    const from = clamp(Math.round(((north - lat) / (north - south)) * height - 0.5), 0, height - 1);
    out.set(data.subarray(from * width, (from + 1) * width), j * width);
  }
  return { data: out, width, height: rows };
}

/**
 * How wide the two layers cross-fade into each other, in degrees of longitude. About
 * 90km at these latitudes: long enough that the change is gradual at the zooms a reader
 * explores at, short enough to cost only the outer few percent of the detailed window.
 */
const BLEND_DEG = 1.0;

/** Pixels per degree, east-west and north-south, for a layer at a given latitude. */
function pixelScale(bounds, width, height, lat) {
  const ys = mercator(bounds.south);
  const yn = mercator(bounds.north);
  const d = 0.05;
  return {
    perLon: width / (bounds.east - bounds.west),
    perLat: (Math.abs(mercator(lat + d) - mercator(lat - d)) / Math.abs(yn - ys)) * height / (2 * d),
  };
}

/**
 * Fade one layer out where the other fades in, instead of cutting a hole.
 *
 * A hard edge was the whole problem. The two layers agree on geography — cross-correlated
 * on a common ground grid they peak at exactly zero offset — and they agree on brightness,
 * within 4%. What they cannot agree on is texture: the base averages 8x8 source cells, so
 * it spreads every lane into a soft 4.5km block, while the detailed layer resolves the
 * same lane to 500m. Butt those together and the join is visible not because anything is
 * misplaced but because coarse mosaic meets fine speckle along a straight line, and a
 * straight line is exactly what an eye finds.
 *
 * So neither layer ends anywhere in particular any more. Across the blend band the base
 * ramps 1 to 0 while the detail ramps 0 to 1, and the texture changes over 90km rather
 * than over one pixel. Brightness survives the crossing because these alphas are small:
 * compositing two layers at w and c leaves w + c - wc, so with complementary ramps the
 * only error is the wc term, which at the ~0.05 alphas here dips under a tenth of a
 * percent in the middle of the band.
 *
 * Working from fractional pixel positions also retires a bug the hole had. Its edges were
 * rounded to whole pixels, and rounding to nearest lands outside the detailed layer about
 * half the time — at 1/16 the south edge fell at 1964.53 and rounded to 1965, erasing
 * base data along a 4km strip that nothing else covered. A ramp has no edge to round.
 */
function blendOut(data, width, height, bounds, inner) {
  const ys = mercator(bounds.south);
  const yn = mercator(bounds.north);
  const colOf = (lon) => ((lon - bounds.west) / (bounds.east - bounds.west)) * width;
  const rowOf = (lat) => ((yn - mercator(lat)) / (yn - ys)) * height;
  const mid = (inner.north + inner.south) / 2;
  const { perLon, perLat } = pixelScale(bounds, width, height, mid);
  const bandX = BLEND_DEG * perLon;
  const bandY = BLEND_DEG * perLat;
  const x0 = colOf(inner.west);
  const x1 = colOf(inner.east);
  const y0 = rowOf(inner.north);
  const y1 = rowOf(inner.south);

  const lo = Math.max(0, Math.floor(y0));
  const hi = Math.min(height, Math.ceil(y1));
  for (let y = lo; y < hi; y += 1) {
    const insideY = Math.min(y + 0.5 - y0, y1 - (y + 0.5)) / bandY;
    if (insideY <= 0) continue;
    const from = Math.max(0, Math.floor(x0));
    const to = Math.min(width, Math.ceil(x1));
    for (let x = from; x < to; x += 1) {
      const insideX = Math.min(x + 0.5 - x0, x1 - (x + 0.5)) / bandX;
      const t = clamp(Math.min(insideX, insideY), 0, 1);
      if (t > 0) data[y * width + x] = Math.round(data[y * width + x] * (1 - t));
    }
  }
}

/** The other half of the crossfade: fade the detailed layer in from its own edges. */
function blendIn(data, width, height, bounds) {
  const mid = (bounds.north + bounds.south) / 2;
  const { perLon, perLat } = pixelScale(bounds, width, height, mid);
  const bandX = BLEND_DEG * perLon;
  const bandY = BLEND_DEG * perLat;
  for (let y = 0; y < height; y += 1) {
    const ty = Math.min(y + 0.5, height - (y + 0.5)) / bandY;
    for (let x = 0; x < width; x += 1) {
      const tx = Math.min(x + 0.5, width - (x + 0.5)) / bandX;
      const t = clamp(Math.min(tx, ty), 0, 1);
      if (t < 1) data[y * width + x] = Math.round(data[y * width + x] * t);
    }
  }
}

/**
 * One channel of density becomes a green wash whose alpha is that density.
 *
 * The colour is not chosen here: the maps draw red and cyan sightings on a dark basemap,
 * and green is what stays distinct from both. Baking it in lets `imageOverlay` draw the
 * file directly, with no canvas step in the page.
 */
async function encode(data, width, height, path) {
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    rgba[i * 4 + 1] = 255;
    rgba[i * 4 + 3] = data[i];
  }
  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .webp({ lossless: true, effort: 6 })
    .toFile(path);
}

async function main() {
  const source = process.argv[2];
  if (!source) {
    console.error("Usage: node scripts/reproject-shipping-raster.mjs <path-to-shipdensity_global.tif>");
    process.exit(1);
  }

  const raster = openRaster(source);
  mkdirSync(OUT, { recursive: true });

  const cropBounds = windowFor(raster.geo, LAYERS[1].bounds).bounds;
  const layers = [];

  for (const layer of LAYERS) {
    const box = windowFor(raster.geo, layer.bounds);
    const small = buildAlpha(raster, box, layer.downsample);
    const warped = toMercatorRows(small.data, small.width, small.height, box.bounds);
    // The two halves of one crossfade: the base fades out across the detailed window's
    // margin, the detailed layer fades in across the same ground.
    if (layer.blend === "out") {
      blendOut(warped.data, warped.width, warped.height, box.bounds, cropBounds);
    } else if (layer.blend === "in") {
      blendIn(warped.data, warped.width, warped.height, box.bounds);
    }
    await encode(warped.data, warped.width, warped.height, join(OUT, layer.name));
    // Leaflet's own bounds order: [[south, west], [north, east]].
    layers.push({
      image: `/whales/${layer.name}`,
      bounds: [
        [box.bounds.south, box.bounds.west],
        [box.bounds.north, box.bounds.east],
      ],
      // A world-spanning layer has to be drawn in the neighbouring world copies too, or
      // it simply stops at the antimeridian while the basemap tiles carry on repeating.
      wrap: layer.wrap,
    });
    console.log(`${layer.name}  ${warped.width}x${warped.height}`);
  }

  raster.close();

  // Written here rather than into maps.json, so each generated file has exactly one
  // script that owns it. The array is in draw order: coarse base first.
  writeFileSync(
    join(OUT, "shipping.json"),
    JSON.stringify({
      provenance: {
        source: "https://datacatalog.worldbank.org/search/dataset/0037580",
        file: "shipdensity_global.tif",
        generated: new Date().toISOString().slice(0, 10),
        cell: 0.005,
        fullScale: FULL_SCALE,
      },
      layers,
    })
  );
  console.log("shipping.json");
}

await main();
