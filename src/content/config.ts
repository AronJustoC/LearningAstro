import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    autor: z.string(),
    fecha: z.date(),
  }),
});

export const collections = {
  blog: blogCollection,
};
