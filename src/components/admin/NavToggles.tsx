import { useEffect, useState } from "react";

type NavTabKey = "proyectos" | "tienda" | "blog" | "cursos";
type NavTabs = Record<NavTabKey, boolean>;

const TABS: { key: NavTabKey; label: string }[] = [
  { key: "proyectos", label: "Proyectos" },
  { key: "tienda", label: "Tienda" },
  { key: "blog", label: "Blog" },
  { key: "cursos", label: "Cursos" },
];

const EMPTY_TABS: NavTabs = {
  proyectos: false,
  tienda: false,
  blog: false,
  cursos: false,
};

const CONNECTION_ERROR = "No se pudo conectar con el servidor.";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function errorMessage(err: unknown): string {
  return err instanceof Error && err.message ? err.message : CONNECTION_ERROR;
}

type Props = { apiBaseUrl: string };

export default function NavToggles({ apiBaseUrl }: Props) {
  const apiUrl = `${apiBaseUrl}/settings/nav`;
  const [tabs, setTabs] = useState<NavTabs>(EMPTY_TABS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingKey, setSavingKey] = useState<NavTabKey | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const response = await fetch(apiUrl, { headers: authHeaders() });
        if (!response.ok) {
          throw new Error("No se pudo cargar la configuración.");
        }
        const data = await response.json();
        if (active) {
          setTabs({ ...EMPTY_TABS, ...(data.tabs ?? {}) });
          setError("");
        }
      } catch (err) {
        if (active) setError(errorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [apiUrl]);

  async function handleToggle(key: NavTabKey) {
    if (savingKey !== null) return;

    const previous = tabs[key];
    const next = !previous;
    setTabs((prev) => ({ ...prev, [key]: next }));
    setSavingKey(key);
    setError("");

    try {
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ tabs: { [key]: next } }),
      });
      if (!response.ok) {
        throw new Error("No se pudo guardar el cambio.");
      }
      const data = await response.json();
      if (data?.tabs) {
        setTabs({ ...EMPTY_TABS, ...data.tabs });
      }
    } catch (err) {
      setTabs((prev) => ({ ...prev, [key]: previous }));
      setError(errorMessage(err));
    } finally {
      setSavingKey(null);
    }
  }

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground" aria-busy="true">
        Cargando configuración...
      </p>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {error && (
        <div
          role="alert"
          className="rounded-[2px] border border-[var(--destructive)] px-4 py-3 text-sm text-[var(--destructive)]"
        >
          {error}
        </div>
      )}

      <ul className="divide-y divide-border rounded-[2px] border border-border">
        {TABS.map(({ key, label }) => {
          const checked = tabs[key];
          const saving = savingKey === key;
          return (
            <li
              key={key}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <span className="text-sm font-medium text-foreground">{label}</span>
              <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={`Mostrar ${label}`}
                disabled={saving}
                onClick={() => handleToggle(key)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors disabled:opacity-50 ${
                  checked
                    ? "border-[var(--color-action)] bg-[var(--color-action)]"
                    : "border-border bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    checked ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
