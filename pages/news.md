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
                <h2>
                    {{ post.title }}
                    <span class="date">
                        (<time datetime="{{ post.date | date_to_xmlschema }}" itemprop="datePublished">{{ post.date | date: "%b %-d, %Y" }}</time>)
                    </span>                                                         
                </h2>
                <small>{{ post.excerpt }}</small>
            </a>
        </li>
    {% endfor %}
</ul>
