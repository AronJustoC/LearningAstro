import type { User } from "./User";

export interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;

  // Relación con User
  author?: Pick<User, "id" | "username" | "email" | "imageUrl">;
}
