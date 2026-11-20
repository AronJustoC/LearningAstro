// Único punto de configuración de la API y de la sesión. Server (SSR) y navegador leen variables distintas:
// en SSR se usa API_BASE_URL en runtime; en el navegador, PUBLIC_API_BASE_URL se inyecta en build time.

const isBrowser = () => typeof window !== "undefined";

// Base sin barra final: ej. http://api:4000/api en SSR o https://api.../api en el navegador.
export function apiBase(): string {
  return isBrowser()
    ? (import.meta.env.PUBLIC_API_BASE_URL as string)
    : ((process.env.API_BASE_URL ?? import.meta.env.API_BASE_URL) as string);
}

export function apiUrl(path: string): string {
  return `${apiBase()}${path.startsWith("/") ? path : `/${path}`}`;
}

// Guarda el par de tokens que devuelve el login o el refresh: { token, refresh_token }.
export function saveSession(tokens: { token: string; refresh_token: string }) {
  try {
    localStorage.setItem("accessToken", tokens.token);
    localStorage.setItem("refreshToken", tokens.refresh_token);
  } catch {
    // localStorage bloqueado: la sesion solo dura lo que dura la cookie.
  }
  // Cookie para el SSR (las paginas /admin leen el rol al cargar). Secure solo fuera de localhost.
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `token=${tokens.token}; path=/; max-age=3600; SameSite=Strict${secure}`;
}

export function clearSession() {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  } catch {
    // Sin localStorage no hay nada que limpiar.
  }
  document.cookie = "token=; path=/; max-age=0; SameSite=Strict";
}

export function authHeaders(): Record<string, string> {
  if (!isBrowser()) return {};
  try {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

// Un solo refresh en vuelo aunque varias peticiones reciban 401 a la vez.
let refreshing: Promise<boolean> | null = null;

export function refreshSession(): Promise<boolean> {
  if (!refreshing) {
    refreshing = (async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return false;
      const res = await fetch(apiUrl("/auth/refresh"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) {
        clearSession();
        return false;
      }
      saveSession(await res.json());
      return true;
    })().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}

// fetch con token y, si la API responde 401, un intento de refresh y repetir la peticion una vez.
export async function apiFetch(path: string, init: RequestInit = {}, retry = true): Promise<Response> {
  const headers = { "Content-Type": "application/json", ...authHeaders(), ...(init.headers as Record<string, string>) };
  const res = await fetch(apiUrl(path), { ...init, headers });
  if (res.status !== 401 || !retry || !isBrowser()) return res;
  const refreshed = await refreshSession();
  return refreshed ? apiFetch(path, init, false) : res;
}
