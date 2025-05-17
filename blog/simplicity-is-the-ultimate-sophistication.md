---
title: Simplicity is the ultimate sophistication
excerpt: This idea permeates through my entire life. The idea that to make something simple to use a lot of effort is needed.
date: 2024-10-26
image: img20241027_20210635.webp
---

This idea permeates through my entire life. 
The idea that to make something simple to use a lot of effort is needed.

## Simplicity

My blog is an example of this ethos.
At the time of me writing this it's just a simple site, no images, no animations, no forms and no JavaScript.
And this has a reason, my blog scores only 100's on PageSpeed Insights and it loads within seconds all over the world.
Which is important to me because that is what I look for in websites, fast access to the information I want.

## Sophistication

But to achieve this a lot of I had to do some sophisticated things.
I'll go over them here.

### Markdown to SQLite

All of my articles are written using Markdown and when I started this blog I would just parse this Markdown to HTML whenever the user viewed an article.
And also to show my latest articles and to list my articles in the overview.
You can probably see where I'm going with this, all this parsing takes time. 
So I decided to parse it only once when I deploy my website, every deploy I blow away my current SQLite database and fill a new one with my articles.
Having them all in SQLite is perfect because SQLite is extremely fast and offers relationships for me to use.

### Sitemap generation

When all articles have been stored in the database I use this information to generate a sitemap.
This is important to me because I want people to find my blog.

### Generate OGs

Remember before when I said my blog doesn't have any images? 
Well I lied. 
Every deployment I will check for articles which don't have an OG image yet and generate it.
This increases the likelihood people click on my articles when sharing them on social media.

## Retrieving page views

I use Fathom Analytics to see which of my articles people view the most.
This gives me feedback for what people might want to see in the future.
They also have an API where you can retrieve your analytics data, so I have a job that runs daily that gets page views per article and adds them to the database.

### Cloudflare

And all of this is behind a Cloudflare CDN with the most aggressive caching available. 
Meaning that almost any page a user visits is returned by Cloudflare.
Every deploy I purge the Cloudflare cache and every time a page is visited Cloudflare caches it again.

## Conclusion

Always remember, when things look simple you can bet someone put a lot of work in to make it seem that way!

