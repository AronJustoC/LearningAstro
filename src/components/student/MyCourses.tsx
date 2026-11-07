import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface EnrolledCourse {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  imageUrl?: string | null;
  progressPercent?: number;
  completedCount?: number;
  lessonCount?: number;
}

export default function MyCourses() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "/auth/login";
      return;
    }

    async function loadMyCourses() {
      try {
        const response = await fetch(`${import.meta.env.PUBLIC_API_BASE_URL}/me/courses`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          window.location.href = "/auth/login";
          return;
        }

        if (!response.ok) {
          setError("No pudimos cargar tus cursos ahora. Intenta de nuevo más tarde.");
          return;
        }

        const data = await response.json();
        setCourses(data.courses ?? []);
      } catch {
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    }

    loadMyCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-12 text-sm text-[var(--color-text)]">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Cargando tus cursos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="hairline-t hairline-b py-8 space-y-3">
        <p className="text-sm" style={{ color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}>
          Todavía no estás inscrito en ningún curso.
        </p>
        <div>
          <a href="/cursos" className="link-arrow text-sm inline-flex items-center gap-1 font-semibold">
            Explorar cursos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => {
        const completed = course.completedCount ?? 0;
        const total = course.lessonCount ?? 0;
        const percent = Math.min(
          100,
          Math.max(0, course.progressPercent ?? (total > 0 ? Math.round((completed / total) * 100) : 0))
        );

        return (
          <div
            key={course.id}
            className="group flex flex-col h-full rounded-[2px] hairline overflow-hidden bg-[var(--color-bg)] transition-all duration-150"
          >
            {course.imageUrl && (
              <img
                src={course.imageUrl}
                alt={course.title}
                loading="lazy"
                width="400"
                height="224"
                className="w-full h-56 object-cover object-[50%_38%] hairline-b"
              />
            )}
            <div className="flex flex-col flex-1 p-5 gap-3">
              <h2 className="text-xl font-bold leading-snug text-[var(--color-text)]">{course.title}</h2>
              {course.description && (
                <p
                  className="text-sm leading-relaxed line-clamp-3"
                  style={{ color: "color-mix(in srgb, var(--color-text) 75%, transparent)" }}
                >
                  {course.description}
                </p>
              )}

              <div className="mt-auto pt-4 space-y-2">
                <div className="w-full h-2 rounded-[2px] bg-[var(--surface-2)] overflow-hidden hairline">
                  <div
                    className="h-full bg-[var(--color-action)] transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs" style={{ color: "color-mix(in srgb, var(--color-text) 68%, transparent)" }}>
                  <span>{completed} / {total} lecciones</span>
                  <span>{percent}%</span>
                </div>
              </div>

              <div className="pt-3 hairline-t">
                <a
                  href={`/cursos/${course.slug}`}
                  className="btn-block w-full justify-center inline-flex items-center gap-2"
                >
                  Continuar
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M8 7h9v9" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
