# 🎮 Fase 4C: Pantalla de Juego — Layout y Datos Base

Fecha: 24 de octubre de 2025  
Estado: ✅ Completada (Primera iteración del layout)

## Objetivo

Implementar el componente principal de la pantalla de juego (`PaginaJuego`) como contenedor/plantilla para niveles, definiendo el layout visual, la navegación y la carga dinámica de herramientas por nivel. Esta fase no incluye lógica de simulación (Phaser) ni reglas de juego.

## Alcance de esta fase

- Estructura JSX completa del layout: cabecera, área de simulación, caja de herramientas, panel del tutor y controles.
- Estilos base en CSS (tema pixel retro, grid responsivo, ajuste a viewport sin scroll externo).
- Ruta protegida `/juego/:panelId/:nivelId` conectada desde la selección de subtemas.
- Datos base para herramientas y configuración por nivel.
- Actualización de subtemas (niveles) por panel conforme al documento de diseño.

Fuera de alcance:

- Integración con Phaser.js, sprites, físicas o validaciones de juego.
- Persistencia de progreso en backend.

## Cambios realizados

### 1) Pantalla de juego (layout + navegación)

- `src/caracteristicas/juego/PaginaJuego.js`
  - Nuevo componente funcional con estructura de 5 secciones.
  - Lectura de `panelId` y `nivelId` desde la URL con `useParams`.
  - Botones: [VALIDAR], [PISTA], [REINICIAR] (placeholders) y [SALIR] → navega a `/subtemas`.
  - Carga dinámica de herramientas según nivel (ver sección 3).

- `src/caracteristicas/juego/PaginaJuego.css`
  - Layout con CSS Grid (2 columnas, 2 filas) y ajuste a `100vh`/`100vw`.
  - Sin scroll externo; scroll solo interno en la lista de herramientas.
  - Estética pixel: bordes cian, botones estilo pixel, placeholder de simulación con cuadrícula.

- `src/App.js`
  - Ruta protegida agregada: `/juego/:panelId/:nivelId` → renderiza `PaginaJuego`.

### 2) Datos de herramientas y configuración de niveles

- `src/caracteristicas/juego/datos/definicionHerramientas.js`
  - Catálogo `HERRAMIENTAS_DISPONIBLES` (12 herramientas iniciales) con `id`, `nombre` e `icono` (emojis/placeholder): cable, batería, resistencia fija, bombilla, interruptor, imán de barra, brújula, bobina, capacitor, fuente CA, motor, transformador.

- `src/caracteristicas/juego/datos/configuracionNiveles.js`
  - Mapa `CONFIGURACION_NIVELES`: asigna herramientas por nivel usando clave `panel-<n>-nivel-<n>`.
  - Helper `obtenerHerramientasParaNivel(panelId, nivelId)` con normalización de IDs.

### 3) Subtemas (niveles) por panel — actualización

- `src/caracteristicas/subtema/PaginaSubtema.js`
  - Reemplazo completo de `subtemasPorPanel` para incluir los 6 paneles definidos en el diseño (Chatarrería, Electricidad, Magnetismo, Faraday, Circuitos Complejos, CA).
  - Primer nivel de Panel 1 desbloqueado (modo alumno). En modo docente, todos desbloqueados.
  - Botón “¡EMPEZAR NIVEL!” navega a `/juego/:panelId/:nivelId`.

## Flujo de datos (alto nivel)

1. Usuario selecciona panel y nivel en `PaginaSubtema` → `navegar(/juego/:panelId/:nivelId)`.
2. `PaginaJuego` lee `panelId` y `nivelId` con `useParams`.
3. `obtenerHerramientasParaNivel(panelId, nivelId)` devuelve IDs permitidos.
4. Se filtra `HERRAMIENTAS_DISPONIBLES` por esos IDs → render en “Caja de Herramientas”.

## Casos de prueba rápidos

- Al entrar en `/juego/1/1` se muestran herramientas: cable, batería.
- Al entrar en `/juego/2/2` se muestran: cable, batería, resistencia, bombilla, interruptor.
- La pantalla cabe en el viewport sin scroll; solo la lista de herramientas hace scroll si excede.
- [SALIR] lleva siempre a `/subtemas`.
- En móvil (≤768px), el grid se apila en una sola columna.

## Archivos modificados/creados

- Creado: `src/caracteristicas/juego/PaginaJuego.js`
- Creado: `src/caracteristicas/juego/PaginaJuego.css`
- Actualizado: `src/App.js` (ruta del juego)
- Creado: `src/caracteristicas/juego/datos/definicionHerramientas.js`
- Creado: `src/caracteristicas/juego/datos/configuracionNiveles.js`
- Actualizado: `src/caracteristicas/subtema/PaginaSubtema.js` (subtemas por panel, navegación a juego)

## Siguientes pasos sugeridos

- Integrar Phaser.js dentro de `area-simulacion` (canvas montado en un contenedor con `ref`).
- Definir un contract de “herramienta” para arrastrar/soltar (tipos, slots, validaciones).
- Sincronizar título y objetivo de nivel desde una fuente de datos común (mock/local o futura API).
- Añadir overlays básicos: Cargando, Pausado, Error.

---

Última actualización: 24 de octubre de 2025
