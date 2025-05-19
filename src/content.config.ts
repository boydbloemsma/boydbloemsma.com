import { defineCollection, z } from 'astro:content';

import { glob } from 'astro/loaders';

const blog = defineCollection({
    loader: glob({pattern: '**/*.md', base: './blog'}),
    schema: z.object({
        title: z.string(),
        excerpt: z.string(),
        date: z.coerce.date(),
        image: z.string().optional(),
        tags: z.array(z.string()).optional().default([]),
    })
});

export const collections = { blog };
