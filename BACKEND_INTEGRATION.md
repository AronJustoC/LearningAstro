# Plan de Integración del Backend

Este documento detalla el plan paso a paso para integrar un backend en nuestro proyecto Astro. Cubriremos la autenticación, la creación de un panel de administración y la conexión de las páginas públicas a la API.

**Checkpoints:** Marcamos nuestro progreso con `[ ]` o `[x]`.

---

## Fase 1: Autenticación de Usuarios

**Objetivo:** Permitir que los usuarios se registren e inicien sesión, gestionando su estado de autenticación en la aplicación.

- [x] **Paso 1.1: Instalar dependencias para interactividad**
  - **Acción:** Ejecutar `npx astro add react` para añadir React al proyecto.
  - **Buena Práctica:** Astro nos permite usar componentes de frameworks como React o Svelte para las partes interactivas de la UI (islas de interactividad), mientras el resto del sitio sigue siendo estático y rápido.

- [x] **Paso 1.2: Crear las páginas de autenticación**
  - **Acción:** Crear los archivos `src/pages/auth/login.astro` y `src/pages/auth/register.astro`.
  - **Buena Práctica:** Agrupar las páginas relacionadas con la autenticación en una carpeta `auth` mejora la organización del proyecto.

- [x] **Paso 1.3: Desarrollar los formularios con React**
  - **Acción:** Crear los componentes `src/components/auth/LoginForm.tsx` y `src/components/auth/RegisterForm.tsx`.
  - **Buena Práctica:** Estos componentes manejarán el estado del formulario (entradas de usuario, validaciones) y las llamadas a la API. Se integrarán en las páginas de Astro con la directiva `client:load`.
  - **Implementación (`LoginForm.tsx`):**
    - **Estado:** Se usa `useState` para manejar `email` y `password`.
    - **Envío:** Una función `handleSubmit` previene el comportamiento por defecto del formulario y contendrá la lógica de `fetch` para llamar a la API.
    - **Código de ejemplo:**

      ```tsx
      // src/components/auth/LoginForm.tsx
      import React, { useState } from "react";

      const LoginForm = () => {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");

        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          console.log("Datos del formulario:", { email, password });
          // Próximamente: Llamada a la API con fetch
        };

        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ... campos de email y password ... */}
          </form>
        );
      };

      export default LoginForm;
      ```

  - **Implementación (`RegisterForm.tsx`):**
    - **Estado:** Similar al login, pero se añade un campo `username`.
    - **Envío:** La función `handleSubmit` recogerá `username`, `email` y `password` para enviarlos a la API.
    - **Código de ejemplo:**

      ```tsx
      // src/components/auth/RegisterForm.tsx
      import React, { useState } from "react";

      const RegisterForm = () => {
        const [username, setUsername] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");

        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          console.log("Datos del formulario:", { username, email, password });
          // Próximamente: Llamada a la API con fetch
        };

        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ... campos de username, email y password ... */}
          </form>
        );
      };

      export default RegisterForm;
      ```

- [x] **Paso 1.4: Implementar el manejo de tokens**
  - **Acción:** Dentro de los componentes de React, usar `fetch` para llamar a los endpoints `api/auth/login` y `api/auth/register`.
  - **Buena Práctica (Seguridad):** Para empezar, podemos guardar los tokens (`accessToken`, `refreshToken`) en `localStorage`. Sin embargo, para un entorno de producción, la mejor práctica es que el backend configure los tokens en **cookies `HttpOnly`** para prevenir ataques XSS.
  - **Implementación (`LoginForm.tsx`):**
    - Se modifica la función `handleSubmit` para incluir la llamada `fetch` al endpoint de login.
    - Se añade manejo de estado para errores y se guarda el token en `localStorage`.
    - **Código de ejemplo con `fetch`:**

      ```tsx
      // ... (código de ejemplo para LoginForm)
      ```

  - **Implementación (`RegisterForm.tsx`):**
    - Se aplica la misma lógica de `fetch` al `handleSubmit` del formulario de registro, apuntando al endpoint de register.
    - **Código de ejemplo con `fetch`:**

      ```tsx
      // src/components/auth/RegisterForm.tsx
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // ... (lógica para limpiar errores)

        try {
          const response = await fetch(
            "http://localhost:4000/api/auth/register",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, email, password }),
            },
          );

          if (response.ok) {
            const data = await response.json();
            console.log("Registro exitoso:", data);
            // Opcional: Iniciar sesión y guardar token
          } else {
            // ... (manejo de error de registro)
          }
        } catch (error) {
          // ... (manejo de error de red)
        }
      };
      ```

- [x] **Paso 1.5: Crear un Store global para el estado de autenticación**
  - **Acción:** Usar una librería ligera como `nanostores` (`npm install nanostores @nanostores/react`) para gestionar el estado global (ej. si el usuario está logueado, sus datos). Crear el archivo `src/stores/authStore.ts`.
  - **Buena Práctica:** Un store global permite que cualquier componente (Astro, React, etc.) pueda reaccionar a los cambios de estado de autenticación de forma sencilla.
  - **Implementación (`authStore.ts`):**
    - Se usa `atom` para el estado de autenticación (`isAuthenticated`).
    - Se usa `map` para la información del usuario (`user`).
    - Se crean acciones `login` y `logout` para modificar el estado.
    - **Código de ejemplo:**

      ```ts
      // src/stores/authStore.ts
      import { atom, map } from "nanostores";

      export const isAuthenticated = atom(false);
      export const user = map<Record<string, any>>({});

      export function login(userData: Record<string, any>) {
        isAuthenticated.set(true);
        user.set(userData);
        if (userData.token) {
          localStorage.setItem("token", userData.token);
        }
      }

      export function logout() {
        isAuthenticated.set(false);
        user.set({});
        localStorage.removeItem("token");
      }
      ```

  - **Uso en React:**
    - Se importa el hook `useStore` de `@nanostores/react` y las acciones del store.
    - La acción `login` se llama después de una respuesta exitosa de la API.

      ```tsx
      // En LoginForm.tsx
      import { useStore } from "@nanostores/react";
      import { isAuthenticated, login } from "../../stores/authStore";

      const $isAuthenticated = useStore(isAuthenticated);

      // Dentro de handleSubmit, si la API responde OK:
      login(data); // Llama a la acción para actualizar el estado global
      ```

#### Commit de Git para la Fase 1

```bash
git add .
git commit -m "feat(auth): implement user registration and login flow"
```

---

## Fase 2: Panel de Administración (Dashboard)

**Objetivo:** Crear una sección privada donde el usuario autenticado pueda gestionar los proyectos y los posts del blog.

- [x] **Paso 2.1: Crear la página base del Dashboard**
  - **Acción:** Crear el archivo `src/pages/admin/dashboard.astro`.
  - **Implementación:** Se crea la página con un layout base y un título. La lógica de protección se añadirá en el siguiente paso.

- [x] **Paso 2.2: Proteger la ruta del Dashboard**
  - **Acción:** En el `frontmatter` de `dashboard.astro`, añadir lógica para verificar si el usuario está autenticado (consultando el store o la cookie). Si no lo está, redirigir a la página de login usando `Astro.redirect('/auth/login')`.
  - **Implementación:**
    - El código en el `frontmatter` se ejecuta en el servidor.
    - Se usa `Astro.cookies.get('token')` para leer la cookie de autenticación.
    - Si la cookie no existe, se redirige al usuario a `/auth/login`.
    - **Nota:** Esto requiere que el `LoginForm.tsx` cree la cookie después de un inicio de sesión exitoso (ej. `document.cookie = 'token=...; path=/;'`).
    - **Código de ejemplo en `dashboard.astro`:**

      ```astro
      ---
      import LayoutBase from '../../layouts/LayoutBase.astro';

      const token = Astro.cookies.get('token');
      if (!token) {
        return Astro.redirect('/auth/login');
      }
      ---
      {/* ... resto del HTML ... */}
      ```

- [x] **Paso 2.3: Desarrollar componentes de gestión (CRUD)**
  - **Acción:** Crear componentes interactivos como `src/components/admin/ProjectsManager.tsx` y `src/components/admin/PostsManager.tsx`.
  - **Buena Práctica:** Cada componente se encargará de las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para un tipo de contenido, llamando a los endpoints protegidos de la API con el `accessToken`.
  - **Implementación (`ProjectsManager.tsx`):**
    - ... (explicación y código como ya está)
  - **Implementación (`PostsManager.tsx`):**
    - Sigue el mismo patrón que `ProjectsManager.tsx`, pero para gestionar las publicaciones del blog.
    - Apunta al endpoint de `posts` y utiliza el tipo `Post`.
    - **Código de ejemplo:**

      ```tsx
      // src/components/admin/PostsManager.tsx
      import React, { useState, useEffect } from "react";
      import type { Post } from "../../types/Post";

      const PostsManager = () => {
        // ... (lógica similar a ProjectsManager para obtener y listar posts)
      };
      ```

  - **Integración en el Dashboard:**
    - Ambos componentes se añaden a `dashboard.astro` con la directiva `client:load`.

      ```astro
      // src/pages/admin/dashboard.astro
      <ProjectsManager client:load />
      <PostsManager client:load />
      ```

#### Commit de Git para la Fase 2

```bash
git add .
git commit -m "feat(admin): create protected dashboard for content management"
```

---

## Fase 3: Conectar Contenido Público a la API

**Objetivo:** Modificar las páginas existentes para que muestren el contenido dinámicamente desde el backend.

- [x] **Paso 3.1: Refactorizar la sección de Proyectos**
  - **Acción:** En `src/pages/index.astro` (o donde se listen los proyectos), usar `fetch` en el `frontmatter` para obtener los datos de los proyectos desde `api/projects` y pasarlos al componente que los renderiza.
  - **Implementación:**
    - Se realiza una llamada `fetch` en el `frontmatter` de `index.astro` a un endpoint público de la API.
    - Los datos obtenidos se pasan como `props` al componente que renderiza la lista de proyectos (ej. `Projects.astro`).
    - El componente `Projects.astro` se modifica para recibir y mapear estas `props`.
    - **Código de ejemplo en `index.astro`:**

      ```astro
      ---
      // Se obtienen los proyectos desde la API
      const response = await fetch('http://localhost:4000/api/projects/public');
      const projects = await response.json();
      ---
      {/* Se pasan los proyectos al componente */}
      <Projects projects={projects} />
      ```

- [x] **Paso 3.2: Crear las páginas del Blog**
  - **Acción:**
    1. Crear `src/pages/blog/index.astro` para listar todos los posts.
    2. Crear `src/pages/blog/[slug].astro` usando rutas dinámicas para mostrar un post individual.
  - **Buena Práctica:** Astro puede generar estas páginas de forma estática en tiempo de construcción (`getStaticPaths`) o renderizarlas en el servidor bajo demanda (SSR), dependiendo de la configuración.
  - **Implementación (Índice):**
    - La página `index.astro` obtiene todos los posts desde un endpoint público y los muestra en una lista.

      ```astro
      // src/pages/blog/index.astro
      const response = await fetch('http://localhost:4000/api/posts/public');
      const posts = await response.json();
      ```

  - **Implementación (Detalle):**
    - La página `[slug].astro` usa `getStaticPaths` para generar una página por cada post.
    - `getStaticPaths` obtiene todos los posts y crea un mapa de rutas basado en el `slug`.
    - La página recibe los datos del post correspondiente a través de `Astro.props`.

      ```astro
      // src/pages/blog/[slug].astro
      export async function getStaticPaths() {
        const response = await fetch('http://localhost:4000/api/posts/public');
        const posts = await response.json();
        return posts.map(post => ({ params: { slug: post.slug }, props: { post } }));
      }
      const { post } = Astro.props;
      ```

- [x] **Paso 3.3: Tipificar las respuestas de la API**
  - **Acción:** Crear/actualizar los archivos en `src/types/` (ej. `Post.ts`, `Project.ts`) para que coincidan con la estructura de datos devuelta por la API.
  - **Buena Práctica:** Usar TypeScript para tipificar los datos de la API previene errores, habilita el autocompletado y sirve como documentación.
  - **Implementación:**
    - Se definen interfaces de TypeScript para cada tipo de dato que proviene de la API.
    - **Código de ejemplo para `Project.ts`:**

      ```ts
      // src/types/Project.ts
      export interface Project {
        id: number;
        name: string;
        description: string;
        // ... y otras propiedades
      }
      ```

    - **Código de ejemplo para `Post.ts`:**

      ```ts
      // src/types/Post.ts
      export interface Post {
        id: number;
        title: string;
        slug: string;
        content: string;
        // ... y otras propiedades
      }
      ```

#### Commit de Git para la Fase 3

```bash
git add .
git commit -m "feat(content): fetch projects and blog posts dynamically from API"
```

---

## Fase 4: Construcción de la Interfaz del Dashboard

**Objetivo:** Desarrollar una interfaz de usuario clara y funcional para el panel de administración utilizando componentes reutilizables de Astro.

A continuación se detalla el proceso completo para que lo implementes manualmente.

- [ ] **Paso 4.1: Crear el Layout del Dashboard (`DashboardLayout.astro`)**
  - **Acción:** Crea el archivo `src/layouts/DashboardLayout.astro`. Este componente definirá la estructura visual de toda la sección de administración, incluyendo un menú lateral y un área principal para el contenido.
  - **Código:**
    ```astro
    ---
    // src/layouts/DashboardLayout.astro
    import Sidebar from '../components/admin/Sidebar.astro';

    interface Props {
      title: string;
    }

    const { title } = Astro.props;
    ---
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width" />
      <title>{title}</title>
      <style>
        :root {
          --admin-bg: #1f2937; /* Gris oscuro para el fondo */
          --sidebar-bg: #111827; /* Aún más oscuro para el sidebar */
          --text-color: #f9fafb; /* Texto claro */
          --accent-color: #3b82f6; /* Azul para acentos */
        }
        body {
          margin: 0;
          font-family: system-ui, sans-serif;
          background-color: var(--admin-bg);
          color: var(--text-color);
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: 250px 1fr; /* Columna fija para el sidebar */
          min-height: 100vh;
        }
        main {
          padding: 2rem;
        }
      </style>
    </head>
    <body>
      <div class="dashboard-grid">
        <Sidebar />
        <main>
          <slot />
        </main>
      </div>
    </body>
    </html>
    ```

- [ ] **Paso 4.2: Crear el Componente de Navegación (`Sidebar.astro`)**
  - **Acción:** Crea el archivo `src/components/admin/Sidebar.astro`. Este componente contendrá los enlaces para navegar por las diferentes secciones del panel de administración.
  - **Código:**
    ```astro
    ---
    // src/components/admin/Sidebar.astro
    ---
    <aside>
      <nav>
        <h2>Admin Panel</h2>
        <ul>
          <li><a href="/admin/dashboard">Dashboard</a></li>
          <li><a href="/admin/posts">Gestionar Posts</a></li>
          <li><a href="/admin/projects">Gestionar Proyectos</a></li>
          <li><a href="/">Volver al Sitio</a></li>
        </ul>
      </nav>
      <style>
        aside {
          background-color: var(--sidebar-bg);
          padding: 1.5rem;
          border-right: 1px solid #374151;
        }
        h2 {
          font-size: 1.5rem;
          margin-bottom: 2rem;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        a {
          color: var(--text-color);
          text-decoration: none;
          font-size: 1.1rem;
          transition: color 0.2s;
        }
        a:hover {
          color: var(--accent-color);
        }
      </style>
    </aside>
    ```

- [ ] **Paso 4.3: Crear un Componente "Widget" (`StatCard.astro`)**
  - **Acción:** Crea el archivo `src/components/admin/StatCard.astro`. Este será un componente reutilizable para mostrar estadísticas importantes de un vistazo.
  - **Código:**
    ```astro
    ---
    // src/components/admin/StatCard.astro
    interface Props {
      title: string;
      value: string | number;
    }

    const { title, value } = Astro.props;
    ---
    <div class="stat-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
    <style>
      .stat-card {
        background-color: var(--sidebar-bg);
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid #374151;
      }
      h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.2rem;
        color: #9ca3af; /* Color más suave para el título */
      }
      p {
        margin: 0;
        font-size: 2.5rem;
        font-weight: bold;
      }
    </style>
    ```

- [ ] **Paso 4.4: Actualizar la Página del Dashboard**
  - **Acción:** Modifica el archivo `src/pages/admin/dashboard.astro` para usar el nuevo layout y los componentes que has creado.
  - **Código:**
    ```astro
    ---
    // src/pages/admin/dashboard.astro
    import DashboardLayout from '../../layouts/DashboardLayout.astro';
    import StatCard from '../../components/admin/StatCard.astro';

    // Lógica para proteger la ruta (como ya tenías)
    const token = Astro.cookies.get('token');
    if (!token) {
      return Astro.redirect('/auth/login');
    }

    // Datos de ejemplo para las estadísticas
    const totalPosts = 15;
    const totalProjects = 8;
    const newUsers = 3;
    ---
    <DashboardLayout title="Admin Dashboard">
      <h1>Dashboard</h1>
      <p>Bienvenido al panel de administración.</p>
      
      <div class="stats-grid">
        <StatCard title="Total Posts" value={totalPosts} />
        <StatCard title="Total Proyectos" value={totalProjects} />
        <StatCard title="Nuevos Usuarios (Mes)" value={newUsers} />
      </div>
    </DashboardLayout>

    <style>
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
      }
    </style>
    ```

#### Commit de Git para la Fase 4

Una vez que hayas creado y modificado todos los archivos, puedes hacer el commit:

```bash
git add src/layouts/DashboardLayout.astro src/components/admin/Sidebar.astro src/components/admin/StatCard.astro src/pages/admin/dashboard.astro BACKEND_INTEGRATION.md
git commit -m "feat(admin): build dashboard UI with layout and components"
```

---

### Mejoras y Consideraciones Adicionales

- **Endpoints Públicos:** La documentación de la API indica que los endpoints de `posts` y `projects` son protegidos. Para las páginas públicas, el backend debería exponer endpoints de solo lectura que no requieran autenticación. Esto es un punto crítico a discutir con el desarrollador del backend.
- **Manejo de Errores:** Implementar un sistema de notificaciones (ej. "toasts") para dar feedback al usuario sobre el resultado de las operaciones (ej. "Proyecto creado con éxito", "Error de autenticación").
- **Validación de Formularios:** Añadir validación en tiempo real en los formularios de React para mejorar la experiencia de usuario, además de la validación que ya debería existir en el backend.
- **Optimistic UI:** Para una mejor UX en el panel de administración, se puede implementar una "UI optimista", donde la interfaz se actualiza inmediatamente después de una acción del usuario, sin esperar la confirmación del servidor.
