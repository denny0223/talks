# Export Contract

This site exposes collection data for search engines, crawlers, and LLM/RAG tools. Source records live in `_events/`, `_slides/`, and `_topics/`; exported files are generated views.

## Event Records

`/talks.json` exports public activity records.

- `id`: stable unique event record key derived from the `_events` filename without `.md`.
- `url`: canonical public event page.
- `title`: event record title; not unique.
- `event`: activity, course, conference, or organization name; not unique.
- `event_url`: external activity or organizer page, not a venue.
- `date`: canonical start date in `YYYY-MM-DD`.
- `end_date`: canonical end date for continuous multi-day events, otherwise `null`.
- `date_text`: generated visitor-facing date text.
- `display_date`: compatibility alias for `date_text`; new consumers should use `date_text`.
- `sequence`: same-day display order, otherwise `null`.
- `topics`: topic IDs that join to `/topics.json` `id`.
- `slides`: slide IDs that join to `/slides.json` `id`.
- `videos` and `links`: labeled external resources.

Records are sorted by descending `date`; records on the same date are sorted by ascending `sequence`.

## Slide Records

`/slides.json` exports slide assets and context pages.

- `id`: stable unique slide key derived from the `_slides` filename.
- `url`: canonical searchable context page on this site.
- `external_url`: original slide sharing URL.
- `topics`: topic IDs that join to `/topics.json` `id`.
- `related_events`: event IDs that join to `/talks.json` `id`.

The original slide URL remains the sharing target. The local `/slides/{id}/` page exists so crawlers can index context, topics, and related events.

## Topic Records

`/topics.json` exports stable long-term categories.

- `id`: stable unique topic key derived from the `_topics` filename.
- `title`: human-readable topic title.
- `summary`: concise topic description.
- `aliases`: alternate names for retrieval.
- `url`: canonical topic page.

## LLM Files

`/llms.txt` is the crawler routing file. `/llms-full.txt` is a Markdown export with disambiguated headings and the same join keys used by the JSON endpoints.
