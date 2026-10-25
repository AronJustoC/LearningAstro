import type { Project } from "../types/Project";

// Proyectos destacados: se muestran cuando el backend no responde o aún no tiene proyectos.
// Textos tal como los definió el propietario; no añadir enlaces ni claims sin confirmarlos.
export const featuredProjects: Project[] = [
  {
    id: 1,
    slug: "avanzik-workspace",
    title: "Avanzik Workspace",
    description:
      "Workspace GIS/CAD para crear, organizar y exportar planos técnicos con plantillas, recursos y proyectos conectados.",
    imageUrl: "/projects/avanzik.png",
  },
  {
    id: 2,
    slug: "mbc-predictive",
    title: "MBC Predictive",
    description:
      "Sitio de MBC, especialistas en mantenimiento predictivo e ingeniería en Cusco: análisis vibracional, termografía, ultrasonido y alineamiento láser.",
    imageUrl: "/projects/mbcpredictive.png",
  },
  {
    id: 3,
    slug: "had-business",
    title: "HAD Business",
    description:
      "Tienda de hardware en Cusco: laptops, armado de PCs, repuestos de impresión y servicio técnico con envíos a todo el Perú.",
    imageUrl: "/projects/hadbusiness.png",
  },
  {
    id: 4,
    slug: "adn-muebles",
    title: "ADN Muebles",
    description:
      "Tienda de escritorios industriales de acero y terciado hechos a mano en Cusco, con entrega a domicilio y pedido por WhatsApp.",
    imageUrl: "/projects/adnmuebles.jpg",
    // Publicado en GitHub Pages por ahora; actualizar cuando tenga dominio propio.
    liveUrl: "https://aronjustoc.github.io/adn-muebles/",
  },
];

export const findFeaturedProject = (slug?: string) =>
  featuredProjects.find((project) => project.slug === slug);
