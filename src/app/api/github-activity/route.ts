import { getGitHubSnapshot } from "@/lib/github";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
export async function GET() {
  const snapshot = await getGitHubSnapshot();
  return Response.json(snapshot, {
    status: snapshot.calendar || snapshot.repositories ? 200 : 503,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}
