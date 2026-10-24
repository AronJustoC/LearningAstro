---
title: "Mi app funciona, pero se ve fea"
descripcion: "Instalo Impeccable, una skill de diseño para Claude, y le pido un estilo de cuaderno de taller. La app cambia de cara."
episodio: 8
fecha: 2026-10-24
imagen: /blog/serie-app/ep8-8.jpg
imagenAlt: "La app antes, en gris y morado, y ahora con el estilo de cuaderno de taller"
stack: ["Claude Code", "Impeccable", "Kotlin", "Jetpack Compose"]
pregunta: "¿Cuál prefieres: antes o ahora?"
---

Mi app funciona, pero **se ve fea**: colores básicos y una letra común, igual que cualquier otra app.

![Cómo se veía mi app antes: color básico y letra común](/blog/serie-app/ep8-1.jpg)

## Instalo una skill de diseño en Claude

La solución fue una **skill de diseño para Claude** llamada **Impeccable**. Se instala en dos pasos y en la misma terminal de Claude Code:

1. Primero agrego su tienda:
   `/plugin marketplace add pbakaus/impeccable`
2. Luego la instalo con un comando:
   `/plugin install impeccable@impeccable`

![Impeccable: skill de diseño con color, letras y espacio](/blog/serie-app/ep8-2.jpg)

## Le pido un estilo: cuaderno de taller

Con la skill lista, le pedí un estilo concreto:

`/impeccable shape cuaderno de taller`

## Colores, letras y botones nuevos

El resultado cambió la app entera: fondo de papel, letra manuscrita, botones con borde y hasta el cronómetro, que ahora es un bloque amarillo.

![La app ahora, con el estilo de cuaderno de taller](/blog/serie-app/ep8-6.jpg)

![Antes y ahora, lado a lado](/blog/serie-app/ep8-8.jpg)

*Grabado el 11 de octubre de 2026.*

## El stack de este episodio

- **Claude Code**: donde corre la skill.
- **Impeccable**: la skill de diseño con la que pedí el estilo.
- **Kotlin** y **Jetpack Compose**: el código de pantallas que recibe los cambios.
