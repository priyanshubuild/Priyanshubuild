import { readFile, mkdir, writeFile } from "node:fs/promises";

const projects = JSON.parse(
  await readFile(new URL("../src/data/projects.json", import.meta.url), "utf8"),
);
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[char],
  );
await mkdir(new URL("../public/projects/", import.meta.url), {
  recursive: true,
});
for (const project of projects) {
  // These are locally generated title covers, not screenshots of someone else's work.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600" role="img" aria-labelledby="title"><title id="title">${escape(project.title)} — repository title cover</title><defs><pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#202024" stroke-width="1"/></pattern></defs><rect width="1200" height="600" fill="#09090b"/><rect width="1200" height="600" fill="url(#grid)"/><rect x="32" y="32" width="1136" height="536" rx="22" fill="#101013" stroke="#303036"/><path d="M64 126H1136M64 474H1136" stroke="#303036"/><g font-family="Arial,Helvetica,sans-serif"><text x="76" y="92" fill="#d4d4d8" font-size="25" font-weight="700">@code by PRIYANSHU</text><circle cx="1106" cy="83" r="7" fill="#22c55e"/>${project.coverLines.map((line, i) => `<text x="76" y="${246 + i * 90}" fill="#fafafa" font-size="76" font-weight="700" letter-spacing="-2">${escape(line)}</text>`).join("")}<text x="76" y="527" fill="#a1a1aa" font-size="22" letter-spacing="2">${escape(project.coverLabel)}</text></g><path d="m990 215-48 48 48 48m57-96 48 48-48 48" stroke="#52525b" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
  await writeFile(
    new URL(`../public${project.image}`, import.meta.url),
    svg + "\n",
  );
}
console.log(`Generated ${projects.length} local vector project covers.`);
