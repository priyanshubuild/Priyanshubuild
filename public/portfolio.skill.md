---
name: read-priyanshu-portfolio
description: Read Priyanshu Gupta's public developer profile and verified GitHub activity from his official portfolio.
---

# Read Priyanshu Gupta's portfolio

Use this resource to locate public facts and navigate the existing portfolio. It does not provide a way to send messages or change the owner's data.

1. Read `https://priyanshugupta.com/profile.json` for the public name, role, contact address, and exact professional profile links.
2. Read `https://priyanshugupta.com/` for the introduction, skills, learning experience, about section, and contact links. These sections are present in the server-rendered HTML.
3. Read `https://priyanshugupta.com/api/github-activity` for all-time commit totals on each public repository's default branch and the separate personal contribution calendar. Repository metadata and the calendar refresh in two-minute windows. Counts for unchanged repositories are reused until a new push or default branch changes their cache key. Respect partial/unavailable responses and fetch timestamps; do not interpret a failure as zero activity.
4. The homepage anchors are `#projects`, `#experience`, `#skills`, `#github`, `#about`, and `#contact`. The project collection is `/projects`; the legacy `/projectspage` address permanently redirects there. Project descriptions distinguish personal practice, college coursework and team work.
5. In browsers with WebMCP, the read-only `get_portfolio_profile` and `get_github_activity` tools expose the same public resources. Each accepts an empty object.
6. Contact is a mailto link that opens a draft in the visitor's email application. Reading the site or its resources does not send a message.

Repository counts include all authors, bots, and merge commits reachable from each owned public repository's current default branch, across its full history. The calendar separately describes the owner's contributions of all types, including work outside owned repositories, during the returned 365-date range ending today in Asia/Kolkata. Its date keys are calendar dates, not UTC commit timestamps. These sources have different scopes and their totals should not be equated. Neither source represents a hiring assessment, an independent skill certification, or a private activity record.
