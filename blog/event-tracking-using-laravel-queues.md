---
title: Event tracking using Laravel queues
excerpt: To provide the best user experience on your website you first need to understand the user, this is what event tracking is for.
date: 2024-01-01
image: img20241027_20262870.webp
---

To provide the best user experience on your website you first need to understand the user, this is what event tracking is for.

Let's say for example we have a e-commerce store that sells books and we decide to track the following interactions:
- Purchase
- Add to cart
- Product view

When a user visits our site and clicks on a few books we send these interactions to an event tracking service together with a unique user identifier (we will be using the session ID).
Now when this user comes back a week later, we can use their session ID to retrieve book recommendations tailored to this user based on what books they clicked before.

> For the sake of this article I will not go into all the different services which take these interactions and process them, since there are way to many to discuss and they all basically work the same.

## Why queue

Event tracking is a perfect example for jobs that can be queued because for every interaction an API call has to be made. API calls to external services can be slow or even fail at times.
Since we don't want our user to be impacted by this we move it from the main thread to be processed in the background, so we dispatch a job passing all necessary data and let the user continue browsing.

## The jobs

Let's say our event tracking service needs the following data per interaction:
- `itemId`: The book's ID.
- `userId`: Current user's session ID.
- `timestamp`: Timestamp for when the interaction occurred.

There is something to keep in mind however, the timestamp must be from when the interaction was performed ***not*** when the job was executed.

I have opted to create separate jobs for each interaction.

```php
class AddToCart implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 5;

    public function __construct(
        public int $book_id,
        public string $session_id,
        public int $timestamp,
    ) {}

    public function handle(): void
    {
        $response = Http::post('https://event-tracking.org/add-to-cart', [
            'itemId' => $this->book_id,
            'userId' => $this->session_id,
            'timestamp' => $this->timestamp,
        ]);

        $response->throwUnlessStatus(201);
    }
}
```

Let's go over what we're looking at.

We make a simple post request using the data passed to the job, if this request doesn't return a 201 (created) status code we throw an exception.

The way Laravel's queueing system works the job will then be released back into the queue where it will be attempted again.
Since there is a chance the event tracking service is down we have set the max amount of tries to 5, if it still throws exceptions after 5 retries we consider the job failed.

## Dispatching

Now everywhere a book is added to the cart all we have to do is dispatch this job.

```php
\App\Jobs\Events\AddToCart::dispatch(  
    1,  
    Session::getId(),  
    now()->unix(),  
)->onQueue('events');
```

This will take the book ID, the exact unix timestamp the book was added to the cart and the session ID for the user who added it.

Now we can start a worker for the `events` queue and all our interactions will be sent to our event tracking service!
