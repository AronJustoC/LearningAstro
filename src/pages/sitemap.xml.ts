import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { featuredProjects } from "../data/projects";
import { loadCatalog, type Catalog } from "../lib/store/catalog";
import { apiBase } from "../lib/api";

const SITE = "https://aronjusto.site";

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

interface Entry {
  path: string;
  lastmod?: string;
}

export const GET: APIRoute = async () => {
  // Catálogo de la API: si el backend no responde, el mapa sigue siendo válido sin él.
  let catalog: Catalog = { products: [], categories: [] };
  try {
    catalog = await loadCatalog();
  } catch (error) {
    console.error("Sitemap: no se pudo leer el catálogo de la tienda:", error);
  }

  const entries: Entry[] = [
    { path: "/" },
    { path: "/proyectos" },
    { path: "/blog" },
    { path: "/contacto" },
    { path: "/tienda" },
    { path: "/cursos" },
    ...featuredProjects
      .filter((project) => project.slug)
      .map((project) => ({ path: `/proyectos/${project.slug}` })),
    ...catalog.categories.map((category) => ({ path: `/tienda/${category.slug}` })),
    ...catalog.products.map((product) => ({ path: `/tienda/producto/${product.slug}` })),
  ];

  for (const articulo of await getCollection("serie")) {
    entries.push({
      path: `/blog/serie/${articulo.id}`,
      lastmod: articulo.data.fecha.toISOString().slice(0, 10),
    });
  }

  // Posts de la API: si el backend no responde, el mapa sigue siendo válido sin ellos.
  try {
    const apiBaseUrl = apiBase();
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

  // Cursos publicados de la API: si el backend no responde, el mapa sigue siendo válido sin ellos.
  try {
    const apiBaseUrl = apiBase();
    const response = await fetch(`${apiBaseUrl}/courses/public`, { signal: AbortSignal.timeout(3000) });
    if (response.ok) {
      const { courses = [] } = await response.json();
      for (const course of courses as { slug: string }[]) {
        entries.push({ path: `/cursos/${course.slug}` });
      }
    }
  } catch (error) {
    console.error("Sitemap: no se pudieron leer los cursos de la API:", error);
  }

  // Productos activos de la tienda: si el backend no responde, el mapa sigue siendo válido sin ellos.
  try {
    const apiBaseUrl = apiBase();
    const response = await fetch(`${apiBaseUrl}/store/products`, { signal: AbortSignal.timeout(3000) });
    if (response.ok) {
      const { products = [] } = await response.json();
      for (const product of products as { slug: string }[]) {
        entries.push({ path: `/tienda/producto/${product.slug}` });
      }
    }
  } catch (error) {
    console.error("Sitemap: no se pudieron leer los productos de la API:", error);
  }

  // El catálogo y /store/products pueden devolver el mismo producto: una sola <loc> por ruta.
  const uniqueEntries = [
    ...new Map(entries.map((entry): [string, Entry] => [entry.path, entry])).values(),
  ];

  const urls = uniqueEntries
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
