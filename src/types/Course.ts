export type Chapter = {
  id: number;
  time: number;
  title: string;
  orden: number;
};

export type Lesson = {
  id: number;
  courseId: number;
  title: string;
  orden: number;
  content: string;
  videoUrl: string | null;
  attachmentUrl: string | null;
  duration: number | null;
  chapters: Chapter[];
};

export type Course = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  publicado: boolean;
  createdAt: string;
  lessonCount?: number;
  lessons?: Lesson[];
};
