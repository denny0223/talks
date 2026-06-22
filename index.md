---
title: Denny Huang Talks
description: Denny Huang 的演講、課程、活動紀錄與投影片索引。
---

# Denny Huang Talks

Presentations, courses, panels, hosting, judging, and public activity records of Denny Huang. Speech invitations: [denny0223@gmail.com](mailto:denny0223@gmail.com).

## Newest Slide Versions

{% assign latest_slides = site.slides | sort: "first_presented" | reverse %}
{% for slide in latest_slides limit: 10 %}
- [{{ slide.title }}]({{ slide.url | relative_url }}) / [Original slide]({{ slide.external_url }})
{% endfor %}

{% assign events_by_year = site.events | sort: "date" | reverse | group_by_exp: "event", "event.date | date: '%Y'" %}
{% for year in events_by_year %}
## {{ year.name }}

<ul class="record-list">
{% for event in year.items %}
  <li>
    {{ event.display_date | remove_first: year.name | strip }} /
    <a href="{{ event.url | relative_url }}">{{ event.title }}</a>
    {% if event.event %} - {{ event.event }}{% endif %}
    {% if event.slides and event.slides.size > 0 %}
      {% for slide_id in event.slides %}
        {% assign slide = site.slides | where: "slug", slide_id | first %}
        {% if slide %} [<a href="{{ slide.url | relative_url }}">投影片</a>]{% endif %}
      {% endfor %}
    {% endif %}
    {% if event.videos and event.videos.size > 0 %}
      {% for video in event.videos %}
        [<a href="{{ video.url }}">錄影</a>]
      {% endfor %}
    {% endif %}
  </li>
{% endfor %}
</ul>
{% endfor %}
