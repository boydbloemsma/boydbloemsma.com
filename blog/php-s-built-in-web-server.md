---
title: PHP's built-in web server
excerpt: Sometimes the easiest solution is the best solution.
date: 2024-01-07
image: img20241027_20245253.webp
tags: ["PHP", "Laravel", "Development"]
---

A little while ago I had to POST some data to an endpoint which did not exist yet.
I wanted to validate the structure of my request and see if it would arrive at the endpoint.
After some quick research into API mocking not yielding what I was really looking for, I remembered PHP's [built-in web server](https://www.php.net/manual/en/features.commandline.webserver.php).

Sometimes the easiest solution is the best solution.

## Hosting a single file

For my implementation a simple index file that returns the posted JSON payload was enough.

```php
<?php

header('Content-Type: application/json');

echo file_get_contents('php://input');
```

Then I served the file using:

```shell
php -S localhost:8000 index.php
```

Now I could see my calls were arriving at the newly created endpoint and I could validate the structure based on the response I got.

## Usage in Laravel

This works in Laravel projects as well, as a matter of fact this is what the `php artisan serve` command does under the hood.

All we need to do is pass a document root directory using the `-t` flag, in Laravel this is the public directory.

```shell
php -S localhost:8000 -t public
```

But you're probably better off just using `php artisan serve` in this scenario, seeing as it's integrated in Laravel.

So if you're ever in a pinch and need spin up a quick web server, remember `php -S`.
