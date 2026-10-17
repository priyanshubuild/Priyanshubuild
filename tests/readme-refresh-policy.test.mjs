import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { refreshedToday } from "../scripts/readme-refresh-policy.mjs";

const snapshot = (timestamp) =>
  Object.fromEntries(
    ["calendar", "repositories", "languages"].map((key) => [
      key,
      { fetchedAt: timestamp },
    ]),
  );

test("daily refresh skips only a complete snapshot from today's India date", () => {
  const now = new Date("2026-10-17T01:00:00Z");
  assert.equal(refreshedToday(snapshot("2026-10-16T23:00:00Z"), now), true);
  assert.equal(refreshedToday(snapshot("2026-10-16T10:00:00Z"), now), false);
  const partial = snapshot("2026-10-17T00:00:00Z");
  partial.languages.fetchedAt = "2026-10-16T00:00:00Z";
  assert.equal(refreshedToday(partial, now), false);
  assert.equal(refreshedToday(undefined, now), false);
  assert.equal(refreshedToday(snapshot("invalid"), now), false);
  assert.equal(refreshedToday(snapshot("2026-10-18T00:00:00Z"), now), false);
});

test("README automation has a single daily schedule and duplicate safeguard", async () => {
  const workflow = await readFile(
    new URL("../.github/workflows/readme-activity.yml", import.meta.url),
    "utf8",
  );
  assert.equal((workflow.match(/cron:/g) || []).length, 1);
  assert.match(workflow, /cron: '25 0 \* \* \*'/);
  assert.doesNotMatch(workflow, /workflow_dispatch:|\n  push:/);
  assert.match(workflow, /update-readme-activity\.mjs --daily/);
});
