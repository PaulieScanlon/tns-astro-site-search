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
};
