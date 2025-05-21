---
title: Rewriting my blog in Astro
excerpt: Sometimes you shouldn't try to swim against the current.
date: 2025-05-21
image: img20241206_11314725.jpg
tags: ["Astro", "Development"]
---

Sometimes you shouldn't try to swim against the current.

## The problems with my old setup

My old setup consisted of the following stack: 

- **Laravel**: The backbone of my old blog, used for everything the blog provided.
- **SQLite**: All articles were stored in SQLite on deployment, from this I could then use Eloquent to query the articles.
- **Torchlight**: I used Torchlight for code highlighting for articles that had code blocks.

This setup, however, caused me a few issues.
The Torchlight plugin seems to no longer be maintained; this meant I couldn't upgrade from Laravel 10 which kind of disappointed me.
I also had to do a lot of parsing tricks to get the headers from Markdown, for example.

## Why Astro caught my attention

I had heard a lot about Astro, mostly the fact that you can use whichever frontend framework you want.
Astro also produces zero JavaScript if it's unnecessary, this is crucial to me.
I want my blog to compile to HTML as much as possible.

## The migration process

The migration didn't go without any problems. 
It took me around 4 hours to migrate everything.
Since I was using Markdown previously, I could just copy those articles to my new repository.
Now no SQLite is needed; I now leverage the Astro Content Collections, making everything straightforward.

My blade files could almost be copied one to one, keeping my Tailwind classes intact.
The only thing I needed to change here was the way I interact with the data.

Luckily enough, Astro has integrations for sitemap, so this was no work for me at all, probably less work than in Laravel.

The most challenging part was getting my article views from Fathom, in Laravel I just used a command for this which I ran every day and when I deploy.
Now I created a GitHub Action to do the same but store these in a JSON file and commit the changes.

All in all, I think it was well worth it.

## What I learned

My conclusion is that picking the right tool for the job is crucial.
I hope this migration will save me more time in the future.