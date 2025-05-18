---
title: Building my first SAAS using Laravel
excerpt: I think it's especially hard for developers to think of these things, because we are used to thinking in solutions instead of problems.
date: 2024-09-08
image: img20241027_20130866.webp
tags: ["Laravel", "SAAS", "Development"]
---

I've been on the lookout for a SAAS idea for a while now. It had to be a problem that I had to deal with myself, and other people as well. I think it's especially hard for developers to think of these things, because we are used to thinking in solutions instead of problems. So when a good friend of mine came to me with this idea is was ecstatic. 

## The Idea

My friend and I are avid readers, this means we often read a book we think the other person should read. This usually results in a swap, leaving me with a book of his and him with a book of mine. But we also lend out books to other people, keeping track of all this is a though task.
Thats where the idea comes in, a website to keep track of whom is borrowing your precious books. We decided to call it Shelveless.

## Outlining our MVP

First we sat down and decided what functionality our website had to have to constitute an MVP (Minimum Viable Product).

- Users should be able to add books by scanning an ISBN code
- Users should be able to change the reading status of any book in their library
- Users should be able to add friends (other users on Shelveless)
	- Books can also be lend to non-users by just entering their name
- Users should be able to view other users' libraries and request to borrow books from them

## The stack

The best tech stack is the one you are familiar with. Which is why I chose:

**Laravel** as my backend, which has authentication, rate-limiting, a good ORM and a bunch of other stuff builtin.

**React** on the frontend with **Inertia** as translation layer between the two. This decision was also made with the idea that I could use React Native eventually if I wanted to.

**TailwindCSS** for styling, because I had picked React as well I could use the Catalyst TailwindCSS components, greatly speeding up development.

## Some mentionable packages

Creating this website wouldn't be possible without the rich package ecosystem around Laravel. I want to highlight some packages that I really enjoyed working with.

### Filament

<https://filamentphp.com/>

Filament is by far the easiest way to setup an admin panel. 
And I'm not just talking about in the Laravel ecosystem, I mean the easiest, period.
Using this package saved the hundreds of hours I'd say.

### Cashier

<https://laravel.com/docs/11.x/billing>

Laravel's first party billing package is amazing, setting up subscriptions became a non-issue.

### Saloon

<https://docs.saloon.dev/>

Used for all external API requests. The true power of Saloon showed itself when I had to switch to another book API. All I had to do was add a new connector, add a few requests and map a few fields. This is a package I will always use in future projects.

### The OG

<https://github.com/simonhamp/the-og>

I'm also using this package for my blog, but I wanted to use it to the fullest in this project. It makes generating original OG images super easy.

## Struggles

It wasn't all sunshine and roses. There were things I struggled with.

### Unreliable API's

When I started this project I used the free OpenLibrary API to retrieve book information. Sadly I discovered this API to be very unreliable, it couldn't find information for a lot of books. This would lead users to be annoyed with our dataset, so I swapped it out for the ISBNdb API which is not perfect either but a lot better.

### SSR

This was my first production product using Inertia, and I found out that if you want to have some basic functionality like meta tags you really need to enable server side rendering. When enabling this however some things broke, like the Ziggy route helper. This is one of the reasons why I'm a big enjoyer of plain Laravel or Laravel with Livewire.

## The future

I will continue working on this project for the foreseeable future. There is enough that needs to happen on the website and we have plenty of ideas for new functionalities. And eventually a real app.

## Conclusion

Doing this project has motivated me to just do more of these things, and I already have some ideas for new projects.

If Shelveless sounds like something you might want to use, you can check it out here: <https://shelveless.com/>.
