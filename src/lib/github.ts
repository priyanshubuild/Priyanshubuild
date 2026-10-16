import "server-only";
import { unstable_cache } from "next/cache";
import savedActivity from "../../assets/readme/activity.json";
import {
  GITHUB_USERNAME, contributionRange, normalizeCalendar, parseContributionHTML,
  parseRepositoryCommitCount, sortRepositoryTotals, type GitHubSnapshot,
} from "./github-data";

async function githubResponse(path: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json", "User-Agent": "priyanshu-portfolio",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(`https://api.github.com${path}`, {
    headers, cache: "no-store", signal: AbortSignal.timeout(15000),
  });
  if (!response.ok && response.status !== 409) throw new Error(`GitHub returned ${response.status}`);
  return response;
}

// Time buckets block for a fresh result instead of returning a stale entry first.
const calendar = unstable_cache(async (from: string, to: string, _bucket: number) => {
  void _bucket;
  const years = [...new Set([from.slice(0, 4), to.slice(0, 4)])];
  const pages = await Promise.all(years.map(async year => {
    const response = await fetch(`https://github.com/users/${GITHUB_USERNAME}/contributions?from=${year}-01-01&to=${year}-12-31`, {
      headers: { Accept: "text/html" }, cache: "no-store", signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error("GitHub calendar is unavailable");
    return parseContributionHTML(await response.text());
  }));
  const days = normalizeCalendar({ contributions: pages.flat().filter(day => day.date >= from && day.date <= to) });
  if (days.length !== 365 || days[0].date !== from || days.at(-1)?.date !== to)
    throw new Error("Incomplete GitHub calendar range");
  return { days, from, to, fetchedAt: new Date().toISOString() };
}, ["github-direct-calendar-v2", GITHUB_USERNAME], { revalidate: 120 });

type PublicRepo = { id: number; name: string; fullName: string; branch: string; pushedAt: string };
const ownedRepositories = unstable_cache(async (_bucket: number) => {
  void _bucket;
  const repos = new Map<string, PublicRepo>();
  for (let page = 1; page <= 20; page++) {
    const response = await githubResponse(`/users/${GITHUB_USERNAME}/repos?type=owner&per_page=100&page=${page}`);
    const list: unknown = await response.json();
    if (!Array.isArray(list)) throw new Error("Invalid repository list");
    for (const repo of list) {
      if (repo.private !== false) continue;
      if (!Number.isSafeInteger(repo.id) || repo.id < 1 || typeof repo.full_name !== "string" || !/^priyanshubuild\/[\w.-]+$/i.test(repo.full_name) || typeof repo.name !== "string" || typeof repo.default_branch !== "string" || !repo.default_branch || (repo.pushed_at !== null && !Number.isFinite(Date.parse(repo.pushed_at))))
        throw new Error("Invalid public repository");
      repos.set(repo.full_name.toLowerCase(), { id: repo.id, name: repo.name, fullName: repo.full_name, branch: repo.default_branch, pushedAt: repo.pushed_at ?? "empty" });
    }
    if (list.length < 100) return { repos: [...repos.values()], fetchedAt: new Date().toISOString() };
  }
  throw new Error("Incomplete repository pagination");
}, ["github-owned-public-repos-v2", GITHUB_USERNAME], { revalidate: 120 });

// A new push or default branch invalidates the key. Unchanged repositories do
// not need another API request on every refresh, protecting public API limits.
const commitCount = unstable_cache(async (fullName: string, branch: string, _pushedAt: string, repositoryId: number) => {
  void _pushedAt;
  const params = new URLSearchParams({ per_page: "1", sha: branch });
  const response = await githubResponse(`/repos/${fullName}/commits?${params}`);
  if (response.status === 409) return 0;
  return parseRepositoryCommitCount(await response.json(), response.headers.get("link"), fullName, repositoryId);
}, ["github-all-default-branch-commits-v2"], { revalidate: 86400 });

async function repositories(bucket: number): Promise<NonNullable<GitHubSnapshot["repositories"]>> {
  const owned = await ownedRepositories(bucket);
  const repos = [];
  for (let i = 0; i < owned.repos.length; i += 3) {
    repos.push(...await Promise.all(owned.repos.slice(i, i + 3).map(async repo => ({
      name: repo.name, href: `https://github.com/${repo.fullName}`,
      count: await commitCount(repo.fullName, repo.branch, repo.pushedAt, repo.id),
    }))));
  }
  return { repos: sortRepositoryTotals(repos), scope: "all-time", source: "github-default-branches", fetchedAt: owned.fetchedAt };
}

export async function getGitHubSnapshot(): Promise<GitHubSnapshot> {
  const { from, to } = contributionRange();
  const bucket = Math.floor(Date.now() / 120000);
  const [days, repos] = await Promise.allSettled([calendar(from, to, bucket), repositories(bucket)]);
  const saved = savedActivity as unknown as GitHubSnapshot;
  const savedCalendar = saved.calendar?.from === from && saved.calendar?.to === to ? saved.calendar : null;
  const savedRepositories = saved.repositories?.scope === "all-time" ? saved.repositories : null;
  return {
    calendar: days.status === "fulfilled" ? days.value : savedCalendar,
    repositories: repos.status === "fulfilled" ? repos.value : savedRepositories,
    errors: { calendar: days.status === "rejected", repositories: repos.status === "rejected" },
  };
}
