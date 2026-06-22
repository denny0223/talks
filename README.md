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
---

A short human-readable note for the slide page.
```

The original slide URL remains the official sharing URL. The generated `/slides/slide-id/` page is only a searchable context page that links back to the original slide.

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

The validator checks required fields, date format, unique slugs, slide references, topic references, and URL shape.

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
