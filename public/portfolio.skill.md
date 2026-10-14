---
name: read-priyanshu-portfolio
description: Read Priyanshu Gupta's public developer profile and verified GitHub activity from his official portfolio.
---

# Read Priyanshu Gupta's portfolio

Use this resource to locate public facts and navigate the existing portfolio. It does not provide a way to send messages or change the owner's data.

1. Read `https://priyanshugupta.com/profile.json` for the public name, role, contact address, and exact professional profile links.
2. Read `https://priyanshugupta.com/` for the introduction, skills, learning experience, about section, and contact links. These sections are present in the server-rendered HTML.
3. Read `https://priyanshugupta.com/api/github-activity` for current public authored commit rankings and the separate contribution calendar. Sources refresh at most every 15 minutes. Respect partial/unavailable responses and the returned fetch timestamps; do not interpret a failure as zero activity.
4. The homepage anchors are `#projects`, `#experience`, `#skills`, `#github`, `#about`, and `#contact`. Project pages are `/projects` and `/projectspage`.
5. In browsers with WebMCP, the read-only `get_portfolio_profile` and `get_github_activity` tools expose the same public resources. Each accepts an empty object.
6. Contact is a mailto link that opens a draft in the visitor's email application. Reading the site or its resources does not send a message.

Repository counts measure indexed public authored commits in the returned date range, rather than all types of GitHub contributions. The calendar also includes other contribution types. Neither source represents a hiring assessment, an independent skill certification, or a private activity record.
