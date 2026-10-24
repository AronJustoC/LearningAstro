---
title: "Mucho código, pero cero pantallas"
descripcion: "La IA admite que no avanzaba y me da dos caminos. Elijo seguir el plan, pero con más revisión."
episodio: 3
fecha: 2026-10-24
imagen: /blog/serie-app/ep3-7.jpg
imagenAlt: "Reporte del agente en la terminal: 139 pruebas pasan, ninguna falla, con el logo de Kotlin"
stack: ["Kotlin", "Jetpack Compose", "Room", "Claude Code", "Agente de TDD (ECC)", "Emulador de Android"]
pregunta: "¿Avances rápidos o bases firmes?"
---

Llevaba mucho código escrito y, sin embargo, mi app tenía **cero pantallas**. Si la instalaba en el teléfono, solo veía una pantalla en blanco.

## La IA admite que no avanzaba

Se lo conté a Claude Code y respondió con honestidad: reconoció que, aunque la base estaba bien, **no estaba avanzando** hacia algo que yo pudiera usar. Fue un buen momento para parar y decidir.

## Me da dos caminos para elegir

La IA me propuso dos caminos, con sus costos, y me dejó decidir a mí. Elegí **seguir el plan, pero con más revisión**: bases firmes antes de correr.

## Un agente experto programa por mí

Para esa parte llamé a un agente especialista en pruebas, que programa primero las pruebas y después el código. Mientras trabajaba, yo seguía el avance.

## Luego llega la parte que se ve

Cuando por fin llegaron las pantallas, ya había **139 pruebas que pasaban, ninguna falla**. La app mostraba su pantalla *Hoy* vacía ("Nothing planned for today") y el formulario para crear actividades, con sus minutos y los días en que se repiten.

![El reporte del agente: 139 pruebas pasan, ninguna falla](/blog/serie-app/ep3-7.jpg)

*Grabado el 8 de octubre de 2026.*

## El stack de este episodio

- **Kotlin** y **Jetpack Compose**: el código y las pantallas.
- **Room**: la base de datos que ya estaba probada.
- **Claude Code** y un **agente de TDD** del paquete ECC: escriben las pruebas primero.
- **Emulador de Android**: donde se ve la app mientras la construyo.
