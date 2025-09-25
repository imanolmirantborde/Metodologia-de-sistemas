# Proyecto: Juego Clicker de Alfajores  

## Descripción General  
Este proyecto consiste en el desarrollo de un **juego tipo clicker** cuyo objetivo es acumular puntos mediante la interacción con un botón.  

- **Mecánica básica**: al presionar el botón principal, el jugador obtiene puntos.  
- **Mejoras**: los puntos acumulados permiten adquirir mejoras que incrementan la cantidad de puntos por clic o generan puntos automáticamente por segundo.  
- **Multiplicadores**: se incluyen mejoras especiales que aumentan de forma significativa la producción de puntos.  

La temática está centrada en los **alfajores**:  
- El botón principal representará un **alfajor**, y cada clic generará "alfajores" como puntos.  
- Las mejoras estarán relacionadas con la producción, como **fábricas** o **granjas de alfajores**.  
- Los multiplicadores estarán representados por variedades como **alfajores de maicena, blancos o de chocolate blanco**.  

---

## Datos Técnicos  
**Base de datos**: [Supabase](https://supabase.com/) → para almacenar las partidas con inicio de sesión y perfiles de usuario.  
**Frontend**: desarrollado con **React + TypeScript** para asegurar un código robusto, tipado y mantenible.  

---

## Patrones de Diseño  
El proyecto implementará patrones de diseño para garantizar escalabilidad y mantenibilidad:  

**Estructural → Facade**: simplifica y unifica la interacción con subsistemas complejos.  
**De Comportamiento → Observer**: gestiona la comunicación entre objetos y actualiza automáticamente la interfaz y estadísticas del jugador.  

---

## Integrantes del Proyecto  
- Giuseppe Giovanelli
- Lucas Soresi
- Micaela Rocio Zubiel
- Imanol Mirant Borde
