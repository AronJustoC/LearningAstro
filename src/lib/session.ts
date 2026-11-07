export type Role = "ADMIN" | "USER";

// Lee el rol del payload del JWT. Solo sirve para decidir a qué pantalla enviar al usuario.
// La autorización real la aplica el backend (checkRole) en cada endpoint.
export function readRole(token: string | null | undefined): Role | null {
  if (!token) return null;
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return json.role === "ADMIN" || json.role === "USER" ? json.role : null;
  } catch {
    return null;
  }
}
