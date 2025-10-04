# Plan de Aprendizaje de Astro.js con TypeScript

Este archivo servirá como nuestra guía para aprender Astro.js desde cero, utilizando TypeScript para asegurar un código más robusto y mantenible. Seguiremos una estructura modular, culminando en la creación de un proyecto completo.

**Checkpoints:** Marcamos nuestro progreso con `[x]`. El siguiente paso a explicar será el primer `[ ]`.

---

## Módulo 1: Fundamentos de Astro

**Objetivo:** Entender la estructura básica de un proyecto de Astro y sus conceptos principales, usando TypeScript desde el inicio.

- [x] **Instalación y Configuración Inicial**
- [x] **Páginas y Rutas**
- [x] **Componentes de Astro (Introducción)**
- [x] **Componentes de Astro (Props)**
- [x] **Layouts**

---

## Módulo 2: Contenido y Estilos

**Objetivo:** Aprender a manejar contenido y a aplicar estilos de forma eficiente.

- [x] **Estilos en Astro**
- [x] **Manejo de Contenido con Markdown**
- [x] **Colecciones de Contenido (Content Collections):**
  - Organizar y validar nuestro contenido (e.g., para un blog)
    usando esquemas de Zod.
  - Consultar (`query`) colecciones para mostrar listas de contenido.

---

## Módulo 3: Interactividad y Dinamismo

**Objetivo:** Añadir interactividad del lado del cliente con TypeScript.

- [ ] **Scripts del Lado del Cliente:**
  - Añadir TypeScript a nuestras páginas con la etiqueta `<script>`.
  - Entender el procesamiento de scripts en servidor y cliente.

- [ ] **Frameworks de UI con TypeScript (React, Svelte, Vue):**
  - Integrar un componente de un framework (ej. React con `.tsx`).
  - Entender el concepto de "Astro Islands".
  - Utilizar directivas de cliente (`client:load`, `client:idle`, `client:visible`).

---

## Proyecto Final: Blog Personal con TypeScript

**Objetivo:** Aplicar todos los conceptos aprendidos para construir
un blog personal completo y funcional.

- [ ] **Página de Inicio:**
  - Presentación personal y lista de las últimas entradas del blog.
- [ ] **Página de Blog (`/blog`):**
  - Muestra todas las entradas del blog.
- [ ] **Páginas de Entradas Individuales (`/blog/[slug]`):**
  - Generadas dinámicamente desde una colección de contenido.
- [ ] **Página "Sobre Mí" (`/about`):**
- [ ] **Layout Consistente con Header y Footer.**
- [ ] **Estilos con Tailwind CSS.**
- [ ] **(Opcional) Componente Interactivo:**
  - Añadir un "dark mode toggle" o similar.
