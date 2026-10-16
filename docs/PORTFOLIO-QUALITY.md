# Portfolio fixes and verification

The existing page layout, content, dark styling, large headings, ruler edges, and social dock are retained. Changes focus on accurate data, local icons, crawlability, accessibility, loading work, and defects found in the review.

## GitHub contributions

The old list supplied three fixed repository names, counts, and copied logos. It also treated push events as commit counts. The replacement ranks actual public authored commits in the past 365 UTC dates using GitHub's commit search. All matching pages are collected; incomplete results, changing pagination, and duplicate commits cannot silently produce an inaccurate ranking. Searches above GitHub's 1,000-result limit are split by date range. The displayed top three repositories link to their real sources and use inline Git branch icons.

The daily calendar remains separate, using the existing GitHub Contributions API provider. It preserves the first dates before Sunday, pads the layout, and totals the actual displayed 365 days. The label accurately describes a rolling year.

Each successful source is cached independently for 15 minutes. The visible widget checks periodically and when the tab becomes visible. Failures preserve successful data, expose an unavailable/stale message, and support retry. A manual refresh respects the server cache. GitHub indexing and source publication can lag. Private commits do not appear in the public repository ranking; GitHub's publicly visible calendar can include other contribution types.

No token is required for this account's current data. A server-only `GITHUB_TOKEN` can increase API limits for larger histories; never put it in a `NEXT_PUBLIC_` variable or source control. Search explicitly uses `is:public`, and the parser rejects private repositories even if a token can access them. These API routes require normal Next.js runtime hosting rather than a static export.

## Local branding and search metadata

All favicon assets are in `public/`: SVG, ICO with 16/32/48 pixel layers, 96 pixel PNG, Apple icon, app icons and a maskable icon. The SVG supports light and dark themes. The old faint icon is replaced at its stable URLs. There are no external favicon image dependencies.

The copied social-preview artwork is replaced with a local image bearing Priyanshu's name. Person schema no longer uses a placeholder logo as a portrait. ProfilePage markup belongs to the homepage, project pages retain their own canonical URLs and breadcrumbs, and the sitemap no longer invents a new modification date on every build. A full-name heading, keyboard skip link, and server-rendered content improve clarity for readers and crawlers.

## Agent browsing

The normal HTML remains the primary content. `/profile.json` provides the same public identity, interests, contact address, and exact profile links. `/llms.txt` describes the pages and data sources. `/.well-known/ai-catalog.json` links to a read-only portfolio skill and passes the ARD conformance validator used by Lighthouse.

Supported browsers receive two WebMCP tools: `get_portfolio_profile` and `get_github_activity`. Both accept an empty object, reject unexpected input, read public resources, and have no message-sending or account-changing actions. Registration, both executions, and invalid-input rejection were verified in the supported in-app browser. The ordinary interface continues to work where the experimental API is unavailable.

These resources help agents interpret and navigate the site. They do not guarantee that any search engine or chatbot will select or rank it.

## Performance and accessibility

- Static hero and greeting markup render on the server. The greeting retains the original nine words, eight 180 ms intervals, a 200 ms final pause, and a one-second upward shutter with the original easing. CSS starts the sequence without waiting for hydration or repeated JavaScript updates. The social dock appears after the reveal; reduced-motion and JavaScript-disabled visitors can access the page immediately.
- The existing contribution widget and its animation code load near the viewport, with space reserved to avoid collapse during loading.
- Simple skill, open-to-work, copy-icon, and ruler effects use lightweight CSS while retaining their styling. Local pixel-font files include a small critical subset and the unchanged complete original for other characters. The 113 retained characters have identical outlines and advance widths; the full file is byte-identical to the original. Its license is included, and unused pixel-font variants are not loaded.
- Nested link/button controls, missing icon rendering, hidden menu focus, Escape-to-close focus handling, contrast, decorative text semantics, duplicate IDs/keys, and copy-email failure handling were corrected.
- Project images use Next.js image optimization with explicit sizing and accessible link labels. The 404 animation stops running when idle.
- Analytics are enabled on Vercel, where their endpoints exist, rather than requesting nonexistent local endpoints.
- Homepage initial JavaScript fell from roughly 184 kB to 125 kB in the production build report. The desktop-only star tooltip loads when its control is visible, and its provider no longer loads globally. The decorative activity-loading grid uses a single SVG pattern rather than 371 separate elements. The live contribution calendar is unchanged. Visible fonts are preloaded.
- The availability badge stays within a narrow mobile screen and supports pinning its label without the previous hover/click conflict.

## Security review

Next.js was patched within the existing version 15 series to 15.5.28. Vulnerable transitive packages were updated without forced major upgrades. The unused sitemap package was removed, and the unused blur helper uses native math instead of its vulnerable dependency. A targeted PostCSS 8.5.30 override fixes the vulnerable version pinned by Next.js; the installed dependency tree was verified.

The final production dependency audit reports zero known advisories. Nine upstream development-tool advisories remain in the globbing stack used by ESLint/shadcn; they are not production dependencies. A forced downgrade or major framework migration was not used to mask them.

## Verification and reproduction

Build, ESLint, TypeScript, and eight contribution tests pass. `npm run verify:site` checks canonical URLs, descriptions, schema, social images, favicon dimensions and references, public discovery resources, sitemap/robots, 404/noindex behavior, real repository ordering, and independent cache reuse.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run start -- --hostname 127.0.0.1 --port 3100
npm run verify:site
```

Lighthouse reports use version 13.5.0 and Chrome 155, against a local production build, with standard mobile settings or the standard desktop preset. Scores are measured lab results and vary with device, network, hosting, browser version and extensions. They are not a guarantee for every visitor or a measurement of real-user Core Web Vitals.

| Lighthouse category | Original mobile | Final mobile | Original desktop | Final desktop |
| --- | ---: | ---: | ---: | ---: |
| Performance | 68 | 97 | 99 | 100 |
| Accessibility | 96 | 100 | 96 | 100 |
| Best practices | 96 | 100 | 96 | 100 |
| SEO | 100 | 100 | 100 | 100 |

October 17 mobile metrics with the restored intro: FCP 0.9 s, LCP 2.7 s, total blocking time 40 ms, layout shift 0. Mobile performance has not reached 100 under Lighthouse's standard simulated slow network and CPU. The original visual design and typography are retained. The four standard desktop categories and the applicable agentic checks score 100. These are local production measurements; the deployed host must be measured separately.

A separate October 17 audit of **https://priyanshugupta.com** measured **97 mobile performance and 98 desktop performance**, with **100 accessibility, best practices, SEO, and applicable agentic checks on both presets**. Live mobile FCP was 1.5 s, LCP 1.7 s, TBT 100 ms, CLS 0.013, and Speed Index 4.0 s. Live desktop FCP was 0.6 s, LCP 0.8 s, TBT 0 ms, CLS 0.006, and Speed Index 1.5 s. The complete greeting deliberately keeps its original cadence and reveal, which contributes to the time before the full page becomes visible. The requested all-100 performance result is not achieved; local 100 desktop performance must not be described as a deployed-site guarantee.

The experimental agentic category passes all four applicable checks (accessibility tree, layout stability, `llms.txt`, and ARD schema) on both presets. Native WebMCP checks were marked not applicable in the command-line browser; both actual tools and input rejection were separately tested in the supported in-app browser. This experimental category is a ratio of applicable checks, not evidence of chatbot ranking.

Interactive checks covered 320 px and 390 px mobile widths, menu opening/closing and Escape focus return, contact navigation and copy feedback, live contribution loading/expansion/refresh, repository links, and the public browsing tools. Desktop/tablet layouts and project filtering were also reviewed. The production dependency audit reports no known advisories; development-tool exceptions are described above.

The generated pixel-font assets are committed and do not require Python during a build. To regenerate them, install `fonttools[woff]` for Python 3, then run `node scripts/generate-critical-font.mjs`. To regenerate the local icons and social image, run `node scripts/generate-icons.mjs`.

## Remaining external steps

1. Verify the domain property in Google Search Console, or use the existing `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` setting with your own verification value.
2. Submit `https://priyanshugupta.com/sitemap.xml`, inspect the homepage and project URLs, and request indexing after the updated deployment is live.
3. Check PageSpeed Insights and Search Console's real-user Core Web Vitals on the deployed site. Monitor indexing and query performance.
4. Keep your real professional profiles linked to the canonical domain and continue publishing evidence of your work. Your other accounts were not edited.

Google must recrawl the homepage and favicon before its search result can update. Ranking and favicon display are controlled by Google. AI search visibility depends on each provider's discovery and selection systems.

References: [Google favicon guidance](https://developers.google.com/search/docs/appearance/favicon-in-search), [Google SEO guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [Google AI features](https://developers.google.com/search/docs/appearance/ai-features), [GitHub search limits](https://docs.github.com/en/rest/search/search), [Lighthouse agentic scoring](https://developer.chrome.com/docs/lighthouse/agentic-browsing/scoring), [WebMCP API](https://developer.chrome.com/docs/ai/webmcp/imperative-api).
