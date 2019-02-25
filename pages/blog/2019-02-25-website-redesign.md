---
layout: blogpost
permalink: /blog/website-redesign/
title: Redesigning our website
date: 2019-02-25
---

Being a young startup (founded in 2017), we have a very agile approach to most things.
Last year we realized we should have a new website for Mobile World Congress 2018, and we had about three days to create it.
It didn’t turn out perfect, but it sort of communicated what we do and why people should be interested in working with us.
We lived with this website for a year, but when Mobile World Congress 2019 was approaching we started thinking about a redesign.
We’d gotten some feedback from customers and users throughout the year: our website was boring, depressing, lifeless, and had too much text on it.
This time we didn’t have just three days though, we had two weeks! <sup><sup><sup>... not <sup>enough <sup>time<sup></sup></sup></sup></sup></sup>

## Sprucing things up
We decided that the best way to freshen up the website would be to cut a lot of text,
and to add illustrations to accompany the paragraphs explaining our business model.
We’re a very tech heavy company: 22 of our engineers are backend or infra, and 1 is UX/frontend,
so we had to find an external illustrator to work with.
Since our business model isn’t the most straightforward, we wanted to hire an illustrator local to one of our offices.
Having someone local would help in case we needed an in-person meeting to explain details.
After a few days of searching, we found a studio in Trondheim that was able to take
on the job despite our short deadline: [Hugmun.studio](https://www.hugmun.studio/).

We provided them with the layout for the new landing page, and worked closely with them for the whole two weeks.
The illustrations were finished 30 minutes before our first meeting at Mobile World Congress,
just in time to deploy a new version of the website.
The gallery below (click to enlarge) contains the six main iterations,
although there were smaller iterations done per illustration over Slack:

<div class="uk-child-width-1-3 uk-child-width-1-6@s" uk-grid uk-lightbox="animation: fade">
    {% include image.html url="/img/blog/website-redesign/illu1.png" caption="
        We wanted a modern and friendly look. This was the first we saw of the illustrations, and we were happy with the overall style.
        We asked if they could make the first illustration more 'phone' themed.
    "%}
    {% include image.html url="/img/blog/website-redesign/illu2.png" caption="
        They added a phone screen in front of the woman, but we thought it looked more like an airplane emergency exit.
        We asked for a more 'in-your-face' phone, and for the books under the globe in the second illustration to be a server.
    "%}
    {% include image.html url="/img/blog/website-redesign/illu3.png" caption="
        We were pretty happy with illustration 1 and 3 and this point, but illustration 2 didn't feel right.
        We asked for something with a bit more movement and energy to it.

    "%}
    {% include image.html url="/img/blog/website-redesign/illu4.png" caption="
        After replacing the coffee-drinker with a phone-surfer, and receiving our fourth illustration,
        we were happy with the overall motif of the illustrations. The color palette didn't feel right for our company though,
        so we requested a more traditional/corporate look.
    "%}
    {% include image.html url="/img/blog/website-redesign/illu5.png" caption="
        We got a bluer palette which was a lot more popular within the company.
        Illustration 1 had started to feel too similar to illustration 2, so we asked the character could be walking left while on a call.
        We were happy with the direction of the fith illustration, but we wanted it to be more busy.

    "%}
    {% include image.html url="/img/blog/website-redesign/illu6.png" caption="
        The finished set of illustrations. We're very happy with the result.
    "%}
</div>

We wanted the illustrations to be somewhat abstract, but still fit with an overall theme.
We didn't write the copy for the illustrations until they were almost done,
but the illustrator managed to capture the overall feelings we wanted to convey.

## Bootstrapping Internal Talent

In parallel with having the illustrations done, we needed to work on the website.
Our UX/frontend engineer lead the project and did the design and CSS.
Our Head of Security is a good photographer and edited the photos.
Our CEO is good at talking and was in charge of writing the copy.
Several other team members volunteered to edit the copy (proof-reading, reworking sentences, etc).

## The Result

The gallery below contains some before and after screenshots of the old and the current website.

<div class="uk-child-width-1-3 uk-child-width-1-6@s" uk-grid uk-lightbox="animation: fade">
    {% include image.html url="/img/blog/website-redesign/ba1-old.png" caption="
        Our old index page had some issues we wanted to address:
        The header image was dark, there was too much going on in the top (top menu, logo, tagline), and there was too much text.
    "%}
    {% include image.html url="/img/blog/website-redesign/ba1-new.png" caption="
        Our redesign has a brighter header image, a lot less text, and colorful illustrations.
        The top menu has been moved to the left side so it won't interfere with the content.
    "%}
    {% include image.html url="/img/blog/website-redesign/ba2-old.png" caption="
        Our old 'Operator' page was intended to explain our product to operators. It was just a block of of text with one illustration.
        Again we wanted to make things a bit more exciting.
    "%}
    {% include image.html url="/img/blog/website-redesign/ba2-new.png" caption="
        We renamed the page to 'Our product'. We added a header image, and we partitioned the text content into different sections with headings.
    "%}
    {% include image.html url="/img/blog/website-redesign/ba3-old.png" caption="
        Our old FAQ was just a block of questions and answer. We wanted to make information easier to find.
    "%}
    {% include image.html url="/img/blog/website-redesign/ba3-new.png" caption="
        In line with the overall design, this page also got a header image.
        All answers were collapsed, so it'd be easier to find the correct question.
    "%}
</div>

For most pages we mainly cut text and made things more consistent (header images),
the index/landing page was the only one to receive a radical makeover.

## Conclusion

If we had hired an external company to do all this, not only would it have been a lot more expensive,
but it wouldn't have been "our" website anymore.
Like the old one, the new website isn't perfect, but it's a big improvement,
and it still feels very much like it's ours.

A lot of companies just hand their website over to a marketing firm and let them do the rest.
We take pride in fully owning the whole process, and the website is open source so anyone can contribute.
You can even <a href="{{site.repourl}}/blob/master/{{page.path}}">edit this post</a> if you want.

We're looking forward to the Mobile World Congress 2020 redesign.
