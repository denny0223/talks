---
title: Topics
description: Denny Huang 演講與投影片的主題分類索引。
permalink: /topics/
---

# Topics

<ul class="card-list">
{% assign topics = site.topics | sort: "title" %}
{% for topic in topics %}
  {% assign topic_events = site.events | where_exp: "event", "event.topics contains topic.slug" %}
  {% assign topic_slides = site.slides | where_exp: "slide", "slide.topics contains topic.slug" %}
  <li class="card">
    <h2><a href="{{ topic.url | relative_url }}">{{ topic.title }}</a></h2>
    {% if topic.summary %}<p>{{ topic.summary }}</p>{% endif %}
    <p class="meta">{{ topic_events.size }} records / {{ topic_slides.size }} slides</p>
  </li>
{% endfor %}
</ul>
