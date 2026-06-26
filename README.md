# Denny Huang Talks

This repository powers <https://denny.one/talks>. It records Denny Huang's talks, courses, panels, hosting, judging, interviews, slide links, and related public activity records.

The public site is generated from Jekyll collections. Do not hand-edit generated index pages; update the source records instead.

## Add a New Record

For a normal new talk or activity record, create one file under `_events/`.

```bash
scripts/new-event \
  --date 2026-06-25 \
  --title "Google Cloud 學程總整課程" \
  --event "Google 數位人才探索計畫" \
  --event-url "https://growonairtw.withgoogle.com/events/digitaleducation" \
  --slide 20260625-digital-education-google-cloud \
  --topics cloud-ai,education
```

Then edit the generated `_events/YYYY-MM-DD-title.md` file and fill in `summary`, `videos`, and `links` if needed.

If the record uses an existing slide, only the event file is needed.

Event date maintenance should stay script-driven:

- Use `date` for normal records.
- Add `--end-date YYYY-MM-DD` only for a continuous multi-day event.
- Let `scripts/new-event` handle same-day display order.

Example multi-day record:

```bash
scripts/new-event \
  --date 2026-08-01 \
  --end-date 2026-08-02 \
  --title "Two-day workshop" \
  --event "Example Event" \
  --topics education
```

## Add a New Slide

Create `_slides/slide-id.md` before referencing it from an event.

```yaml
---
title: "Slide title"
external_url: "https://denny.one/example-slide/"
summary: "A short searchable description of the slide."
topics:
  - software-engineering
language: "zh-TW"
first_presented: 2026-06-25
aliases: []
featured: false
featured_order:
featured_label:
---

A short human-readable note for the slide page.
```

The original slide URL remains the official sharing URL. The generated `/slides/slide-id/` page is only a searchable context page that links back to the original slide.

## Feature a Common Slide

The homepage `Featured Slide Versions` list is curated manually for frequently used slides that visitors should access quickly. It is not based on recency.

Set these fields in `_slides/slide-id.md`:

```yaml
featured: true
featured_order: 10
featured_label: "Git slide"
```

Use gaps of 10 for `featured_order` so future slides can be inserted without renumbering the whole list. `featured_label` controls the homepage link text and should match the visitor-facing label. Do not set `featured: true` just because a slide is new.

## Add a New Topic

Topics should stay small and stable. Only add `_topics/topic-id.md` when a new long-term category is needed.

```yaml
---
title: "Topic title"
summary: "What this topic groups together."
aliases: []
---

Topic description.
```

## Validate

Run validation after changing collection data:

```bash
scripts/validate
```

The validator checks required fields, normalized date fields, same-day ordering, unique slugs, slide references, topic references, and URL shape.

If Ruby and Bundler are available, also run:

```bash
bundle exec jekyll build
```

## Generated Public Surfaces

These pages and endpoints are generated from collections:

- `/`
- `/events/`
- `/events/{slug}/`
- `/slides/`
- `/slides/{slug}/`
- `/topics/`
- `/topics/{slug}/`
- `/talks.json`
- `/slides.json`
- `/llms.txt`
- `/llms-full.txt`
- `/sitemap.xml`

## Data Exports

JSON and LLM-facing exports are documented in [docs/exports.md](docs/exports.md). In short:

- `/talks.json` uses stable unique event IDs.
- `/slides.json` lists slide records and related event IDs.
- `/topics.json` lists stable topic IDs and summaries.
- `/llms.txt` points crawlers and AI tools to JSON exports, the full Markdown export, and the sitemap.
