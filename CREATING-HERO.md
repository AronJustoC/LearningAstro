# Guía de Construcción: Componente `Hero.astro`

Este documento detalla el proceso de creación de un componente `Hero` dinámico y estilizado para un portafolio, utilizando Astro, Tailwind CSS y Shiki para el resaltado de sintaxis.

Seguiremos un enfoque incremental, empezando por una estructura simple y añadiendo capas de estilo y funcionalidad. Cada "checkpoint" representa un hito lógico en el desarrollo y puede corresponder a un commit en Git.

---

### [ ] Checkpoint 1: Estructura y Maquetado Básico

**Objetivo:** Crear el esqueleto HTML del componente. Nos enfocaremos en la semántica y el contenido, sin preocuparnos aún por el diseño.

**Pasos:**

1. Crea el archivo `src/components/Hero.astro`.
2. Añade el siguiente código, que define una sección con dos columnas: una para el texto y otra para un bloque de código de ejemplo.

```astro
{/* src/components/Hero.astro */}
---
---
<section class="py-20">
  <div class="max-w-7xl mx-auto px-6 lg:px-8">
    {/* Contenedor principal de la rejilla */}
    <div class="grid lg:grid-cols-2 gap-12 items-center">

      {/* Columna Izquierda: Texto */}
      <div class="space-y-6">
        <h1>Hola, soy Aron Justo</h1>
        <p>
          Desarrollador Full Stack apasionado por crear experiencias web que
          combinan diseño elegante con código limpio.
        </p>
        <div class="flex gap-4">
          <a href="/proyectos">Ver mi trabajo</a>
          <a href="/contacto">Contáctame</a>
        </div>
      </div>

      {/* Columna Derecha: Bloque de Código (Placeholder) */}
      <div>
        <pre><code>
const aron = {
  name: "Aron Justo",
  role: "Full Stack Developer"
};
        </code></pre>
      </div>

    </div>
  </div>
</section>
```

**Checkpoint de Git:** En este punto, tienes la estructura base. Es un buen momento para hacer tu primer commit.

> ```bash
> git add .
> git commit -m "feat(hero): add initial html structure for hero component"
> ```

---

### [x] Checkpoint 2: Estilizado con Tailwind CSS

**Objetivo:** Aplicar clases de Tailwind CSS para dar forma al layout, la tipografía y los elementos básicos, haciendo que el componente sea responsive.

**Pasos:** Modifica tu archivo `Hero.astro` para añadir las clases de utilidad de Tailwind.

```astro
{/* src/components/Hero.astro */}
---
---
<section class="min-h-screen flex items-center py-20">
  <div class="max-w-7xl mx-auto px-6 lg:px-8 w-full">
    <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

      {/* Columna Izquierda: Texto */}
      <div class="space-y-8 order-2 lg:order-1">
        <h1 class="text-5xl lg:text-7xl font-bold leading-tight">
          Hola, soy
          <span class="block mt-2">Aron Justo</span>
        </h1>
        <p class="text-lg lg:text-xl opacity-80 leading-relaxed max-w-xl">
          Desarrollador Full Stack apasionado por crear experiencias web que
          combinan diseño elegante con código limpio. Transformo ideas en
          productos digitales que la gente ama usar.
        </p>
        <div class="flex flex-wrap gap-4 pt-4">
          <a href="/proyectos" class="px-8 py-4 rounded-xl font-semibold">
            Ver mi trabajo
          </a>
          <a href="/contacto" class="px-8 py-4 rounded-xl font-semibold border-2">
            Contáctame
          </a>
        </div>
      </div>

      {/* Columna Derecha: Bloque de Código */}
      <div class="order-1 lg:order-2">
        <div class="relative rounded-2xl overflow-hidden shadow-lg">
          {/* Header de la ventana de código */}
          <div class="flex items-center gap-2 px-4 py-3 border-b">
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span class="text-sm font-mono ml-2 opacity-60">auth.ts</span>
          </div>
          {/* Contenido del código */}
          <div class="p-6 overflow-x-auto">
            <pre><code>
const aron = {
  name: "Aron Justo",
  role: "Full Stack Developer"
};
            </code></pre>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>
```

**Checkpoint de Git:** Ahora el componente se ve estructurado y es responsive.

> ```bash
> git add .
> git commit -m "style(hero): apply tailwind for layout and typography"
> ```

---

### [x] Checkpoint 3: Integración de Shiki para Resaltado de Sintaxis

**Objetivo:** Añadir resaltado de sintaxis profesional al bloque de código usando Shiki.

**Pasos:**

1. Instala Shiki: `npm install shiki`.
2. Actualiza el `script` del frontmatter para procesar el código y el `template` para renderizar el resultado.

```astro
{/* src/components/Hero.astro */}
---
import { codeToHtml } from "shiki";

const sampleCode = `interface Developer {
  name: string;
  role: string;
  passion: string;
}

const aron: Developer = {
  name: "Aron Justo",
  role: "Full Stack Developer",
  passion: "Building amazing things"
};

export default aron;`;

const highlighted = await codeToHtml(sampleCode, {
  lang: "typescript",
  theme: "vitesse-dark", // Puedes cambiar el tema
});
---
<section class="min-h-screen flex items-center py-20">
  <div class="max-w-7xl mx-auto px-6 lg:px-8 w-full">
    <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      {/* ... Columna Izquierda sin cambios ... */}
      <div class="space-y-8 order-2 lg:order-1">
        <h1 class="text-5xl lg:text-7xl font-bold leading-tight">
          Hola, soy
          <span class="block mt-2">Aron Justo</span>
        </h1>
        <p class="text-lg lg:text-xl opacity-80 leading-relaxed max-w-xl">
          Desarrollador Full Stack apasionado por crear experiencias web que
          combinan diseño elegante con código limpio. Transformo ideas en
          productos digitales que la gente ama usar.
        </p>
        <div class="flex flex-wrap gap-4 pt-4">
          <a href="/proyectos" class="px-8 py-4 rounded-xl font-semibold">
            Ver mi trabajo
          </a>
          <a href="/contacto" class="px-8 py-4 rounded-xl font-semibold border-2">
            Contáctame
          </a>
        </div>
      </div>

      {/* Columna Derecha: Bloque de Código con Shiki */}
      <div class="order-1 lg:order-2">
        <div class="relative rounded-2xl overflow-hidden shadow-2xl">
          {/* ... Header de la ventana sin cambios ... */}
          <div class="flex items-center gap-2 px-4 py-3 border-b">
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span class="text-sm font-mono ml-2 opacity-60">auth.ts</span>
          </div>

          {/* Contenido del código con Shiki */}
          <div class="p-6 overflow-x-auto">
            <Fragment set:html={highlighted} />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Checkpoint de Git:** El componente ahora es dinámico y muestra código resaltado.

> ```bash
> git add .
> git commit -m "feat(hero): integrate shiki for code highlighting"
> ```

---

### [x] Checkpoint 4: Estilos Personalizados y Acabados Visuales

**Objetivo:** Aplicar nuestra paleta de colores definida en `global.css`, mejorar el aspecto de los botones y añadir un efecto de brillo de fondo para dar profundidad.

**Pasos:**

1. **Añadir Estilos a Botones:** Modificaremos los links para que parezcan botones, uno principal (con fondo) y uno secundario (con borde), usando las variables de color.
2. **Añadir Brillos de Fondo:** Agregaremos `divs` con posicionamiento absoluto, gradientes radiales y un filtro de desenfoque (`blur`) para crear un efecto de "blob" o brillo decorativo detrás del contenido.

**Código:** Reemplaza el contenido de `src/components/Hero.astro` con el siguiente código.

```astro
{/* src/components/Hero.astro - CHECKPOINT 4 */}}
---
import { codeToHtml } from "shiki";

// ... (el código de Shiki no cambia)
const sampleCode = `interface Developer {
  name: string;
  role: string;
  passion: string;
}

const aron: Developer = {
  name: "Aron Choque",
  role: "JS Developer",
  passion: "Building amazing things",
}

export default aron;
`;

const highlighted = await codeToHtml(sampleCode, {
  lang: "typescript",
  theme: "catppuccin-macchiato",
});
---
<section class="relative min-h-screen flex items-center py-20">
  {/* Efectos de brillo de fondo */}
  <div class="absolute inset-0 -z-10 overflow-hidden">
    <div class="absolute top-0 left-0 w-96 h-96 rounded-full bg-primary-glow opacity-20 blur-3xl"></div>
    <div class="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-secondary-glow opacity-20 blur-3xl"></div>
  </div>

  <div class="max-w-7xl mx-auto px-6 lg:px-8 w-full">
    <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <div class="space-y-8 order-2 lg:order-1">
        <div class="space-y-6">
          <h1 class="text-5xl lg:text-6xl font-bold leading-tight">
            Soy <span class="block mt-2" style="color: var(--color-primary);">Aron Choque</span>
          </h1>
          <p class="text-md lg:text-lg opacity-80 leading-relaxed max-w-xl">
            Desarrollador <strong>Backend</strong> con Node apasionado por crear
            experiencias web sólidas y seguras.
          </p>
          <div class="flex flex-wrap gap-4 pt-5">
            <a href="/proyectos" class="px-8 py-4 rounded-xl font-semibold transition-transform duration-300 hover:scale-105" style="background-color: var(--color-primary); color: var(--color-bg);">
              Ver mi trabajo
            </a>
            <a href="/contacto" class="px-8 py-4 rounded-xl font-semibold border-2 transition-transform duration-300 hover:scale-105" style="border-color: var(--color-primary); color: var(--color-primary);">
              Contáctame
            </a>
          </div>
        </div>
      </div>
      <div class="order-1 lg:order-2">
        <div class="relative rounded-2xl overflow-hidden shadow-2xl" style="border: 1px solid var(--color-primary-dark);">
          <div class="flex items-center gap-2 px-4 py-3 border-b" style="border-color: var(--color-primary-dark);">
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span class="text-sm font-mono ml-2 opacity-60">developer.ts</span>
          </div>
          <div class="p-6 overflow-x-auto">
            <Fragment set:html={highlighted} />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .bg-primary-glow {
    background-color: var(--color-primary);
  }
  .bg-secondary-glow {
    background-color: var(--color-primary-dark);
  }
</style>
```

**Checkpoint de Git:**

> ```bash
> git add .
> git commit -m "style(hero): apply custom theme and decorative elements"
> ```

---

### [ ] Checkpoint 5: Animaciones de Entrada y Transiciones

**Objetivo:** Dar vida al componente con animaciones de entrada para los elementos y mejorar las transiciones de los botones.

**Pasos:**

1. **Definir Animaciones:** Añadiremos una etiqueta `<style>` para definir `@keyframes` para las animaciones `fadeIn` (aparecer) y `slideUp` (deslizar hacia arriba).
2. **Aplicar Animaciones:** Usaremos clases y estilos en línea para aplicar estas animaciones a los elementos del `Hero`, usando `animation-delay` para que aparezcan de forma escalonada.

**Código:** Reemplaza el contenido de `src/components/Hero.astro` con el código final.

```astro
{/* src/components/Hero.astro - CHECKPOINT 5 (FINAL) */}}
---
import { codeToHtml } from "shiki";

// ... (el código de Shiki no cambia)
const sampleCode = `interface Developer {
  name: string;
  role: string;
  passion: string;
}

const aron: Developer = {
  name: "Aron Choque",
  role: "JS Developer",
  passion: "Building amazing things",
}

export default aron;
`;

const highlighted = await codeToHtml(sampleCode, {
  lang: "typescript",
  theme: "catppuccin-macchiato",
});
---
<section class="relative min-h-screen flex items-center py-20">
  {/* Efectos de brillo de fondo */}
  <div class="absolute inset-0 -z-10 overflow-hidden">
    <div class="absolute top-0 left-0 w-96 h-96 rounded-full bg-primary-glow opacity-20 blur-3xl animate-blob"></div>
    <div class="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-secondary-glow opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
  </div>

  <div class="max-w-7xl mx-auto px-6 lg:px-8 w-full">
    <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <div class="space-y-8 order-2 lg:order-1 animate-slideUp">
        <div class="space-y-6">
          <h1 class="text-5xl lg:text-6xl font-bold leading-tight">
            Soy <span class="block mt-2" style="color: var(--color-primary);">Aron Choque</span>
          </h1>
          <p class="text-md lg:text-lg opacity-80 leading-relaxed max-w-xl" style="animation-delay: 0.2s;">
            Desarrollador <strong>Backend</strong> con Node apasionado por crear
            experiencias web sólidas y seguras.
          </p>
          <div class="flex flex-wrap gap-4 pt-5" style="animation-delay: 0.4s;">
            <a href="/proyectos" class="px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg" style="background-color: var(--color-primary); color: var(--color-bg);">
              Ver mi trabajo
            </a>
            <a href="/contacto" class="px-8 py-4 rounded-xl font-semibold border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg" style="border-color: var(--color-primary); color: var(--color-primary); box-shadow: 0 0 10px transparent;">
              Contáctame
            </a>
          </div>
        </div>
      </div>
      <div class="order-1 lg:order-2 animate-fadeIn" style="animation-delay: 0.6s;">
        <div class="relative rounded-2xl overflow-hidden shadow-2xl" style="border: 1px solid var(--color-primary-dark);">
          <div class="flex items-center gap-2 px-4 py-3 border-b" style="border-color: var(--color-primary-dark);">
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span class="text-sm font-mono ml-2 opacity-60">developer.ts</span>
          </div>
          <div class="p-6 overflow-x-auto">
            <Fragment set:html={highlighted} />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .bg-primary-glow {
    background-color: var(--color-primary);
  }
  .bg-secondary-glow {
    background-color: var(--color-primary-dark);
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes blob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(20px, -30px) scale(1.1); }
    50% { transform: translate(-20px, 30px) scale(0.9); }
    75% { transform: translate(10px, -10px) scale(1.05); }
  }

  .animate-slideUp {
    animation: slideUp 0.5s forwards;
    opacity: 0;
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s forwards;
    opacity: 0;
  }

  .animate-blob {
    animation: blob 10s infinite;
  }

  .animation-delay-2000 {
    animation-delay: 2s;
  }
</style>
```

**Checkpoint de Git:**

> ```bash
> git add .
> git commit -m "feat(hero): add entry animations and transitions"
> ```

---

### Próximos Pasos y Mejoras

¡Felicidades! Has construido un componente `Hero` impresionante. Como mejora futura, podrías considerar:

- **Refactorizar Estilos:** Mover los estilos en línea a una etiqueta `<style>` con clases (como hicimos con el `Footer`), para un HTML más limpio.
- **Props del Componente:** Permitir que el título, la descripción o el snippet de código se pasen como `props` para hacer el componente aún más reutilizable.
