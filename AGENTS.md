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

If the event uses an existing slide, do not create a new `_slides/` file. Only create `_slides/slide-id.md` when a slide URL appears for the first time.

Topics should stay broad and stable. Only add `_topics/topic-id.md` when a new long-term category is clearly needed.

## Migration Script Boundary

`scripts/migrate-readme.js` exists to reproduce the initial migration from the old README list. Do not run it for routine updates: it deletes and regenerates `_events/`, `_slides/`, and `_topics/`.

Only use it intentionally when redoing the full migration from an old README snapshot, and review the generated diff carefully afterward.

## Validation

Run this after changing collection data or templates:

```bash
./scripts/validate
```

The validator checks required fields, date format, duplicate slugs, slide references, topic references, and URL shape.

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
- Prefer meaningful `summary` text over generic labels such as "簡報連結" or "投影片連結".
- When correcting obvious typos or URL normalization in data, keep the change small and mention it in the commit or final summary.

## Commit Guidance

Keep commits small and reviewable:

- Data-only updates: one commit for new or corrected `_events/`, `_slides/`, and `_topics/` records.
- Template or SEO behavior changes: separate from data updates.
- Script or validation changes: separate when practical.

Before committing, run `./scripts/validate` and check `git status --short`.
