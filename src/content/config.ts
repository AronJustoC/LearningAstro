import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    autor: z.string(),
    fecha: z.date(),
  }),
});

// Serie "Creando una app desde cero": un artículo por episodio de video.
const serieCollection = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/serie" }),
  schema: z.object({
    title: z.string(),
    descripcion: z.string(),
    episodio: z.number(),
    fecha: z.date(),
    imagen: z.string(),
    imagenAlt: z.string(),
    stack: z.array(z.string()),
    pregunta: z.string(),
  }),
});

export const collections = {
  blog: blogCollection,
  serie: serieCollection,
};
