import { unstable_cache } from "next/cache";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const getStars = unstable_cache(
  async () => {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "priyanshu-portfolio",
    };
    if (process.env.GITHUB_TOKEN)
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const response = await fetch(
      "https://api.github.com/repos/priyanshubuild/Priyanshubuild",
      { headers, cache: "no-store", signal: AbortSignal.timeout(8000) },
    );
    if (!response.ok) throw new Error("GitHub stars unavailable");
    const data = await response.json();
    if (!Number.isInteger(data.stargazers_count) || data.stargazers_count < 0)
      throw new Error("Invalid GitHub stars");
    return data.stargazers_count;
  },
  ["portfolio-repository-stars"],
  { revalidate: 3600 },
);
export async function GET() {
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
  try {
    return Response.json({ stars: await getStars() }, { headers });
  } catch {
    return Response.json({ stars: null }, { status: 503, headers });
  }
}
