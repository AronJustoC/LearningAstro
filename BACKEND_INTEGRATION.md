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

- [ ] **Paso 1.3: Desarrollar los formularios con React**
  - **Acción:** Crear los componentes `src/components/auth/LoginForm.tsx` y `src/components/auth/RegisterForm.tsx`.
  - **Buena Práctica:** Estos componentes manejarán el estado del formulario (entradas de usuario, validaciones) y las llamadas a la API. Se integrarán en las páginas de Astro con la directiva `client:load`.

- [ ] **Paso 1.4: Implementar el manejo de tokens**
  - **Acción:** Dentro de los componentes de React, usar `fetch` para llamar a los endpoints `api/auth/login` y `api/auth/register`.
  - **Buena Práctica (Seguridad):** Para empezar, podemos guardar los tokens (`accessToken`, `refreshToken`) en `localStorage`. Sin embargo, para un entorno de producción, la mejor práctica es que el backend configure los tokens en **cookies `HttpOnly`** para prevenir ataques XSS.

- [ ] **Paso 1.5: Crear un Store global para el estado de autenticación**
  - **Acción:** Usar una librería ligera como `nanostores` (`npm install nanostores`) para gestionar el estado global (ej. si el usuario está logueado, sus datos). Crear el archivo `src/stores/authStore.ts`.
  - **Buena Práctica:** Un store global permite que cualquier componente (Astro, React, etc.) pueda reaccionar a los cambios de estado de autenticación de forma sencilla.

#### Commit de Git para la Fase 1

```bash
git add .
git commit -m "feat(auth): implement user registration and login flow"
```

---

## Fase 2: Panel de Administración (Dashboard)

**Objetivo:** Crear una sección privada donde el usuario autenticado pueda gestionar los proyectos y los posts del blog.

- [ ] **Paso 2.1: Crear la página base del Dashboard**
  - **Acción:** Crear el archivo `src/pages/admin/dashboard.astro`.

- [ ] **Paso 2.2: Proteger la ruta del Dashboard**
  - **Acción:** En el `frontmatter` de `dashboard.astro`, añadir lógica para verificar si el usuario está autenticado (consultando el store o la cookie). Si no lo está, redirigir a la página de login usando `Astro.redirect('/auth/login')`.

- [ ] **Paso 2.3: Desarrollar componentes de gestión (CRUD)**
  - **Acción:** Crear componentes interactivos como `src/components/admin/ProjectsManager.tsx` y `src/components/admin/PostsManager.tsx`.
  - **Buena Práctica:** Cada componente se encargará de las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para un tipo de contenido, llamando a los endpoints protegidos de la API con el `accessToken`.

#### Commit de Git para la Fase 2

```bash
git add .
git commit -m "feat(admin): create protected dashboard for content management"
```

---

## Fase 3: Conectar Contenido Público a la API

**Objetivo:** Modificar las páginas existentes para que muestren el contenido dinámicamente desde el backend.

- [ ] **Paso 3.1: Refactorizar la sección de Proyectos**
  - **Acción:** En `src/pages/index.astro` (o donde se listen los proyectos), usar `fetch` en el `frontmatter` para obtener los datos de los proyectos desde `api/projects` y pasarlos al componente que los renderiza.

- [ ] **Paso 3.2: Crear las páginas del Blog**
  - **Acción:**
    1. Crear `src/pages/blog/index.astro` para listar todos los posts.
    2. Crear `src/pages/blog/[slug].astro` usando rutas dinámicas para mostrar un post individual.
  - **Buena Práctica:** Astro puede generar estas páginas de forma estática en tiempo de construcción (`getStaticPaths`) o renderizarlas en el servidor bajo demanda (SSR), dependiendo de la configuración.

- [ ] **Paso 3.3: Tipificar las respuestas de la API**
  - **Acción:** Crear/actualizar los archivos en `src/types/` (ej. `Post.ts`, `Project.ts`) para que coincidan con la estructura de datos devuelta por la API.
  - **Buena Práctica:** Usar TypeScript para tipificar los datos de la API previene errores y mejora el autocompletado durante el desarrollo.

#### Commit de Git para la Fase 3

```bash
git add .
git commit -m "feat(content): fetch projects and blog posts dynamically from API"
```

---

### Mejoras y Consideraciones Adicionales

- **Endpoints Públicos:** La documentación de la API indica que los endpoints de `posts` y `projects` son protegidos. Para las páginas públicas, el backend debería exponer endpoints de solo lectura que no requieran autenticación. Esto es un punto crítico a discutir con el desarrollador del backend.
- **Manejo de Errores:** Implementar un sistema de notificaciones (ej. "toasts") para dar feedback al usuario sobre el resultado de las operaciones (ej. "Proyecto creado con éxito", "Error de autenticación").
- **Validación de Formularios:** Añadir validación en tiempo real en los formularios de React para mejorar la experiencia de usuario, además de la validación que ya debería existir en el backend.
- **Optimistic UI:** Para una mejor UX en el panel de administración, se puede implementar una "UI optimista", donde la interfaz se actualiza inmediatamente después de una acción del usuario, sin esperar la confirmación del servidor.

