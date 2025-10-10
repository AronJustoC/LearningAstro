export interface Project {
  id: number;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  repoUrl?: string | null;
  liveUrl?: string | null;
  createdAt?: string; // string si proviene del backend como ISO date
  userId?: number;

  // Relación opcional (si alguna vez incluyes el usuario dueño)
  owner?: {
    id: number;
    username: string;
    email: string;
    imageUrl?: string | null;
  };
}
