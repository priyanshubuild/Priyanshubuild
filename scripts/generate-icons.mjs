import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const output = fileURLToPath(new URL("../public/", import.meta.url));
// Draw the mark as paths so its shape never depends on an installed font.
const mark = `<path d="M8 6h10c5 0 8 3 8 8s-3 8-8 8h-5v6H8V6zm5 5v6h5c2 0 3-1 3-3s-1-3-3-3h-5z" fill="#fafafa" fill-rule="evenodd"/>`;
const accent = `<circle cx="25" cy="26" r="2" fill="#22c55e"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#09090b"/>${mark}${accent}</svg>`;

// At 16 pixels, align the stem and counter to whole pixels instead of
// shrinking the larger mark onto half-pixel edges.
const smallSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="4" fill="#09090b"/><path d="M4 3h5c2.5 0 4 1.5 4 4s-1.5 4-4 4H7v3H4V3zm3 2v4h2c1.3 0 2-.7 2-2s-.7-2-2-2H7z" fill="#fafafa" fill-rule="evenodd"/><circle cx="12.5" cy="13" r="1" fill="#22c55e"/></svg>`;
const appleSvg = svg.replace('rx="8"', 'rx="0"');

function renderIcon(size, source = size === 16 ? smallSvg : svg) {
  const sourceSize = source === smallSvg ? 16 : 32;
  return sharp(Buffer.from(source), { density: 72 * size / sourceSize })
    .resize(size, size)
    .png();
}

await writeFile(`${output}favicon.svg`, svg);
for (const [name, size] of [
  ["favicon-16.png", 16],
  ["favicon-32.png", 32],
  ["favicon.png", 96],
  ["apple-touch-icon.png", 180],
  ["icon-192.png", 192],
  ["icon.png", 512],
])
  await renderIcon(size, name === "apple-touch-icon.png" ? appleSvg : undefined)
    .toFile(`${output}${name}`);
const sizes = [16, 32, 48];
const pngs = await Promise.all(
  sizes.map((size) => renderIcon(size).toBuffer()),
);
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
for (let i = 0; i < sizes.length; i++) {
  const p = 6 + 16 * i;
  header[p] = sizes[i];
  header[p + 1] = sizes[i];
  header.writeUInt16LE(1, p + 4);
  header.writeUInt16LE(32, p + 6);
  header.writeUInt32LE(pngs[i].length, p + 8);
  header.writeUInt32LE(offset, p + 12);
  offset += pngs[i].length;
}
await writeFile(`${output}favicon.ico`, Buffer.concat([header, ...pngs]));
await sharp(
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 32 32"><rect width="32" height="32" fill="#09090b"/><g transform="translate(4 4) scale(.75)">${mark}${accent}</g></svg>`,
  ),
)
  .png()
  .toFile(`${output}icon-maskable.png`);
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#09090b"/><g stroke="#28282d"><path d="M40 0v630M1160 0v630M40 110h1120M40 550h1120"/>${Array.from({ length: 63 }, (_, i) => `<path d="M${i % 5 ? 32 : 22} ${i * 10}h${i % 5 ? 8 : 18}M1160 ${i * 10}h${i % 5 ? 8 : 18}"/>`).join("")}</g><g font-family="Arial,sans-serif"><text x="88" y="70" fill="#ededf0" font-size="24">@code by PRIYANSHU</text><text x="88" y="213" fill="#fafafa" font-size="65" font-weight="600">Priyanshu Gupta</text><text x="88" y="326" fill="#fafafa" font-size="83" font-weight="600">I build &amp; solve.</text><text x="88" y="410" fill="#b0b0bb" font-size="24">Software Developer &amp; Systems Engineer</text><text x="88" y="458" fill="#b0b0bb" font-size="22">C++ · Algorithms · Linux · Modern web applications</text><text x="88" y="597" fill="#aaaaaf" font-size="20">priyanshugupta.com</text></g></svg>`;
if (!process.argv.includes("--icons-only")) {
await sharp(Buffer.from(og)).png().toFile(`${output}opengraph.png`);
// Keep the historical URL useful for crawlers that still have the old preview cached.
await sharp(`${output}opengraph.png`).jpeg({ quality: 90 }).toFile(`${output}official/opengraphh.jpg`);
}
await renderIcon(400).toFile(`${output}official/logo.png`);
console.log(process.argv.includes("--icons-only")
  ? "Generated local favicon and app icon assets."
  : "Generated local favicon, app icon, and social preview assets.");
