import { readFile, writeFile, mkdir, rename, readdir, unlink } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import { mkdtemp, rm } from "node:fs/promises";

const root = fileURLToPath(new URL("../", import.meta.url));
const response = await fetch(process.env.ACTIVITY_SOURCE_URL || "https://priyanshugupta.com/api/github-activity", {
  headers: { Accept: "application/json" },
  signal: AbortSignal.timeout(60000),
});
if (!response.ok) throw new Error("Public activity source is unavailable; keeping the previous snapshot.");
const data = await response.json();
if (data.errors?.calendar !== false || data.errors?.repositories !== false)
  throw new Error("Public activity is incomplete; keeping the previous snapshot.");
const days = data.calendar?.days;
const repos = data.repositories?.repos;
const validDate = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
if (!Array.isArray(days) || days.length !== 365 || !Array.isArray(repos))
  throw new Error("Unexpected activity shape.");
for (let i = 0; i < days.length; i++) {
  const day = days[i];
  if (!validDate(day.date) || !Number.isInteger(day.count) || day.count < 0 || !Number.isInteger(day.level) || day.level < 0 || day.level > 4 || (i && Date.parse(day.date) - Date.parse(days[i - 1].date) !== 86400000))
    throw new Error("Invalid calendar data.");
}
for (let i = 0; i < repos.length; i++) {
  const repo = repos[i];
  if (typeof repo.name !== "string" || !/^[\w.-]+$/.test(repo.name) || !Number.isInteger(repo.count) || repo.count < 1 || typeof repo.href !== "string" || !/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/.test(repo.href) || (i && repo.count > repos[i - 1].count))
    throw new Error("Invalid repository ranking.");
}
const { from, to } = data.calendar;
const { fetchedAt } = data.repositories;
if (data.repositories.scope !== "all-time" || !validDate(from) || !validDate(to) || Date.parse(to) - Date.parse(from) !== 364 * 86400000 || !Number.isFinite(Date.parse(fetchedAt)))
  throw new Error("Invalid source timestamps.");
const escape = (text) => String(text).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const total = days.reduce((sum, day) => sum + day.count, 0);
const commits = repos.reduce((sum, repo) => sum + repo.count, 0);
const active = days.filter((day) => day.count > 0).length;
const temporary = await mkdtemp(join(tmpdir(), "portfolio-readme-lines-"));
let languages;
try {
  const output = join(temporary, "source-lines.json");
  await promisify(execFile)("python3", [join(root, "scripts/count-public-code.py"), output], { timeout: 240000, maxBuffer: 1024 * 1024 });
  languages = JSON.parse(await readFile(output, "utf8"));
} finally {
  await rm(temporary, { recursive: true, force: true });
}
if (!languages.lines || !Array.isArray(languages.repositories) || languages.scope !== "public-non-fork-default-branches")
  throw new Error("Invalid source line snapshot");
const languageRows = Object.entries(languages.lines).sort(([a, ac], [b, bc]) => bc - ac || a.localeCompare(b));
if (languageRows.some(([, count]) => !Number.isSafeInteger(count) || count < 0)) throw new Error("Invalid code line total");
const sum = languageRows.reduce((value, [, count]) => value + count, 0);
const shown = languageRows.slice(0, 6);
const languageDate = languages.fetchedAt.slice(0, 10);
const metrics = [["Contributions · year", total], ["Commits · all time", commits], ["Active days · year", active]].map(([label, value], index) => `<text x="${24 + index * 138}" y="78" fill="#fafafa" font-size="30" font-weight="700">${value.toLocaleString("en-US")}</text><text x="${24 + index * 138}" y="102" fill="#a1a1aa" font-size="10">${label}</text>`).join("");
const snapshotDate = fetchedAt.slice(0, 10);
const frame = '<rect x=".5" y=".5" width="439" height="175" rx="10" fill="#09090b" stroke="#303036"/>';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="176" role="img" aria-labelledby="title desc"><title id="title">Priyanshu Gupta's GitHub activity totals</title><desc id="desc">${total} contributions and ${active} active days between ${from} and ${to}; ${commits} all-time commits by all contributors on public repository default branches.</desc>${frame}<g font-family="Arial,sans-serif"><text x="24" y="28" fill="#fafafa" font-size="13" font-weight="600">GitHub activity</text>${metrics}<text x="24" y="157" fill="#a1a1aa" font-size="10">Updated ${snapshotDate} UTC</text></g></svg>`;
const shades = ["#fafafa", "#b0b0bb", "#84848f", "#63636e", "#4c4c57", "#383843"];
let left = 24;
const bar = shown.map(([, count], i) => {
  const width = sum ? 392 * count / sum : 0;
  const rect = `<rect x="${left}" y="48" width="${width}" height="8" fill="${shades[i]}"/>`;
  left += width;
  return rect;
}).join("");
const legend = shown.map(([name, count], i) => `<circle cx="${28 + (i % 2) * 196}" cy="${79 + Math.floor(i / 2) * 23}" r="3" fill="${shades[i]}"/><text x="${38 + (i % 2) * 196}" y="${83 + Math.floor(i / 2) * 23}" fill="#e4e4e7" font-size="11">${escape(name.slice(0, 18))}</text><text x="${208 + (i % 2) * 196}" y="${83 + Math.floor(i / 2) * 23}" text-anchor="end" fill="#fafafa" font-family="monospace" font-size="11">${count.toLocaleString("en-US")}</text>`).join("");
const languageSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="176" role="img" aria-labelledby="title desc"><title id="title">Public source lines by language</title><desc id="desc">Nonblank, noncomment source lines in public non-fork repositories: ${escape(shown.map(([name, count]) => `${name} ${count} lines`).join(", "))}. Dependencies, generated files and notebook outputs are excluded.</desc>${frame}<g font-family="Arial,sans-serif"><text x="24" y="28" fill="#fafafa" font-size="13" font-weight="600">Public code · lines</text><rect x="24" y="48" width="392" height="8" rx="4" fill="#26262c"/>${bar}${legend}${!sum ? '<text x="24" y="83" fill="#a1a1aa" font-size="11">No public source lines available.</text>' : ""}<text x="24" y="157" fill="#a1a1aa" font-size="10">${sum.toLocaleString("en-US")} lines total</text><text x="416" y="157" text-anchor="end" fill="#a1a1aa" font-size="10">Updated ${languageDate} UTC</text></g></svg>`;
const activityImage = `activity-${createHash("sha256").update(svg).digest("hex").slice(0, 12)}.svg`;
const languagesImage = `languages-${createHash("sha256").update(languageSVG).digest("hex").slice(0, 12)}.svg`;
const block = `<!-- activity:start -->
<p align="center">
  <a href="https://github.com/priyanshubuild"><img src="assets/readme/${activityImage}" width="49%" alt="${total} GitHub contributions and ${active} active days in the past year; ${commits} all-time commits across public repositories" /></a>
  <a href="https://github.com/priyanshubuild?tab=repositories"><img src="assets/readme/${languagesImage}" width="49%" alt="Public source lines: ${escape(shown.map(([name, count]) => `${name} ${count.toLocaleString("en-US")} lines`).join(", ")) || "no source lines"}" /></a>
</p>

<sub>Activity: past year · Repository commits: all time · Updated daily · ${snapshotDate} UTC.</sub>
<!-- activity:end -->`;
const readme = await readFile(join(root, "README.md"), "utf8");
if ((readme.match(/<!-- activity:start -->/g) || []).length !== 1 || (readme.match(/<!-- activity:end -->/g) || []).length !== 1)
  throw new Error("README activity markers are missing or duplicated.");
if (readme.indexOf("<!-- activity:end -->") < readme.indexOf("<!-- activity:start -->"))
  throw new Error("README activity markers are out of order.");
const updated = readme.replace(/<!-- activity:start -->[\s\S]*?<!-- activity:end -->/, block);
// Keep the preceding images for readers with a cached README, plus this snapshot.
const retainedImages = new Set([activityImage, languagesImage]);
for (const [, file] of readme.matchAll(/assets\/readme\/((?:activity|languages)-[a-f0-9]{12}\.svg)/g)) retainedImages.add(file);
await mkdir(join(root, "assets/readme"), { recursive: true });
for (const [file, contents] of [
  ["assets/readme/activity.svg", svg],
  ["assets/readme/languages.svg", languageSVG],
  [`assets/readme/${activityImage}`, svg],
  [`assets/readme/${languagesImage}`, languageSVG],
  ["assets/readme/activity.json", JSON.stringify({ calendar: data.calendar, repositories: data.repositories, languages }, null, 2) + "\n"],
  ["README.md", updated],
]) {
  const path = join(root, file);
  await writeFile(`${path}.tmp`, contents);
  await rename(`${path}.tmp`, path);
}
for (const file of await readdir(join(root, "assets/readme"))) {
  if (/^(?:activity|languages)-[a-f0-9]{12}\.svg$/.test(file) && !retainedImages.has(file))
    await unlink(join(root, "assets/readme", file));
}
console.log(`Updated public activity: ${total} contributions, ${commits} repository commits, ${sum} source lines.`);
