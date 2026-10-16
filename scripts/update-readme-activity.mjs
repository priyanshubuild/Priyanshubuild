import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const response = await fetch("https://priyanshugupta.com/api/github-activity", {
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
const { from, to, fetchedAt } = data.repositories;
if (!validDate(from) || !validDate(to) || Date.parse(to) - Date.parse(from) !== 364 * 86400000 || !Number.isFinite(Date.parse(fetchedAt)))
  throw new Error("Invalid source timestamps.");
const escape = (text) => String(text).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const total = days.reduce((sum, day) => sum + day.count, 0);
const commits = repos.reduce((sum, repo) => sum + repo.count, 0);
const active = days.filter((day) => day.count > 0).length;
async function githubJSON(path) {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "priyanshu-readme" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const result = await fetch(`https://api.github.com${path}`, { headers, signal: AbortSignal.timeout(15000) });
  if (!result.ok) throw new Error("GitHub language data is unavailable; keeping the previous snapshot.");
  return result.json();
}
const owned = new Map();
for (let page = 1; page <= 20; page++) {
  const list = await githubJSON(`/users/priyanshubuild/repos?type=owner&per_page=100&page=${page}`);
  if (!Array.isArray(list)) throw new Error("Invalid repository response.");
  for (const repo of list) {
    if (repo.private !== false || repo.fork !== false) continue;
    if (typeof repo.full_name !== "string" || !/^priyanshubuild\/[\w.-]+$/i.test(repo.full_name)) throw new Error("Invalid public repository.");
    owned.set(repo.full_name.toLowerCase(), repo.full_name);
  }
  if (list.length < 100) break;
  if (page === 20) throw new Error("Language pagination cannot be completed.");
}
const bytes = new Map();
const byRepository = [];
const names = [...owned.values()];
for (let i = 0; i < names.length; i += 3) {
  const responses = await Promise.all(names.slice(i, i + 3).map((name) => githubJSON(`/repos/${name}/languages`)));
  for (const [index, languages] of responses.entries()) {
    if (!languages || Array.isArray(languages) || typeof languages !== "object") throw new Error("Invalid language data.");
    for (const [name, count] of Object.entries(languages)) {
      if (!Number.isSafeInteger(count) || count < 0) throw new Error("Invalid language count.");
      if (count) bytes.set(name, (bytes.get(name) ?? 0) + count);
    }
    byRepository.push({ repository: names[i + index], bytes: languages });
  }
}
const languageRows = [...bytes].sort(([a, ac], [b, bc]) => bc - ac || a.localeCompare(b));
const sum = languageRows.reduce((value, [, count]) => value + count, 0);
const shown = languageRows.slice(0, 4);
const languageDate = new Date().toISOString().slice(0, 10);
const metrics = [["Contributions", total], ["Authored commits", commits], ["Active days", active]].map(([label, value], index) => `<text x="${24 + index * 138}" y="72" fill="#fafafa" font-size="30" font-weight="700">${value}</text><text x="${24 + index * 138}" y="96" fill="#a1a1aa" font-size="10">${label}</text>`).join("");
const snapshotDate = fetchedAt.slice(0, 10);
const frame = '<rect x=".5" y=".5" width="439" height="149" rx="10" fill="#09090b" stroke="#303036"/>';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="150" role="img" aria-labelledby="title desc"><title id="title">Priyanshu Gupta's GitHub activity totals</title><desc id="desc">${total} contributions, ${commits} public authored commits, and ${active} active days between ${from} and ${to}.</desc>${frame}<g font-family="Arial,sans-serif"><text x="24" y="28" fill="#fafafa" font-size="13" font-weight="600">GitHub activity</text><text x="416" y="28" text-anchor="end" fill="#a1a1aa" font-size="10">Past 365 days</text>${metrics}<text x="24" y="131" fill="#a1a1aa" font-size="10">Updated ${snapshotDate} UTC</text></g></svg>`;
const shades = ["#fafafa", "#b0b0bb", "#73737b", "#45454d"];
let left = 24;
const bar = shown.map(([, count], i) => {
  const width = sum ? 392 * count / sum : 0;
  const rect = `<rect x="${left}" y="48" width="${width}" height="8" fill="${shades[i]}"/>`;
  left += width;
  return rect;
}).join("");
const legend = shown.map(([name, count], i) => `<circle cx="${28 + (i % 2) * 196}" cy="${79 + Math.floor(i / 2) * 23}" r="3" fill="${shades[i]}"/><text x="${38 + (i % 2) * 196}" y="${83 + Math.floor(i / 2) * 23}" fill="#e4e4e7" font-size="11">${escape(name.slice(0, 18))} ${(count / sum * 100).toFixed(1)}%</text>`).join("");
const languageSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="150" role="img" aria-labelledby="title desc"><title id="title">Public repository languages</title><desc id="desc">Language proportions measured by code bytes in ${names.length} public non-fork repositories, not personal effort or proficiency: ${escape(shown.map(([name, count]) => `${name} ${(count / sum * 100).toFixed(1)}%`).join(", "))}.</desc>${frame}<g font-family="Arial,sans-serif"><text x="24" y="28" fill="#fafafa" font-size="13" font-weight="600">Public code languages</text><rect x="24" y="48" width="392" height="8" rx="4" fill="#26262c"/>${bar}${legend}${!sum ? '<text x="24" y="83" fill="#a1a1aa" font-size="11">No public language data available.</text>' : ""}<text x="24" y="131" fill="#a1a1aa" font-size="10">Updated ${languageDate} UTC</text></g></svg>`;
const block = `<!-- activity:start -->
<p align="center">
  <a href="https://github.com/priyanshubuild"><img src="assets/readme/activity.svg" width="49%" alt="${total} GitHub contributions, ${commits} public authored commits, ${active} active days in the past year" /></a>
  <a href="https://github.com/priyanshubuild?tab=repositories"><img src="assets/readme/languages.svg" width="49%" alt="Public code languages by bytes: ${escape(shown.map(([name, count]) => `${name} ${(count / sum * 100).toFixed(1)}%`).join(", ")) || "no language data"}" /></a>
</p>

<sub>Past 365 days · Updated daily · Snapshot: ${snapshotDate} UTC.</sub>
<!-- activity:end -->`;
const readme = await readFile(join(root, "README.md"), "utf8");
if ((readme.match(/<!-- activity:start -->/g) || []).length !== 1 || (readme.match(/<!-- activity:end -->/g) || []).length !== 1)
  throw new Error("README activity markers are missing or duplicated.");
if (readme.indexOf("<!-- activity:end -->") < readme.indexOf("<!-- activity:start -->"))
  throw new Error("README activity markers are out of order.");
const updated = readme.replace(/<!-- activity:start -->[\s\S]*?<!-- activity:end -->/, block);
await mkdir(join(root, "assets/readme"), { recursive: true });
for (const [file, contents] of [
  ["assets/readme/activity.svg", svg],
  ["assets/readme/languages.svg", languageSVG],
  ["assets/readme/activity.json", JSON.stringify({ calendar: data.calendar, repositories: data.repositories, languages: { bytes: Object.fromEntries(languageRows), repositories: byRepository, fetchedAt: languageDate } }, null, 2) + "\n"],
  ["README.md", updated],
]) {
  const path = join(root, file);
  await writeFile(`${path}.tmp`, contents);
  await rename(`${path}.tmp`, path);
}
console.log(`Updated public activity: ${total} contributions, ${commits} authored commits, ${active} active days.`);
