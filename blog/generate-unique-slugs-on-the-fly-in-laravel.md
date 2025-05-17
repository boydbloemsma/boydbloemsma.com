---
title: Generate unique slugs on-the-fly in Laravel
excerpt: Have you ever wondered how YouTube video IDs work?
date: 2023-12-13
image: img20241027_20165163.webp
---

Have you ever wondered how YouTube video IDs work?
They probably use something similar to what we will be building in this article!

When you look at a video, the URL will look something like this `https://www.youtube.com/watch?v=dQw4w9WgXcQ`.
In this case `dQw4w9WgXcQ` is the video identifier.

Let's replicate this in Laravel.

## Setting up the model

Let's get started by creating a videos table that will hold an ID, a unique url_key and a title.

```php
return new class extends Migration  
{  
    public function up(): void  
    {  
		Schema::create('videos', function (Blueprint $table) {  
		    $table->id();  
		    $table->string('url_key')->unique();  
		    $table->string('title');  
		    $table->timestamps();  
		});
    }
};
```

Next let's set up a route to view a record using Laravel's route-model binding.

```php
Route::get('/videos/{video}', function (\App\Models\Video $video) {
    return "$video->id: $video->title";
})->name('videos.show');
```

Now if we visit `example.test/videos/1` we will see the video ID and title.

## Generating a unique slug

To generate the unique slug we will be using [Sqids](https://sqids.org/).
Sqids takes a 'alphabet', which is a alphanumeric string that it will take characters from to generate a unique identifier.
With the same input ID and alphabet the resulting identifier will always be same, so **don't** use this library for encryption purposes.

Now let's see it in action.

```php
Route::post('/videos', function (\Illuminate\Http\Request $request) {
    $id = Video::max('id') ?? 0;

    $sqids = new Sqids\Sqids(
        'uMUfSYvtV01cybOINeEKh4BXFHQT8oaL2mJg79AWwrnqCZp5zsi3dkj6DRPGlx',
        5
    );

    do {
        $id++;
        $key = $sqids->encode([$id]);
    } while (Video::where('url_key', $key)->exists());

    Video::create([
        'url_key' => $key,
        'title' => $request->title,
    ]);
})->name('videos.store');
```

Here we retrieve the highest id in the table and encode it.  
If your app is big enough two or more requests might retrieve the same max ID, meaning they will generate the same identifier.
To enforce uniqueness we do a final check whether the identifier already exists in the database, if it does we increase the ID and try again.

Now this will probably work 99% of the time but it isn't what we would call [thread safe](https://en.wikipedia.org/wiki/Thread_safety). Which means the following scenario is still possible:

1. Request comes in and url_key is generated for ID 1
2. New request comes in and url_key is generated for ID 1 and inserted
3. We try to insert the url_key from step one
4. A unique constraint violation is thrown

To prevent this from happening we can use something called a 'for update' lock.
This will prevent a selected record from being modified or being selected with another shared lock.
For this we will create a new table where we can store write locks.

```php
return new class extends Migration  
{  
    public function up(): void  
    {  
        Schema::create('write_locks', function (Blueprint $table) {  
            $table->id();  
            $table->string('type');  
            $table->timestamps();  
        });  
    }
}
```

In this table we will insert a record where type is `key_generation` which we can lock so we don't have to lock our entire videos table.

```php
Route::post('/videos', function (\Illuminate\Http\Request $request) {  
    DB::transaction(function () use ($request) {  
        DB::table('write_locks')  
            ->where('type', 'key_generation')  
            ->lockForUpdate()  
            ->get();  
  
        $sqids = new Sqids\Sqids(  
            'uMUfSYvtV01cybOINeEKh4BXFHQT8oaL2mJg79AWwrnqCZp5zsi3dkj6DRPGlx',  
            5  
        );  
  
        $id = Video::max('id') ?? 0;  
  
        do {  
            $id++;  
            $key = $sqids->encode([$id]);  
        } while (Video::where('url_key', $key)->exists());  
  
        Video::create([  
            'url_key' => $key,  
            'title' => $request->title,  
        ]);  
    });  
})->name('videos.store');
```

We need to wrap our key generation in a transaction so when we lock the `key_generation` record in our write locks table any subsequent requests will have to wait for the previous transaction to finish and unlock the record.
Thankfully Eloquent offers the useful `lockForUpdate` method, which does exactly that.

And just like that we have made our URL key generation thread safe.

## Using the slug

To use the newly generated identifier in URLs we will use Laravel's `getRouteKeyName` method, which decides what column to use for the model.

```php
class Video extends Model  
{  
    public function getRouteKeyName(): string  
    {  
        return 'url_key';  
    }  
}
```

Now we can retrieve our model using `/videos/HehZ5` instead of `/videos/1`, which looks a lot better!
