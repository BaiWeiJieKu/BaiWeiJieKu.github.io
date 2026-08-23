---
# the default layout is 'page'
title: 收藏
icon: fas fa-bookmark
order: 5
excerpt_separator: ""
---

{% for favorite in site.favorites %}
## [{{ favorite.title }}]({{ favorite.url | relative_url }})

{{ favorite.content }}

---

{% endfor %}
