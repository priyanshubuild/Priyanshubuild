import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
const base = process.env.PORTFOLIO_CHECK_URL || "http://127.0.0.1:3100";
for (const path of ["/", "/projects", "/projectspage"]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  assert.equal(response.headers.get("content-security-policy"), "frame-ancestors 'none'; object-src 'none'; base-uri 'self'");
  const html = await response.text();
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, "One H1 per page");
  const canonical = "https://priyanshugupta.com" + (path === "/" ? "" : path);
  assert.ok(
    html.includes(`rel="canonical" href="${canonical}"`) ||
      html.includes(`rel="canonical" href="${canonical}/"`),
  );
  assert.match(html, /<meta name="description" content="[^"]+/);
  assert.match(
    html,
    /<meta property="og:image" content="https:\/\/priyanshugupta.com\/opengraph.png"/,
  );
  assert.match(html, /<link rel="icon" href="\/favicon.png" type="image\/png" sizes="96x96"/);
  assert.equal((html.match(/<link rel="icon" /g) || []).length, 1, "One stable primary favicon");
  const schemas = [
    ...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs),
  ].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.length);
  if (path === "/") {
    assert.ok(schemas.some((x) => x["@type"] === "ProfilePage"));
    assert.ok(
      schemas.some((x) =>
        x["@graph"]?.some((node) => node["@type"] === "Person" && !node.image),
      ),
    );
  }
  console.log(
    `${path}: canonical, description, social image, favicon, valid schema`,
  );
}
for (const path of [
  "/favicon.svg",
  "/favicon.ico",
  "/favicon.png",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/icon.png",
  "/icon-maskable.png",
  "/opengraph.png",
  "/site.webmanifest",
  "/profile.json",
  "/llms.txt",
  "/portfolio.skill.md",
  "/.well-known/ai-catalog.json",
  "/robots.txt",
  "/sitemap.xml",
  "/fonts/geist-pixel-square-latin-v1.woff2",
  "/fonts/geist-pixel-square-v1.woff2",
])
  assert.equal((await fetch(base + path)).status, 200, path);
for (const [path, size] of [
  ["favicon-16.png", 16],
  ["favicon-32.png", 32],
  ["favicon.png", 96],
  ["apple-touch-icon.png", 180],
  ["icon-192.png", 192],
  ["icon.png", 512],
]) {
  const meta = await sharp(
    await readFile(new URL("../public/" + path, import.meta.url)),
  ).metadata();
  assert.equal(meta.width, size);
  assert.equal(meta.height, size);
}
const ico = await readFile(new URL("../public/favicon.ico", import.meta.url));
assert.equal(ico.readUInt16LE(4), 3);
const missing = await fetch(base + "/missing-portfolio-page");
assert.equal(missing.status, 404);
assert.match(await missing.text(), /name="robots" content="noindex"/);
const robots = await (await fetch(base + "/robots.txt")).text();
assert.ok(robots.includes("Allow: /"));
assert.ok(robots.includes("https://priyanshugupta.com/sitemap.xml"));
const sitemap = await (await fetch(base + "/sitemap.xml")).text();
assert.equal((sitemap.match(/<loc>/g) || []).length, 3);
assert.ok(!sitemap.includes("<lastmod>"));
const first = await (await fetch(base + "/api/github-activity")).json();
assert.ok(first.calendar && first.repositories);
assert.deepEqual(first.errors, { calendar: false, repositories: false });
assert.equal(first.calendar.timeZone, "Asia/Kolkata");
assert.equal(first.calendar.to, new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",
}).format(new Date()));
assert.equal(first.repositories.scope, "all-time");
assert.equal(first.repositories.source, "github-default-branches");
assert.ok(
  first.repositories.repos.every(
    (repo, i, array) => i === 0 || repo.count <= array[i - 1].count,
  ),
);
const second = await (await fetch(base + "/api/github-activity")).json();
assert.equal(first.calendar.fetchedAt, second.calendar.fetchedAt);
assert.equal(first.repositories.fetchedAt, second.repositories.fetchedAt);
console.log(
  "Local assets, exact icon dimensions, discovery files, 404/noindex, robots/sitemap, real sorted repository counts and cache reuse pass.",
);
