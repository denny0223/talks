---
title: Event Records
description: Denny Huang 的完整演講、課程、主持、評審與公開活動紀錄。
permalink: /events/
---

# Event Records

{% assign events_by_year = site.events | sort: "date" | reverse | group_by_exp: "event", "event.date | date: '%Y'" %}
{% for year in events_by_year %}
## {{ year.name }}

{% include event-list.html events=year.items order="asc" date_format="short" body="content" %}
{% endfor %}
