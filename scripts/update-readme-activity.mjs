import { readFile, writeFile, mkdir, rename, readdir, unlink } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import { mkdtemp, rm } from "node:fs/promises";
import { activityAssets, activityBlock, snapshotImagePattern } from "./readme-visuals.mjs";
import { refreshedToday } from "./readme-refresh-policy.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
// Layout-only edits can reuse the last verified snapshot without recounting code.
const renderOnly = process.argv.includes("--render-only");
if (process.argv.includes("--daily") && !renderOnly) {
  let previous;
  try {
    previous = JSON.parse(await readFile(join(root, "assets/readme/activity.json"), "utf8"));
  } catch {
    // A missing or unreadable snapshot needs a complete refresh.
  }
  if (refreshedToday(previous)) {
    console.log("The README already has today's verified snapshot; skipping a duplicate daily refresh.");
    process.exit(0);
  }
}
let data;
if (renderOnly) {
  data = JSON.parse(await readFile(join(root, "assets/readme/activity.json"), "utf8"));
} else {
  const response = await fetch(process.env.ACTIVITY_SOURCE_URL || "https://priyanshugupta.com/api/github-activity", {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok) throw new Error("Public activity source is unavailable; keeping the previous snapshot.");
  data = await response.json();
}
if (!renderOnly && (data.errors?.calendar !== false || data.errors?.repositories !== false))
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
const total = days.reduce((sum, day) => sum + day.count, 0);
const commits = repos.reduce((sum, repo) => sum + repo.count, 0);
let languages = data.languages;
if (!renderOnly) {
  const temporary = await mkdtemp(join(tmpdir(), "portfolio-readme-lines-"));
  try {
    const output = join(temporary, "source-lines.json");
    await promisify(execFile)("python3", [join(root, "scripts/count-public-code.py"), output], { timeout: 240000, maxBuffer: 1024 * 1024 });
    languages = JSON.parse(await readFile(output, "utf8"));
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}
if (!languages?.lines || !Array.isArray(languages.repositories) || languages.scope !== "public-non-fork-default-branches")
  throw new Error("Invalid source line snapshot");
const languageRows = Object.entries(languages.lines).sort(([a, ac], [b, bc]) => bc - ac || a.localeCompare(b));
if (languageRows.some(([, count]) => !Number.isSafeInteger(count) || count < 0)) throw new Error("Invalid code line total");
const sum = languageRows.reduce((value, [, count]) => value + count, 0);
const assets = activityAssets(data, languages);
const block = activityBlock(data, languages, assets);
const readme = await readFile(join(root, "README.md"), "utf8");
if ((readme.match(/<!-- activity:start -->/g) || []).length !== 1 || (readme.match(/<!-- activity:end -->/g) || []).length !== 1)
  throw new Error("README activity markers are missing or duplicated.");
if (readme.indexOf("<!-- activity:end -->") < readme.indexOf("<!-- activity:start -->"))
  throw new Error("README activity markers are out of order.");
const updated = readme.replace(/<!-- activity:start -->[\s\S]*?<!-- activity:end -->/, block);
// Keep the preceding images for readers with a cached README, plus this snapshot.
const retainedImages = new Set([...assets.values()].map(asset => asset.file));
for (const [, file] of readme.matchAll(/assets\/readme\/((?:activity|languages)(?:-compact)?-[a-f0-9]{12}\.svg)/g)) retainedImages.add(file);
await mkdir(join(root, "assets/readme"), { recursive: true });
for (const [file, contents] of [
  ...[...assets].flatMap(([name, asset]) => [[`assets/readme/${name}.svg`, asset.contents], [`assets/readme/${asset.file}`, asset.contents]]),
  ["assets/readme/activity.json", JSON.stringify({ calendar: data.calendar, repositories: data.repositories, languages }, null, 2) + "\n"],
  ["README.md", updated],
]) {
  const path = join(root, file);
  await writeFile(`${path}.tmp`, contents);
  await rename(`${path}.tmp`, path);
}
for (const file of await readdir(join(root, "assets/readme"))) {
  if (snapshotImagePattern.test(file) && !retainedImages.has(file))
    await unlink(join(root, "assets/readme", file));
}
console.log(`Updated public activity: ${total} contributions, ${commits} repository commits, ${sum} source lines.`);
