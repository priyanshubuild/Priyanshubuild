export const GITHUB_USERNAME = "priyanshubuild";
export type Contribution = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  placeholder?: boolean;
};
export type RepoContribution = { name: string; count: number; href: string };
export type GitHubSnapshot = {
  calendar: { days: Contribution[]; fetchedAt: string } | null;
  repositories: {
    repos: RepoContribution[];
    from: string;
    to: string;
    fetchedAt: string;
  } | null;
  errors: { calendar: boolean; repositories: boolean };
};
const DAY = 86400000;
function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
export function contributionRange(now = new Date()) {
  const to = now.toISOString().slice(0, 10);
  const from = new Date(Date.parse(to) - 364 * DAY).toISOString().slice(0, 10);
  return { from, to };
}
export function normalizeCalendar(raw: unknown): Contribution[] {
  if (
    !object(raw) ||
    !Array.isArray(raw.contributions) ||
    !raw.contributions.length
  )
    throw new Error("Missing calendar");
  const days = raw.contributions
    .map((day): Contribution => {
      if (
        !object(day) ||
        typeof day.date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(day.date) ||
        !Number.isFinite(Date.parse(day.date)) ||
        new Date(day.date).toISOString().slice(0, 10) !== day.date ||
        !Number.isInteger(day.count) ||
        (day.count as number) < 0 ||
        !Number.isInteger(day.level) ||
        (day.level as number) < 0 ||
        (day.level as number) > 4
      )
        throw new Error("Invalid contribution day");
      return {
        date: day.date,
        count: day.count as number,
        level: day.level as Contribution["level"],
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
  for (let i = 1; i < days.length; i++)
    if (Date.parse(days[i].date) - Date.parse(days[i - 1].date) !== DAY)
      throw new Error("Incomplete calendar");
  return days.slice(-365);
}
export function parseCommitPage(raw: unknown) {
  if (
    !object(raw) ||
    !Number.isInteger(raw.total_count) ||
    (raw.total_count as number) < 0 ||
    raw.incomplete_results !== false ||
    !Array.isArray(raw.items)
  )
    throw new Error("Incomplete commit search");
  const items = raw.items.map((item) => {
    if (
      !object(item) ||
      typeof item.sha !== "string" ||
      !/^[a-f0-9]{40}$/i.test(item.sha) ||
      !object(item.repository) ||
      item.repository.private !== false ||
      typeof item.repository.full_name !== "string" ||
      !/^[\w.-]+\/[\w.-]+$/.test(item.repository.full_name) ||
      !object(item.author) ||
      typeof item.author.login !== "string" ||
      item.author.login.toLowerCase() !== GITHUB_USERNAME
    )
      throw new Error("Invalid authored commit");
    return { sha: item.sha, repo: item.repository.full_name };
  });
  return { total: raw.total_count as number, items };
}
export function rankRepositories(
  commits: { sha: string; repo: string }[],
): RepoContribution[] {
  const seen = new Set<string>();
  const counts = new Map<string, number>();
  for (const commit of commits) {
    const key = `${commit.repo.toLowerCase()}:${commit.sha}`;
    if (seen.has(key)) continue;
    seen.add(key);
    counts.set(commit.repo, (counts.get(commit.repo) ?? 0) + 1);
  }
  return [...counts]
    .sort(([a, ac], [b, bc]) => bc - ac || a.localeCompare(b))
    .map(([repo, count]) => ({
      name: repo.split("/")[1],
      count,
      href: `https://github.com/${repo}`,
    }));
}
export function mergeSnapshot(
  previous: GitHubSnapshot | undefined,
  next: GitHubSnapshot,
): GitHubSnapshot {
  return {
    ...next,
    calendar: next.calendar ?? previous?.calendar ?? null,
    repositories: next.repositories ?? previous?.repositories ?? null,
  };
}
