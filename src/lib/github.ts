import "server-only";
import { unstable_cache } from "next/cache";
import {
  GITHUB_USERNAME,
  contributionRange,
  normalizeCalendar,
  parseCommitPage,
  rankRepositories,
  type GitHubSnapshot,
} from "./github-data";
async function getJSON(url: string, github = false): Promise<unknown> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (github) {
    headers.Accept = "application/vnd.github+json";
    headers["User-Agent"] = "priyanshu-portfolio";
    if (process.env.GITHUB_TOKEN)
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const response = await fetch(url, {
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok)
    throw new Error(`GitHub source returned ${response.status}`);
  return response.json();
}
const calendar = unstable_cache(
  async () => ({
    days: normalizeCalendar(
      await getJSON(
        `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`,
      ),
    ),
    fetchedAt: new Date().toISOString(),
  }),
  ["github-calendar", GITHUB_USERNAME],
  { revalidate: 900 },
);
async function searchRange(
  from: string,
  to: string,
  depth = 0,
): Promise<{ sha: string; repo: string }[]> {
  const query = encodeURIComponent(
    `author:${GITHUB_USERNAME} is:public committer-date:${from}..${to}`,
  );
  const url = `https://api.github.com/search/commits?q=${query}&per_page=100&sort=committer-date&order=desc`;
  const first = parseCommitPage(await getJSON(`${url}&page=1`, true));
  // GitHub caps a single search at 1,000 results. Split the date range rather than silently truncating.
  if (first.total > 1000) {
    if (from === to || depth >= 9)
      throw new Error("Commit search cannot be completed");
    const middle = new Date(
      Math.floor((Date.parse(from) + Date.parse(to)) / 2 / 86400000) * 86400000,
    )
      .toISOString()
      .slice(0, 10);
    const after = new Date(Date.parse(middle) + 86400000)
      .toISOString()
      .slice(0, 10);
    return [
      ...(await searchRange(from, middle, depth + 1)),
      ...(await searchRange(after, to, depth + 1)),
    ];
  }
  const commits = [...first.items];
  // At most nine further requests. A partial/rate-limited search never becomes an inaccurate ranking.
  for (let page = 2; page <= Math.ceil(first.total / 100); page++) {
    const next = parseCommitPage(await getJSON(`${url}&page=${page}`, true));
    if (next.total !== first.total)
      throw new Error("Commit search changed during pagination");
    commits.push(...next.items);
  }
  if (
    new Set(commits.map((c) => `${c.repo.toLowerCase()}:${c.sha}`)).size !==
    first.total
  )
    throw new Error("Commit search is incomplete");
  return commits;
}
const repositories = unstable_cache(
  async () => {
    const { from, to } = contributionRange();
    const repos = rankRepositories(await searchRange(from, to));
    return { repos, from, to, fetchedAt: new Date().toISOString() };
  },
  ["github-public-authored-commits", GITHUB_USERNAME],
  { revalidate: 900 },
);
export async function getGitHubSnapshot(): Promise<GitHubSnapshot> {
  const [days, repos] = await Promise.allSettled([calendar(), repositories()]);
  return {
    calendar: days.status === "fulfilled" ? days.value : null,
    repositories: repos.status === "fulfilled" ? repos.value : null,
    errors: {
      calendar: days.status === "rejected",
      repositories: repos.status === "rejected",
    },
  };
}
