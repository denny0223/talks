---
title: Event Records
description: Denny Huang 的完整演講、課程、主持、評審與公開活動紀錄。
permalink: /events/
---

# Event Records

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
