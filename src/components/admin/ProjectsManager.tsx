import { useEffect, useState } from "react";
import type { Project } from "../../types/Project";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ImageUploadField from "./ImageUploadField";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const API_URL = `${import.meta.env.PUBLIC_API_BASE_URL}/projects`;

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadProjects() {
    const response = await fetch(API_URL, { headers: authHeaders() });
    const data = await response.json();
    setProjects(data.projects ?? []);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          title,
          description,
          repoUrl,
          liveUrl,
          imageUrl: imageUrl || undefined,
        }),
      });
      if (!response.ok) {
        setError("No se pudo crear el proyecto. Revisá los datos.");
        return;
      }
      setTitle("");
      setDescription("");
      setRepoUrl("");
      setLiveUrl("");
      setImageUrl("");
      loadProjects();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function savePortada(project: Project, destacadoPortada: boolean, ordenPortada: number) {
    setError("");
    const others = projects.filter((p) => p.id !== project.id && p.destacadoPortada).length;
    if (destacadoPortada && others >= 3) {
      setError("Máximo 3 proyectos en la portada.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/${project.id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ destacadoPortada, ordenPortada: destacadoPortada ? ordenPortada : null }),
      });
      if (!response.ok) {
        setError("No se pudo guardar la portada.");
        return;
      }
      loadProjects();
    } catch {
      setError("No se pudo conectar con el servidor.");
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!response.ok) {
        setError("No se pudo borrar el proyecto (¿sos ADMIN?).");
        return;
      }
      loadProjects();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <Card className="shadow-[var(--shadow-soft)] border-border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Nuevo proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} aria-busy={loading} className="space-y-4">
            {error && (
              <Alert variant="destructive" role="alert">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                required
                disabled={loading}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="min-h-10 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                rows={3}
                disabled={loading}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="repoUrl">Repo URL</Label>
              <Input
                id="repoUrl"
                type="url"
                disabled={loading}
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="min-h-10 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="liveUrl">Live URL</Label>
              <Input
                id="liveUrl"
                type="url"
                disabled={loading}
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className="min-h-10 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <ImageUploadField
              value={imageUrl}
              onChange={setImageUrl}
              label="Imagen"
            />
            <Button
              type="submit"
              disabled={loading}
              className="min-h-10 px-5 text-[var(--color-on-action)] font-medium bg-[var(--color-action)] hover:bg-[var(--color-action)]/90 hover:-translate-y-px shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring active:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Creando...
                </span>
              ) : (
                "Crear proyecto"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Proyectos existentes</h2>
        {error && (
          <Alert variant="destructive" role="alert">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {projects.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <p className="text-muted-foreground text-sm">
              Sin proyectos todavía. Crea el primero arriba.
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="rounded-[2px] border-[var(--hairline)] shadow-none">
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <span className="font-semibold text-foreground">{project.title}</span>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-muted-foreground">En portada</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-pressed={!!project.destacadoPortada}
                    onClick={() => savePortada(project, !project.destacadoPortada, project.ordenPortada ?? 1)}
                  >
                    {project.destacadoPortada ? "Sí" : "No"}
                  </Button>
                  {project.destacadoPortada && (
                    <Input
                      type="number"
                      min={1}
                      max={3}
                      aria-label="Orden"
                      title="Orden"
                      defaultValue={project.ordenPortada ?? 1}
                      onBlur={(e) => {
                        const n = Math.min(3, Math.max(1, Number(e.target.value) || 1));
                        if (n !== project.ordenPortada) savePortada(project, true, n);
                      }}
                      className="w-16 min-h-9"
                    />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={deletingId === project.id}
                  onClick={() => handleDelete(project.id)}
                  className="min-h-9 px-3 text-[var(--destructive)] hover:bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] hover:text-[var(--destructive)]"
                >
                  {deletingId === project.id ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="size-3.5 animate-spin" />
                      Borrando...
                    </span>
                  ) : (
                    "Borrar"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
