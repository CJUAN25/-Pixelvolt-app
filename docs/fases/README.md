# 📚 Documentación del Proyecto PixelVolt

## Índice de Fases de Desarrollo

Este directorio contiene la documentación completa del proceso de desarrollo del proyecto PixelVolt, organizada por fases.

---

## 📋 Fases Completadas

### ✅ [Fase 1: Reestructuración de la Arquitectura Central](./FASE-1-REFACTORIZACION.md)

**Fecha**: 7 de octubre de 2025 (Migrado: 21 de octubre de 2025)  
**Estado**: ✅ Completada y Migrada a Español

**Resumen**:

- Instalación de react-router-dom
- Reestructuración completa del proyecto
- Migración de nomenclatura a español (features → caracteristicas, etc.)
- Sistema de autenticación global con ContextoAutenticacion
- Implementación de rutas protegidas (RutaProtegida)
- Navegación basada en URLs

**Archivos Clave**:

- `src/contexto/ContextoAutenticacion.js`
- `src/componentes/RutaProtegida.js`
- `src/App.js`

---

### ✅ [Fase 2: Adaptación del Flujo de Autenticación](./FASE-2-AUTENTICACION.md)

**Fecha**: 7 de octubre de 2025 (Migrado: 21 de octubre de 2025)  
**Estado**: ✅ Completada y Migrada a Español

**Resumen**:

- Integración de ContextoAutenticacion en PaginaAutenticacion
- Sistema de códigos de invitación para docentes
- Código `PROFESOR2025` para registro de docentes
- Validación de contraseñas
- Asignación dinámica de roles (Estudiante/Docente)
- Migración completa de nombres a español

**Requisitos Funcionales Implementados**:

- **RF-001**: Sistema de inicio de sesión
- **RF-010**: Código de invitación para docentes

**Archivos Clave**:

- `src/caracteristicas/autenticacion/PaginaAutenticacion.js`

---

### ✅ [Fase 3: Panel del Laboratorio](./FASE-3-LABORATORIO.md)

**Fecha**: 8 de octubre de 2025 (Migrado: 21 de octubre de 2025)  
**Estado**: ✅ Completada y Migrada a Español

**Resumen**:

- Diseño responsive de dos columnas para PaginaLaboratorio
- 6 paneles temáticos (Chatarrería de Robots, Electricidad, Magnetismo, etc.)
- Sistema de desbloqueo progresivo
- Modo Sandbox para docentes (todos los paneles desbloqueados)
- Componente TarjetaPanel reutilizable
- Navegación a PaginaSubtema

**Requisitos Funcionales Implementados**:

- **RF-002**: Visualización de paneles temáticos
- **RF-003**: Sistema de progreso con estados (desbloqueado/bloqueado/completado)
- **RF-011**: Modo Sandbox para docentes

**Archivos Clave**:

- `src/caracteristicas/laboratorio/PaginaLaboratorio.js`
- `src/caracteristicas/subtema/PaginaSubtema.js`
- `src/componentes/TarjetaPanel.js`

---

### ✅ [Fase 4A: Panel de Control del Docente - Parte A](./FASE-4A-DASHBOARD-GRUPOS.md)

**Fecha**: 9 de octubre de 2025 (Migrado: 21 de octubre de 2025)  
**Estado**: ✅ Completada y Migrada a Español

**Resumen**:

- Dashboard exclusivo para docentes (`/dashboard`)
- Pestaña de Gestión de Grupos (GestorGrupos)
- CRUD completo de grupos con servicioGrupos
- Generación automática de códigos de unión
- Modales para crear/editar/eliminar grupos
- Sistema de mock database con localStorage

**Requisitos Funcionales Implementados**:

- **RF-006**: Creación y gestión de grupos
- **RF-007**: Generación de códigos de unión únicos

**Archivos Clave**:

- `src/paginas/DashboardPage.js`
- `src/caracteristicas/panel-control/GestorGrupos.js`
- `src/api/servicioGrupos.js`

---

### ✅ [Fase 4B: Panel de Control del Docente - Parte B](./FASE-4B-DASHBOARD-PROGRESO.md)

**Fecha**: 9 de octubre de 2025 (Migrado: 21 de octubre de 2025)  
**Estado**: ✅ Completada y Migrada a Español

**Resumen**:

- Pestaña de Visor de Progreso (VisorProgreso)
- Métricas de progreso por grupo
- Rendimiento por panel temático
- Filtros por grupo
- Integración con servicioProgreso
- Visualización de datos de estudiantes

**Requisitos Funcionales Implementados**:

- **RF-008**: Visualización de progreso estudiantil
- **RF-009**: Estadísticas por grupo y panel

**Archivos Clave**:

- `src/caracteristicas/panel-control/VisorProgreso.js`
- `src/api/servicioProgreso.js`

---

### ✅ [Fase 5: Implementación de la Interfaz Interactiva del Juego](./FASE-5-JUEGO-SIMULACION.md)

**Fecha**: 25 de octubre de 2025  
**Estado**: ✅ Completada

**Resumen**:

- Integración de Phaser 3 con importación dinámica y escala RESIZE.
- Cuadrícula 32px, arrastre con límites y snap-to-grid.
- Componentes como Containers con imagen y puntos de conexión.
- Cables ortogonales con clics intermedios (clic-seguir-clic), z-index detrás de componentes.
- Redibujo dinámico de cables al mover componentes.
- Modelo de datos de conectividad con Map/Set y limpieza automática al eliminar componentes.

**Archivos Clave**:

- `src/caracteristicas/juego/componentes/LienzoJuego.js`
- `src/caracteristicas/juego/PaginaJuego.js`
- `src/caracteristicas/juego/datos/definicionHerramientas.js`

---

### ✅ [Fase 6: Simulación Eléctrica Básica, Validación y Progreso](./FASE-6-SIMULACION-BASICA.md)

**Fecha**: 26 de octubre de 2025  
**Estado**: ✅ Completada

**Resumen**:

- Simulador básico (DFS) para continuidad de circuito y estado de bombillas/interruptores.
- Integración de simulación con Phaser: actualización visual en tiempo real.
- Validación de objetivos por nivel con botón [VALIDAR].
- Guardado de progreso y puntos en localStorage y desbloqueo de niveles.
- Ajustes UX: herramientas por nivel, conectores de batería laterales.

**Archivos Clave**:

- `src/caracteristicas/juego/phaser/EscenaPrincipal.js`
- `src/caracteristicas/juego/simulacion/simuladorCircuito.js`
- `src/caracteristicas/juego/datos/configuracionNiveles.js`
- `src/caracteristicas/juego/PaginaJuego.js`
- `src/caracteristicas/subtema/PaginaSubtema.js`

---

### ✅ [Fase 7: Enriquecimiento de Niveles y Contenido Educativo (Parte 1)](./FASE-7-ENRIQUECIMIENTO-NIVELES-PARTE1.md)

**Fecha**: 28 de octubre de 2025  
**Estado**: ✅ Completada (Parte 1)

**Resumen**:

- Reorganización de configuración de niveles en archivos modulares por panel.
- Implementación completa de Nivel 1.1 como tutorial paso a paso.
- Implementación de Niveles 2.1 a 2.5 con contenido educativo detallado.
- Simulación de Ley de Ohm con cálculo de corriente (I=V/R).
- Estados visuales de brillo en bombillas (apagada, tenue, correcta, muy brillante, quemada).
- Feedback contextual según estados del circuito.
- Validaciones específicas (bombillasConEstadoMin, estadoBombillaEsperado).
- Sistema de pistas con soporte dual (tutorial/simple).
- Modal in-game para retroalimentación (reemplazo de alerts).

**Archivos Clave**:

- `src/caracteristicas/juego/datos/configuracionPanel1.js` - `configuracionPanel6.js`
- `src/caracteristicas/juego/componentes/ModalFeedback.js`
- `src/caracteristicas/juego/phaser/componentes/BombillaComponente.js`
- `src/caracteristicas/juego/simulacion/simuladorCircuito.js`

---

### ✅ [Fase 8: Integración Completa Backend-Frontend y Sistema de Progresión](./FASE-8-INTEGRACION-API-Y-SISTEMA-PROGRESION.md)

**Fecha**: 30 de octubre de 2025  
**Estado**: ✅ Completada

**Resumen**:

- Corrección de nombres de columnas SQL en controladores backend.
- Eliminación completa de datos simulados (mock data) - 300+ líneas removidas.
- Refactorización de servicios API frontend conectados a endpoints reales.
- Reestructuración del endpoint `/progreso/estudiante` con estructura anidada.
- Fix de bug de bombilla quemándose en Panel 2 Nivel 1.
- Limpieza de UI: eliminación de tienda, modos y constructor de desafíos.
- Implementación de sistema completo de desbloqueo progresivo de niveles y paneles.
- Sistema de carga de progreso con `useEffect` y `fetchConToken`.
- Validación de completitud de paneles basada en cantidad de niveles.

**Requisitos Funcionales Implementados**:

- **RF-001**: Autenticación JWT persistente
- **RF-003**: Roles con lógica de desbloqueo diferenciada
- **RF-005**: Sistema de niveles y validación de objetivos
- **RF-007**: Sistema de puntos con guardado en MySQL
- **RF-009**: Gestión de grupos con API real
- **RF-010**: Visualización de progreso con datos reales
- **RF-011**: Modo Sandbox para docentes

**Archivos Clave**:

- `pixelvolt-api/controladores/gruposControlador.js` (corrección SQL)
- `pixelvolt-api/controladores/progresoControlador.js` (endpoint reestructurado)
- `src/api/servicioGrupos.js` (eliminación mock data)
- `src/api/servicioProgreso.js` (eliminación mock data)
- `src/caracteristicas/laboratorio/PaginaLaboratorio.js` (sistema de desbloqueo)
- `src/caracteristicas/juego/datos/configuracionPanel2.js` (fix nivel 2.1)

---

## 🔜 Próximas Fases Planificadas

### ✅ [Fase 4C: Pantalla de Juego — Layout y Datos Base](./FASE-4C-JUEGO-LAYOUT.md)

**Fecha**: 24 de octubre de 2025  
**Estado**: ✅ Completada (Iteración 1)

**Resumen**:

- Componente `PaginaJuego` con layout y estilos pixel.
- Ruta protegida `/juego/:panelId/:nivelId` integrada en `App.js`.
- Catálogo de herramientas y configuración por nivel.
- Subtemas por panel actualizados acorde al diseño.

**Archivos Clave**:

- `src/caracteristicas/juego/PaginaJuego.js`
- `src/caracteristicas/juego/PaginaJuego.css`
- `src/caracteristicas/juego/datos/definicionHerramientas.js`
- `src/caracteristicas/juego/datos/configuracionNiveles.js`
- `src/caracteristicas/subtema/PaginaSubtema.js`

### Fase 7: Integración con Backend

Estado: Pendiente

- Conexión con API REST
- Autenticación con JWT
- Persistencia real de datos
- WebSockets para actualizaciones en tiempo real

### Fase 8: Sistema de Gamificación

Estado: Pendiente

- Puntos y recompensas
- Tienda de avatares
- Logros y badges
- Tabla de clasificación

---

## 📊 Estado General del Proyecto

### Estructura Actual del Proyecto

```text
pixelvolt-app/
├── docs/
│   └── fases/                    # 📂 Documentación organizada
│       ├── README.md             # Este archivo
│       ├── FASE-1-REFACTORIZACION.md
│       ├── FASE-2-AUTENTICACION.md
│       ├── FASE-3-LABORATORIO.md
│       ├── FASE-4A-DASHBOARD-GRUPOS.md
│       ├── FASE-4B-DASHBOARD-PROGRESO.md
│       ├── FASE-4C-JUEGO-LAYOUT.md
│       ├── FASE-5-JUEGO-SIMULACION.md
│       ├── FASE-6-SIMULACION-BASICA.md
│       ├── FASE-7-ENRIQUECIMIENTO-NIVELES-PARTE1.md
│       └── FASE-8-INTEGRACION-API-Y-SISTEMA-PROGRESION.md
│
├── src/
│   ├── api/                      # Servicios (español)
│   │   ├── servicioGrupos.js
│   │   └── servicioProgreso.js
│   │
│   ├── caracteristicas/          # Características (español)
│   │   ├── autenticacion/
│   │   │   ├── PaginaAutenticacion.js
│   │   │   └── PaginaAutenticacion.css
│   │   ├── laboratorio/
│   │   │   ├── PaginaLaboratorio.js
│   │   │   └── PaginaLaboratorio.css
│   │   ├── subtema/
│   │   │   ├── PaginaSubtema.js
│   │   │   └── PaginaSubtema.css
│   │   └── panel-control/
│   │       ├── GestorGrupos.js
│   │       ├── GestorGrupos.css
│   │       ├── VisorProgreso.js
│   │       ├── VisorProgreso.css
│   │       └── ConstructorDesafios.js
│   │
│   ├── componentes/              # Componentes reutilizables (español)
│   │   ├── TarjetaPanel.js
│   │   ├── TarjetaPanel.css
│   │   └── RutaProtegida.js
│   │
│   ├── contexto/                 # Estado global (español)
│   │   └── ContextoAutenticacion.js
│   │
│   ├── estilos/                  # Estilos globales (español)
│   │   └── global.css
│   │
│   ├── paginas/                  # Páginas principales
│   │   ├── DashboardPage.js
│   │   └── DashboardPage.css
│   │
│   ├── App.js                    # Componente raíz
│   └── index.js                  # Punto de entrada
│
├── public/
├── build/
├── package.json
└── README.md
```

### Requisitos Funcionales Completados

| ID | Requisito | Estado | Fase |
|----|-----------|--------|------|
| RF-001 | Inicio de sesión y autenticación JWT | ✅ | 2, 8 |
| RF-002 | Visualización de paneles | ✅ | 3 |
| RF-003 | Sistema de progreso y roles | ✅ | 3, 8 |
| RF-005 | Sistema de niveles y validación | ✅ | 6, 8 |
| RF-006 | Gestión de grupos | ✅ | 4A, 8 |
| RF-007 | Sistema de puntos persistente | ✅ | 6, 8 |
| RF-008 | Visualización de progreso real | ✅ | 4B, 8 |
| RF-009 | Estadísticas por grupo | ✅ | 4B, 8 |
| RF-010 | Código de invitación docente | ✅ | 2 |
| RF-011 | Modo Sandbox | ✅ | 3, 8 |

### Migración a Español

**Estado**: ✅ 100% Completada

Toda la base de código ha sido migrada a nomenclatura en español:

- ✅ Nombres de carpetas (features → caracteristicas, etc.)
- ✅ Nombres de componentes (AuthPage → PaginaAutenticacion, etc.)
- ✅ Nombres de funciones (login → iniciarSesion, etc.)
- ✅ Nombres de variables (user → usuario, etc.)
- ✅ Nombres de servicios (groupService → servicioGrupos, etc.)
- ✅ Estados (unlocked → desbloqueado, etc.)

### Archivos Legacy Eliminados

- ❌ `src/features/` (completo)
- ❌ `src/components/` (completo)
- ❌ `src/context/AuthContext.js`
- ❌ `src/api/groupService.js`
- ❌ `src/api/progressService.js`
- ❌ Duplicados en `src/paginas/`
- ❌ Archivos antiguos de fases en raíz del proyecto

---

## 🚀 Cómo Usar Esta Documentación

### Para Desarrolladores

1. Lee la documentación en orden secuencial (Fase 1 → Fase 2 → ...)
2. Cada fase contiene:
   - Cambios realizados
   - Archivos modificados
   - Requisitos funcionales implementados
   - Casos de prueba
3. Usa la estructura de archivos como referencia

### Para Nuevos Miembros del Equipo

1. Empieza con **Fase 1** para entender la arquitectura base
2. Revisa **Fase 2** para el sistema de autenticación
3. Continúa secuencialmente para ver la evolución del proyecto

### Para QA/Testing

- Cada fase incluye casos de prueba específicos
- Los requisitos funcionales están claramente marcados
- Se incluyen inputs esperados y outputs

---

## 📝 Convenciones de Nomenclatura

### Español en Todo el Código

- **Componentes**: `PaginaAutenticacion`, `TarjetaPanel`, `GestorGrupos`
- **Funciones**: `iniciarSesion()`, `manejarClic()`, `obtenerGrupos()`
- **Variables**: `usuario`, `nombreUsuario`, `datosFormulario`
- **Estados**: `desbloqueado`, `bloqueado`, `completado`
- **Props**: `alHacerClic`, `alVolverAutenticacion`

### Organización de Carpetas

- `caracteristicas/` - Código organizado por característica funcional
- `componentes/` - Componentes reutilizables
- `contexto/` - Estado global de la aplicación
- `api/` - Servicios para comunicación con backend
- `estilos/` - Estilos globales

---

## 🔗 Enlaces Útiles

- [Fase 1: Reestructuración](./FASE-1-REFACTORIZACION.md)
- [Fase 2: Autenticación](./FASE-2-AUTENTICACION.md)
- [Fase 3: Laboratorio](./FASE-3-LABORATORIO.md)
- [Fase 4A: Dashboard Grupos](./FASE-4A-DASHBOARD-GRUPOS.md)
- [Fase 4B: Dashboard Progreso](./FASE-4B-DASHBOARD-PROGRESO.md)
- [Fase 4C: Pantalla de Juego — Layout y Datos Base](./FASE-4C-JUEGO-LAYOUT.md)
- [Fase 5: Implementación de la Interfaz Interactiva del Juego](./FASE-5-JUEGO-SIMULACION.md)
- [Fase 6: Simulación Eléctrica Básica, Validación y Progreso](./FASE-6-SIMULACION-BASICA.md)
- [Fase 7: Enriquecimiento de Niveles y Contenido Educativo (Parte 1)](./FASE-7-ENRIQUECIMIENTO-NIVELES-PARTE1.md)
- [Fase 8: Integración Completa Backend-Frontend y Sistema de Progresión](./FASE-8-INTEGRACION-API-Y-SISTEMA-PROGRESION.md)

---

**Última Actualización**: 30 de octubre de 2025  
**Versión del Proyecto**: 0.8.0  
**Estado**: En Desarrollo Activo  
**Idioma del Código**: Español 🇪🇸
