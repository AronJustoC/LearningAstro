import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { featuredProjects } from "../data/projects";

const SITE = "https://aronjusto.site";

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

interface Entry {
  path: string;
  lastmod?: string;
}

export const GET: APIRoute = async () => {
  const entries: Entry[] = [
    { path: "/" },
    { path: "/proyectos" },
    { path: "/blog" },
    { path: "/contacto" },
    ...featuredProjects
      .filter((project) => project.slug)
      .map((project) => ({ path: `/proyectos/${project.slug}` })),
  ];

  for (const articulo of await getCollection("serie")) {
    entries.push({
      path: `/blog/serie/${articulo.id}`,
      lastmod: articulo.data.fecha.toISOString().slice(0, 10),
    });
  }

  // Posts de la API: si el backend no responde, el mapa sigue siendo válido sin ellos.
  try {
    const apiBaseUrl = process.env.API_BASE_URL ?? import.meta.env.API_BASE_URL;
    const response = await fetch(`${apiBaseUrl}/posts/public`, { signal: AbortSignal.timeout(3000) });
    if (response.ok) {
      const { posts = [] } = await response.json();
      for (const post of posts as { slug: string; updatedAt?: string; createdAt?: string }[]) {
        const fecha = post.updatedAt ?? post.createdAt;
        entries.push({
          path: `/blog/${post.slug}`,
          lastmod: fecha ? new Date(fecha).toISOString().slice(0, 10) : undefined,
        });
      }
    }
  } catch (error) {
    console.error("Sitemap: no se pudieron leer los posts de la API:", error);
  }

  const urls = entries
    .map(
      ({ path, lastmod }) =>
        `  <url>\n    <loc>${escapeXml(SITE + path)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n  </url>`,
    )
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } },
  );
};
