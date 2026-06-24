---
title: Denny Huang Talks
description: Denny Huang 的演講、課程、活動紀錄與投影片索引。
---

# Denny Huang Talks

Presentations, courses, panels, hosting, judging, and public activity records of Denny Huang. Speech invitations: [denny0223@gmail.com](mailto:denny0223@gmail.com).

## Featured Slide Versions

{% assign featured_slides = site.slides | where_exp: "slide", "slide.featured == true" | sort: "featured_order" %}
{% for slide in featured_slides %}
- Newest version of [{{ slide.featured_label | default: slide.title }}]({{ slide.external_url }})
{% endfor %}

{% assign events_by_year = site.events | sort: "date" | reverse | group_by_exp: "event", "event.date | date: '%Y'" %}
{% for year in events_by_year %}
## {{ year.name }}

<ul class="record-list">
{% for event in year.items %}
  <li>
    {{ event.display_date | remove_first: year.name | strip }} /
    {{ event.content | markdownify | remove: "<p>" | remove: "</p>" | strip }}
  </li>
{% endfor %}
</ul>
{% endfor %}
