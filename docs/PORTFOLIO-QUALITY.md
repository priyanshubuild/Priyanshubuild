# Portfolio fixes and verification

The existing page layout, content, dark styling, large headings, ruler edges, and social dock are retained. Changes focus on accurate data, local icons, crawlability, accessibility, loading work, and defects found in the review.

## GitHub contributions

The ranking counts **all commits reachable from each owned public repository's default branch**, including all authors, merge commits and bots, across its full history. This scope was explicitly selected by the owner. It matches GitHub's default-branch commit count. With `per_page=1`, the official commits endpoint's last-page number is the total; both named and numeric repository pagination URLs are validated against the requested repository.

The calendar reads GitHub's public calendar HTML for the required years and selects exactly the rolling 365 calendar dates through today in Asia/Kolkata. This includes the owner's new day before the UTC server reaches midnight. Tooltips supply daily counts; missing counts or incomplete dates fail closed. Leap-year parsing retains all 366 dates before filtering. This avoids an intermediary calendar provider's cache. Personal profile contributions include work outside owned repositories and multiple contribution types; owned-repository totals instead describe current default-branch histories across all authors.

Repository metadata and calendar requests use two-minute cache buckets that wait for a fresh result. Commit counts are cached by repository, default branch and push timestamp: a new push invalidates that repository's count. The visible widget polls every minute and on tab visibility, then sorts by total commits. Stable keys and motion layout let rows slide to their new positions; ties are alphabetical. Failed sources retain the browser's last good values or a compatible committed snapshot with explicit error status. Refresh respects the shared cache, and GitHub publication can lag.

Only public repository metadata is accepted. A server-only `GITHUB_TOKEN` can increase API limits; never put it in a `NEXT_PUBLIC_` variable or source control. Per-push count caching reduces unauthenticated API usage. These routes require Next.js runtime hosting. A breaking change to GitHub's calendar markup is surfaced as unavailable data and requires a parser update.

## Local branding and search metadata

All favicon assets are in `public/`: SVG, ICO with 16/32/48 pixel layers, 96 pixel PNG, Apple icon, app icons and a maskable icon. The larger white P uses a charcoal tile and a small green availability accent in both browser themes. The homepage advertises one primary square 96-pixel PNG at the stable `/favicon.png` URL, plus separate shortcut and Apple icons. There are no external favicon image dependencies. Googlebot and Googlebot-Image can fetch the homepage and image; search display still requires Google's recrawl and selection.

The copied social-preview artwork is replaced with a local image bearing Priyanshu's name. Person schema no longer uses a placeholder logo as a portrait. ProfilePage markup belongs to the homepage; the verified project collection has its own canonical URL and breadcrumbs. The old project-placeholder URL permanently redirects to that collection. The sitemap lists the two canonical pages and does not invent a new modification date on every build. A full-name heading, keyboard skip link, and server-rendered content improve clarity for readers and crawlers. See [the search review](SEARCH-OPTIMIZATION.md) for the later content, metadata and discovery corrections.

## Agent browsing

The normal HTML remains the primary content. `/profile.json` provides the same public identity, interests, contact address, and exact profile links. `/llms.txt` describes the pages and data sources. `/.well-known/ai-catalog.json` links to a read-only portfolio skill and passes the ARD conformance validator used by Lighthouse.

Supported browsers now receive four WebMCP tools: `get_portfolio_profile`, `get_portfolio_projects`, `get_portfolio_guide` and `get_github_activity`. They accept an empty object, reject unexpected input, read fixed public resources without credentials, support cancellation, and have no message-sending or account-changing actions. All four executions and invalid-input rejection were verified in the supported in-app browser. The ordinary interface continues to work where the experimental API is unavailable. Generated Markdown alternatives and a full public guide add detailed identity, project attribution, navigation and activity definitions; see [the AI discovery review](AI-DISCOVERY.md) for sources, regeneration and focused verification.

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

Next.js was patched within the existing version 15 series to 15.5.28. Vulnerable transitive packages were updated without forced major upgrades. A targeted PostCSS 8.5.30 override fixes the vulnerable version pinned by Next.js; the installed dependency tree was verified. Standard response headers prevent framing, MIME sniffing, plugins and base-URL injection, and disable unused camera, microphone and location permissions. They do not restrict the existing greeting or application scripts.

The production dependency audit reports zero known advisories. Five development-tool advisory entries remain in one dependency chain: Next's ESLint plugin → fast-glob → micromatch → braces. The underlying braces stack-exhaustion advisory has no published patch as of October 17, 2026. These packages are used for linting local source, not shipped as production dependencies or exposed to visitors' patterns. A forced downgrade or major framework migration was not used to mask the finding. See [the upstream advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).

## Codebase cleanup

The active Next.js routes and their import graph were traced before deletion. Removed 25 unused source files, one associated stylesheet, 15 unused images, the unused component-generator configuration and obsolete commit-search functions/tests. Removed unused direct packages, including the old cursor/calendar/animation helpers and shadcn CLI. The critical-font generator now uses the committed original font, so it no longer needs the entire Geist package; the font and license remain. Sharp is declared directly because the asset scripts import it. Active project images, legacy identity-image URLs, generated README cache variants, maintenance scripts and licenses remain intentional.

Only the single visible footer design credit retains the template author's name and original repository link. Public documentation describes data sources, asset regeneration, operational limits and verification; it contains no credentials and is appropriate to keep in a public portfolio repository. Unrelated untracked résumé work in `output/` and `tmp/` is excluded from this cleanup.

## Verification and reproduction

Build, ESLint, TypeScript, and eight contribution tests pass for this change. `npm run verify:site` passes checks for security headers, canonical URLs, descriptions, schema, social images, stable favicon dimensions and references, public discovery resources, sitemap/robots, 404/noindex behavior, the current India calendar date, real repository ordering, and independent cache reuse. The preview shows ten contributions on October 17 and 403 in the rolling year at verification time. The font subset was regenerated from the committed original with the documented fontTools dependency and remained byte-identical.

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

The earlier experimental agentic category passed all four applicable checks (accessibility tree, layout stability, `llms.txt`, and ARD schema) on both presets. Native WebMCP checks were marked not applicable in the command-line browser. After the discovery expansion, all four actual tools and input rejection were separately tested in the supported in-app browser, and the catalog validator and `llms.txt` audit passed again. This experimental category is a ratio of applicable checks, not evidence of chatbot ranking.

Interactive checks covered 320 px and 390 px mobile widths, menu opening/closing and Escape focus return, contact navigation and copy feedback, live contribution loading/expansion/refresh, repository links, and the public browsing tools. Desktop/tablet layouts and project filtering were also reviewed. The production dependency audit reports no known advisories; development-tool exceptions are described above.

The generated pixel-font assets are committed and do not require Python during a build. To regenerate them, install `fonttools[woff]` for Python 3, then run `node scripts/generate-critical-font.mjs`. To regenerate the local icons and social image, run `node scripts/generate-icons.mjs`.

## Welcome triggering and restored project presentation

The later October 17 update restores the image-led project layout from commit `85eb527`: diagonal side pattern, original centered category capsule, title/Back header, cover images, technology chips and footer actions. Tighter spacing and type make the first desktop card 490 px tall, compared with 545 px in that earlier presentation at a 1280 px viewport. Hover uses a 4 px lift and 1.035 cover scale, with restrained action fades and reduced-motion support. The two previously removed project notes remain absent.

The greeting used to live inside the homepage shell, so each Home remount restarted it. `WelcomeSession` now owns its lifecycle in the persistent root layout. A tiny head script records a tab visit in `sessionStorage` and selects play/skip before body paint. It plays on initial Home entry and on an explicit browser reload of Home, as requested in the follow-up. Returning through internal links, browser Back or another same-tab visit skips it. Reload detection uses the Navigation Timing entry's type; a client route change does not execute the bootstrap again. CSS only starts the original welcome when that flag is play. The controller disposes of the greeting after its real reveal animation ends, on departure from Home or on history restoration; it also handles CSS finishing before hydration. The homepage shell no longer mounts a greeting. The dock waits only during a welcome that is actually playing.

The head script owns one HTML data attribute, so hydration-warning suppression is scoped to the HTML element. Client/server greeting markup otherwise matches on hydration; this does not replace testing for hydration errors. Storage failures do not block page access, and reduced-motion preference skips the welcome. There are no cookies, external requests or cross-tab identifiers for this feature.

The nine words, eight 180 ms intervals, 200 ms final pause, one-second reveal and visual styles remain unchanged. The welcome remains CSS-driven before hydration; skipping does not wait for a timer or client-only placeholder.

The production build, lint, types and all 21 tests pass. Browser checks cover initial Home entry, Home → Projects → Back, explicit Home reload, Contact hash navigation, browser Back, direct Projects entry followed by Home, independent tabs and closing/opening a fresh tab. Initial visits and explicit Home reloads play; skipped visits have no greeting node after hydration and no dock-delay animation. Hero bounds were identical before and after the initial welcome; browser warning/error logs were empty. At 320 px and 390 px the restored capsule stays in a single row with no horizontal overflow. The pre-paint logic also has focused tests for reduced motion and blocked storage. These are functional checks, not a new full Lighthouse measurement.

References: [tab-scoped session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage), [persistent Next.js layouts](https://nextjs.org/docs/app/getting-started/layouts-and-pages), [React layout effects](https://react.dev/reference/react/useLayoutEffect).

## Cleanup and dependency review — October 17, 2026

The reference review found every site component in use. Five unlinked README images were removed, and their generators no longer emit the duplicate chart aliases or standalone header SVG. Current and previous content-hashed charts, icon/font licenses, legacy preview URLs, favicon variants and regeneration tools remain intentional. Unused sidebar/chart theme tokens, an undefined font token, a shadowed color mapping and a nonexistent TypeScript include were removed. The homepage shell import now uses its actual name. The obsolete local `out/` export was also removed; it is ignored generated output, separate from the current Next.js build.

Lint, type checking (including unused-local/parameter checks), script syntax checks and the production build pass after cleanup. All 22 local README image references resolve, and the four current chart variants match their saved source data. Browser inspection confirmed the homepage presentation and four project cards with no broken covers or warning/error logs.

The production dependency audit reports zero known vulnerabilities. The full audit reports one underlying high-severity advisory, [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), through the development-only chain `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces@3.0.3`. npm reports five affected packages along that one chain. The advisory concerns deeply nested glob patterns and has no published patched braces release as of this review. The lint configuration uses fixed project patterns; the public request handlers do not expose this development dependency. A clean production audit does not establish that all application code is free of security flaws.

## Remaining external steps

1. Verify the domain property in Google Search Console, or use the existing `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` setting with your own verification value.
2. Submit `https://priyanshugupta.com/sitemap.xml`, inspect the homepage and project URLs, and request indexing after the updated deployment is live.
3. Check PageSpeed Insights and Search Console's real-user Core Web Vitals on the deployed site. Monitor indexing and query performance.
4. Keep your real professional profiles linked to the canonical domain and continue publishing evidence of your work. Your other accounts were not edited.

Google must recrawl the homepage and favicon before its search result can update. Ranking and favicon display are controlled by Google. AI search visibility depends on each provider's discovery and selection systems.

References: [Google favicon guidance](https://developers.google.com/search/docs/appearance/favicon-in-search), [Google SEO guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [Google AI features](https://developers.google.com/search/docs/appearance/ai-features), [GitHub search limits](https://docs.github.com/en/rest/search/search), [Lighthouse agentic scoring](https://developer.chrome.com/docs/lighthouse/agentic-browsing/scoring), [WebMCP API](https://developer.chrome.com/docs/ai/webmcp/imperative-api).
