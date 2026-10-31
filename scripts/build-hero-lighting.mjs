/**
 * Local photographic retouch: never resamples the master photograph.
 * Only a blurred illumination field from the editing reference is transferred;
 * generated edges, lettering, objects and textures cannot enter either asset.
 * Run: node scripts/build-hero-lighting.mjs [path-to-lighting-reference.png]
 * Without an argument, reuse the checked-in low-frequency exposure field.
 */
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const width = 2172;
const height = 724;
const root = new URL("../", import.meta.url);
const sourcePath = new URL("public/images/premium-home/hero-dubai.webp", root);
const fieldPath = new URL("scripts/assets/hero-lighting-field.png", root);
const sourceFile = await readFile(sourcePath);
const metadata = await sharp(sourceFile).metadata();
if (metadata.width !== width || metadata.height !== height)
  throw new Error("The master photograph dimensions have changed.");
const source = await sharp(sourceFile).removeAlpha().raw().toBuffer();
if (source.length !== width * height * 3)
  throw new Error("The master must decode to three-channel RGB.");
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const linear = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const srgb = (v) =>
  v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055;
const smooth = (lo, hi, v) => {
  const t = clamp((v - lo) / (hi - lo));
  return t * t * (3 - 2 * t);
};
const oval = (x, y, cx, cy, rx, ry) => {
  const distance = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
  return distance >= 1 ? 0 : (1 - distance) ** 2;
};

if (process.argv[2]) {
  const reference = await sharp(process.argv[2]).metadata();
  if (reference.width !== width || reference.height !== height)
    throw new Error("Reference must have the original dimensions.");
  const fieldWidth = 136;
  const fieldHeight = 46;
  // Materialize the blur first: sharp otherwise resizes before filtering,
  // which would smear the entire panorama into a global exposure change.
  const soften = async (image) => {
    const blurred = await sharp(image).removeAlpha().blur(32).png().toBuffer();
    return sharp(blurred).resize(fieldWidth, fieldHeight).raw().toBuffer();
  };
  const [before, after] = await Promise.all([
    soften(sourceFile),
    soften(process.argv[2]),
  ]);
  const field = Buffer.alloc(before.length);
  for (let i = 0; i < field.length; i++) {
    const gain = Math.log2(
      (linear(after[i] / 255) + 0.025) / (linear(before[i] / 255) + 0.025)
    );
    field[i] = Math.round((clamp(gain, -1, 1) + 1) * 127.5);
  }
  await sharp(field, {
    raw: { width: fieldWidth, height: fieldHeight, channels: 3 },
  })
    .png()
    .toFile(fieldPath.pathname);
}
const field = await sharp(await readFile(fieldPath))
  .resize(width, height, { kernel: "cubic" })
  .raw()
  .toBuffer();

const diffuserPath =
  "M1576 312 C1558 281 1557 252 1566 217 C1580 151 1638 107 1705 107 C1776 107 1832 155 1845 219 C1852 252 1846 284 1833 312 C1781 292 1630 292 1576 312 Z";
const housingPath =
  "M1576 312 C1630 292 1781 292 1833 312 C1818 352 1791 382 1782 472 L1765 495 H1640 L1620 472 C1611 400 1595 354 1576 312 Z";
const metalPath = "M1640 497H1764V578L1747 596H1658L1640 578Z";
const marblePath = "M1238 555L1914 550L2172 598L1818 650L1078 606L1238 590Z";
const mask = async (path, blur = 0) => {
  let pipeline = sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><path d="${path}" fill="white"/></svg>`
    )
  );
  if (blur) pipeline = pipeline.blur(blur);
  const pixels = await pipeline.ensureAlpha().raw().toBuffer();
  return Uint8Array.from(
    { length: width * height },
    (_, i) => pixels[i * 4 + 3]
  );
};
const [diffuser, housing, metal, marble, bloom] = await Promise.all([
  mask(diffuserPath),
  mask(housingPath),
  mask(metalPath),
  mask(marblePath),
  mask(diffuserPath, 18),
]);
const off = Buffer.from(source);
const on = Buffer.from(source);
let outsideChanges = 0;
let changedPixels = 0;
const channelWarmth = [1, 0.88, 0.7];

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const p = y * width + x;
    const i = p * 3;
    const dome = diffuser[p] / 255;
    const plastic = housing[p] / 255;
    const chrome = metal[p] / 255;
    const material = clamp(dome + plastic + chrome);
    const luminance =
      (source[i] * 0.2126 + source[i + 1] * 0.7152 + source[i + 2] * 0.0722) /
      255;
    const details = smooth(0.4, 0.78, luminance);
    const core = oval(x, y, 1687, 227, 154, 135);
    const wall =
      oval(x, y, 1834, 220, 122, 214) *
      smooth(1728, 1743, x) *
      (1 - smooth(1920, 1940, x)) *
      (1 - material);
    const floor =
      (marble[p] / 255) *
      (1 - material) *
      Math.max(
        oval(x, y - (x - 1710) * 0.035, 1710, 627, 188, 23),
        0.45 * oval(x, y, 1735, 578, 185, 29)
      );
    const contact = oval(x, y, 1708, 617, 30, 5);
    const atmosphere =
      (bloom[p] / 255) *
      (1 - material) *
      (1 - smooth(1727, 1730, x)) *
      smooth(1515, 1540, x);
    for (let c = 0; c < 3; c++) {
      const original = source[i + c] / 255;
      // The old OFF state was localized diffuser shading. Bake it once, keeping
      // source curvature/grain, so the browser no longer paints a flat overlay.
      const shade = (0.79 + core * 0.085) * [0.994, 1, 1.006][c];
      off[i + c] = Math.round(
        clamp(original * (1 - dome + dome * shade)) * 255
      );
      let value = linear(original);
      const exposure = field[i + c] / 127.5 - 1;
      const exposureMean =
        (field[i] + field[i + 1] + field[i + 2]) / (3 * 127.5) - 1;
      const housingFalloff = 0.24 + 0.76 * (1 - smooth(302, 495, y));
      const gain =
        dome * clamp(exposure, -0.1, 0.15) * 0.3 +
        plastic *
          details *
          housingFalloff *
          (clamp(exposureMean, 0, 0.18) + [0.48, 0.26, -0.04][c]) +
        chrome * details * [0.22, 0.09, -0.15][c];
      value *= 2 ** gain;
      // Material response preserves the original surface detail instead of
      // inserting a replacement diffuser, logo or generated metal texture.
      value += dome * core * (1 - value) * [0.16, 0.12, 0.055][c];
      const wallGain = Math.max(0, exposureMean);
      value *= 1 + wall * Math.min(0.33, wallGain * 0.48);
      // Retain pigment and texture while letting the adjacent wall visibly
      // catch the emitted light; multiplication alone vanished in its red.
      value += wall * (1 - value) * [0.18, 0.105, 0.06][c];
      value +=
        floor *
        (1 - contact) *
        (0.25 + 0.75 * details) *
        (1 - value) *
        [0.38, 0.24, 0.085][c];
      value += atmosphere * 0.12 * (1 - value) * channelWarmth[c];
      on[i + c] = Math.round(clamp(srgb(clamp(value))) * 255);
    }
    const changed = [0, 1, 2].some((c) => on[i + c] !== off[i + c]);
    if (changed) changedPixels++;
    // Hard guarantee: no generated/retouched pixels in the headline, battery,
    // skyline outside the local light spill, or far-right wall/plant.
    if (
      (x < 1515 || x > 1940 || y < 6 || y > 651) &&
      [0, 1, 2].some(
        (c) => on[i + c] !== source[i + c] || off[i + c] !== source[i + c]
      )
    )
      outsideChanges++;
  }
}
if (outsideChanges)
  throw new Error(
    `${outsideChanges} pixels changed outside the permitted area`
  );
for (const [state, pixels] of [
  ["off", off],
  ["on", on],
]) {
  const path = new URL(
    `public/images/premium-home/hero-dubai-${state}.webp`,
    root
  );
  await sharp(pixels, { raw: { width, height, channels: 3 } })
    .webp({ lossless: true, effort: 6 })
    .toFile(path.pathname);
  const decoded = await sharp(path.pathname).removeAlpha().raw().toBuffer();
  if (!decoded.equals(pixels))
    throw new Error(`${state} asset changed during encoding`);
}
const report = {
  source: "public/images/premium-home/hero-dubai.webp",
  sourceSha256: createHash("sha256").update(sourceFile).digest("hex"),
  width,
  height,
  changedPixels,
  unchangedPixels: width * height - changedPixels,
  outsideChanges,
  geometryResampled: false,
  encoding: "lossless WebP",
  method:
    "Original pixels plus material-masked low-frequency lighting; no generated photo pixels used",
};
await writeFile(
  new URL("scripts/assets/hero-lighting-report.json", root),
  JSON.stringify(report, null, 2) + "\n"
);
process.stdout.write(JSON.stringify(report, null, 2) + "\n");
