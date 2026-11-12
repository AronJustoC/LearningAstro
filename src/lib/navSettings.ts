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

export async function getNavTabs(): Promise<NavTabs> {
  try {
    const base = process.env.API_BASE_URL ?? import.meta.env.API_BASE_URL;
    const res = await fetch(`${base}/settings/nav`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      console.error(`getNavTabs: ${base}/settings/nav respondió ${res.status}, se muestran todas las pestañas`);
      return ALL_TRUE;
    }

    const data = await res.json();
    const tabs = data?.tabs;
    if (!tabs || typeof tabs !== "object") {
      console.error("getNavTabs: respuesta sin tabs válidos, se muestran todas las pestañas");
      return ALL_TRUE;
    }

    const keys: (keyof NavTabs)[] = ["proyectos", "tienda", "blog", "cursos"];
    const result = { ...ALL_TRUE };
    for (const key of keys) {
      if (typeof tabs[key] !== "boolean") {
        console.error(`getNavTabs: pestaña "${key}" no es booleana, se muestran todas las pestañas`);
        return ALL_TRUE;
      }
      result[key] = tabs[key];
    }
    return result;
  } catch (err) {
    console.error("getNavTabs: no se pudo leer la configuración de navegación, se muestran todas las pestañas", err);
    return ALL_TRUE;
  }
}
