import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { readRole } from "@/lib/session";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      if (response.status === 401) {
        setError("Email o contraseña incorrectos.");
        return;
      }

      if (!response.ok) {
        setError(`No pudimos iniciar sesión (error ${response.status}). Intenta de nuevo.`);
        return;
      }

      const data = await response.json();
      const accessToken = data.token.token;

      localStorage.setItem("accessToken", accessToken);
      document.cookie = `token=${accessToken}; path=/; max-age=3600`;

      window.location.href =
        readRole(accessToken) === "ADMIN" ? "/admin/dashboard" : "/mis-cursos";
    } catch {
      setError("No se pudo conectar con el servidor. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-busy={loading} className="flex flex-col gap-5">
      {error && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className="text-sm font-semibold">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(error)}
          disabled={loading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-11 rounded-[2px] border-[var(--hairline)] bg-transparent px-3 text-base transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password" className="text-sm font-semibold">
          Contraseña
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            aria-invalid={Boolean(error)}
            disabled={loading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-11 rounded-[2px] border-[var(--hairline)] bg-transparent px-3 pr-12 text-base transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            disabled={loading}
            className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-[2px] text-[var(--color-text)]/70 transition-colors hover:text-[var(--color-text)] focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="display mt-1 min-h-11 w-full rounded-[2px] bg-[var(--color-action)] text-base uppercase tracking-wide text-[var(--color-on-action)] transition-colors hover:bg-[var(--color-action)]/90 focus-visible:ring-2 focus-visible:ring-ring"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Ingresando…
          </span>
        ) : (
          "Iniciar sesión"
        )}
      </Button>
    </form>
  );
}
