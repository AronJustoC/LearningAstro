---
title: "Pongo a prueba mi base de datos"
descripcion: "Creo un celular virtual en mi PC y corro cinco pruebas sobre la base de datos. Todas pasan."
episodio: 2
fecha: 2026-10-24
imagen: /blog/serie-app/ep2-2.jpg
imagenAlt: "Emulador de Android abierto en el escritorio, un celular virtual dentro de mi PC"
stack: ["Room", "SQLite", "Gradle", "KSP", "Emulador de Android", "Claude Code"]
pregunta: "¿Pruebas en emulador o en celular?"
---

Antes de dibujar una sola pantalla quise saber si la base de datos aguantaba. Para eso necesitaba un celular, y no quería depender de uno real: creé un **celular virtual dentro de mi PC**.

![Emulador de Android: un celular virtual en mi PC](/blog/serie-app/ep2-2.jpg)

## Un agente arma el prototipo

Dejé que un agente trabajara en segundo plano mientras yo miraba. Lo que armó fue un proyecto mínimo: la base de datos y sus pruebas. Todavía **sin pantallas**, solo la base. Él mismo me lo aclaró: ninguna pantalla y nada que se vea.

## Cinco pruebas en el emulador

Corrí cinco pruebas sobre la base de datos, directamente en el emulador:

1. Abrir la base en frío.
2. Un solo cronómetro activo a la vez.
3. Los triggers.
4. Las vistas.
5. La migración de la versión 1 a la 2.

Las cinco pasaron.

![Resultado de las pruebas: las cinco pasan](/blog/serie-app/ep2-6.jpg)

## Diez semanas de datos en 1,3 milisegundos

Para medir el rendimiento le cargué **diez semanas de datos** (520 tareas y 1.560 sesiones). Sumar todo tardó **1,32 ms** en el emulador.

## El stack de este episodio

- **Room** sobre **SQLite**: la base de datos de la app.
- **Gradle 9.8.1**, **KSP 2.3.12** y **Room 2.8.5**: las versiones que fijó el agente.
- **Emulador de Android**: el celular virtual donde corren las pruebas.
- **Claude Code**: la IA con la que construyo.
