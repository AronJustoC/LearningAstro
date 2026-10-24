---
title: "Creo mi app de rutina desde cero"
descripcion: "Una app de rutina diaria que construyo con IA. Primero el plan, luego el stack y cómo se guardan mis datos."
episodio: 1
fecha: 2026-10-24
imagen: /blog/serie-app/ep1-4.jpg
imagenAlt: "Terminal de Claude Code con el plan de 10 días y el logo de Jetpack Compose"
stack: ["Kotlin", "Jetpack Compose", "Room", "Android Studio", "Claude Code"]
pregunta: "¿Tú planeas o programas primero?"
---

Quiero una app de celular para controlar mi rutina diaria, y quiero construirla de cero con una IA como compañera: **Claude Code**, la IA que escribe el código conmigo. Este es el primer episodio de la serie y el origen de todo lo que viene después.

## Primero, el plan

Antes de escribir una sola línea de código, le pedí a la IA que armara el plan. Salió una hoja de ruta de **10 días**, con riesgos anotados y hitos por día: proyecto Android con la base de datos, categorías y plantillas, la pantalla del día, el cronómetro, el panel de resultados y la exportación de datos.

![Plan del código en la terminal, con el roadmap de 10 días y Jetpack Compose](/blog/serie-app/ep1-4.jpg)

## El stack que elegí

- **Kotlin**: el lenguaje con el que se programa Android.
- **Jetpack Compose**: la herramienta que dibuja la pantalla de la app.
- **Room**: guarda los datos de la rutina en el teléfono.
- **Android Studio**: el programa donde se construye la app.

## Cómo se guardan mis datos

Antes de pensar en pantallas dibujé cómo se conecta todo y definí qué va a guardar mi rutina: actividades con un nombre, un tipo, los minutos de meta y los días de la semana en que se repiten.

![Diagrama de la base de datos de la app, con la plantilla de actividad](/blog/serie-app/ep1-6.jpg)

## Instalo Android Studio para empezar

Para probar la app necesito el entorno de Android, así que el último paso del día fue instalar Android Studio.

![Android Studio, el programa donde se construye la app](/blog/serie-app/ep1-7.jpg)
