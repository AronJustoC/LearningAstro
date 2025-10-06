# Guía de Construcción: Componente `Hero.astro`

Este documento detalla el proceso de creación de un componente `Hero` dinámico y estilizado para un portafolio, utilizando Astro, Tailwind CSS y Shiki para el resaltado de sintaxis.

Seguiremos un enfoque incremental, empezando por una estructura simple y añadiendo capas de estilo y funcionalidad. Cada "checkpoint" representa un hito lógico en el desarrollo y puede corresponder a un commit en Git.

---

### [ ] Checkpoint 1: Estructura y Maquetado Básico

**Objetivo:** Crear el esqueleto HTML del componente. Nos enfocaremos en la semántica y el contenido, sin preocuparnos aún por el diseño.

**Pasos:**

1.  Crea el archivo `src/components/Hero.astro`.
2.  Añade el siguiente código, que define una sección con dos columnas: una para el texto y otra para un bloque de código de ejemplo.

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

### [ ] Checkpoint 2: Estilizado con Tailwind CSS

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

### [ ] Checkpoint 3: Integración de Shiki para Resaltado de Sintaxis

**Objetivo:** Añadir resaltado de sintaxis profesional al bloque de código usando Shiki.

**Pasos:**

1.  Instala Shiki: `npm install shiki`.
2.  Actualiza el `script` del frontmatter para procesar el código y el `template` para renderizar el resultado.

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

### [ ] Checkpoint 4: Estilos Personalizados y Acabados Visuales

**Objetivo:** Añadir todos los estilos en línea que usan variables CSS para dar al componente su aspecto final y único (colores, gradientes, brillos).

**Pasos:** Agrega los atributos `style` a los elementos correspondientes. Este paso asume que tienes variables como `--color-primary` definidas en un archivo CSS global.

*En este punto, el código se volverá idéntico al que me proporcionaste inicialmente, pero sin las animaciones.*

**Checkpoint de Git:** El componente ya tiene su diseño final y está listo para los toques finales.

> ```bash
> git add .
> git commit -m "style(hero): apply custom theme and visual details"
> ```

---

### [ ] Checkpoint 5: Animaciones y Efectos Finales

**Objetivo:** Dar vida al componente con animaciones sutiles y añadir los elementos decorativos de fondo.

**Pasos:**

1.  Añade la etiqueta `<style>` al final del archivo con las definiciones de `@keyframes` y las clases de ayuda.
2.  Añade las clases de animación (`animate-fadeIn`, `animate-slideUp`) a los elementos HTML.
3.  Añade los `div` para los "blobs" decorativos de fondo.

*El código final será exactamente el que me mostraste en tu consulta inicial.*

**Checkpoint de Git:** El componente está completo, con un diseño pulido y animaciones.

> ```bash
> git add .
> git commit -m "feat(hero): add animations and decorative elements"
> ```

---

### Próximos Pasos y Mejoras

¡Felicidades! Has construido un componente `Hero` impresionante. Como mejora futura, podrías considerar:

*   **Refactorizar Estilos:** Mover los estilos en línea a una etiqueta `<style>` con clases (como hicimos con el `Footer`), para un HTML más limpio.
*   **Props del Componente:** Permitir que el título, la descripción o el snippet de código se pasen como `props` para hacer el componente aún más reutilizable.