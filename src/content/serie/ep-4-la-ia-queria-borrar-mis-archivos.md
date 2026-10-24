---
title: "La IA quería borrar mis archivos"
descripcion: "Mi app ya cuenta el tiempo, pero mi disco llegó al 95%. Dejé que la IA limpie lo seguro y lo dudoso lo decido yo."
episodio: 4
fecha: 2026-10-24
imagen: /blog/serie-app/ep4-1.jpg
imagenAlt: "La app en el emulador con un cronómetro corriendo en la actividad Read"
stack: ["Kotlin", "Jetpack Compose", "Room", "Android", "Claude Code"]
pregunta: "¿Dejarías que una IA limpie tu PC?"
---

Mi app por fin **cuenta el tiempo**: inicio una actividad, el cronómetro corre y puedo pausarla o terminarla.

![La app con un cronómetro corriendo](/blog/serie-app/ep4-1.jpg)

## Mi PC se quedó sin espacio

Justo cuando todo avanzaba, mi PC dijo que ya no tenía espacio: el **disco había llegado al 95%**. No podía seguir trabajando así.

## ¿Y qué ocupa tanto?

Le pregunté a la IA qué ocupaba tanto, y la respuesta fue una sorpresa: **carpetas viejas por todos lados**, cachés de proyectos y de paquetes que ya no hacían falta.

## La regla: nada se borra sin mi permiso

Aquí vino el susto: la IA se ofreció a borrar mis archivos. Así que fijé una regla y separé la lista en dos:

- **Lo seguro**, lo que se puede volver a generar sin perder nada: lo borra el agente.
- **Lo dudoso**: lo decido yo.

![Claude Code separando lo seguro de lo dudoso](/blog/serie-app/ep4-6.jpg)

Entonces le dije a la IA que borrara **solo lo seguro**. Lo demás espera a que yo lo revise.

![La app, al cierre del episodio](/blog/serie-app/ep4-8.jpg)

*Grabado el 8 de octubre de 2026.*

## El stack de este episodio

- **Kotlin** y **Jetpack Compose**: la app y su cronómetro.
- **Room**: guarda cada sesión de tiempo.
- **Claude Code**: la IA que propuso limpiar, con permisos que yo controlo.
