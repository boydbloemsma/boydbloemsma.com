---
title: Creating a markdown blog using Laravel 10
excerpt: Before we can start this article I have a confession to make; I'm a back-end developer.
date: 2023-12-06
---

Before we can start this article I have a confession to make; I'm a back-end developer.

I love the back-end, I like solving the puzzles back-end development provides and I am familiar with it.
That's why I decided to use [Laravel](https://laravel.com/) for my blog over some of the other blog options out there.

## Example article

First I had to think of how my articles would be structured and I landed on the following:

```md
---
date: 2023-12-06
title: Example title
excerpt: This will be a short excerpt from the article.
---

Markdown goes here
```

The lines between the dashes are called FrontMatter.
Markdown itself won't do anything with this, but we can extract useful information from this block to enrich our Model.
## The Article model

I don't want to use a database for this blog. But since I'm a big fan of the Eloquent ORM I will use the [Sushi](https://github.com/calebporzio/sushi) package to transform my articles to models.
To do this I created the following code:

```php
<?php  
  
namespace App\Models;  
  
use Illuminate\Database\Eloquent\Model;  
use Illuminate\Filesystem\Filesystem;  
use Illuminate\Support\Carbon;  
use Illuminate\Support\Facades\File;  
use League\CommonMark\Environment\Environment;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;  
use League\CommonMark\MarkdownConverter;
use Spatie\YamlFrontMatter\YamlFrontMatter;  
use Sushi\Sushi;
  
class Article extends Model
{  
    use Sushi;
  
    public function getRows(): array 
    {  
		$environment = (new Environment())
		    ->addExtension(new CommonMarkCoreExtension());
		$converter = new MarkdownConverter($environment);
        
        $filesystem = new FileSystem(); 
        $articles = [];  
        foreach (File::allFiles(app_path('articles')) as $file) {  
            $slug = $file->getFilenameWithoutExtension();  
            $filename = $file->getRelativePathName();  
            $file = $filesystem->get(app_path("articles/$filename"));
  
            $object = YamlFrontMatter::parse($file);  
  
            $articles[] = [ 
                'title' => $object->matter('title'),  
                'excerpt' => $object->matter('excerpt'),  
                'date' => Carbon::createFromTimestamp($object->matter('date'))->format('Y-m-d'),  
                'slug' => $slug, 
                'body' =>  $converter->convert($object->body()),
            ]; 
        }  
  
        return $articles;
    }
}
```

It might look like a lot is happening in this code block but it really isn't that impressive. Let's break it down.

### Getting the articles

```php
<?php  
  
namespace App\Models;  
  
use Illuminate\Database\Eloquent\Model;  
use Illuminate\Filesystem\Filesystem;  
use Illuminate\Support\Carbon;  
use Illuminate\Support\Facades\File;  
use League\CommonMark\Environment\Environment;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;  
use League\CommonMark\MarkdownConverter;
use Spatie\YamlFrontMatter\YamlFrontMatter;  
use Sushi\Sushi;
  
class Article extends Model // [tl! focus:start]
{  
    use Sushi;
  
    public function getRows(): array // [tl! focus:end]
    {  
		$environment = (new Environment())
		    ->addExtension(new CommonMarkCoreExtension());
		$converter = new MarkdownConverter($environment);
        
        $filesystem = new FileSystem(); // [tl! focus:start]
        $articles = [];  
        foreach (File::allFiles(app_path('articles')) as $file) {  
            $slug = $file->getFilenameWithoutExtension();  
            $filename = $file->getRelativePathName();  
            $file = $filesystem->get(app_path("articles/$filename")); // [tl! focus:end]
  
            $object = YamlFrontMatter::parse($file);  
  
            $articles[] = [ // [tl! focus]
                'title' => $object->matter('title'),  
                'excerpt' => $object->matter('excerpt'),  
                'date' => Carbon::createFromTimestamp($object->matter('date'))->format('Y-m-d'),  
                'slug' => $slug, // [tl! focus]
                'body' =>  $converter->convert($object->body()),
            ]; // [tl! focus:start]
        }  
  
        return $articles;
    } // [tl! focus:end]
}
```

In this block of code we search for all files in the `app/articles` directory recursively.
We then iterate over all files and create a slug by getting the filename without the extension (talk about efficiency).
Because I store my articles by year we need to use the `getRelativePathName` method to include the parent directories.
The Sushi package takes the array we return in the `getRows` method and turns the values into models.

### Converting the file and enriching the model

```php
<?php  
  
namespace App\Models;  
  
use Illuminate\Database\Eloquent\Model;  
use Illuminate\Filesystem\Filesystem;  
use Illuminate\Support\Carbon;  
use Illuminate\Support\Facades\File;  
use League\CommonMark\Environment\Environment;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;  
use League\CommonMark\MarkdownConverter;
use Spatie\YamlFrontMatter\YamlFrontMatter;  
use Sushi\Sushi;
  
class Article extends Model
{  
    use Sushi;
  
    public function getRows(): array
    {  
		$environment = (new Environment()) // [tl! focus:start]
		    ->addExtension(new CommonMarkCoreExtension());
		$converter = new MarkdownConverter($environment); // [tl! focus:end]
        
        $filesystem = new FileSystem();
        $articles = [];  
        foreach (File::allFiles(app_path('articles')) as $file) {  
            $slug = $file->getFilenameWithoutExtension();  
            $filename = $file->getRelativePathName();  
            $file = $filesystem->get(app_path("articles/$filename"));
  
            $object = YamlFrontMatter::parse($file); // [tl! focus]
  
            $articles[] = [
                'title' => $object->matter('title'),  // [tl! focus:start]
                'excerpt' => $object->matter('excerpt'),  
                'date' => Carbon::createFromTimestamp($object->matter('date'))->format('Y-m-d'), // [tl! focus:end]
                'slug' => $slug,
                'body' =>  $converter->convert($object->body()), // [tl! focus]
            ];
        }  
  
        return $articles;
    }
}
```

The [yaml-front-matter](https://github.com/spatie/yaml-front-matter) package by Spatie will extract all the juicy FrontMatter we inserted in the document and makes it available using the `matter` method.
This gives us the `title`, `excerpt` and `date` values, the body is then converted using [CommonMark](https://commonmark.thephpleague.com/).
From here on we can use the models like any other Eloquent model, even route model binding will work!

```php
Route::prefix('/articles')->group(function () {  
    Route::get('/', function () {  
        $articles = Article::all();  
        return view('pages.articles.index', ['articles' => $articles]);  
    })->name('articles.index');  
  
    Route::get('/{article:slug}', function (Article $article) {  
        return view('pages.articles.show', ['article' => $article]);  
    })->name('articles.show');  
});
```
## Bonus: Syntax highlighting

Since my blog is web development related, I wanted to get syntax highlighting in code blocks right. To do this I use [Torchlight](https://torchlight.dev) and the implementation couldn't be easier. You just install the Torchlight CommonMark extension and add it to the CommonMark environment.

```php
$environment = (new Environment())  
    ->addExtension(new CommonMarkCoreExtension())  
    ->addExtension(new TorchlightExtension());  
$converter = new MarkdownConverter($environment);
```

> Don't forget to add your Torchlight token to your `.env`

That's it!
Good luck and build something beautiful.
