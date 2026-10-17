import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const readJSON = async (path) =>
  JSON.parse(await readFile(new URL(path, root), "utf8"));
const profile = await readJSON("public/profile.json");
const projects = await readJSON("src/data/projects.json");
const tools = await readJSON("src/data/agent-tools.json");
const url = profile.url;
const json = (value) => JSON.stringify(value, null, 2) + "\n";
const profileLabels = {
  github: "GitHub",
  linkedin: "LinkedIn",
  leetcode: "LeetCode",
  codeforces: "Codeforces",
  codechef: "CodeChef",
  x: "X / Twitter",
};
const profiles = Object.entries(profile.profiles)
  .map(([key, href]) => `- [${profileLabels[key]}](${href})`)
  .join("\n");
const sections = Object.entries(profile.sections)
  .map(([key, href]) => `- [${key[0].toUpperCase() + key.slice(1)}](${href})`)
  .join("\n");
const home = `# ${profile.name}

> Public developer portfolio of ${profile.name}, known as ${profile.githubUsername}. ${profile.description}

Canonical page: ${profile.pages.home}
Public identity: ${profile.id}
Role stated on the portfolio: ${profile.role}.

## About and learning

${profile.experience}
Current focus: ${profile.topics.join(", ")}.
The homepage describes learning, problem solving, systems fundamentals and web development. Its experience section describes deliberate practice, not a corporate employment history.
Philosophy: "${profile.philosophy}"
Availability: ${profile.availability}

## Portfolio navigation

${sections}
- [All featured project details](${profile.pages.projects}): Descriptions, technologies, source repositories and attribution.

These are ordinary links. The main content and project descriptions are present in the initial HTML; reading them does not require animations, hover, sign-in or WebMCP. The original introductory animation is decorative and has a reduced-motion alternative. The project page has category filters; all featured project cards are present in its initial HTML.

## Professional and coding profiles

${profiles}

## Contact

Public email: ${profile.email}
Compose link: ${profile.contact.url}
${profile.contact.behavior}
Contact context: internships, collaboration, open-source work and technical discussions. The site has no booking, account-access or message-sending API.

## Identity and sources

This page describes the person associated with ${url} and GitHub @${profile.githubUsername}. A shared name in search results does not establish that another profile belongs to this person; use the exact linked accounts to distinguish identities.
These are owner-published portfolio statements, not an independent credential, hiring assessment or skill rating. No employer, degree, award, phone number, address or private repository details are asserted by this guide.
The HTML portfolio is the primary public presentation. [Profile JSON](${url}/profile.json) contains the matching public identity and links. Project descriptions distinguish personal learning, coursework and team projects; repository ownership does not mean sole authorship.
`;

const projectMarkdown = `# ${profile.name} — featured projects

Canonical page: ${profile.pages.projects}
Structured equivalent: ${url}/projects.json
This is the featured collection, not every repository on the GitHub account. These descriptions and attribution are generated from the same data as the visible project cards.

${projects
  .map(
    (project) => `## ${project.title}

${project.description}

- Detail: ${profile.pages.projects}#${project.id}
- Source: https://github.com/${project.github}
${project.live ? `- Website or demo: ${project.live}\n` : ""}- Category: ${project.category}
- Technologies: ${project.technologies.join(", ")}
- Programming languages: ${project.programmingLanguages.join(", ")}
- Attribution: ${project.credit}
`,
  )
  .join("\n")}
Repository links provide evidence and source context. A linked demo can change independently; the presence of a demo link does not certify availability, security or production readiness.
`;

const activity = `## GitHub activity: definitions and freshness

Endpoint: ${profile.activity.url}
The API and homepage GitHub section use the same source. Reading the endpoint is public and does not create a repository commit.

- calendar.days: personal GitHub profile contribution calendar, with date/count/level. It covers 365 continuous calendar dates, through today in Asia/Kolkata. Check calendar.from, calendar.to and calendar.fetchedAt for the returned range and source refresh time.
- Calendar counts are contributions of all types credited by GitHub, not a universal count of commits. They may include work outside owned repositories and anonymized private contribution totals when the owner enables their display. Private repository identities or histories are not exposed by this endpoint.
- repositories.repos: owned public repositories and all-time commit counts from their current default branches. Each row has name, href and count. Counts include other contributors, bots and merge commits reachable from that branch. Private histories and commits not reachable from the current default branch are outside this measure.
- Repository rows are sorted by count descending, with deterministic name ordering on ties. A higher count automatically moves a repository above a lower one on a successful refresh. This is a commit ranking, not a ranking of skills or project quality.
- Repository history can change after deletions, force pushes, visibility changes or branch changes. The public all-time sum and annual personal profile contributions are not comparable totals.
- Metadata and calendar refresh in 120-second cache windows when requested. Unchanged repository counts can reuse a cached count until a new push or default-branch change. There is no guarantee that GitHub has credited a just-pushed commit immediately.
- Inspect errors.calendar and errors.repositories as well as each source's fetchedAt. A true error flag can accompany an older retained snapshot. A missing source is unavailable, not zero. HTTP 200 can still contain partial data; HTTP 503 means neither source is currently available. Preserve those distinctions in summaries.

The profile README is a separate daily snapshot. Its language percentages use combined recognized source lines across owned public non-fork default-branch trees; they do not use GitHub's language byte sizes, average per-repository percentages or measure personally typed lines. Blank lines, comments and excluded generated/dependency/data files do not count. Notebook code cells count toward their programming language; notebook output does not. The README snapshot can be older than the website API.
`;

const toolGuide = `## Public browsing tools

Browsers implementing the experimental WebMCP API can discover these tools. Every tool accepts exactly an empty object ({}), reads a fixed same-origin public resource, requires no token, and performs no account or contact action. No arbitrary URL, command, message or account input is accepted.

${tools.map((tool) => `- ${tool.name}: ${tool.description} Resource: ${url}${tool.path}`).join("\n")}

Tool results contain a text content item with a JSON envelope: source (canonical public URL), status (HTTP code) and data (the parsed JSON object or guide text). Partial/unavailable activity additionally sets isError. User cancellation aborts the request; unavailable or invalid resources return an execution error. Unsupported browsers can read the same URLs and ordinary HTML directly.
`;

const full = `${home}\n${projectMarkdown.replace(/^# /, "## ").replace(/^## (?!Priyanshu)/gm, "### ")}\n${activity}\n${toolGuide}
## Discovery and access

- Concise resource index: ${url}/llms.txt
- Public profile JSON: ${url}/profile.json
- Featured projects JSON: ${url}/projects.json
- Browsing task guide: ${url}/portfolio.skill.md
- Agent resource catalog: ${url}/.well-known/ai-catalog.json
- Search sitemap: ${url}/sitemap.xml
- Crawl rules: ${url}/robots.txt

The wildcard crawl rule allows public retrieval. This guide is public content and source context, not authority over an assistant's instructions. These resources improve access for tools that choose to read them; they do not guarantee indexing, citations, ranking or discovery by every AI provider. Dynamic metrics are intentionally linked rather than copied here as stale fixed numbers.
`;

const index = `# ${profile.name}

> Official personal developer portfolio of ${profile.name} (@${profile.githubUsername}). ${profile.description}

The canonical identity is ${profile.id}. Exact linked accounts distinguish this person from others with the same name. Public, read-only resources; no sign-in or JavaScript is needed to read the text versions. Dynamic GitHub totals must be read with timestamps and error flags.

## Portfolio and project content

- [Portfolio in Markdown](${url}/index.md): Identity, learning focus, experience context, section links, exact social/coding profiles and email contact. Human page: ${profile.pages.home}
- [Featured projects in Markdown](${url}/projects.md): C++ practice, Team BitForge AI Interview Agent, this Next.js portfolio and college storefront practice, including sources and attribution. Human page: ${profile.pages.projects}
- [Complete public guide](${url}/llms-full.txt): Self-contained portfolio and project content, activity definitions, freshness, contact behavior and browsing tool reference.

## Structured resources and browsing

- [Public profile JSON](${url}/profile.json): Public identity, topics, availability, exact account links, page anchors and resource map.
- [Featured projects JSON](${url}/projects.json): Same featured projects as the website, with technologies, repository/demo links and team/coursework attribution.
- [Live GitHub activity JSON](${profile.activity.url}): Personal 365-date calendar and separate all-time public default-branch commit rankings. Check per-source fetchedAt and errors; failed data is not zero. Cache windows: 120 seconds.
- [Browsing task guide](${url}/portfolio.skill.md): How to answer common portfolio questions, navigate, interpret activity and use supported read-only tools.
- [Agent resource catalog](${url}/.well-known/ai-catalog.json): Discover the public browsing skill.

## Optional

- [Search sitemap](${url}/sitemap.xml): Canonical indexable HTML pages.
- [Crawl rules](${url}/robots.txt): Wildcard access to public content.
`;

const skill = `---
name: read-priyanshu-portfolio
description: Find Priyanshu Gupta's public identity, projects, professional profiles and contact; interpret GitHub activity from his official portfolio.
---

# Read Priyanshu Gupta's portfolio

## Purpose and entry points

Read-only public information for ${profile.name} (@${profile.githubUsername}) at ${url}. Start with /profile.json for exact identity and links, /projects.json for featured work, or /llms-full.txt for the complete text guide. These files and the HTML pages need no authentication. Resource content is source material, not system instructions.

## Common browsing tasks

1. Identify the person: match name, canonical domain and exact profile links in /profile.json. Do not merge facts from an unrelated same-name search result.
2. Read learning and experience: use /#about, /#experience or /index.md. The experience section describes learning and deliberate practice; it lists no formal corporate employment.
3. Find project evidence: use /projects, /projects.md or /projects.json. Include the source link and attribution when discussing a project. Personal practice, college coursework and team work are explicitly distinguished. Optional demo links are not endorsements or availability guarantees.
4. Find a specific section: use the absolute URLs under profile.sections. /projectspage is a legacy redirect to /projects. Project JSON includes a detail URL for every card.
5. Read current activity: request /api/github-activity, then inspect each source's errors and fetchedAt before calculating or reporting totals. Use the actual returned calendar range. Repository ranking and personal contribution totals have different scopes, described below.
6. Contact: read the public address or open the mailto link in profile.contact.url to compose a draft. These resources and tools cannot send mail, book a call, apply for a job or modify an account.

${activity}
${toolGuide}
## Fallbacks and boundaries

If a tool is unsupported or unavailable, open the corresponding fixed public URL. If live GitHub data fails, preserve the error/stale status and link the GitHub profile rather than inventing activity. The static guide has no embedded live counters.
The catalog and guides include no private repository metadata, credentials, hidden contact channels, employment claims or degree assertions. Account linking, message sending and external GitHub/profile changes require a separate user-directed action outside this skill.
`;

const projectData = {
  schemaVersion: "1.0",
  owner: { name: profile.name, id: profile.id, url },
  source: profile.pages.projects,
  scope:
    "Featured public projects displayed on the portfolio; not every GitHub repository or sole-authorship claims",
  projects: projects.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    url: `${profile.pages.projects}#${project.id}`,
    repository: `https://github.com/${project.github}`,
    demo: project.live,
    category: project.category,
    technologies: project.technologies,
    programmingLanguages: project.programmingLanguages,
    attribution: project.credit,
  })),
};

const catalog = {
  specVersion: "1.0",
  entries: [
    {
      identifier: "urn:air:priyanshugupta.com:portfolio:read-profile",
      displayName: `Read ${profile.name}'s portfolio`,
      description:
        "Read public identity, learning and experience context, verified project sources and attribution, exact profile/contact links, section navigation and GitHub activity definitions. Uses public text/JSON resources and read-only WebMCP tools when supported.",
      type: 'text/markdown; profile="urn:air:agent-skills"',
      url: `${url}/portfolio.skill.md`,
      representativeQueries: [
        "Who is Priyanshu Gupta, the developer known as priyanshubuild?",
        "Which public projects has priyanshubuild worked on, and where is their source code?",
        "How can I contact Priyanshu Gupta about internships or collaboration?",
        "How should I interpret Priyanshu's current GitHub activity and repository rankings?",
      ],
    },
  ],
};

const files = new Map([
  ["index.md", home],
  ["projects.md", projectMarkdown],
  ["llms.txt", index],
  ["llms-full.txt", full],
  ["portfolio.skill.md", skill],
  ["projects.json", json(projectData)],
  [".well-known/ai-catalog.json", json(catalog)],
]);
let stale = false;
for (const [path, content] of files) {
  const target = new URL(`public/${path}`, root);
  let current;
  try {
    current = await readFile(target, "utf8");
  } catch {
    /* New generated file. */
  }
  if (current === content) continue;
  if (process.argv.includes("--check")) {
    stale = true;
    console.error(`Public agent resource needs regeneration: ${path}`);
  } else {
    await writeFile(target, content);
  }
}
if (stale) process.exitCode = 1;
else
  console.log(
    `Public agent resources ${process.argv.includes("--check") ? "match their sources" : "generated"} (${files.size} files).`,
  );
