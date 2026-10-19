import { useEffect, useState } from "react";
import type { Project } from "../../types/Project";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
        body: JSON.stringify({ title, description, repoUrl, liveUrl }),
      });
      if (!response.ok) {
        setError("No se pudo crear el proyecto. Revisá los datos.");
        return;
      }
      setTitle("");
      setDescription("");
      setRepoUrl("");
      setLiveUrl("");
      loadProjects();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
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
        {projects.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <p className="text-muted-foreground text-sm">
              Sin proyectos todavía. Crea el primero arriba.
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] hover:-translate-y-px transition-all duration-200 border-border">
              <CardContent className="flex items-center justify-between p-4">
                <span className="text-sm font-medium text-foreground">{project.title}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deletingId === project.id}
                  onClick={() => handleDelete(project.id)}
                  className="min-h-9 px-3 hover:-translate-y-px transition-all duration-200 active:translate-y-0"
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
