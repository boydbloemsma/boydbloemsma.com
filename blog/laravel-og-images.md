---
title: Laravel OG images
excerpt: Because we don't want to have to manually create an image for every article, we can use The OG package which will do all the hard work for us.
date: 2024-04-20
image: img20241027_20201795.webp
---

I received some feedback about the way my articles look when shared, to improve this I decided to add OG images.
When researching the best way to do this in Laravel I came across this [tweet](https://twitter.com/simonhamp/status/1776998335519318360) from Simon Hamp.

## What are OG images?

The Open Graph protocol enables you to add metadata to your pages that social media platforms can use to enhance the way your links are displayed.
One of these metadata properties is `og:image` which can be an image URL to represent your link.

## The OG

Because we don't want to manually create an image for every article, 
we can use [The OG](https://github.com/simonhamp/the-og) package which will do all the hard work for us.

```shell
composer require simonhamp/the-og
```

## Image generation

Then let's generate a Laravel command where we will store our OG image generation logic.

```shell
php artisan make:command GenerateOgs
```
I use Spatie's [Sheets](https://github.com/spatie/sheets) package to retrieve all of my articles.
It really doesn't matter how you retrieve your articles, as long as you can iterate over them, we should be good.

```php
// GenerateOgs.php

<?php

namespace App\Console\Commands;

use Intervention\Image\Encoders\WebpEncoder;
use SimonHamp\TheOg\Background;
use SimonHamp\TheOg\BorderPosition;
use SimonHamp\TheOg\Image;
use Illuminate\Console\Command;
use Spatie\Sheets\Facades\Sheets;

class GenerateOgs extends Command
{
    protected $signature = 'ogs:generate';

    protected $description = 'Generates og images for articles';

    public function handle(): void
    {
        $articles = Sheets::collection('articles')
            ->all();

        foreach ($articles as $article) {
            $filename = public_path('images/' . $article->slug . '.webp');

            (new Image())
                ->border(BorderPosition::Bottom)
                ->url(route('articles.show', $article->slug))
                ->title($article->title)
                ->description($article->excerpt)
                ->background(
                    background: Background::GridMe,
                    opacity: 0.7
                )
                ->save(
                    path: $filename,
                    encoder: new WebpEncoder,
                );
            $this->info("Image for $article->title generated.");
        }
    }
}
```

Running this command will generate an OG image for every article, which is great, 
but if we want to run this command on every deployment we probably don't want it to regenerate already existing images.
To prevent this we can use Laravel's File facade to check whether the file already exists.

```php
// GenerateOgs.php

<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Intervention\Image\Encoders\WebpEncoder;
use SimonHamp\TheOg\Background;
use SimonHamp\TheOg\BorderPosition;
use SimonHamp\TheOg\Image;
use Spatie\Sheets\Facades\Sheets;

class GenerateOgs extends Command
{
    protected $signature = 'ogs:generate';

    protected $description = 'Generates og images for articles';

    public function handle(): void
    {
        $articles = Sheets::collection('articles')
            ->all();

        foreach ($articles as $article) {
            $filename = public_path('images/' . $article->slug . '.webp');
            if (File::exists($filename)) {
                $this->info("Image for $article->title already exists.");
                continue;
            }

            (new Image())
                ->border(BorderPosition::Bottom)
                ->url(route('articles.show', $article->slug))
                ->title($article->title)
                ->description($article->excerpt)
                ->background(
                    background: Background::GridMe,
                    opacity: 0.7
                )
                ->save(
                    path: $filename,
                    encoder: new WebpEncoder,
                );
            $this->info("Image for $article->title generated.");
        }
    }
}
```

You can choose to use the WebP encoder to reduce the image size.

> If you store your articles in a database you could store a reference to the image there, 
> this would prevent you from having to check whether the file exists.

Now all we have to do is read this image on the article page.

```php
// articles/show.blade.php

@if(File::exists(public_path('images/' . $article->slug . '.webp')))
    <meta property="og:image" content="{{ asset('images/' . $article->slug . '.webp') }}" />
    <meta property="twitter:image" content="{{ asset('images/' . $article->slug . '.webp') }}" />
@endif
```

Adding this to your deployment script will make sure all of your articles have OG images!
