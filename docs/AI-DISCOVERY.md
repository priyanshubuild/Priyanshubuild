# Public AI discovery and browsing

## Published resources

The normal server-rendered HTML remains the main portfolio. Readers and crawlers can access identity, project descriptions and contact links without running JavaScript. The original intro and visible layout are retained.

| Resource | Purpose |
| --- | --- |
| `/llms.txt` | Small index of text versions and structured resources |
| `/llms-full.txt` | Complete public identity, learning/experience context, projects, attribution, exact profiles, contact, navigation and activity definitions |
| `/index.md` | Text equivalent of the portfolio's identity, learning and contact information |
| `/projects.md` | Featured project descriptions, technologies, repositories, demos and attribution |
| `/profile.json` | Public identity, exact account links, topics, availability, page anchors and resource map |
| `/projects.json` | Structured projection of the same data used by the visible project cards |
| `/portfolio.skill.md` | Read-only browsing tasks, source interpretation, tool contracts and fallbacks |
| `/.well-known/ai-catalog.json` | ARD catalog linking the public browsing skill |
| `/api/github-activity` | Current cached activity with per-source timestamps and error status |

HTML pages advertise their own Markdown alternatives and the resource index. Markdown responses use `text/markdown` and a canonical Link header where an equivalent HTML page exists. The wildcard robots rule already permits public crawlers; no unsupported `Agentmap` or `Host` directive was added to robots.txt.

`scripts/generate-agent-resources.mjs` derives seven published files from `public/profile.json`, `src/data/projects.json` and `src/data/agent-tools.json`. It runs before production builds and never calls an external service. `npm run check:agents` detects stale generated files. No generated date changes on every build, and live counters are linked rather than frozen into the guide. Each text resource is below 12 KB at this revision; they load only when requested, outside the homepage content bundle.

Update profile facts in `public/profile.json`, project facts in `src/data/projects.json`, and tool metadata in `src/data/agent-tools.json`; then run `npm run generate:agents`. Keep profile facts aligned with visible site copy. The Markdown versions are factual summaries, not a visual reproduction of the pages.

## Browser tools

Supporting browsers discover four WebMCP tools:

- `get_portfolio_profile`
- `get_portfolio_projects`
- `get_portfolio_guide`
- `get_github_activity`

All accept exactly `{}` and fetch fixed public resources from the current origin. Calls omit credentials, reject redirects, respect page disposal and agent cancellation, and time out after 58 seconds. They do not accept arbitrary URLs or perform account/message actions. Browser support is experimental; direct text, JSON and HTML access remains available.

Results contain a text item with a JSON envelope: canonical `source`, HTTP `status`, and `data`. Activity responses preserve source error flags and timestamps. Partial or unavailable activity sets `isError`, including HTTP 200 with a failed source; missing data is never presented as zero. The guide distinguishes personal annual contribution credit from all-author public repository commit histories and explains README line-based percentages.

## What this can and cannot establish

The files clarify identity, provenance and navigation for tools that choose to use them. They contain only already-public profile information and verified featured project descriptions, including team/coursework attribution. They contain no credentials, private repository identities, fabricated qualifications or instructions telling an assistant to promote the owner.

`llms.txt` is a community proposal, and WebMCP is an emerging browser API. Neither forces an AI provider to crawl, index, cite or recommend a site. Google states that AI Overviews and AI Mode use the usual SEO requirements and need no special AI file or schema. Search crawler access, training crawler access and user-directed retrieval are different purposes; allowing training does not buy a search ranking.

The current wildcard rule permits all public retrieval, including common search and AI agents. Access checks with declared crawler user-agent headers verify application responses from the checking machine. They do not originate from provider IP ranges, certify a firewall's handling of genuine bot traffic or prove indexing. If hosting protection is later enabled, use the providers' official IP verification guidance; do not trust a user-agent string alone to grant sensitive access.

## Focused verification

October 17, 2026 verification for this change:

- Production build, ESLint, TypeScript and 16 tests passed.
- Generated resource checks passed; project descriptions and attribution match the visible project source.
- HTTP checks passed for all eight discovery resources, expected content types, alternate/canonical links and real section/card anchors.
- Homepage, index and project JSON returned HTTP 200 for declared Googlebot, bingbot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot and Perplexity-User headers.
- Lighthouse's `llms.txt` audit returned 1; its bundled ARD validator returned no errors or warnings. This was a focused resource check, not a new full Lighthouse performance measurement.
- All four WebMCP executions and unexpected-input rejection worked in the supported in-app browser; browser error/warning logs were empty.
- Production build output remains 125 KB first-load JavaScript for the homepage and 116 KB for projects, rounded as reported by Next.js. The larger text guide is not bundled into either page.

Reproduce:

```sh
npm run check:agents
npm test
npm run lint
npm run build
npm run typecheck
npm run start -- --hostname 127.0.0.1 --port 3100
npm run verify:agents
```

Set `PORTFOLIO_CHECK_URL=https://priyanshugupta.com` for deployed HTTP checks. Test native tools in a browser supporting WebMCP. Account-level Search Console indexing requests and provider selection remain external steps.

## References

- [Google: AI features and websites](https://developers.google.com/search/docs/appearance/ai-features)
- [llms.txt proposal](https://llmstxt.org/)
- [Chrome: WebMCP imperative API](https://developer.chrome.com/docs/ai/webmcp/imperative-api)
- [OpenAI crawler roles](https://developers.openai.com/api/docs/bots)
- [Anthropic crawler roles](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Perplexity crawler and firewall guidance](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)

For the independent daily README schedule, duplicate-run safeguard and cost, see [README assets](README-ASSETS.md).
