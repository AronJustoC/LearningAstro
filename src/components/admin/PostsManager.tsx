import { useEffect, useState } from "react";
import type { Post } from "../../types/Post";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ImageUploadField from "./ImageUploadField";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [imageUrl, setImageUrl] = useState("");
  const [publicado, setPublicado] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

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
        body: JSON.stringify({
          title,
          slug,
          content,
          imageUrl: imageUrl || undefined,
          publicado,
        }),
      });
      if (!response.ok) {
        setError("No se pudo crear el post. Revisá los datos.");
        return;
      }
      setTitle("");
      setSlug("");
      setContent("");
      setImageUrl("");
      setPublicado(true);
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

  async function handleEditStart(post: Post) {
    setError("");
    setEditing(post);
    setEditTitle(post.title);
    setEditSlug(post.slug);
    setEditContent(post.content);
    setEditImageUrl(post.imageUrl ?? "");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setError("");
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/${editing.id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({
          title: editTitle,
          slug: editSlug,
          content: editContent,
          imageUrl: editImageUrl || null,
        }),
      });
      if (response.status === 409) {
        setError("El slug ya existe.");
        return;
      }
      if (!response.ok) {
        setError("No se pudo guardar el post. Revisá los datos.");
        return;
      }
      setPosts((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? {
                ...p,
                title: editTitle,
                slug: editSlug,
                content: editContent,
                imageUrl: editImageUrl || null,
              }
            : p,
        ),
      );
      setEditing(null);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleVisibility(post: Post) {
    setError("");
    setTogglingId(post.id);
    const next = !post.publicado;
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, publicado: next } : p)),
    );
    try {
      const response = await fetch(`${API_URL}/${post.id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ publicado: next }),
      });
      if (!response.ok) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === post.id ? { ...p, publicado: post.publicado } : p,
          ),
        );
        setError("No se pudo cambiar la visibilidad del post.");
      }
    } catch {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, publicado: post.publicado } : p,
        ),
      );
      setError("No se pudo conectar con el servidor.");
    } finally {
      setTogglingId(null);
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
            <ImageUploadField
              value={imageUrl}
              onChange={setImageUrl}
              label="Imagen"
            />
            <label
              htmlFor="publicado"
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <input
                id="publicado"
                type="checkbox"
                checked={publicado}
                disabled={loading}
                onChange={(e) => setPublicado(e.target.checked)}
                className="size-4 accent-[var(--color-action)]"
              />
              Visible en el blog
            </label>
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
            <Card key={post.id} className="rounded-[2px] border-[var(--hairline)] shadow-none">
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="truncate font-semibold text-foreground">
                    {post.title}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      post.publicado
                        ? "bg-[color-mix(in_srgb,var(--color-action)_12%,transparent)] text-[var(--color-action)]"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {post.publicado ? "Visible" : "Oculto"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditStart(post)}
                    className="min-h-9 px-3"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={togglingId === post.id}
                    onClick={() => handleToggleVisibility(post)}
                    className="min-h-9 px-3"
                  >
                    {togglingId === post.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : post.publicado ? (
                      "Ocultar"
                    ) : (
                      "Mostrar"
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={deletingId === post.id}
                    onClick={() => handleDelete(post.id)}
                    className="min-h-9 px-3 text-[var(--destructive)] hover:bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] hover:text-[var(--destructive)]"
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
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar post</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} aria-busy={saving} className="space-y-4">
            {error && (
              <Alert variant="destructive" role="alert">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                required
                disabled={saving}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="min-h-10 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-slug">Slug</Label>
              <Input
                id="edit-slug"
                required
                disabled={saving}
                value={editSlug}
                onChange={(e) => setEditSlug(e.target.value)}
                className="min-h-10 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-content">Contenido</Label>
              <Textarea
                id="edit-content"
                required
                disabled={saving}
                rows={4}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <ImageUploadField
              value={editImageUrl}
              onChange={setEditImageUrl}
              label="Imagen"
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => setEditing(null)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="min-h-10 px-5 text-[var(--color-on-action)] font-medium bg-[var(--color-action)] hover:bg-[var(--color-action)]/90 hover:-translate-y-px shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring active:translate-y-0"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Guardando...
                  </span>
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
