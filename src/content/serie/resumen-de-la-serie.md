---
title: "Cómo construí una app de rutinas con IA: resumen de la serie"
descripcion: "De cero pantallas a una app de rutinas para Android: el stack, los problemas reales y lo que aprendí construyendo con una IA como compañera."
episodio: 0
fecha: 2026-10-24
imagen: /blog/serie-app/ep8-8.jpg
imagenAlt: "La app de rutinas antes y después del diseño de cuaderno de taller"
stack: ["Kotlin", "Jetpack Compose", "Room", "SQLite", "Android Studio", "Claude Code", "Impeccable"]
pregunta: "¿Qué le agregarías a mi app?"
---

Quise una app de celular para controlar mi rutina diaria y decidí construirla **de cero con una IA como compañera de equipo**: Claude Code. La grabé en video, episodio por episodio. Este artículo junta toda la historia en un solo lugar, y cada paso enlaza al episodio completo.

## El resultado en una frase

Una app para Android donde cada actividad tiene una **meta de tiempo**: toco *Iniciar*, el reloj corre, una barra me muestra cuánto llevo y, si llego a la meta, cumplí. Un panel me dice cuánto cumplo de verdad, semana por semana.

![La app antes y después del diseño: de gris y morado a cuaderno de taller](/blog/serie-app/ep8-8.jpg)

## El stack

- **Kotlin**: el lenguaje con el que se programa Android.
- **Jetpack Compose**: dibuja las pantallas de la app.
- **Room** sobre **SQLite**: guarda la rutina y el tiempo en el teléfono.
- **Android Studio** y su **emulador**: donde construyo y pruebo sin un celular real.
- **Claude Code**: la IA con la que escribo el código.
- **Impeccable**: la skill de diseño que dio a la app su estilo.

## La historia, paso a paso

1. **[Creo mi app de rutina desde cero](/blog/serie/ep-1-la-idea-y-el-plan)**: antes de programar, un plan de 10 días, el stack elegido y el diseño de cómo se guardan los datos.
2. **[Pongo a prueba mi base de datos](/blog/serie/ep-2-pongo-a-prueba-mi-base-de-datos)**: un celular virtual en mi PC y cinco pruebas que pasan. Diez semanas de datos se suman en 1,32 ms.
3. **[Mucho código, pero cero pantallas](/blog/serie/ep-3-mucho-codigo-cero-pantallas)**: la IA admite que no avanzaba, elijo seguir el plan con más revisión y llegan las pantallas con 139 pruebas en verde.
4. **[La IA quería borrar mis archivos](/blog/serie/ep-4-la-ia-queria-borrar-mis-archivos)**: mi disco llegó al 95%. Lo seguro lo borra la IA y lo dudoso lo decido yo.
5. **[¿De verdad cumples tus hábitos?](/blog/serie/ep-6-de-verdad-cumples-tus-habitos)**: un panel con cumplimiento, consistencia y racha, y el tiempo por categoría.
6. **[Mi app funciona, pero se ve fea](/blog/serie/ep-8-le-ensene-mi-gusto-a-la-ia)**: instalo Impeccable y le pido un estilo de cuaderno de taller.
7. **[¿Cómo sabe mi app si cumplo?](/blog/serie/ep-9-como-sabe-mi-app-si-cumplo)**: metas con tiempo propio, un reloj que corre y un botón *Hecho*.

![El cronómetro corre y la barra de avance sube](/blog/serie-app/ep9-5.jpg)

## Lo que aprendí

- **El plan va antes que el código.** Un plan de 10 días me ahorró decidir a ciegas.
- **Pruebas primero, pantallas después.** Con la base probada, las pantallas llegaron sobre terreno firme.
- **Una IA que admite cuando no avanza vale más que una que siempre dice que sí.** Parar y elegir un camino fue mejor decisión que seguir corriendo.
- **Yo decido lo que importa.** Ante un riesgo, como borrar archivos, la regla fue clara: lo seguro lo hace la IA y lo dudoso lo decido yo.
- **Medir con datos.** Un panel me mostró cuánto cumplía de verdad, no cuánto creía.
- **El diseño también se enseña.** Con una skill de diseño y una idea clara de lo que quería, la app dejó de parecer una más.

## Y tú, ¿qué le agregarías?

La serie sigue. Si quieres una app así para tu negocio, o automatizar algo de tu empresa, [cuéntame qué necesitas](/contacto).
