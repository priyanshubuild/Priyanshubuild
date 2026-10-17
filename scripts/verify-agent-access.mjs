import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const base = process.env.PORTFOLIO_CHECK_URL || "http://127.0.0.1:3100";
const canonical = "https://priyanshugupta.com";
const resources = new Map([
  ["/llms.txt", "text/plain"],
  ["/llms-full.txt", "text/plain"],
  ["/index.md", "text/markdown"],
  ["/projects.md", "text/markdown"],
  ["/portfolio.skill.md", "text/markdown"],
  ["/profile.json", "application/json"],
  ["/projects.json", "application/json"],
  ["/.well-known/ai-catalog.json", "application/json"],
]);
const contents = new Map();
for (const [path, type] of resources) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  assert.ok(
    response.headers.get("content-type")?.startsWith(type),
    `${path} has a readable content type`,
  );
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  const text = await response.text();
  assert.equal(
    text,
    await readFile(new URL("../public" + path, import.meta.url), "utf8"),
    `${path} matches the current source`,
  );
  assert.ok(Buffer.byteLength(text) < 20000, `${path} stays compact`);
  contents.set(path, text);
}
const profile = JSON.parse(contents.get("/profile.json"));
for (const [name, url] of Object.entries(profile.resources)) {
  const path = new URL(url).pathname;
  assert.equal(new URL(url).origin, canonical, name);
  assert.ok(
    resources.has(path) || path === "/sitemap.xml",
    `${name} points to a published resource`,
  );
}
const projects = JSON.parse(contents.get("/projects.json"));
const htmlPages = new Map();
for (const [page, markdown] of [
  ["/", "/index.md"],
  ["/projects", "/projects.md"],
]) {
  const response = await fetch(base + page);
  assert.equal(response.status, 200);
  const html = await response.text();
  htmlPages.set(page, html);
  assert.match(html, /rel="describedby" href="\/llms\.txt"/);
  assert.ok(
    html.includes(`type="text/markdown"`) &&
      html.includes(`href="${canonical}${markdown}"`),
    "Page advertises its Markdown alternative",
  );
  assert.match(html, /rel="ai-catalog"/);
  const markdownResponse = await fetch(base + markdown);
  assert.ok(markdownResponse.headers.get("link")?.includes(`rel="canonical"`));
}
for (const section of Object.values(profile.sections))
  assert.ok(
    htmlPages.get("/").includes(`id="${new URL(section).hash.slice(1)}"`),
  );
for (const project of projects.projects)
  assert.ok(htmlPages.get("/projects").includes(`id="${project.id}"`));

// These header tests detect application-level blocks. They do not impersonate
// provider IP addresses or prove that a provider has crawled/indexed the site.
for (const agent of [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Googlebot",
  "bingbot",
]) {
  for (const path of ["/", "/llms.txt", "/projects.json"]) {
    const response = await fetch(base + path, {
      headers: { "User-Agent": agent },
    });
    assert.equal(response.status, 200, `${agent}: ${path}`);
    if (path === "/") {
      const html = await response.text();
      assert.match(html, /Priyanshu/);
      assert.match(html, /id="about"/);
      assert.doesNotMatch(
        response.headers.get("x-robots-tag") || "",
        /noindex/i,
      );
    }
  }
}
const robots = await (await fetch(base + "/robots.txt")).text();
assert.match(robots, /User-Agent: \*\s+Allow: \//i);
assert.doesNotMatch(robots, /(?:^|\n)\s*(Host|Disallow):/i);
console.log(
  `Agent discovery, source consistency, readable alternatives, section links and eight crawler user-agent access checks passed against ${base}.`,
);
