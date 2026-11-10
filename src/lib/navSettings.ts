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
    const base = import.meta.env.PUBLIC_API_BASE_URL;
    const res = await fetch(`${base}/settings/nav`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return ALL_TRUE;

    const data = await res.json();
    const tabs = data?.tabs;
    if (!tabs || typeof tabs !== "object") return ALL_TRUE;

    const keys: (keyof NavTabs)[] = ["proyectos", "tienda", "blog", "cursos"];
    const result = { ...ALL_TRUE };
    for (const key of keys) {
      if (typeof tabs[key] !== "boolean") return ALL_TRUE;
      result[key] = tabs[key];
    }
    return result;
  } catch {
    return ALL_TRUE;
  }
}
