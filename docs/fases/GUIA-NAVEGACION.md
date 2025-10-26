# 📚 Guía Rápida de Navegación - Documentación PixelVolt

## 🎯 ¿Qué quieres hacer?

### 👨‍💻 Soy nuevo en el proyecto

**Empieza aquí**: [`README.md`](./README.md) - Índice principal con visión general del proyecto

**Luego lee en orden**:

1. [`FASE-1-REFACTORIZACION.md`](./FASE-1-REFACTORIZACION.md) - Entiende la arquitectura base
2. [`FASE-2-AUTENTICACION.md`](./FASE-2-AUTENTICACION.md) - Sistema de login y roles
3. `FASE-3-LABORATORIO.md` - Paneles temáticos (próximamente actualizada)
4. `FASE-4A-DASHBOARD-GRUPOS.md` - Gestión de grupos (próximamente actualizada)
5. `FASE-4B-DASHBOARD-PROGRESO.md` - Visor de progreso (próximamente actualizada)
6. [`FASE-4C-JUEGO-LAYOUT.md`](./FASE-4C-JUEGO-LAYOUT.md) - Pantalla de juego (layout + datos base)

---

### 🔍 Busco información específica

#### Sobre Autenticación

- **¿Cómo funciona el login?** → [`FASE-2-AUTENTICACION.md`](./FASE-2-AUTENTICACION.md#funcionalidades-implementadas)
- **¿Qué es el código de invitación?** → [`FASE-2-AUTENTICACION.md`](./FASE-2-AUTENTICACION.md#rf-010-código-de-invitación-para-docentes)
- **¿Cómo se asignan los roles?** → [`FASE-2-AUTENTICACION.md`](./FASE-2-AUTENTICACION.md#sistema-de-roles-dinámico)

#### Sobre Arquitectura

- **¿Cómo está organizado el código?** → [`FASE-1-REFACTORIZACION.md`](./FASE-1-REFACTORIZACION.md#nueva-estructura-de-carpetas)
- **¿Qué rutas hay disponibles?** → [`FASE-1-REFACTORIZACION.md`](./FASE-1-REFACTORIZACION.md#enrutamiento-y-rutas-protegidas)
      - Ruta del juego: `/juego/:panelId/:nivelId` (ver [`FASE-4C-JUEGO-LAYOUT.md`](./FASE-4C-JUEGO-LAYOUT.md))
- **¿Cómo funciona el contexto de autenticación?** → [`FASE-1-REFACTORIZACION.md`](./FASE-1-REFACTORIZACION.md#sistema-de-autenticación-global)

#### Sobre Nomenclatura

- **¿Qué componentes fueron migrados?** → [`FASE-1-REFACTORIZACION.md`](./FASE-1-REFACTORIZACION.md#componentes-migrados)
- **¿Qué funciones cambiaron de nombre?** → [`FASE-1-REFACTORIZACION.md`](./FASE-1-REFACTORIZACION.md#funciones-y-variables-migradas)
- **¿Dónde encuentro la lista completa?** → [`RESUMEN-REORGANIZACION.md`](./RESUMEN-REORGANIZACION.md#cambios-de-nomenclatura-documentados)

#### Sobre el Dashboard de Docente

- **¿Cómo gestionar grupos?** → `FASE-4A-DASHBOARD-GRUPOS.md` (próximamente)
- **¿Cómo ver el progreso?** → `FASE-4B-DASHBOARD-PROGRESO.md` (próximamente)

---

### 🧪 Necesito probar funcionalidades

#### Casos de Prueba de Autenticación

→ [`FASE-2-AUTENTICACION.md`](./FASE-2-AUTENTICACION.md#casos-de-prueba)

**Incluye:**

- Login exitoso
- Registro como estudiante
- Registro como docente
- Validación de contraseñas

---

### 📝 Quiero contribuir/documentar

#### Para documentar una nueva fase

1. Usa el formato de las fases existentes como plantilla
2. Incluye las siguientes secciones:
   - Cambios Realizados
   - Funcionalidades Implementadas
   - Requisitos Funcionales Cumplidos
   - Flujo de Datos
   - Casos de Prueba
   - Archivos Modificados
   - Checklist de Completitud

#### Para actualizar documentación existente

1. Verifica la nomenclatura en español
2. Actualiza ejemplos de código
3. Añade la fecha de actualización al final

---

### 🔧 Mantenimiento del Proyecto

#### Estado de Migración

Estado: ✅ 100% Completado

Ver detalles en: [`README.md`](./README.md#migración-a-español)

#### Archivos Eliminados (Legacy)

Ver lista completa en: [`RESUMEN-REORGANIZACION.md`](./RESUMEN-REORGANIZACION.md#limpieza-de-archivos-antiguos)

---

## 📊 Mapa de Requisitos Funcionales

| RF | Descripción | Fase | Estado |
|----|-------------|------|--------|
| RF-001 | Inicio de sesión | 2 | ✅ |
| RF-002 | Visualización de paneles | 3 | ✅ |
| RF-003 | Sistema de progreso | 3 | ✅ |
| RF-006 | Gestión de grupos | 4A | ✅ |
| RF-007 | Códigos de unión | 4A | ✅ |
| RF-008 | Visualización de progreso | 4B | ✅ |
| RF-009 | Estadísticas por grupo | 4B | ✅ |
| RF-010 | Código de invitación docente | 2 | ✅ |
| RF-011 | Modo Sandbox | 3 | ✅ |

---

## 🗂️ Estructura de Carpetas del Proyecto

```text
pixelvolt-app/
├── docs/
│   └── fases/                           ← ESTÁS AQUÍ
│       ├── GUIA-NAVEGACION.md          ← Este archivo
│       ├── README.md                   ← Índice principal
│       ├── RESUMEN-REORGANIZACION.md   ← Resumen de cambios
│       ├── FASE-1-REFACTORIZACION.md   ← Arquitectura
│       ├── FASE-2-AUTENTICACION.md     ← Auth y Roles
│       ├── FASE-3-LABORATORIO.md       ← Paneles (próx.)
│       ├── FASE-4A-DASHBOARD-GRUPOS.md ← Grupos (próx.)
│       └── FASE-4B-DASHBOARD-PROGRESO.md ← Progreso (próx.)
│
├── src/
│   ├── caracteristicas/                ← Código por funcionalidad
│   ├── componentes/                    ← Componentes reutilizables
│   ├── contexto/                       ← Estado global
│   ├── api/                            ← Servicios
│   └── ...
│
└── ...
```

---

## 🚀 Comandos Útiles

### Desarrollo

```bash
npm start           # Iniciar servidor de desarrollo
npm run build       # Compilar para producción
npm test            # Ejecutar pruebas
```

### Navegación del Código

- **Componentes principales**: `src/caracteristicas/`
- **Componentes reutilizables**: `src/componentes/`
- **Servicios API**: `src/api/`
- **Estado global**: `src/contexto/`

---

## 💡 Tips Rápidos

### ¿Cómo se llama ahora...?

| Buscas | Ahora se llama | Ubicación |
|--------|----------------|-----------|
| AuthPage | PaginaAutenticacion | `caracteristicas/autenticacion/` |
| LaboratoryPage | PaginaLaboratorio | `caracteristicas/laboratorio/` |
| PanelCard | TarjetaPanel | `componentes/` |
| login() | iniciarSesion() | ContextoAutenticacion |
| user | usuario | Todo el proyecto |

### Datos de Prueba

**Código de Invitación Docente**: `PROFESOR2025`

**Usuario de Prueba**:

- Usuario: `cualquier_nombre`
- Contraseña: `cualquier_contraseña`
- Código (opcional): `PROFESOR2025` para ser docente

---

## 🔗 Enlaces Externos

- Repositorio: [GitHub - CJUAN25/-Pixelvolt-app](https://github.com/CJUAN25/-Pixelvolt-app)
- React Router: [Documentación oficial](https://reactrouter.com/)
- React: [Documentación oficial](https://react.dev/)

---

## 📞 Contacto y Soporte

Para preguntas sobre la documentación o el proyecto, contacta al equipo de desarrollo.

---

**Última Actualización**: 21 de octubre de 2025  
**Versión**: 1.0  
**Idioma**: Español 🇪🇸
