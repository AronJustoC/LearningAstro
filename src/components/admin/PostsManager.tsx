import { useEffect, useState } from "react";
import type { Post } from "../../types/Post";
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
  }

  async function handleDelete(id: number) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!response.ok) {
      setError("No se pudo borrar el post (¿sos ADMIN?).");
      return;
    }
    loadPosts();
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo post</CardTitle>
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
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="content">Contenido</Label>
              <Textarea
                id="content"
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <Button type="submit">Crear post</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Posts existentes</h2>
        {posts.length === 0 && (
          <p className="text-muted-foreground text-sm">
            Sin posts todavía.
          </p>
        )}
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="flex items-center justify-between">
              <span className="text-sm font-medium">{post.title}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(post.id)}
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
