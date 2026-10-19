import { useEffect, useState } from "react";
import type { Post } from "../../types/Post";
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

const API_URL = `${import.meta.env.PUBLIC_API_BASE_URL}/posts`;

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export default function PostsManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadPosts() {
    const response = await fetch(API_URL, { headers: authHeaders() });
    const data = await response.json();
    setPosts(data.posts ?? []);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ title, slug, content }),
      });
      if (!response.ok) {
        setError("No se pudo crear el post. Revisá los datos.");
        return;
      }
      setTitle("");
      setSlug("");
      setContent("");
      loadPosts();
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
        setError("No se pudo borrar el post (¿sos ADMIN?).");
        return;
      }
      loadPosts();
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
          <CardTitle className="text-xl font-semibold">Nuevo post</CardTitle>
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
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                required
                disabled={loading}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="min-h-10 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="content">Contenido</Label>
              <Textarea
                id="content"
                required
                disabled={loading}
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="transition-colors focus-visible:ring-2 focus-visible:ring-ring"
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
                "Crear post"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Posts existentes</h2>
        {posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <p className="text-muted-foreground text-sm">
              Sin posts todavía. Crea el primero arriba.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] hover:-translate-y-px transition-all duration-200 border-border">
              <CardContent className="flex items-center justify-between p-4">
                <span className="text-sm font-medium text-foreground">{post.title}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deletingId === post.id}
                  onClick={() => handleDelete(post.id)}
                  className="min-h-9 px-3 hover:-translate-y-px transition-all duration-200 active:translate-y-0"
                >
                  {deletingId === post.id ? (
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
