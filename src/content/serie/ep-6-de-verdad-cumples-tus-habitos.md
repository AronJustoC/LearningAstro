---
title: "¿De verdad cumples tus hábitos?"
descripcion: "Yo creía que cumplía, pero no sabía. Mi app ahora lo cuenta por mí, con un panel de avance y el tiempo de cada cosa."
episodio: 6
fecha: 2026-10-24
imagen: /blog/serie-app/ep6-4.jpg
imagenAlt: "Panel de la app con cumplimiento 52%, consistencia 100% y racha en cero"
stack: ["Kotlin", "Jetpack Compose", "Room", "Claude Code"]
pregunta: "¿Tú sabes cuánto cumples de verdad?"
---

Yo creía que cumplía mis hábitos, pero no lo sabía. Marcaba actividades como hechas u omitidas, y nada más. Entonces la idea fue clara: **mi app debería contarlo por mí**.

![La lista del día, con actividades hechas y omitidas](/blog/serie-app/ep6-2.jpg)

## Un panel con el porcentaje de avance

Construí un panel (*Dashboard*) con tres números: **cumplimiento**, **consistencia** y **racha**. Hoy marca un cumplimiento del 52%, una consistencia del 100% y una racha en cero.

![El panel de la app: cumplimiento 52%, consistencia 100%, racha 0](/blog/serie-app/ep6-4.jpg)

## Cuánto tiempo dedico a cada cosa

El panel también suma el tiempo registrado por categoría: por ejemplo, 43 horas de estudio y 27 horas y 12 minutos de salud.

## Semana por semana, sin maquillaje

Debajo hay un historial de las últimas 12 semanas. La semana del 5 de octubre, por ejemplo, fue de 50% de cumplimiento y 100% de consistencia, con una meta de 300 minutos y 277 minutos hechos.

![Historial semana por semana](/blog/serie-app/ep6-6.jpg)

Y hasta la racha: **hoy va en cero**.

## El stack de este episodio

- **Kotlin** y **Jetpack Compose**: el panel y sus números.
- **Room**: de ahí salen el porcentaje, el tiempo por categoría y las semanas.
- **Claude Code**: la IA con la que construyo cada pieza.
