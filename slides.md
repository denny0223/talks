---
title: Slide Index
description: Denny Huang 的投影片索引頁，包含原始投影片連結與相關演講紀錄。
permalink: /slides/
---

# Slide Index

<ul class="card-list">
{% assign slides = site.slides | sort: "first_presented" | reverse %}
{% for slide in slides %}
  {% assign related_events = site.events | where_exp: "event", "event.slides contains slide.slug" | sort: "date" | reverse %}
  {% assign latest_event = related_events | first %}
  {% assign video_event_count = 0 %}
  {% for related_event in related_events %}
    {% if related_event.videos and related_event.videos.size > 0 %}
      {% assign video_event_count = video_event_count | plus: 1 %}
    {% endif %}
  {% endfor %}
  <li class="card">
    <h2><a href="{{ slide.url | relative_url }}">{{ slide.title }}</a></h2>
    {% if slide.summary %}<p>{{ slide.summary }}</p>{% endif %}
    <p class="meta">
      {{ related_events.size }} related record{% if related_events.size != 1 %}s{% endif %}
      {% if latest_event %} / latest used <a href="{{ latest_event.url | relative_url }}">{% include event-date.html event=latest_event format="full" %}</a>{% endif %}
      {% if video_event_count > 0 %} / {{ video_event_count }} with video{% endif %}
      {% if slide.first_presented %} / first presented {{ slide.first_presented }}{% endif %}
    </p>
    {% if slide.topics and slide.topics.size > 0 %}
      <ul class="tag-list">
        {% for topic_id in slide.topics %}
          {% assign topic = site.topics | where: "slug", topic_id | first %}
          <li>{% if topic %}<a href="{{ topic.url | relative_url }}">{{ topic.title }}</a>{% else %}<span>{{ topic_id }}</span>{% endif %}</li>
        {% endfor %}
      </ul>
    {% endif %}
  </li>
{% endfor %}
</ul>
