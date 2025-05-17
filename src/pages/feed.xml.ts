import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
    const articles = await getCollection('blog');

    return rss({
        title: 'Boyd Bloemsma',
        description: "Boyd Bloemsma's little corner of the internet.",
        site: context.site || new URL('https://boydbloemsma.com'),
        trailingSlash: false,
        items: articles.map((article) => ({
            title: article.data.title,
            pubDate: article.data.date,
            description: article.data.excerpt,
            link: `/articles/${article.id}`,
        }))
    });
}
