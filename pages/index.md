---
layout: default
title: Blog
permalink: /
---

<div>
{% for post in site.categories.blog %}
    <div class="blogpost">
        <header>
            <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
            <span class="date">
                (<time datetime="{{ post.date | date_to_xmlschema }}" itemprop="datePublished">{{ post.date | date: "%b %-d, %Y" }}</time>)
            </span>
        </header>
        {% for tag in post.tags %}
            <span class="tag {{ tag | split: "." | join: " " }}">{{ tag | split: "." | first }}</span>
        {% endfor %}
        <p>{{ post.excerpt | strip_html | truncate: 280 }}
        <a class="read-more" href="{{ post.url }}">Read more →</a></p>
    </div>
{% endfor %}
</div>
