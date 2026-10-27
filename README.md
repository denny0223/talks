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

Then complete the generated record using the [record writing conventions](#record-writing), including a useful summary and any video or supporting links. Check the default `speaker` role and `zh-TW` language against the actual activity.

If the record uses an existing slide, only the event file is needed.

Event date maintenance should stay script-driven:

- Use `date` for normal records.
- Add `--end-date YYYY-MM-DD` only for a continuous multi-day event.
- Let `scripts/new-event` handle same-day display order.
- Do not add `display_date` or `date_label`; generated views derive display text from `date` and `end_date`.

Example multi-day record:

```bash
scripts/new-event \
  --date 2026-08-01 \
  --end-date 2026-08-02 \
  --title "Two-day workshop" \
  --event "Example Event" \
  --topics education
```

## Record Writing

Use these conventions for new records and requested corrections. Older records contain historical formats; do not normalize unrelated records as part of routine maintenance.

Preserve the original activity and talk names. Set `role` to the actual participation (`speaker`, `panelist`, `judge`, `awardee`, `host`, or `interviewee`) and `language` to the language used, `zh-TW` or `en`. Panels, hosting, judging, awards, and interviews can describe the activity and role directly; they do not need an invented talk title or slide link. When there is no separate event name, omit the event prefix and its separator.

Write a concise `summary` about the subject, audience, and value of the activity or deck. Omit incidental lab brands and simulated company names unless they are needed to understand the subject. Resource labels such as `簡報連結` belong on links, not in place of a useful summary.

Front matter supplies record details and machine-readable exports. The homepage and event index display the Markdown body directly. Keep primary resources in both places with matching URLs and labels; supplementary resources may remain in `links` for the detail page. Avoid repeating an event URL as a separate resource when the activity name already links to it.

| Resource or situation | Fields and body convention |
| --- | --- |
| Activity page | Prefer the official event, session, or organizer announcement for `event_url`, and link the corresponding activity name. Do not substitute a slide URL. If there is no suitable public page, leave `event_url` empty and use plain text. |
| Official session page | A talk title may link to its official agenda/session page. Otherwise keep the title as plain text; do not use it as the slide or video link label. Put a separate session URL in `links` when it differs from `event_url`. |
| Slides | Reference slide IDs in `slides`, and append `[簡報連結](original-slide-url)` using each slide's `external_url`. With multiple decks, add a short topic or session label before each link so readers can distinguish them. |
| Video | Use `videos` and a label describing the resource, such as `課程錄影`, `議程錄影`, `活動錄影`, `發言片段`, or `完整 Podcast @YouTube`. Preserve useful timestamps for excerpts. |
| Audio or interview article | Use `links` with an accurate label such as `訪談錄音` or `專訪文章`; reserve `videos` for video resources because it drives the site's Video badge and `has_videos` export. |
| Supporting resources | Use `links` with purpose-specific labels such as `官方 Codelab`, `對話與工具紀錄`, `互動儀表板`, or `議程共筆`. Link directly to the useful artifact; a transcript that already links to its repository does not need an additional repository link unless the code itself is the intended resource. |
| Secondary sources | Identify the publisher and source type, such as `媒體報導` or `轉載公告`. Keep them only when they add useful context; do not present a repost as the official activity page. |
| Missing resources | Use empty `slides`, `videos`, or `links` arrays and omit the corresponding body links. A record without slides remains valid; do not invent placeholders. |

For a talk with slides and a supporting artifact:

```markdown
[活動名稱](https://example.com/event) : 講題 [簡報連結](https://example.com/slides) [對話與工具紀錄](https://example.com/transcript)
```

For a talk with an official session page and a recording:

```markdown
[活動名稱](https://example.com/event) : [講題](https://example.com/session) [議程錄影](https://example.com/video)
```

When correcting or removing a resource, update both its front matter entry and any body links. After building, check the affected homepage/event-index rows, detail pages, and exports for the intended labels and destinations. `scripts/validate` checks URL shape, not reachability or editorial consistency.

Before writing, identify the intended reader, a comparable record, any relevant exception, and the pages or exports that will change. Review the result against those criteria: can a visitor understand the subject without knowing the lab, identify the speaker's role, and reach the useful resources directly? When a correction exposes a mistaken assumption, recheck the other affected fields and outputs before considering the record complete.

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
