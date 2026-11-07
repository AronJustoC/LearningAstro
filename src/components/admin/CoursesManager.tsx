import { useEffect, useState } from "react";
import type { Course, Lesson } from "../../types/Course";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
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

const API_URL = `${import.meta.env.PUBLIC_API_BASE_URL}/courses`;

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function parseDuration(text: string): number | undefined {
  const trimmed = text.trim();
  if (!trimmed) return undefined;
  const parts = trimmed.split(":");
  if (parts.length > 3) return undefined;
  if (!parts.every((part) => /^\d+$/.test(part.trim()))) return undefined;
  const nums = parts.map((part) => Number(part.trim()));
  if (parts.length === 1) return nums[0];
  if (parts.length === 2) {
    if (nums[1] >= 60) return undefined;
    return nums[0] * 60 + nums[1];
  }
  if (nums[1] >= 60 || nums[2] >= 60) return undefined;
  return nums[0] * 3600 + nums[1] * 60 + nums[2];
}

function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

export default function CoursesManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [publicado, setPublicado] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [expandedCourse, setExpandedCourse] = useState<Course | null>(null);
  const [loadingExpanded, setLoadingExpanded] = useState(false);

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonOrden, setLessonOrden] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonAttachmentUrl, setLessonAttachmentUrl] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");
  const [lessonChapters, setLessonChapters] = useState<
    { time: string; title: string }[]
  >([]);
  const [lessonError, setLessonError] = useState("");
  const [lessonLoading, setLessonLoading] = useState(false);
  const [deletingLessonId, setDeletingLessonId] = useState<number | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);

  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [courseEdit, setCourseEdit] = useState({
    title: "",
    slug: "",
    description: "",
    imageUrl: "",
    publicado: false,
  });
  const [courseEditError, setCourseEditError] = useState("");
  const [savingCourse, setSavingCourse] = useState(false);

  async function loadCourses() {
    try {
      const response = await fetch(API_URL, { headers: authHeaders() });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setError("Tu sesión expiró. Vuelve a iniciar sesión.");
          return;
        }
        setError("No se pudo cargar los cursos.");
        return;
      }
      const data = await response.json();
      setCourses(data.courses ?? []);
      setError("");
    } catch {
      setError("No se pudo conectar con el servidor.");
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourseDetails(id: number) {
    setLoadingExpanded(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, { headers: authHeaders() });
      if (response.ok) {
        const data = await response.json();
        const courseData: Course = data.course ?? data;
        if (courseData.lessons) {
          courseData.lessons.sort((a, b) => a.orden - b.orden);
        }
        setExpandedCourse(courseData);
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoadingExpanded(false);
    }
  }

  function handleToggleExpand(id: number) {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedCourse(null);
    } else {
      setExpandedId(id);
      loadCourseDetails(id);
    }
    resetLessonForm();
    setEditingCourseId(null);
  }

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
          description: description || undefined,
          imageUrl: imageUrl || undefined,
          publicado,
        }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          setError("Ya existe un curso con ese slug.");
        } else {
          setError("No se pudo guardar. Revisá los datos.");
        }
        return;
      }

      setTitle("");
      setSlug("");
      setDescription("");
      setImageUrl("");
      setPublicado(false);
      loadCourses();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function handleTogglePublish(course: Course) {
    setActionId(course.id);
    try {
      const response = await fetch(`${API_URL}/${course.id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ publicado: !course.publicado }),
      });
      if (!response.ok) {
        setError("No se pudo guardar. Revisá los datos.");
        return;
      }
      await loadCourses();
      if (expandedId === course.id) {
        await loadCourseDetails(course.id);
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setActionId(null);
    }
  }

  async function handleDeleteCourse(id: number) {
    setActionId(id);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!response.ok) {
        setError("No se pudo guardar. Revisá los datos.");
        return;
      }
      if (expandedId === id) {
        setExpandedId(null);
        setExpandedCourse(null);
      }
      loadCourses();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setActionId(null);
    }
  }

  function addChapterRow() {
    setLessonChapters((prev) => [...prev, { time: "", title: "" }]);
  }

  function updateChapterRow(
    index: number,
    field: "time" | "title",
    value: string,
  ) {
    setLessonChapters((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  }

  function removeChapterRow(index: number) {
    setLessonChapters((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleCreateLesson(e: React.FormEvent) {
    e.preventDefault();
    if (!expandedId) return;
    setLessonError("");

    const duration = parseDuration(lessonDuration);
    if (lessonDuration.trim() && duration === undefined) {
      setLessonError("La duración debe tener el formato mm:ss o h:mm:ss.");
      return;
    }

    const chapters: { time: number; title: string }[] = [];
    for (const row of lessonChapters) {
      const timeText = row.time.trim();
      const titleText = row.title.trim();
      if (!timeText && !titleText) continue;
      if (!titleText) {
        setLessonError("Cada capítulo con tiempo necesita un título.");
        return;
      }
      if (!timeText) {
        setLessonError("Cada capítulo necesita un tiempo válido (mm:ss).");
        return;
      }
      const time = parseDuration(timeText);
      if (time === undefined) {
        setLessonError(
          "El tiempo del capítulo debe tener el formato mm:ss o h:mm:ss.",
        );
        return;
      }
      chapters.push({ time, title: titleText });
    }

    setLessonLoading(true);

    try {
      const body: Record<string, unknown> = {
        title: lessonTitle,
        orden: Number(lessonOrden),
        content: lessonContent,
      };
      if (editingLessonId !== null) {
        // En edición, vacío significa borrar el valor: se envía null.
        body.videoUrl = lessonVideoUrl || null;
        body.attachmentUrl = lessonAttachmentUrl || null;
        body.duration = duration ?? null;
      } else {
        if (lessonVideoUrl) body.videoUrl = lessonVideoUrl;
        if (lessonAttachmentUrl) body.attachmentUrl = lessonAttachmentUrl;
        if (duration !== undefined) body.duration = duration;
      }
      if (editingLessonId !== null || chapters.length > 0) body.chapters = chapters;

      const lessonUrl =
        editingLessonId !== null
          ? `${API_URL}/${expandedId}/lessons/${editingLessonId}`
          : `${API_URL}/${expandedId}/lessons`;
      const response = await fetch(lessonUrl, {
        method: editingLessonId !== null ? "PATCH" : "POST",
        headers: authHeaders(),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        if (response.status === 409) {
          setLessonError("Ya existe una lección con ese orden en este curso.");
        } else {
          setLessonError("No se pudo guardar. Revisá los datos.");
        }
        return;
      }

      resetLessonForm();
      await loadCourseDetails(expandedId);
      loadCourses();
    } catch {
      setLessonError("No se pudo conectar con el servidor.");
    } finally {
      setLessonLoading(false);
    }
  }

  async function handleDeleteLesson(lessonId: number) {
    if (!expandedId) return;
    setDeletingLessonId(lessonId);
    try {
      const response = await fetch(`${API_URL}/${expandedId}/lessons/${lessonId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!response.ok) {
        setLessonError("No se pudo guardar. Revisá los datos.");
        return;
      }
      await loadCourseDetails(expandedId);
      loadCourses();
    } catch {
      setLessonError("No se pudo conectar con el servidor.");
    } finally {
      setDeletingLessonId(null);
    }
  }

  function resetLessonForm() {
    setEditingLessonId(null);
    setLessonTitle("");
    setLessonOrden("");
    setLessonContent("");
    setLessonVideoUrl("");
    setLessonAttachmentUrl("");
    setLessonDuration("");
    setLessonChapters([]);
    setLessonError("");
  }

  function startEditLesson(lesson: Lesson) {
    setEditingLessonId(lesson.id);
    setLessonTitle(lesson.title);
    setLessonOrden(String(lesson.orden));
    setLessonContent(lesson.content ?? "");
    setLessonVideoUrl(lesson.videoUrl ?? "");
    setLessonAttachmentUrl(lesson.attachmentUrl ?? "");
    setLessonDuration(lesson.duration != null ? formatDuration(lesson.duration) : "");
    setLessonChapters(
      (lesson.chapters ?? []).map((chapter) => ({
        time: formatDuration(chapter.time),
        title: chapter.title,
      })),
    );
    setLessonError("");
  }

  function startEditCourse(course: Course) {
    setEditingCourseId(course.id);
    setCourseEdit({
      title: course.title,
      slug: course.slug,
      description: course.description ?? "",
      imageUrl: course.imageUrl ?? "",
      publicado: course.publicado,
    });
    setCourseEditError("");
  }

  async function handleSaveCourse(e: React.FormEvent) {
    e.preventDefault();
    if (editingCourseId === null) return;
    setCourseEditError("");
    setSavingCourse(true);

    try {
      const body: Record<string, unknown> = {
        title: courseEdit.title,
        slug: courseEdit.slug,
        description: courseEdit.description,
        publicado: courseEdit.publicado,
      };
      body.imageUrl = courseEdit.imageUrl || null;

      const response = await fetch(`${API_URL}/${editingCourseId}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        if (response.status === 409) {
          setCourseEditError("Ya existe un curso con ese slug.");
        } else {
          setCourseEditError("No se pudieron guardar los cambios. Revisa los datos.");
        }
        return;
      }

      const id = editingCourseId;
      setEditingCourseId(null);
      await loadCourses();
      if (expandedId === id) {
        await loadCourseDetails(id);
      }
    } catch {
      setCourseEditError("No se pudo conectar con el servidor.");
    } finally {
      setSavingCourse(false);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <Card className="shadow-[var(--shadow-soft)] border-border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Nuevo curso</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} aria-busy={loading} className="space-y-4">
            {error && (
              <Alert variant="destructive" role="alert">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="course-title">Título</Label>
              <Input
                id="course-title"
                required
                disabled={loading}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="min-h-10 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="course-slug">Slug</Label>
              <Input
                id="course-slug"
                required
                disabled={loading}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="min-h-10 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="course-desc">Descripción</Label>
              <Textarea
                id="course-desc"
                disabled={loading}
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <ImageUploadField
              idPrefix="course-"
              value={imageUrl}
              onChange={setImageUrl}
              label="Imagen"
            />
            <div className="flex items-center gap-2 pt-1">
              <input
                id="course-publicado"
                type="checkbox"
                checked={publicado}
                onChange={(e) => setPublicado(e.target.checked)}
                disabled={loading}
                className="size-4 rounded border-border text-[var(--color-action)] focus:ring-ring"
              />
              <Label htmlFor="course-publicado" className="cursor-pointer text-sm font-medium">
                Publicado
              </Label>
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
                "Crear curso"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Cursos existentes</h2>
        {courses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <p className="text-muted-foreground text-sm">
              Sin cursos todavía. Crea el primero arriba.
            </p>
          </div>
        ) : (
          courses.map((course) => {
            const isExpanded = expandedId === course.id;
            const isActing = actionId === course.id;

            return (
              <Card
                key={course.id}
                className="shadow-[var(--shadow-soft)] border-border transition-all duration-200"
              >
                <CardContent className="p-4 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={() => handleToggleExpand(course.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={isExpanded ? "Colapsar curso" : "Expandir curso"}
                      >
                        {isExpanded ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </button>
                      <span className="text-sm font-medium text-foreground truncate">
                        {course.title}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          course.publicado
                            ? "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        {course.publicado ? "Publicado" : "Borrador"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {course.lessonCount ?? 0} {course.lessonCount === 1 ? "lección" : "lecciones"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isActing}
                        onClick={() => startEditCourse(course)}
                        className="min-h-9 px-3 hover:-translate-y-px transition-all duration-200 active:translate-y-0"
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isActing}
                        onClick={() => handleTogglePublish(course)}
                        className="min-h-9 px-3 hover:-translate-y-px transition-all duration-200 active:translate-y-0"
                      >
                        {isActing ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : course.publicado ? (
                          "Despublicar"
                        ) : (
                          "Publicar"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isActing}
                        onClick={() => handleDeleteCourse(course.id)}
                        className="min-h-9 px-3 text-[var(--destructive)] hover:bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] hover:text-[var(--destructive)] hover:-translate-y-px transition-all duration-200 active:translate-y-0"
                      >
                        {isActing ? (
                          <span className="flex items-center gap-1.5">
                            <Loader2 className="size-3.5 animate-spin" />
                            Borrando...
                          </span>
                        ) : (
                          "Borrar"
                        )}
                      </Button>
                    </div>
                  </div>

                  {editingCourseId === course.id && (
                    <form onSubmit={handleSaveCourse} aria-busy={savingCourse} className="space-y-4 rounded-lg border border-border p-4 bg-card">
                      <h4 className="text-sm font-semibold text-foreground">Editar curso</h4>
                      {courseEditError && (
                        <Alert variant="destructive" role="alert">
                          <AlertDescription>{courseEditError}</AlertDescription>
                        </Alert>
                      )}
                      <div className="space-y-1.5">
                        <Label htmlFor={`edit-course-title-${course.id}`}>Título</Label>
                        <Input
                          id={`edit-course-title-${course.id}`}
                          required
                          disabled={savingCourse}
                          value={courseEdit.title}
                          onChange={(e) =>
                            setCourseEdit((p) => ({ ...p, title: e.target.value }))
                          }
                          className="min-h-10 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`edit-course-slug-${course.id}`}>Slug</Label>
                        <Input
                          id={`edit-course-slug-${course.id}`}
                          required
                          disabled={savingCourse}
                          value={courseEdit.slug}
                          onChange={(e) =>
                            setCourseEdit((p) => ({ ...p, slug: e.target.value }))
                          }
                          className="min-h-10 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`edit-course-desc-${course.id}`}>Descripción</Label>
                        <Textarea
                          id={`edit-course-desc-${course.id}`}
                          disabled={savingCourse}
                          rows={3}
                          value={courseEdit.description}
                          onChange={(e) =>
                            setCourseEdit((p) => ({
                              ...p,
                              description: e.target.value,
                            }))
                          }
                          className="transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </div>
                      <ImageUploadField
                        idPrefix={`edit-course-${course.id}-`}
                        value={courseEdit.imageUrl}
                        onChange={(url) =>
                          setCourseEdit((p) => ({ ...p, imageUrl: url }))
                        }
                        label="Imagen"
                      />
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          id={`edit-course-publicado-${course.id}`}
                          type="checkbox"
                          checked={courseEdit.publicado}
                          onChange={(e) =>
                            setCourseEdit((p) => ({
                              ...p,
                              publicado: e.target.checked,
                            }))
                          }
                          disabled={savingCourse}
                          className="size-4 rounded border-border text-[var(--color-action)] focus:ring-ring"
                        />
                        <Label
                          htmlFor={`edit-course-publicado-${course.id}`}
                          className="cursor-pointer text-sm font-medium"
                        >
                          Publicado
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="submit"
                          disabled={savingCourse}
                          className="min-h-10 px-5 text-[var(--color-on-action)] font-medium bg-[var(--color-action)] hover:bg-[var(--color-action)]/90 hover:-translate-y-px shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring active:translate-y-0"
                        >
                          {savingCourse ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="size-4 animate-spin" />
                              Guardando...
                            </span>
                          ) : (
                            "Guardar cambios"
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setEditingCourseId(null)}
                          className="min-h-10 px-4"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  )}

                  {isExpanded && (
                    <div className="pt-4 border-t border-border space-y-6">
                      {loadingExpanded ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                          <Loader2 className="size-4 animate-spin" />
                          Cargando lecciones...
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-foreground">Lecciones</h3>
                          {!expandedCourse?.lessons || expandedCourse.lessons.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic">
                              No hay lecciones registradas en este curso.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {expandedCourse.lessons.map((lesson) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center justify-between gap-3 p-2.5 rounded-md bg-muted/40 border border-border"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-background border border-border">
                                      #{lesson.orden}
                                    </span>
                                    <span className="text-sm font-medium text-foreground truncate">
                                      {lesson.title}
                                    </span>
                                    {lesson.duration != null && (
                                      <span className="text-xs text-muted-foreground shrink-0">
                                        {formatDuration(lesson.duration)}
                                      </span>
                                    )}
                                    {(lesson.chapters?.length ?? 0) > 0 && (
                                      <span className="text-xs text-muted-foreground shrink-0">
                                        {lesson.chapters.length}{" "}
                                        {lesson.chapters.length === 1
                                          ? "capítulo"
                                          : "capítulos"}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      disabled={deletingLessonId === lesson.id}
                                      onClick={() => startEditLesson(lesson)}
                                      className="min-h-8 px-2.5 text-xs hover:-translate-y-px transition-all duration-200 active:translate-y-0"
                                    >
                                      Editar
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      disabled={deletingLessonId === lesson.id}
                                      onClick={() => handleDeleteLesson(lesson.id)}
                                      className="min-h-8 px-2.5 text-xs text-[var(--destructive)] hover:bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] hover:text-[var(--destructive)] hover:-translate-y-px transition-all duration-200 active:translate-y-0"
                                    >
                                      {deletingLessonId === lesson.id ? (
                                        <Loader2 className="size-3 animate-spin" />
                                      ) : (
                                        "Borrar"
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="rounded-lg border border-border p-4 bg-card space-y-4">
                        <h4 className="text-sm font-semibold text-foreground">
                          {editingLessonId !== null ? "Editar lección" : "Nueva lección"}
                        </h4>
                        <form onSubmit={handleCreateLesson} aria-busy={lessonLoading} className="space-y-3">
                          {lessonError && (
                            <Alert variant="destructive" role="alert">
                              <AlertDescription>{lessonError}</AlertDescription>
                            </Alert>
                          )}
                          <div className="space-y-1.5">
                            <Label htmlFor={`lesson-title-${course.id}`}>Título</Label>
                            <Input
                              id={`lesson-title-${course.id}`}
                              required
                              disabled={lessonLoading}
                              value={lessonTitle}
                              onChange={(e) => setLessonTitle(e.target.value)}
                              className="min-h-10 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor={`lesson-orden-${course.id}`}>Orden</Label>
                            <Input
                              id={`lesson-orden-${course.id}`}
                              type="number"
                              min={1}
                              required
                              disabled={lessonLoading}
                              value={lessonOrden}
                              onChange={(e) => setLessonOrden(e.target.value)}
                              className="min-h-10 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor={`lesson-duration-${course.id}`}>
                              Duración (mm:ss)
                            </Label>
                            <Input
                              id={`lesson-duration-${course.id}`}
                              disabled={lessonLoading}
                              placeholder="mm:ss o h:mm:ss"
                              value={lessonDuration}
                              onChange={(e) => setLessonDuration(e.target.value)}
                              className="min-h-10 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-3">
                              <Label>Capítulos</Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={lessonLoading}
                                onClick={addChapterRow}
                                className="min-h-9 px-3 hover:-translate-y-px transition-all duration-200 active:translate-y-0"
                              >
                                Agregar capítulo
                              </Button>
                            </div>
                            {lessonChapters.length === 0 ? (
                              <p className="text-xs text-muted-foreground italic">
                                Sin capítulos.
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {lessonChapters.map((row, index) => (
                                  <div
                                    key={index}
                                    className="flex flex-wrap items-end gap-2 p-2.5 rounded-md bg-muted/40 border border-border"
                                  >
                                    <div className="space-y-1.5 w-28">
                                      <Label
                                        htmlFor={`lesson-chapter-time-${course.id}-${index}`}
                                        className="text-xs"
                                      >
                                        Tiempo (mm:ss)
                                      </Label>
                                      <Input
                                        id={`lesson-chapter-time-${course.id}-${index}`}
                                        disabled={lessonLoading}
                                        placeholder="mm:ss"
                                        value={row.time}
                                        onChange={(e) =>
                                          updateChapterRow(index, "time", e.target.value)
                                        }
                                        className="min-h-9 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                                      />
                                    </div>
                                    <div className="space-y-1.5 flex-1 min-w-32">
                                      <Label
                                        htmlFor={`lesson-chapter-title-${course.id}-${index}`}
                                        className="text-xs"
                                      >
                                        Título
                                      </Label>
                                      <Input
                                        id={`lesson-chapter-title-${course.id}-${index}`}
                                        disabled={lessonLoading}
                                        value={row.title}
                                        onChange={(e) =>
                                          updateChapterRow(index, "title", e.target.value)
                                        }
                                        className="min-h-9 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                                      />
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      disabled={lessonLoading}
                                      onClick={() => removeChapterRow(index)}
                                      className="min-h-9 px-3 text-[var(--destructive)] hover:bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] hover:text-[var(--destructive)] hover:-translate-y-px transition-all duration-200 active:translate-y-0"
                                    >
                                      Quitar
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor={`lesson-content-${course.id}`}>Contenido markdown</Label>
                            <Textarea
                              id={`lesson-content-${course.id}`}
                              required
                              disabled={lessonLoading}
                              rows={8}
                              value={lessonContent}
                              onChange={(e) => setLessonContent(e.target.value)}
                              className="transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                            />
                          </div>
                          <ImageUploadField
                            idPrefix={`lesson-video-${course.id}-`}
                            value={lessonVideoUrl}
                            onChange={setLessonVideoUrl}
                            label="Video"
                            resourceType="video"
                            accept="video/*"
                          />
                          <ImageUploadField
                            idPrefix={`lesson-attachment-${course.id}-`}
                            value={lessonAttachmentUrl}
                            onChange={setLessonAttachmentUrl}
                            label="Adjunto (PDF)"
                            resourceType="raw"
                            accept="application/pdf"
                          />
                          <div className="flex items-center gap-2">
                            <Button
                              type="submit"
                              disabled={lessonLoading}
                              className="min-h-10 px-5 text-[var(--color-on-action)] font-medium bg-[var(--color-action)] hover:bg-[var(--color-action)]/90 hover:-translate-y-px shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring active:translate-y-0"
                            >
                              {lessonLoading ? (
                                <span className="flex items-center gap-2">
                                  <Loader2 className="size-4 animate-spin" />
                                  Guardando...
                                </span>
                              ) : editingLessonId !== null ? (
                                "Guardar cambios"
                              ) : (
                                "Crear lección"
                              )}
                            </Button>
                            {editingLessonId !== null && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={resetLessonForm}
                              >
                                Cancelar edición
                              </Button>
                            )}
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
