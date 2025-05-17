---
title: Deploying Laravel Reverb in production
excerpt: Once I had completed a proof of concept and was ready to deploy it, however, the trouble started for me.
date: 2024-06-01
image: img20241027_20192315.webp
---

To improve my skill set, I decided it might be fun to create a real-time chat application where users can create rooms and send messages. 
Laravel Reverb seemed like the perfect way to achieve this, so I started building. 
Once I had completed a proof of concept and was ready to deploy it, however, the trouble started for me.

I found the Laravel Reverb documentation for deployment to be lacking, which led me to write this article in order to help other people running into the same issues.

## Subdomain

First of all, they recommend an nginx config to reverse proxy the traffic to Reverb. 
What they don't mention, however is that you should use this nginx config on a subdomain.
My application is hosted on https://chad.boydbloemsma.com/ so I had to point ws.boydbloemsma.com to the same server.
I use [Ploi](https://ploi.io/) for my server management, and they have a great feature for these kind of domain aliases called tenents, so I added ws.boydbloemsma.com there and then added the Laravel nginx config.
You can find this option under Manage > Tenents.

```nginx
server {
    ...
 
    location / {
        proxy_http_version 1.1;
        proxy_set_header Host $http_host;
        proxy_set_header Scheme $scheme;
        proxy_set_header SERVER_PORT $server_port;
        proxy_set_header REMOTE_ADDR $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
 
        proxy_pass http://0.0.0.0:8080;
    }
 
    ...
}
```

Then I used Ploi to add a SSL certificate to support a secure websocket connection.

If you'd like to try out Ploi, feel free to use [my referral link](https://ploi.io/register?referrer=UVl2UTy7GokYzfNJm77j).

## Starting Reverb

Ploi makes this extremely easy; you just navigate to Laravel > Reverb and click spawn server.

## Running the queue worker

Then you need to add a queue worker, and once again, Ploi has us covered. 
Go to the queue tab and add the queue your events are fired on.

## Open port

It is also important to allow incoming traffic for the port you are running Reverb on.
To do this, you have to SSH into the server and run the following command to allow port 8080.

```shell
sudo ufw allow 8080
```

I also had to add an inbound rule for port `8080` in the Digitalocean dashboard for my firewall.

## Broadcast driver

After doing all of this, I was convinced it should be working. 
My application was connecting to the websocket, and the authentication for the private channel succeeded.
But for some reason my events were not arriving at Reverb.
I was a my wit's end.
I eventually decided to enlist the help of the Dutch Laravel Discord, and after some debugging, we discovered the `BROADCAST_DRIVER` was still set to `log` instead of `reverb`.
Updating this fixed all of my issues.

## Conclusion

Deploying Laravel Reverb in production isn't all that easy!
But by sharing my struggles, I hope it might be easier for you.
