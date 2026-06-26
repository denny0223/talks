# AGENTS.md

## Repository Purpose

This repository builds <https://denny.one/talks>, a Jekyll/GitHub Pages site for Denny Huang's public talks, courses, panels, hosting, judging, interviews, slide links, and related activity records.

The site is data-driven. Treat collection files as the source of truth and generated indexes as views over that data.

## Source Of Truth

- `_events/`: one public activity record per file.
- `_slides/`: one slide asset per file.
- `_topics/`: stable long-term topic categories.
- `_config.yml`: Jekyll, SEO, sitemap, collection, and site metadata configuration.
- `_layouts/` and `_includes/`: rendering and structured data templates.

Do not hand-maintain public indexes or machine-readable exports as content sources. These files should read from collections:

- `index.md`
- `events.md`
- `slides.md`
- `topics.md`
- `talks.json`
- `slides.json`
- `topics.json`
- `llms.txt`
- `llms-full.txt`
- `robots.txt`

## Adding Records

For a normal new talk or activity, use the maintenance script:

```bash
./scripts/new-event \
  --date YYYY-MM-DD \
  --title "Talk title" \
  --event "Event name" \
  --event-url "https://example.com/event" \
  --slide existing-slide-id \
  --topics topic-a,topic-b
```

Then edit the generated `_events/YYYY-MM-DD-title.md` file and fill in a useful `summary`, plus `videos` and `links` when available.

Event dates are normalized:

- Single-day events use only `date`.
- Continuous multi-day events use `date` and `end_date`.
- Generated date ranges always use `-` in public text.
- When multiple events share the same `date`, every event on that date must set `sequence: 1`, `sequence: 2`, etc. to preserve the public list order.
- `scripts/new-event` appends the next `sequence` automatically. When it creates the second event on a date, it also updates the existing event to `sequence: 1` and reports the updated file.
- Do not add `display_date`; templates and exports generate display text from normalized date fields.

If the event uses an existing slide, do not create a new `_slides/` file. Only create `_slides/slide-id.md` when a slide URL appears for the first time.

Topics should stay broad and stable. Only add `_topics/topic-id.md` when a new long-term category is clearly needed.

## Featured Slide Versions

The homepage featured slide list is intentionally curated. It represents frequently used latest slide URLs that visitors should be able to access quickly, not the newest slides by date.

Use these fields on `_slides/*.md`:

```yaml
featured: true
featured_order: 10
featured_label: "Git slide"
```

Only mark a slide as featured when the user explicitly wants it in that priority list. Sort order is controlled by `featured_order`; use gaps of 10. `featured_label` controls homepage link text and should match the existing visitor-facing wording.

## Migration Script Boundary

`scripts/migrate-readme.js` exists to reproduce the initial migration from the old README list. Do not run it for routine updates: it deletes and regenerates `_events/`, `_slides/`, and `_topics/`.

Only use it intentionally when redoing the full migration from an old README snapshot, and review the generated diff carefully afterward.

## Validation

Run this after changing collection data or templates:

```bash
./scripts/validate
```

The validator checks required fields, normalized date fields, same-day ordering, duplicate slugs, slide references, topic references, and URL shape.

Machine-readable exports use generated date fields:

- `talks.json` `id` is the stable unique event record key and must be derived from the `_events` filename.
- `slides.json` `related_events` values must join to `talks.json` `id`.
- `topics.json` `id` values must join from event and slide `topics`.
- `date_text` is the generated display date.
- `display_date` is kept only as a backward-compatible alias for `date_text`.
- Source records must not define `display_date` or `date_label`.

If Ruby/Bundler is available, also run:

```bash
bundle exec jekyll build
```

This local environment may not have Ruby or Bundler installed. If the build cannot run because the executable is missing, report that limitation explicitly.

## Content And SEO Guidelines

- Keep public-facing prose concise and searchable.
- Use Traditional Chinese for Taiwanese learner/public-facing summaries unless the original talk title or event name is English.
- Preserve literal product, event, and UI names as written.
- Keep original slide URLs as the official sharing targets; `/slides/{slug}/` pages provide searchable context and links back to the original slides.
- Keep homepage featured slides manually curated via `featured`, `featured_order`, and `featured_label`; do not replace this with date-based automation.
- Prefer meaningful `summary` text over generic labels such as "簡報連結" or "投影片連結".
- When correcting obvious typos or URL normalization in data, keep the change small and mention it in the commit or final summary.

## Commit Guidance

Keep commits small and reviewable:

- Data-only updates: one commit for new or corrected `_events/`, `_slides/`, and `_topics/` records.
- Template or SEO behavior changes: separate from data updates.
- Script or validation changes: separate when practical.

Before committing, run `./scripts/validate` and check `git status --short`.
