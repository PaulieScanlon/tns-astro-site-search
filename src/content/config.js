import { z, defineCollection } from 'astro:content';

export const collections = {
  posts: defineCollection({
    type: 'content',
    schema: z.object({
      draft: z.boolean().optional(),
      audioFeedId: z.string().optional(),
      base: z.string(),
      title: z.string(),
      tags: z.array(z.string()).optional(),
      date: z.date(),
      author: z.string(),
      featuredImage: z.string(),
    }),
  }),
  articles: defineCollection({
    type: 'content',
    schema: z.object({
      audioFeedId: z.string().optional(),
      base: z.string(),
      title: z.string(),
      tags: z.array(z.string()).optional(),
      date: z.date(),
      url: z.string(),
      canonical: z.string().optional(),
      publication: z.string(),
      author: z.string(),
      logo: z.string(),
      featuredImage: z.string().optional(),
    }),
  }),
};