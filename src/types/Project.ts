export interface Project {
  id: number;
  title: string;
  slug?: string; // solo proyectos destacados con página de detalle
  description?: string | null;
  imageUrl?: string | null;
  repoUrl?: string | null;
  liveUrl?: string | null;
  createdAt?: string; // string si proviene del backend como ISO date
  userId?: number;
  destacadoPortada?: boolean;
  ordenPortada?: number | null;

  // Relación opcional (si alguna vez incluyes el usuario dueño)
  owner?: {
    id: number;
    username: string;
    email: string;
    imageUrl?: string | null;
  };
}
