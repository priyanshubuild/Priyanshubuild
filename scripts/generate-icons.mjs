import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const output = fileURLToPath(new URL("../public/", import.meta.url));
const mark = `<path class="letter" d="M9 7h9a7 7 0 0 1 0 14h-4v5H9V7zm5 5v4h4a2 2 0 0 0 0-4h-4z" fill="#fafafa"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect class="tile" x=".5" y=".5" width="31" height="31" rx="7" fill="#18181b" stroke="#73737b"/>${mark}</svg>`;
await writeFile(
  `${output}favicon.svg`,
  svg.replace(
    "<rect",
    "<style>@media(prefers-color-scheme:light){.tile{fill:#fafafa;stroke:#4c4c54}.letter{fill:#18181b}}</style><rect",
  ),
);
for (const [name, size] of [
  ["favicon-16.png", 16],
  ["favicon-32.png", 32],
  ["favicon.png", 96],
  ["apple-touch-icon.png", 180],
  ["icon-192.png", 192],
  ["icon.png", 512],
])
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(`${output}${name}`);
const sizes = [16, 32, 48];
const pngs = await Promise.all(
  sizes.map((size) =>
    sharp(Buffer.from(svg)).resize(size, size).png().toBuffer(),
  ),
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
    `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 32 32"><rect width="32" height="32" fill="#18181b"/><g transform="translate(5 5) scale(.6875)">${mark}</g></svg>`,
  ),
)
  .png()
  .toFile(`${output}icon-maskable.png`);
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#09090b"/><g stroke="#28282d"><path d="M40 0v630M1160 0v630M40 110h1120M40 550h1120"/>${Array.from({ length: 63 }, (_, i) => `<path d="M${i % 5 ? 32 : 22} ${i * 10}h${i % 5 ? 8 : 18}M1160 ${i * 10}h${i % 5 ? 8 : 18}"/>`).join("")}</g><g font-family="Arial,sans-serif"><text x="88" y="70" fill="#ededf0" font-size="24">@code by PRIYANSHU</text><text x="88" y="213" fill="#fafafa" font-size="65" font-weight="600">Priyanshu Gupta</text><text x="88" y="326" fill="#fafafa" font-size="83" font-weight="600">I build &amp; solve.</text><text x="88" y="410" fill="#b0b0bb" font-size="24">Software Developer &amp; Systems Engineer</text><text x="88" y="458" fill="#b0b0bb" font-size="22">C++ · Algorithms · Linux · Modern web applications</text><text x="88" y="597" fill="#aaaaaf" font-size="20">priyanshugupta.com</text></g></svg>`;
await sharp(Buffer.from(og)).png().toFile(`${output}opengraph.png`);
console.log("Generated local favicon, app icon, and social preview assets.");
