---
layout: blogpost
permalink: /blog/hacking-dark-themes-with-css-blend-modes/
title: Hacking dark themes with CSS blend modes
date: 2019-06-25
tags: CSS frontend design
author: <a href="https://linkedin.com/in/davidaase">David Åse</a>
---

Like many other companies, [Working Group Two](/) has a number of applications which are
only available internally or to partners.
Our UI designer (that's me) prefers light backgrounds with dark text, but one of our
partners have wanted a dark theme for one of our applications for some time.
We haven't been able to prioritize this, but we were using CSS blend modes for a different project,
and wondered if we could use them to quickly put together a dark theme.

The application in this post is one of our partner portals, which follows the Material Design
guidelines. It’s built with [Vue](https://vuejs.org/) and [Vuetify](https://vuetifyjs.com/en/),
but also has some custom components and JS plugins (for uploads, charts, etc).
It took two hours to create the dark theme and deploy it to production, and we'll walk
you through the whole process (with screenshots) in this post.

## What are CSS blend modes?
Mozilla has a [page](https://developer.mozilla.org/en-US/docs/Web/CSS/blend-mode) which explains
the concept fairly well. In short, blend modes decide what should happen when two colors are
put on top of each other. The default blend mode is `normal`, which is what most people are used to.
As an example, the `normal` blend mode paints dark text on top of a light background on the
page you’re reading right now.

The applications we have is light and we want it to be dark, so we need to look for blend modes that
can help with that. Scrolling through the [list at MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/blend-mode)
one mode in particular stands out:

```
difference
    The final color is the result of subtracting the darker of the two colors from the lighter one.
    A black layer has no effect, while a white layer inverts the other layer's color.
```

Let’s see it in action <small>(click to enlarge)</small>:

<div class="uk-child-width-1-3 uk-child-width-1-2@s bordered-gallery" uk-grid uk-lightbox="animation: fade">
    {% include image.html url="/img/blog/blend-modes/01-console-subs-light.png" caption="Starting point, mostly basic Vuetify"%}
    {% include image.html url="/img/blog/blend-modes/01-console-subs-difference.png" caption="After applying `mix-blend-mode: difference;`"%}
</div>

Okay, that’s actually not too bad. There are some obvious issues, like the color hues being
inverted and everything being way too dark, but it should be possible to make some adjustments.

## Working with a non-standard blend mode
The most jarring issue is that the colors have been inverted.
Our teal logo is now red, and the red "unlocked account" icon we use in development mode is now teal.
This is in line with the documentation for the `difference` blend mode, but luckily CSS also supports hue-rotation,
so we can just rotate the hue back 180 degrees. Our base style now looks like this:

```
html.dark-mode {
   mix-blend-mode: difference;
   filter: hue-rotate(180deg);
}
```

This fixes our colors, but we also have to do something about the darkness.
The whole application is pretty much pitch black, and to make it brighter we need to … turn down the brightness:

```
html.dark-mode {
   mix-blend-mode: difference;
   filter: hue-rotate(180deg) brightness(0.67);
}
```

Let's have a look <small>(click to enlarge)</small>:

<div class="uk-child-width-1-3 uk-child-width-1-2@s bordered-gallery" uk-grid uk-lightbox="animation: fade">
    {% include image.html url="/img/blog/blend-modes/01-console-subs-light.png" caption="Starting point, mostly basic Vuetify"%}
    {% include image.html url="/img/blog/blend-modes/01-console-subs-difference-filters.png" caption="After applying blend mode and filters"%}
</div>

That’s a lot better (blend modes are fun!). Our dark theme is close to done now,
but we have one problem remaining: Shadows. Because of our blend mode, making
things darker means making them brighter, so all our shadows look like white glows.
Since our base color is white/light gray, we can’t simply change our shadows to white as there would be no contrast.
Our solution was to embrace the “glow” feel and change the shadows to brand colored glows:

<div class="uk-child-width-1-3 uk-child-width-1-2@s bordered-gallery" uk-grid uk-lightbox="animation: fade">
    {% include image.html url="/img/blog/blend-modes/02-console-shadows-light.png" caption="Normally, the menu crates a black shadow on the background"%}
    {% include image.html url="/img/blog/blend-modes/02-console-shadows-glow.png" caption="More of a glow than a shadow"%}
</div>

As you might have noticed in the previous screenshot, we also made some other adjustments.
We made the logo white using a brightness filter, and we made the base font-weight 500
(since contrast is lower in the dark theme).

## More comparison screenshots

<div class="uk-child-width-1-3 uk-child-width-1-6@s bordered-gallery" uk-grid uk-lightbox="animation: fade">
    {% include image.html url="/img/blog/blend-modes/03-console-blacklist-light.png" caption="A standard Vuetify data table"%}
    {% include image.html url="/img/blog/blend-modes/03-console-blacklist-dark.png" caption="It's not perfect in dark mode, but it works"%}
    {% include image.html url="/img/blog/blend-modes/03-console-batch-light.png" caption="Our upload component is custom, not related to Vuetify"%}
    {% include image.html url="/img/blog/blend-modes/03-console-batch-dark.png" caption="Blend mode covers all parts of the app"%}
    {% include image.html url="/img/blog/blend-modes/03-console-stats-light.png" caption="Charts are built with Charts.js"%}
    {% include image.html url="/img/blog/blend-modes/03-console-stats-dark.png" caption="Charts also look okay"%}
</div>

<small>Click to enlarge.</small>

## Conclusion
All in all, it took around two hours to create this dark theme. There are probably better ways of doing this,
but this was incredibly quick, and allowed us to deliver something we normally wouldn't be able to deliver.
Other than the shadows, nothing is particularly ugly, so we consider this a success.

Thanks for reading!

## FAQ

*“Many CSS frameworks have a dark-mode, why not use that?”*\\
Vuetify also has a dark mode. Most of the components they offer look okay in dark-mode, but we would have
to write custom CSS for our own components, and for other libraries we’re using (primarily for charts).
The great thing about the blend-mode hack is that is operates independent of any framework.
You just set it on an HTML tag and it works the same on everything.
