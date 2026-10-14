import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";
const source = await readFile(
  new URL("../src/lib/github-data.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022,
  },
});
const {
  rankRepositories,
  parseCommitPage,
  normalizeCalendar,
  mergeSnapshot,
  contributionRange,
} = await import(
  `data:text/javascript;base64,${Buffer.from(compiled.outputText).toString("base64")}`
);
const commit = (sha, repo) => ({ sha: String(sha).padStart(40, "0"), repo });
test("repository order changes with real commit totals", () => {
  const a = commit(1, "priyanshubuild/alpha"),
    b = commit(2, "priyanshubuild/beta"),
    c = commit(3, "priyanshubuild/beta");
  assert.equal(rankRepositories([a, b, c])[0].name, "beta");
  const data = rankRepositories([
    a,
    b,
    c,
    commit(4, a.repo),
    commit(5, a.repo),
  ]);
  assert.equal(data[0].name, "alpha");
  assert.equal(data[0].count, 3);
  assert.equal(data[0].href, "https://github.com/priyanshubuild/alpha");
});
test("duplicate commits never inflate repository counts", () =>
  assert.equal(
    rankRepositories([
      commit(1, "priyanshubuild/repo"),
      commit(1, "priyanshubuild/repo"),
    ])[0].count,
    1,
  ));
test("ties are stable and a valid empty commit result is accepted", () => {
  assert.equal(
    rankRepositories([
      commit(1, "priyanshubuild/z"),
      commit(2, "priyanshubuild/a"),
    ])[0].name,
    "a",
  );
  assert.deepEqual(
    parseCommitPage({ total_count: 0, incomplete_results: false, items: [] }),
    { total: 0, items: [] },
  );
});
test("incomplete searches and API failures cannot be shown as accurate rankings", () => {
  for (const x of [
    { message: "API rate limit exceeded" },
    { total_count: 2, incomplete_results: true, items: [] },
    { total_count: 1, incomplete_results: false, items: [{}] },
  ])
    assert.throws(() => parseCommitPage(x));
});
test("commit search verifies ownership and a safe repository link", () => {
  const item = {
    sha: "a".repeat(40),
    repository: { full_name: "priyanshubuild/actual-repo" },
    author: { login: "Priyanshubuild" },
  };
  assert.equal(
    parseCommitPage({
      total_count: 1,
      incomplete_results: false,
      items: [item],
    }).items[0].repo,
    "priyanshubuild/actual-repo",
  );
  assert.throws(() =>
    parseCommitPage({
      total_count: 1,
      incomplete_results: false,
      items: [{ ...item, author: { login: "someone-else" } }],
    }),
  );
});
test("calendar retains non-Sunday dates and computes exactly the displayed days", () => {
  const days = normalizeCalendar({
    contributions: [
      { date: "2026-10-13", count: 3, level: 1 },
      { date: "2026-10-14", count: 5, level: 2 },
    ],
  });
  assert.equal(days[0].date, "2026-10-13");
  assert.equal(
    days.reduce((s, d) => s + d.count, 0),
    8,
  );
  assert.throws(() => normalizeCalendar({ contributions: [days[0], days[0]] }));
  assert.throws(() =>
    normalizeCalendar({ contributions: [{ ...days[0], count: -1 }] }),
  );
});
test("failed refresh keeps last successful data and exposes the error", () => {
  const previous = {
    calendar: { days: [], fetchedAt: "2026-10-14" },
    repositories: {
      repos: [],
      from: "2025-10-15",
      to: "2026-10-14",
      fetchedAt: "2026-10-14",
    },
    errors: { calendar: false, repositories: false },
  };
  const next = {
    calendar: null,
    repositories: null,
    errors: { calendar: true, repositories: true },
  };
  const merged = mergeSnapshot(previous, next);
  assert.equal(merged.calendar, previous.calendar);
  assert.equal(merged.repositories, previous.repositories);
  assert.equal(merged.errors.repositories, true);
});
test("year range covers 365 inclusive UTC dates", () =>
  assert.deepEqual(contributionRange(new Date("2026-10-14T18:00:00Z")), {
    from: "2025-10-15",
    to: "2026-10-14",
  }));
