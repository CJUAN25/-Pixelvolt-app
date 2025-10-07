# Fase 2: La Puerta de Entrada - Mockup de Autenticación

## 📋 Descripción

Esta fase implementa la página de autenticación para PixelVolt, cumpliendo con el requisito funcional RF-001. La página permite a los usuarios alternar entre formularios de "Iniciar Sesión" y "Registrarse" con un diseño completamente pixel art.

## 🎯 Características Implementadas

### ✅ Funcionalidades Principales
- **Toggle entre vistas**: Los usuarios pueden cambiar entre "Iniciar Sesión" y "Registrarse"
- **Formularios funcionales**: Validación básica de campos requeridos
- **Diseño responsive**: Adaptable a diferentes tamaños de pantalla
- **Animaciones suaves**: Transiciones y efectos visuales

### ✅ Elementos de UI
- **Título principal**: Logo "PixelVolt" con efectos de sombra
- **Pestañas interactivas**: Botones para cambiar entre vistas
- **Campos de entrada**: Inputs con estilo pixel art
- **Botones de acción**: Estilo 3D con efectos hover
- **Enlaces de navegación**: Para cambiar entre formularios

## 🎨 Diseño Visual

### Paleta de Colores Utilizada
- **Fondo Principal**: `#1a1a2e` (Azul oscuro)
- **Fondo Secundario**: `#16213e` (Azul más oscuro)
- **Verde Pixel**: `#00ff41` (Verde neón principal)
- **Amarillo Pixel**: `#ffd700` (Amarillo de acento)
- **Texto Principal**: `#ffffff` (Blanco)
- **Texto Secundario**: `#b8b8b8` (Gris claro)

### Efectos Visuales
- **Bordes pixelados**: Bordes gruesos con esquinas rectas
- **Sombras neón**: Efectos de resplandor en elementos clave
- **Animaciones**: Pulsaciones y transiciones suaves
- **Efectos 3D**: Botones con profundidad visual

## 📁 Archivos Creados

```
src/pages/
└── AuthPage.js          # Componente principal de autenticación
└── AuthPage.css         # Estilos específicos de la página

src/
└── App.js               # Actualizado para mostrar AuthPage
```

## 🔧 Funcionalidades Técnicas

### Estado del Componente
```javascript
const [currentView, setCurrentView] = useState('login');
```

### Métodos Principales
- `toggleView()`: Cambia entre vistas de login/registro
- `handleSubmit()`: Maneja el envío de formularios
- Event handlers para tabs y navegación

### Validaciones Implementadas
- Campos requeridos en formularios
- Confirmación de contraseña en registro
- Prevención de envío vacío

## 🚀 Cómo Usar

1. **Iniciar Sesión**: 
   - Introduce usuario y contraseña
   - Haz clic en "Iniciar Sesión"

2. **Registrarse**:
   - Cambia a la pestaña "Registrarse"
   - Completa todos los campos
   - Haz clic en "[ Crear Cuenta ]"

3. **Navegación**:
   - Usa las pestañas superiores para cambiar vistas
   - Los enlaces inferiores también permiten navegación

## 📱 Responsive Design

- **Desktop**: Layout completo con animaciones
- **Tablet**: Adaptación de espaciados y tamaños
- **Mobile**: Versión compacta con elementos redimensionados

## 🔮 Próximas Mejoras

Para fases futuras se pueden agregar:
- Validación en tiempo real
- Integración con backend
- Recordar usuario
- Recuperación de contraseña
- Autenticación con redes sociales

## 🎮 Cumplimiento de Requisitos

- **RF-001**: ✅ Autenticación de usuarios implementada
- **RNF-005**: ✅ Estilo visual pixel art aplicado
- **RNF-007**: ✅ Código mantenible y organizado

---

*Fase 2 completada exitosamente - Lista para integración con lógica de backend*