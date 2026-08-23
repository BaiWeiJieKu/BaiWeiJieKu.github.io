---
# the default layout is 'page'
title: 中医
icon: fas fa-leaf
order: 7
excerpt_separator: ""
---

<div class="collection-archive">
{% assign docs = site.zhongyi | sort: 'date' | reverse %}
{% for doc in docs %}
  {% unless doc.title == '中医笔记' %}
  <div class="collection-item d-flex align-items-baseline mb-3">
    <span class="text-muted me-3" style="min-width:5.5em;font-size:0.85em;">{{ doc.date | date: "%Y-%m-%d" }}</span>
    <div>
      <a href="{{ doc.url | relative_url }}" class="fw-bold">{{ doc.title }}</a>
      {% if doc.tags.size > 0 %}
      <div class="mt-1">
        {% for tag in doc.tags %}
        <span class="badge bg-light text-muted me-1" style="font-size:0.75em;font-weight:normal;">{{ tag }}</span>
        {% endfor %}
      </div>
      {% endif %}
    </div>
  </div>
  {% endunless %}
{% endfor %}
</div>
