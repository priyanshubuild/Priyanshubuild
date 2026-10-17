import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const read = (path) => readFile(new URL("../" + path, import.meta.url), "utf8");

test("public agent documents match the shared profile and project sources", async () => {
  await promisify(execFile)(
    process.execPath,
    ["scripts/generate-agent-resources.mjs", "--check"],
    {
      cwd: new URL("../", import.meta.url),
    },
  );
  const profile = JSON.parse(await read("public/profile.json"));
  const originals = JSON.parse(await read("src/data/projects.json"));
  const publicProjects = JSON.parse(await read("public/projects.json"));
  assert.equal(publicProjects.projects.length, originals.length);
  const guide = await read("public/llms-full.txt");
  for (const href of Object.values(profile.profiles))
    assert.ok(guide.includes(href));
  for (const [i, project] of publicProjects.projects.entries()) {
    assert.equal(project.description, originals[i].description);
    assert.equal(project.attribution || "", originals[i].credit);
    assert.ok(guide.includes(project.repository));
    if (project.attribution) assert.ok(guide.includes(project.attribution));
  }
  const home = await read("src/app/page.tsx");
  for (const section of Object.values(profile.sections))
    assert.ok(home.includes(`id="${new URL(section).hash.slice(1)}"`));
  assert.match(guide, /errors\.calendar/);
  assert.match(guide, /HTTP 200 can still contain partial data/);
  assert.match(guide, /not guarantee indexing/);
});
