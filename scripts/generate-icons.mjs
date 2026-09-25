import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "public/brand/adakings-logo-icon.png");
const BRAND_BLACK = "#111111";

async function squareTransparent(size, padRatio = 0.72) {
  const inner = Math.round(size * padRatio);
  const logo = await sharp(SRC).resize(inner, inner, { fit: "inside" }).toBuffer();
  const meta = await sharp(logo).metadata();
  const left = Math.round((size - meta.width) / 2);
  const top = Math.round((size - meta.height) / 2);
  return sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: logo, left, top }])
    .png()
    .toBuffer();
}

async function squareOnBrand(size, padRatio = 0.6) {
  const inner = Math.round(size * padRatio);
  const logo = await sharp(SRC).resize(inner, inner, { fit: "inside" }).toBuffer();
  const meta = await sharp(logo).metadata();
  const left = Math.round((size - meta.width) / 2);
  const top = Math.round((size - meta.height) / 2);
  return sharp({
    create: { width: size, height: size, channels: 4, background: BRAND_BLACK },
  })
    .composite([{ input: logo, left, top }])
    .png()
    .toBuffer();
}

function buildIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dirEntries = [];
  const imageData = [];
  let offset = 6 + count * 16;

  for (const { size, buffer } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    dirEntries.push(entry);
    imageData.push(buffer);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageData]);
}

async function main() {
  const icon32 = await squareTransparent(32, 0.78);
  fs.writeFileSync(path.join(ROOT, "app/icon.png"), icon32);

  const apple180 = await squareOnBrand(180, 0.6);
  fs.writeFileSync(path.join(ROOT, "app/apple-icon.png"), apple180);

  const android192 = await squareOnBrand(192, 0.6);
  fs.writeFileSync(path.join(ROOT, "public/android-chrome-192x192.png"), android192);
  const android512 = await squareOnBrand(512, 0.6);
  fs.writeFileSync(path.join(ROOT, "public/android-chrome-512x512.png"), android512);

  const sizes = [16, 32, 48];
  const buffers = [];
  for (const size of sizes) {
    buffers.push({ size, buffer: await squareTransparent(size, 0.78) });
  }
  fs.writeFileSync(path.join(ROOT, "app/favicon.ico"), buildIco(buffers));

  console.log("Icons generated.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
