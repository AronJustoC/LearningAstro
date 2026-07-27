import { useEffect, useState } from "react";
import type { Project } from "../../types/Project";
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
  }

  async function handleDelete(id: number) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!response.ok) {
      setError("No se pudo borrar el proyecto (¿sos ADMIN?).");
      return;
    }
    loadProjects();
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="repoUrl">Repo URL</Label>
              <Input
                id="repoUrl"
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="liveUrl">Live URL</Label>
              <Input
                id="liveUrl"
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
              />
            </div>
            <Button type="submit">Crear proyecto</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Proyectos existentes</h2>
        {projects.length === 0 && (
          <p className="text-muted-foreground text-sm">
            Sin proyectos todavía.
          </p>
        )}
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="flex items-center justify-between">
              <span className="text-sm font-medium">{project.title}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(project.id)}
              >
                Borrar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
