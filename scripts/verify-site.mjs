import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
const base = process.env.PORTFOLIO_CHECK_URL || "http://127.0.0.1:3100";
const projects = JSON.parse(
  await readFile(new URL("../src/data/projects.json", import.meta.url), "utf8"),
);
const pages = new Map();
const titles = new Set();
const descriptions = new Set();
const meta = (html, key, kind = "name") =>
  html.match(new RegExp(`<meta ${kind}="${key}" content="([^"]*)"`))?.[1];
for (const path of ["/", "/projects"]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(
    response.headers.get("referrer-policy"),
    "strict-origin-when-cross-origin",
  );
  assert.equal(
    response.headers.get("content-security-policy"),
    "frame-ancestors 'none'; object-src 'none'; base-uri 'self'",
  );
  const html = await response.text();
  pages.set(path, html);
  assert.match(html, /<html lang="en"/);
  assert.doesNotMatch(meta(html, "robots") || "", /noindex/i);
  assert.doesNotMatch(response.headers.get("x-robots-tag") || "", /noindex/i);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = meta(html, "description");
  assert.ok(title && description);
  assert.ok(
    !titles.has(title) && !descriptions.has(description),
    "Unique titles and descriptions",
  );
  titles.add(title);
  descriptions.add(description);
  assert.equal(meta(html, "og:title", "property"), title);
  assert.equal(meta(html, "twitter:title"), title);
  assert.equal(meta(html, "og:description", "property"), description);
  assert.equal(meta(html, "twitter:description"), description);
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
  assert.match(
    html,
    /<link rel="icon" href="\/favicon.png" type="image\/png" sizes="96x96"/,
  );
  assert.equal(
    (html.match(/<link rel="icon" /g) || []).length,
    1,
    "One stable primary favicon",
  );
  const schemas = [
    ...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs),
  ].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.length);
  const nodes = schemas.flatMap((schema) => schema["@graph"] || [schema]);
  assert.equal(nodes.filter((node) => node["@type"] === "WebSite").length, 1);
  const website = nodes.find((node) => node["@type"] === "WebSite");
  assert.ok(website.alternateName.includes("priyanshubuild"));
  if (path === "/") {
    assert.ok(schemas.some((x) => x["@type"] === "ProfilePage"));
    assert.ok(
      schemas.some((x) =>
        x["@graph"]?.some((node) => node["@type"] === "Person" && !node.image),
      ),
    );
    assert.match(html, /href="\/projects"/);
    assert.match(html, /data-nosnippet/);
    assert.equal((html.match(/Design credit \(/g) || []).length, 1);
  } else {
    assert.ok(nodes.some((node) => node["@type"] === "CollectionPage"));
    assert.ok(nodes.some((node) => node["@type"] === "BreadcrumbList"));
    const list = nodes.find((node) => node["@type"] === "ItemList");
    assert.equal(list.numberOfItems, projects.length);
    assert.deepEqual(
      list.itemListElement.map((row) => row.item.codeRepository),
      projects.map((project) => `https://github.com/${project.github}`),
    );
    for (const project of projects) {
      assert.ok(html.includes(`id="${project.id}"`));
      assert.ok(html.includes(`href="https://github.com/${project.github}"`));
      assert.ok(
        list.itemListElement.some(
          (row) => row.item.description === project.description,
        ),
      );
      const image = await fetch(base + project.image);
      assert.equal(image.status, 200);
      assert.match(image.headers.get("content-type"), /image\/svg\+xml/);
    }
    assert.doesNotMatch(
      html,
      /Project\/ProjectImages|Linux &amp; Systems Workbench/,
    );
  }
  console.log(
    `${path}: canonical, description, social image, favicon, valid schema`,
  );
}
for (const path of ["/projectspage", "/projectspage?utm_source=seo-check"]) {
  const response = await fetch(base + path, { redirect: "manual" });
  assert.equal(
    response.status,
    308,
    "Legacy project URL permanently redirects",
  );
  const target = new URL(response.headers.get("location"), base);
  assert.equal(target.pathname, "/projects");
  if (path.includes("?"))
    assert.equal(target.searchParams.get("utm_source"), "seo-check");
}
for (const path of pages.keys()) {
  const html = await (
    await fetch(base + path + "?utm_source=seo-check")
  ).text();
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  assert.ok(
    canonical && !canonical.includes("?"),
    "Tracking parameters do not create a canonical URL",
  );
}
for (const agent of ["Googlebot", "bingbot"]) {
  for (const path of pages.keys()) {
    const response = await fetch(base + path, {
      headers: { "User-Agent": agent },
    });
    assert.equal(response.status, 200, `${agent} can access ${path}`);
    const html = await response.text();
    assert.doesNotMatch(meta(html, "robots") || "", /noindex/i);
    assert.match(html, /<h1[\s>]/);
    assert.match(html, /rel="canonical"/);
  }
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
assert.doesNotMatch(
  robots,
  /^Host:/im,
  "Google ignores the unsupported Host directive",
);
const sitemap = await (await fetch(base + "/sitemap.xml")).text();
assert.equal((sitemap.match(/<loc>/g) || []).length, 2);
assert.ok(!sitemap.includes("/projectspage"));
const sitemapURLs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1],
);
assert.deepEqual(
  sitemapURLs.map((url) => new URL(url).pathname),
  ["/", "/projects"],
);
assert.ok(!sitemap.includes("<lastmod>"));
const first = await (await fetch(base + "/api/github-activity")).json();
assert.ok(first.calendar && first.repositories);
assert.deepEqual(first.errors, { calendar: false, repositories: false });
assert.equal(first.calendar.timeZone, "Asia/Kolkata");
assert.equal(
  first.calendar.to,
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date()),
);
assert.equal(first.repositories.scope, "all-time");
assert.equal(first.repositories.source, "github-default-branches");
assert.ok(
  first.repositories.repos.every(
    (repo, i, array) => i === 0 || repo.count <= array[i - 1].count,
  ),
);
const second = await (await fetch(base + "/api/github-activity")).json();
assert.deepEqual(second.errors, { calendar: false, repositories: false });
// Another visitor may finish a refresh between these requests. Both fresh
// snapshots are valid even when their cache timestamps are not identical.
for (const snapshot of [first, second]) {
  for (const timestamp of [
    snapshot.calendar.fetchedAt,
    snapshot.repositories.fetchedAt,
  ]) {
    const age = Date.now() - Date.parse(timestamp);
    assert.ok(
      Number.isFinite(age) && age >= -1000 && age < 300000,
      "Fresh source timestamps",
    );
  }
}
console.log(
  "Indexable pages, unique metadata, matching schema, project sources, permanent redirects, local assets, discovery files, 404/noindex, robots/sitemap and fresh activity pass.",
);
