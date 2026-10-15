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
const offset = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
const padded = [...Array(offset).fill(null), ...days];
const colors = ["#26262c", "#383838", "#5c5c5d", "#868689", "#fafafa"];
const cells = padded.map((day, index) => day ? `<rect x="${69 + Math.floor(index / 7) * 14}" y="${157 + index % 7 * 14}" width="10" height="10" rx="2" fill="${colors[day.level]}"><title>${escape(day.date)}: ${day.count} contributions</title></rect>` : "").join("");
const months = [];
let lastMonth = "";
for (let index = 0; index < padded.length; index += 7) {
  const day = padded.slice(index, index + 7).find(Boolean);
  if (!day) continue;
  const month = day.date.slice(0, 7);
  if (month !== lastMonth) {
    const label = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(new Date(day.date));
    months.push(`<text x="${69 + index / 7 * 14}" y="145" fill="#a1a1aa" font-size="10">${label}</text>`);
    lastMonth = month;
  }
}
const metrics = [["CONTRIBUTIONS", total], ["PUBLIC AUTHORED COMMITS", commits], ["ACTIVE DAYS", active]].map(([label, value], index) => `<text x="${56 + index * 268}" y="65" fill="#a1a1aa" font-size="10" letter-spacing="1.1">${label}</text><text x="${56 + index * 268}" y="106" fill="#fafafa" font-size="34" font-weight="700">${value}</text>`).join("");
const snapshotDate = fetchedAt.slice(0, 10);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="880" height="318" viewBox="0 0 880 318" role="img" aria-labelledby="title desc"><title id="title">Priyanshu Gupta's public GitHub activity</title><desc id="desc">${total} contributions, ${commits} public authored commits, and ${active} active days. Calendar covers ${days[0].date} through ${days.at(-1).date}.</desc><rect x=".5" y=".5" width="879" height="317" rx="12" fill="#09090b" stroke="#303036"/><path d="M28 0v318M852 0v318M28 122h824M28 270h824" fill="none" stroke="#242429"/><g font-family="Arial,sans-serif">${metrics}${months.join("")}<text x="38" y="179" fill="#a1a1aa" font-size="9">Mon</text><text x="38" y="207" fill="#a1a1aa" font-size="9">Wed</text><text x="38" y="235" fill="#a1a1aa" font-size="9">Fri</text><text x="56" y="295" fill="#a1a1aa" font-size="11">${days[0].date} → ${days.at(-1).date} · Public snapshot ${snapshotDate}</text></g>${cells}</svg>`;
const top = repos.slice(0, 3);
const block = `<!-- activity:start -->
<p align="center">
  <a href="https://github.com/priyanshubuild"><img src="assets/readme/activity.svg" width="880" alt="${total} GitHub contributions, ${commits} public authored commits, ${active} active days in the past year" /></a>
</p>

### Most active public repositories

| Repository | Authored commits |
| :--- | ---: |
${top.map((repo) => `| [${repo.name}](${repo.href}) | ${repo.count} |`).join("\n")}

<sub>Snapshot: ${snapshotDate} UTC · Repository window: ${from} to ${to}. Calendar totals include all GitHub contribution types; repository totals count indexed public authored commits. Refreshed daily.</sub>
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
  ["assets/readme/activity.json", JSON.stringify({ calendar: data.calendar, repositories: data.repositories }, null, 2) + "\n"],
  ["README.md", updated],
]) {
  const path = join(root, file);
  await writeFile(`${path}.tmp`, contents);
  await rename(`${path}.tmp`, path);
}
console.log(`Updated public activity: ${total} contributions, ${commits} authored commits, ${active} active days.`);
