import React, { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export interface Chapter {
  title: string;
  time: number;
}

export interface PlayerLesson {
  id: number;
  courseId?: number;
  title: string;
  orden: number;
  content: string;
  videoUrl: string | null;
  attachmentUrl: string | null;
  duration?: number | null;
  chapters?: Chapter[];
}

export interface PlayerCourse {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  lessons?: PlayerLesson[];
}

interface CoursePlayerProps {
  course: PlayerCourse;
  slug: string;
}

interface LessonProgress {
  lessonId: number;
  completed: boolean;
  lastPosition: number;
}

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null || isNaN(seconds)) return "";
  const s = Math.floor(seconds);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  if (hrs > 0) {
    return `${hrs}:${pad(mins)}:${pad(secs)}`;
  }
  return `${mins}:${pad(secs)}`;
}

export default function CoursePlayer({ course, slug }: CoursePlayerProps) {
  const sortedLessons = [...(course.lessons ?? [])].sort((a, b) => a.orden - b.orden);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(
    sortedLessons.length > 0 ? sortedLessons[0].id : null
  );

  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [lessonsProgress, setLessonsProgress] = useState<Record<number, LessonProgress>>({});
  const [loadingEnrollment, setLoadingEnrollment] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastSavedTimeRef = useRef<number>(0);
  const contentContainerRef = useRef<HTMLDivElement | null>(null);

  const activeLesson = sortedLessons.find((l) => l.id === activeLessonId) ?? null;

  async function fetchEnrollment() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setHasToken(false);
      setLoadingEnrollment(false);
      return;
    }
    setHasToken(true);

    try {
      const response = await fetch(
        `${import.meta.env.PUBLIC_API_BASE_URL}/me/courses/${slug}`,
        { headers: authHeaders() }
      );
      if (response.ok) {
        const data = await response.json();
        setEnrolled(Boolean(data.enrolled));
        const progressMap: Record<number, LessonProgress> = {};
        if (Array.isArray(data.lessons)) {
          for (const item of data.lessons) {
            progressMap[item.lessonId] = {
              lessonId: item.lessonId,
              completed: Boolean(item.completed),
              lastPosition: Number(item.lastPosition) || 0,
            };
          }
        }
        setLessonsProgress(progressMap);
      } else {
        setError("No se pudo obtener el estado de inscripción.");
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoadingEnrollment(false);
    }
  }

  useEffect(() => {
    fetchEnrollment();
  }, [slug]);

  async function handleEnroll() {
    setError("");
    setEnrolling(true);
    try {
      const response = await fetch(
        `${import.meta.env.PUBLIC_API_BASE_URL}/courses/${course.id}/enroll`,
        {
          method: "POST",
          headers: authHeaders(),
        }
      );
      if (response.status === 200 || response.status === 201) {
        await fetchEnrollment();
      } else {
        setError("No se pudo completar la inscripción.");
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setEnrolling(false);
    }
  }

  async function saveProgress(
    lessonId: number,
    pos: number,
    completed?: boolean
  ) {
    if (!enrolled) return;
    try {
      const body: { lastPosition?: number; completed?: boolean } = {};
      if (pos >= 0) body.lastPosition = Math.floor(pos);
      if (typeof completed === "boolean") body.completed = completed;

      const res = await fetch(
        `${import.meta.env.PUBLIC_API_BASE_URL}/courses/${course.id}/lessons/${lessonId}/progress`,
        {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(body),
        }
      );
      if (res.status === 403) {
        setError("Necesitas inscribirte para guardar tu avance.");
      } else if (res.ok) {
        setLessonsProgress((prev) => ({
          ...prev,
          [lessonId]: {
            lessonId,
            completed:
              typeof completed === "boolean"
                ? completed
                : Boolean(prev[lessonId]?.completed),
            lastPosition: Math.floor(pos),
          },
        }));
      }
    } catch {
      // Ignorar fallas silenciosas en updates de tiempo
    }
  }

  function handleLoadedMetadata() {
    if (!videoRef.current || !activeLesson) return;
    const currentProgress = lessonsProgress[activeLesson.id];
    if (currentProgress && currentProgress.lastPosition > 0) {
      videoRef.current.currentTime = currentProgress.lastPosition;
    }
  }

  function handleTimeUpdate() {
    if (!videoRef.current || !activeLesson || !enrolled) return;
    const now = videoRef.current.currentTime;
    if (Math.abs(now - lastSavedTimeRef.current) >= 10) {
      lastSavedTimeRef.current = now;
      saveProgress(activeLesson.id, now);
    }
  }

  function handlePause() {
    if (!videoRef.current || !activeLesson || !enrolled) return;
    saveProgress(activeLesson.id, videoRef.current.currentTime);
  }

  function switchLesson(newLessonId: number) {
    if (videoRef.current && activeLesson && enrolled) {
      saveProgress(activeLesson.id, videoRef.current.currentTime);
    }
    lastSavedTimeRef.current = 0;
    setActiveLessonId(newLessonId);
  }

  async function toggleCompleted(lessonId: number) {
    const isCompleted = Boolean(lessonsProgress[lessonId]?.completed);
    const nextCompleted = !isCompleted;
    const currentPos =
      activeLessonId === lessonId && videoRef.current
        ? videoRef.current.currentTime
        : lessonsProgress[lessonId]?.lastPosition ?? 0;

    setLessonsProgress((prev) => ({
      ...prev,
      [lessonId]: {
        lessonId,
        completed: nextCompleted,
        lastPosition: Math.floor(currentPos),
      },
    }));

    await saveProgress(lessonId, currentPos, nextCompleted);
  }

  function seekChapter(time: number) {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    videoRef.current.play().catch(() => {});
  }

  // Inject copy buttons into pre blocks rendered by marked
  useEffect(() => {
    const container = contentContainerRef.current;
    if (!container) return;

    const preBlocks = container.querySelectorAll("pre");
    preBlocks.forEach((pre) => {
      if (pre.querySelector(".code-copy-btn")) return;

      pre.style.position = "relative";
      const button = document.createElement("button");
      button.className =
        "code-copy-btn absolute top-2 right-2 px-2.5 py-1 text-xs font-display rounded bg-[var(--surface-2)] text-[var(--color-text)] border border-[var(--hairline)] hover:border-[var(--focus-color)] transition-colors";
      button.innerText = "Copiar";

      button.addEventListener("click", () => {
        const code = pre.querySelector("code");
        const text = code ? code.innerText : pre.innerText;
        navigator.clipboard.writeText(text).then(() => {
          button.innerText = "Copiado";
          setTimeout(() => {
            button.innerText = "Copiar";
          }, 2000);
        });
      });

      pre.appendChild(button);
    });
  }, [activeLesson?.content, loadingEnrollment]);

  if (loadingEnrollment) {
    return (
      <div className="flex items-center gap-2 py-12 text-sm text-[var(--color-text)]">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Cargando lecciones...</span>
      </div>
    );
  }

  const activeProgress = activeLesson ? lessonsProgress[activeLesson.id] : null;
  const isLessonCompleted = Boolean(activeProgress?.completed);
  const parsedMarkdown = activeLesson?.content ? marked.parse(activeLesson.content) : "";

  return (
    <div className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {hasToken === false ? (
        <div className="p-6 rounded-[2px] hairline bg-[var(--surface-1)] space-y-3">
          <p className="text-base font-semibold text-[var(--color-text)]">
            Inicia sesión para inscribirte y guardar tu avance
          </p>
          <p className="text-sm" style={{ color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
            Registra tu progreso, continúa donde lo dejaste y accede a todos los materiales del curso.
          </p>
          <div>
            <a href="/auth/login" className="btn-block inline-flex items-center gap-2">
              Iniciar sesión
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M8 7h9v9" />
              </svg>
            </a>
          </div>
        </div>
      ) : !enrolled ? (
        <div className="p-6 rounded-[2px] hairline bg-[var(--surface-1)] space-y-3">
          <p className="text-base font-semibold text-[var(--color-text)]">
            Inscríbete a este curso para guardar tu avance
          </p>
          <p className="text-sm" style={{ color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
            Podrás llevar un registro de tus lecciones completadas y posición de video.
          </p>
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="btn-block inline-flex items-center gap-2"
          >
            {enrolling && <Loader2 className="w-4 h-4 animate-spin" />}
            Inscribirme
          </button>
        </div>
      ) : null}

      {sortedLessons.length === 0 ? (
        <div className="hairline-t hairline-b py-6">
          <span className="label block mb-1">Sin lecciones</span>
          <p className="text-sm" style={{ color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
            Este curso todavía no tiene lecciones.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Area: Player, Active Lesson description, chapters, attachments */}
          <div className="lg:col-span-2 space-y-6">
            {activeLesson ? (
              <div className="space-y-6">
                <div>
                  <p className="label mb-1" style={{ color: "var(--color-action)" }}>
                    Lección {activeLesson.orden}
                  </p>
                  <h2 className="display text-2xl lg:text-3xl text-[var(--color-text)]">
                    {activeLesson.title}
                  </h2>
                </div>

                {activeLesson.videoUrl && (
                  <div className="rounded-[2px] hairline overflow-hidden bg-black">
                    <video
                      key={activeLesson.id}
                      ref={videoRef}
                      controls
                      preload="metadata"
                      src={activeLesson.videoUrl}
                      onLoadedMetadata={handleLoadedMetadata}
                      onTimeUpdate={handleTimeUpdate}
                      onPause={handlePause}
                      className="w-full aspect-video"
                    />
                  </div>
                )}

                {/* Mark as completed toggle & download button */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 hairline-b pb-4">
                  {enrolled && (
                    <button
                      onClick={() => toggleCompleted(activeLesson.id)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-[2px] hairline bg-[var(--surface-1)] hover:border-[var(--focus-color)] transition-colors"
                    >
                      <span
                        className={`w-4 h-4 rounded-[2px] border flex items-center justify-center transition-colors ${
                          isLessonCompleted
                            ? "bg-[var(--color-action)] border-[var(--color-action)] text-white"
                            : "border-[var(--hairline)]"
                        }`}
                      >
                        {isLessonCompleted && (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      {isLessonCompleted ? "Lección completada" : "Marcar completada"}
                    </button>
                  )}

                  {activeLesson.attachmentUrl && (
                    <a
                      href={activeLesson.attachmentUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-arrow text-sm inline-flex items-center gap-1"
                    >
                      Descargar material
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </a>
                  )}
                </div>

                {/* Chapters */}
                {activeLesson.chapters && activeLesson.chapters.length > 0 && (
                  <div className="space-y-3 p-4 rounded-[2px] hairline bg-[var(--surface-1)]">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text)]">
                      Capítulos
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[...activeLesson.chapters]
                        .sort((a, b) => a.time - b.time)
                        .map((ch, idx) => (
                          <button
                            key={idx}
                            onClick={() => seekChapter(ch.time)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-[2px] hairline bg-[var(--color-bg)] hover:border-[var(--focus-color)] transition-colors"
                          >
                            <span className="font-display text-[var(--color-action)]">
                              {formatDuration(ch.time)}
                            </span>
                            <span>{ch.title}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {/* Markdown content */}
                {activeLesson.content && (
                  <div
                    ref={contentContainerRef}
                    className="post-body space-y-4"
                    dangerouslySetInnerHTML={{ __html: parsedMarkdown as string }}
                  />
                )}
              </div>
            ) : null}
          </div>

          {/* Sidebar: Lessons List */}
          <div className="lg:col-span-1 rounded-[2px] hairline bg-[var(--surface-1)] p-4 space-y-4 sticky top-20">
            <h3 className="display text-lg text-[var(--color-text)] hairline-b pb-3">
              Contenido del curso
            </h3>
            <ol className="space-y-2">
              {sortedLessons.map((lesson) => {
                const isActive = lesson.id === activeLessonId;
                const isComp = Boolean(lessonsProgress[lesson.id]?.completed);
                return (
                  <li key={lesson.id}>
                    <button
                      onClick={() => switchLesson(lesson.id)}
                      className={`w-full text-left p-3 rounded-[2px] border transition-all flex items-start gap-3 ${
                        isActive
                          ? "bg-[var(--surface-2)] border-[var(--focus-color)]"
                          : "border-transparent hover:border-[var(--hairline)]"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 mt-0.5 rounded-[2px] border flex-shrink-0 flex items-center justify-center transition-colors ${
                          isComp
                            ? "bg-[var(--color-action)] border-[var(--color-action)] text-white"
                            : "border-[var(--hairline)] bg-[var(--color-bg)]"
                        }`}
                      >
                        {isComp && (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs uppercase tracking-wide font-display" style={{ color: "var(--color-action)" }}>
                            Lección {lesson.orden}
                          </p>
                          {lesson.duration != null && (
                            <span className="text-xs font-display" style={{ color: "color-mix(in srgb, var(--color-text) 60%, transparent)" }}>
                              {formatDuration(lesson.duration)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold truncate text-[var(--color-text)]">
                          {lesson.title}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
