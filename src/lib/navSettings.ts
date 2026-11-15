export interface NavTabs {
  proyectos: boolean;
  tienda: boolean;
  blog: boolean;
  cursos: boolean;
}

const ALL_TRUE: NavTabs = {
  proyectos: true,
  tienda: true,
  blog: true,
  cursos: true,
};

// Cada render de página pedía esta config al API. Se cachea unos minutos para no gastar el límite
// de peticiones. Solo se guarda una respuesta válida: un fallo se reintenta en la siguiente petición.
const CACHE_TTL_MS = 2 * 60 * 1000;
let cache: { tabs: NavTabs; at: number } | null = null;

async function fetchNavTabs(): Promise<NavTabs | null> {
  try {
    const base = process.env.API_BASE_URL ?? import.meta.env.API_BASE_URL;
    const res = await fetch(`${base}/settings/nav`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      console.error(`getNavTabs: ${base}/settings/nav respondió ${res.status}, se muestran todas las pestañas`);
      return null;
    }

    const data = await res.json();
    const tabs = data?.tabs;
    if (!tabs || typeof tabs !== "object") {
      console.error("getNavTabs: respuesta sin tabs válidos, se muestran todas las pestañas");
      return null;
    }

    const keys: (keyof NavTabs)[] = ["proyectos", "tienda", "blog", "cursos"];
    const result = { ...ALL_TRUE };
    for (const key of keys) {
      if (typeof tabs[key] !== "boolean") {
        console.error(`getNavTabs: pestaña "${key}" no es booleana, se muestran todas las pestañas`);
        return null;
      }
      result[key] = tabs[key];
    }
    return result;
  } catch (err) {
    console.error("getNavTabs: no se pudo leer la configuración de navegación, se muestran todas las pestañas", err);
    return null;
  }
}

export async function getNavTabs(): Promise<NavTabs> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.tabs;

  const tabs = await fetchNavTabs();
  if (!tabs) return ALL_TRUE;

  cache = { tabs, at: Date.now() };
  return tabs;
}
