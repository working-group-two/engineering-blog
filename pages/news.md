---
layout: default
title: News
permalink: /news
---

# News
<ul class="news-list">
    {% for post in site.categories.news %}
        <li>
            <a href="{{ post.url }}" class="small-shadow">
                <header>
                    <h2>{{ post.title }}</h2>
                    <span class="date">
                        (<time datetime="{{ post.date | date_to_xmlschema }}" itemprop="datePublished">{{ post.date | date: "%b %-d, %Y" }}</time>)
                     </span>
                </header>
                <small>{{ post.excerpt }}</small>
            </a>
        </li>
    {% endfor %}
</ul>
