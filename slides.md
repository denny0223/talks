---
title: Slide Index
description: Denny Huang 的投影片索引頁，包含原始投影片連結與相關演講紀錄。
permalink: /slides/
---

# Slide Index

<ul class="card-list">
{% assign slides = site.slides | sort: "first_presented" | reverse %}
{% for slide in slides %}
  {% assign related_events = site.events | where_exp: "event", "event.slides contains slide.slug" %}
  <li class="card">
    <h2><a href="{{ slide.url | relative_url }}">{{ slide.title }}</a></h2>
    {% if slide.summary %}<p>{{ slide.summary }}</p>{% endif %}
    <p class="meta">{{ related_events.size }} related record{% if related_events.size != 1 %}s{% endif %}{% if slide.first_presented %} / first presented {{ slide.first_presented }}{% endif %}</p>
    {% if slide.external_url %}<p><a href="{{ slide.external_url }}">Open slide deck</a></p>{% endif %}
  </li>
{% endfor %}
</ul>
