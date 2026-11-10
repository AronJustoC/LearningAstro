import { useEffect, useState } from "react";

// Acento = --color-action. "default" quita el override y vuelven los tokens del tema (azul señal).
const ACCENTS = [
  { id: "default", label: "Azul señal", color: "#0a74b3" },
  { id: "coral", label: "Coral", color: "#e4572e" },
  { id: "verde", label: "Verde", color: "#1b998b" },
  { id: "violeta", label: "Violeta", color: "#6d4ccf" },
  { id: "ambar", label: "Ámbar", color: "#d99a06" },
] as const;

const KEY = "accent";

const apply = (id: string) => {
  const root = document.documentElement.style;
  const hit = ACCENTS.find((a) => a.id === id);
  if (!hit || id === "default") {
    root.removeProperty("--color-action");
    root.removeProperty("--focus-color");
    root.removeProperty("--color-on-action");
    return;
  }
  root.setProperty("--color-action", hit.color);
  root.setProperty("--focus-color", hit.color);
  root.setProperty("--color-on-action", "#ffffff");
};

export default function AccentPicker() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("default");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        setCurrent(saved);
        apply(saved);
      }
    } catch {}
  }, []);

  const choose = (id: string) => {
    setCurrent(id);
    apply(id);
    try {
      localStorage.setItem(KEY, id);
    } catch {}
    setOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col-reverse items-center gap-2">
      <button
        type="button"
        aria-expanded={open}
        aria-label="Cambiar color de acento"
        onClick={() => setOpen((v) => !v)}
        className="h-11 w-11 rounded-full border border-[var(--hairline)] bg-[var(--color-bg)] shadow-[var(--shadow-soft)] grid place-items-center"
      >
        <span className="h-4 w-4 rounded-full" style={{ background: "var(--color-action)" }} aria-hidden="true" />
      </button>
      {open && (
        <div role="radiogroup" aria-label="Color de acento" className="flex flex-col gap-2 rounded-full border border-[var(--hairline)] bg-[var(--color-bg)] p-2 shadow-[var(--shadow-soft)]">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              type="button"
              role="radio"
              aria-checked={current === a.id}
              aria-label={a.label}
              onClick={() => choose(a.id)}
              className="h-7 w-7 rounded-full ring-offset-2 ring-offset-[var(--color-bg)] aria-checked:ring-2 aria-checked:ring-[var(--color-text)]"
              style={{ background: a.color }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
