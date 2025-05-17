# Boyd Bloemsma's Personal Website

This is the codebase for my personal website and blog. As a software developer and tinkerer, I love making things and having lots of side projects going. This site is where I share my thoughts, projects, and experiences.

## Simplicity is the Ultimate Sophistication

This idea permeates through my entire life, including this website. At first glance, it's just a simple site - no unnecessary images, animations, forms, or JavaScript. This has a reason: my blog scores only 100's on PageSpeed Insights and loads within seconds all over the world. This is important to me because that's what I look for in websites - fast access to the information I want.

But to achieve this simplicity, I had to do some sophisticated things behind the scenes:

### Technical Features

- **Markdown to SQLite**: All articles are written in Markdown and parsed once during deployment, then stored in SQLite for extremely fast access
- **Sitemap Generation**: Automatically generated to improve SEO
- **OG Image Generation**: Custom OG images for better social media sharing
- **Analytics**: Using Fathom Analytics to track page views without compromising privacy
- **Cloudflare CDN**: Aggressive caching for optimal performance worldwide

## Projects

Some of my other projects include:

### Shelveless

When you start reading books, people will want to lend you books they've enjoyed. And once you've acquired a few books yourself, you will want to lend them out to others. This is a part of life; humans love to share stories, experiences and joy. Shelveless came from this idea - add your friends and keep track of the books you share.

[https://shelveless.com](https://shelveless.com)

### localpantry.shop

A website for artisans to display their products. It's a simple way to showcase their products and get more customers.

[https://localpantry.shop](https://localpantry.shop)

## Tech Stack

This website is built with:

- **Astro**: Fast, content-focused web framework
- **TailwindCSS**: For styling
- **Cloudflare**: For hosting and CDN

## Running Locally

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |

## Remember

Always remember, when things look simple you can bet someone put a lot of work in to make it seem that way!
