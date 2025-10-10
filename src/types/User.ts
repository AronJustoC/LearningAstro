import type { Post } from "./Post";
import type { Project } from "./Project";

export type Role = "USER" | "ADMIN";

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string; // opcional para evitar enviarlo al frontend
  bio?: string | null;
  imageUrl?: string | null;
  role: Role;
  createdAt?: string;

  // Relaciones
  posts?: Post[];
  projects?: Project[];
}
