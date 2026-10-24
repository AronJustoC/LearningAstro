---
title: "¿Cómo sabe mi app si cumplo?"
descripcion: "Cada actividad tiene una meta y su propio tiempo. Toco iniciar, el reloj corre y la barra me muestra cuánto llevo."
episodio: 9
fecha: 2026-10-24
imagen: /blog/serie-app/ep9-5.jpg
imagenAlt: "La app con el cronómetro amarillo corriendo y la barra de avance de la actividad"
stack: ["Kotlin", "Jetpack Compose", "Room", "Impeccable", "Claude Code"]
pregunta: "¿Qué meta pondrías tú primero?"
---

La pregunta de este episodio es la más simple de la serie: **¿cómo sabe mi app si cumplo?**

## Funciona con metas y controla su tiempo

Cada actividad tiene una **meta del día** y su propio tiempo. Por ejemplo: *correr, treinta minutos*.

![Una actividad con meta: correr 30 minutos](/blog/serie-app/ep9-3.jpg)

## Toco iniciar y el reloj corre

Al tocar **Iniciar** arranca el cronómetro, y debajo de la actividad una barra me va mostrando **cuánto llevo**.

![El cronómetro corre y la barra de avance sube](/blog/serie-app/ep9-5.jpg)

## Si llego al tiempo, cumplí

Cuando el tiempo llega a la meta, la actividad se marca como cumplida. Al tocar **Hecho** queda guardado.

![Toco Hecho y el avance queda guardado](/blog/serie-app/ep9-7.jpg)

## El stack de este episodio

- **Kotlin** y **Jetpack Compose**: el cronómetro, la barra de avance y los botones.
- **Room**: guarda cada actividad hecha y su tiempo.
- **Impeccable**: el estilo de cuaderno de taller de la pantalla.
- **Claude Code**: la IA con la que construyo la app.
