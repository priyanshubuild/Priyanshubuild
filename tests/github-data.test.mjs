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
  parseContributionHTML,
  parseRepositoryCommitCount,
  sortRepositoryTotals,
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
    repository: { full_name: "priyanshubuild/actual-repo", private: false },
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
  assert.throws(() =>
    parseCommitPage({
      total_count: 1,
      incomplete_results: false,
      items: [{ ...item, repository: { ...item.repository, private: true } }],
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

test("repository totals include all authors and all time from GitHub pagination", () => {
  const body = [{ sha: "a".repeat(40), author: { login: "github-actions[bot]" } }];
  assert.equal(parseRepositoryCommitCount(body, '<https://api.github.com/repos/priyanshubuild/Priyanshubuild/commits?per_page=1&sha=main&page=62>; rel="last"', "priyanshubuild/Priyanshubuild"), 62);
  assert.equal(parseRepositoryCommitCount(body, null, "priyanshubuild/Priyanshubuild"), 1);
  assert.equal(parseRepositoryCommitCount([], null, "priyanshubuild/empty"), 0);
  assert.equal(parseRepositoryCommitCount(body, '<https://api.github.com/repositories/1335956799/commits?per_page=1&sha=main&page=48>; rel="last"', "priyanshubuild/100xDevs", 1335956799), 48);
  assert.throws(() => parseRepositoryCommitCount(body, '<https://api.github.com/repositories/123/commits?per_page=1&sha=main&page=48>; rel="last"', "priyanshubuild/100xDevs", 1335956799));
  for (const url of [
    "https://example.com/repos/priyanshubuild/repo/commits?per_page=1&page=9",
    "https://api.github.com/repos/other/repo/commits?per_page=1&page=9",
    "https://api.github.com/repos/priyanshubuild/repo/commits?per_page=1&page=9&author=priyanshubuild",
    "https://api.github.com/repos/priyanshubuild/repo/commits?per_page=100&page=9",
  ]) assert.throws(() => parseRepositoryCommitCount(body, `<${url}>; rel="last"`, "priyanshubuild/repo"));
  assert.throws(() => parseRepositoryCommitCount({ message: "API unavailable" }, null, "priyanshubuild/repo"));
});

test("a repository overtakes the leader by its total commits with stable ties", () => {
  const a = { name: "alpha", count: 64, href: "https://github.com/priyanshubuild/alpha" };
  const b = { name: "beta", count: 62, href: "https://github.com/priyanshubuild/beta" };
  assert.equal(sortRepositoryTotals([b, a])[0].name, "alpha");
  assert.equal(sortRepositoryTotals([a, { ...b, count: 65 }])[0].name, "beta");
  assert.equal(sortRepositoryTotals([{ ...b, count: 64 }, a])[0].name, "alpha");
});

test("the official calendar reads singular, zero and comma-separated counts", () => {
  const html = [1, 0, 1234].map((count, i) => `<td id="day-${i}" data-date="2026-10-${14 + i}" data-level="${i === 1 ? 0 : i + 1}"></td><tool-tip for="day-${i}">${count ? count.toLocaleString("en-US") : "No"} contribution${count === 1 ? "" : "s"} on October.</tool-tip>`).join("");
  assert.deepEqual(parseContributionHTML(html).map(day => day.count), [1, 0, 1234]);
  assert.throws(() => parseContributionHTML('<td id="missing" data-date="2026-10-16" data-level="1"></td>'));
  assert.throws(() => parseContributionHTML("unavailable"));
});

test("parsing an entire leap year preserves January 1 for rolling ranges", () => {
  const html = Array.from({ length: 366 }, (_, i) => {
    const date = new Date(Date.UTC(2024, 0, 1 + i)).toISOString().slice(0, 10);
    return `<td id="d${i}" data-date="${date}" data-level="0"></td><tool-tip for="d${i}">No contributions on this day.</tool-tip>`;
  }).join("");
  const year = parseContributionHTML(html);
  assert.equal(year.length, 366);
  assert.equal(year[0].date, "2024-01-01");
});
