# ADR 0001: Keep Jekyll as the Stable Renderer

Status: Accepted

Date: 2026-06-28

## Context

This site has already lived for more than a decade and is expected to remain useful for another decade or longer. Its primary job is to preserve public activity records, slide links, and machine-readable indexes with very low day-to-day maintenance cost.

The durable architecture is not the template engine itself. It is the data contract around `_events/`, `_slides/`, `_topics/`, and the generated public surfaces such as event pages, slide pages, topic pages, JSON exports, `llms.txt`, `llms-full.txt`, sitemap, and structured metadata.

Future maintenance will often involve LLM agents. Those agents need stable source-of-truth boundaries, explicit validation, and small reviewable diffs more than they need a modern frontend framework.

## Decision

Keep Jekyll/GitHub Pages as the production renderer.

Treat Jekyll as a deliberately boring rendering layer over collection data. Do not migrate the site to Astro, Eleventy, Hugo, Next.js, or another renderer unless a concrete revisit trigger is met.

Continue to invest in the framework-independent parts of the site:

- clear collection data contracts
- validation that catches broken records and references
- stable public URLs and exports
- concise maintainer and agent guidance
- small, reviewable content updates

## Rationale

Jekyll's main value here is operational stability, not expressiveness. GitHub Pages has built-in Jekyll support and publishes the dependency versions used by the `github-pages` gem:

- <https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll>
- <https://pages.github.com/versions/>

This lets the project avoid most routine dependency churn. That matters more for this repository than adopting a newer framework with stronger type or component ergonomics.

Astro and other modern static site generators may offer better content-schema tooling, but they also introduce a Node.js package lifecycle, lockfile churn, and a larger build surface. For a long-lived content archive, that tradeoff is not currently justified.

The preferred long-term posture is:

> Keep the renderer boring. Keep the data contract strict.

## Non-Goals

- Do not rewrite the site because a framework is newer or more popular.
- Do not introduce a Node.js build stack solely for schema validation or developer ergonomics.
- Do not turn routine content maintenance into a framework migration.
- Do not treat generated indexes or exports as source content.

## Revisit Triggers

Reconsider the renderer only if at least one of these becomes true:

- GitHub Pages or Jekyll support becomes clearly unsuitable for this site.
- Liquid/Jekyll collections prevent a necessary public feature or export contract.
- The site needs real application behavior, such as interactive search, client-side state, or an authenticated workflow.
- The data contract can no longer be validated safely with the current low-dependency tooling.
- Maintaining Jekyll becomes materially more expensive than maintaining a replacement.

Any renderer migration must start by preserving the data contract and proving public-output parity before replacing Jekyll.
