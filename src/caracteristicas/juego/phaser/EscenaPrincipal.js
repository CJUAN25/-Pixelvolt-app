import Phaser from 'phaser';
import { HERRAMIENTAS_DISPONIBLES } from '../datos/definicionHerramientas';
import BombillaComponente from './componentes/BombillaComponente';
import BateriaComponente from './componentes/BateriaComponente';
import ResistenciaComponente from './componentes/ResistenciaComponente';
import InterruptorComponente from './componentes/InterruptorComponente';
import ComponenteGenerico from './componentes/ComponenteGenerico';
import { analizarEstadoCircuito } from '../simulacion/simuladorCircuito';

class EscenaPrincipal extends Phaser.Scene {
  constructor() {
    super('EscenaPrincipal');
  }

  preload() {
    // Cargar imágenes de herramientas con su id como clave
    HERRAMIENTAS_DISPONIBLES.forEach((h) => {
      if (h?.id && h?.icono) {
        this.load.image(h.id, h.icono);
      }
    });
  }

  create() {
    // Color de fondo para diferenciar el canvas
    this.cameras.main.setBackgroundColor('#0f1420');

    // Crear cuadrícula inicial
    this.dibujarCuadricula();

    // Registrar listener para redimensionamiento
    this.scale.on('resize', this.redibujarCuadricula, this);

    // Configuración del nivel (puede haberse establecido antes de create desde LienzoJuego)
    // No sobrescribir si ya existe
    if (typeof this.configuracionNivel === 'undefined') {
      this.configuracionNivel = null;
    }

    // Map para guardar el último resultado de la simulación (estados de bombillas)
    this.ultimoMapaEstadosBombillas = new Map();

    // Variables de estado para dibujo de cables
    this.estaDibujandoCable = false;
    this.puntoInicioCable = null; // { objeto: Container, punto: {x, y}, puntoVisual: Arc }
    this.cableGraficoActual = null; // Graphics para línea temporal
    this.puntosIntermediosCable = []; // Array de {x, y} para segmentos
    this.cablesCreados = []; // Array de cables permanentes
    
  // Estructuras de datos para modelo de conectividad
    this.conexionesPorComponente = new Map(); // Clave: Container, Valor: Set<cableInfo>
    this.cablePorPuntoVisual = new Map(); // Clave: puntoVisual (Circle), Valor: cableInfo
  // Lista de componentes activos en escena para simulación
  this.componentesActivos = [];

    // Listeners globales para drag-and-drop
    // (Opcional) prevenir menú contextual del navegador en el canvas
    if (this.input.mouse && this.input.mouse.disableContextMenu) {
      this.input.mouse.disableContextMenu();
    }

    this.input.on('dragstart', (pointer, gameObject) => {
      // Solo para objetos arrastrables y con botón izquierdo
      if (gameObject.input?.draggable && (pointer.button === 0 || pointer.leftButtonDown())) {
        // Aplicar tinte: para contenedores, tintar la imagen principal si existe
        const imagen = gameObject.getData ? gameObject.getData('imagenPrincipal') : null;
        if (imagen && imagen.setTint) {
          imagen.setTint(0x00ff00);
        } else if (gameObject.setTint) {
          gameObject.setTint(0x00ff00);
        }
        this.children.bringToTop(gameObject);
        gameObject.setData && gameObject.setData('isDragging', true);
      }
    });

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      if (!gameObject.input?.draggable) return;
      const w = (typeof gameObject.displayWidth === 'number' && gameObject.displayWidth > 0)
        ? gameObject.displayWidth
        : (gameObject.input?.hitArea?.width || gameObject.width || 0);
      const h = (typeof gameObject.displayHeight === 'number' && gameObject.displayHeight > 0)
        ? gameObject.displayHeight
        : (gameObject.input?.hitArea?.height || gameObject.height || 0);
      const originX = (typeof gameObject.originX === 'number') ? gameObject.originX : 0.5;
      const originY = (typeof gameObject.originY === 'number') ? gameObject.originY : 0.5;
      const minX = w * originX;
      const maxX = this.scale.width - w * (1 - originX);
      const minY = h * originY;
      const maxY = this.scale.height - h * (1 - originY);
      gameObject.x = Phaser.Math.Clamp(dragX, minX, maxX);
      gameObject.y = Phaser.Math.Clamp(dragY, minY, maxY);

      // Redibujar cables conectados a este objeto mientras se arrastra
      if (Array.isArray(this.cablesCreados) && this.cablesCreados.length > 0) {
        this.cablesCreados.forEach((cableInfo) => {
          if (cableInfo?.puntoInicio?.contenedor === gameObject || cableInfo?.puntoFin?.contenedor === gameObject) {
            this.redibujarCable(cableInfo);
          }
        });
      }
    });

    this.input.on('dragend', (pointer, gameObject) => {
      if (!gameObject.input?.draggable) return;

      // Snap-to-grid (32x32) antes de limpiar tinte
      const tamanoCelda = 32;
      const columna = Math.round(gameObject.x / tamanoCelda);
      const fila = Math.round(gameObject.y / tamanoCelda);

      // Asumir origen 0.5 si no existe (contenedores)
      const originX = (typeof gameObject.originX === 'number') ? gameObject.originX : 0.5;
      const originY = (typeof gameObject.originY === 'number') ? gameObject.originY : 0.5;

      let snapX = columna * tamanoCelda;
      let snapY = fila * tamanoCelda;

      // Re-aplicar Clamp para asegurar que no salga del canvas
      const w = (typeof gameObject.displayWidth === 'number' && gameObject.displayWidth > 0)
        ? gameObject.displayWidth
        : (gameObject.input?.hitArea?.width || gameObject.width || 0);
      const h = (typeof gameObject.displayHeight === 'number' && gameObject.displayHeight > 0)
        ? gameObject.displayHeight
        : (gameObject.input?.hitArea?.height || gameObject.height || 0);
      const halfWidth = w * originX;
      const halfHeight = h * originY;
      snapX = Phaser.Math.Clamp(snapX, halfWidth, this.scale.width - halfWidth);
      snapY = Phaser.Math.Clamp(snapY, halfHeight, this.scale.height - halfHeight);

      gameObject.x = snapX;
      gameObject.y = snapY;

      // Limpiar tinte: para contenedores, limpiar imagen principal
      const imagen = gameObject.getData ? gameObject.getData('imagenPrincipal') : null;
      if (imagen && imagen.clearTint) {
        imagen.clearTint();
      } else if (gameObject.clearTint) {
        gameObject.clearTint();
      }

      // Redibujar cables conectados tras el snap-to-grid
      if (Array.isArray(this.cablesCreados) && this.cablesCreados.length > 0) {
        this.cablesCreados.forEach((cableInfo) => {
          if (cableInfo?.puntoInicio?.contenedor === gameObject || cableInfo?.puntoFin?.contenedor === gameObject) {
            this.redibujarCable(cableInfo);
          }
        });
      }

      // Retrasa el reseteo de la bandera para que pointerup la vea
      setTimeout(() => {
        if (gameObject.active && gameObject.setData) {
          gameObject.setData('isDragging', false);
        }
      }, 0);
    });

    // Listener global para añadir codos intermedios y cancelar con clic derecho
    this.input.on('pointerdown', (pointer) => {
      // Añadir codos con clic izquierdo (si NO es sobre un punto de conexión)
      if (this.estaDibujandoCable && pointer.leftButtonDown() && !this.esPuntoDeConexion(pointer.targetObject)) {
        // Ajustar posición del clic a la cuadrícula
        const tamanoCelda = 32;
        const clickX = Math.round(pointer.x / tamanoCelda) * tamanoCelda;
        const clickY = Math.round(pointer.y / tamanoCelda) * tamanoCelda;
        
        // Añadir este punto como codo a la ruta
        this.puntosIntermediosCable.push({ x: clickX, y: clickY });
        console.log('Codo añadido en:', clickX, clickY);
      }
      
      // Cancelar con clic derecho
      if (this.estaDibujandoCable && pointer.rightButtonDown()) {
        console.log('Dibujo de cable cancelado con clic derecho.');
        if (this.cableGraficoActual) {
          this.cableGraficoActual.destroy();
        }
        this.estaDibujandoCable = false;
        this.puntoInicioCable = null;
        this.cableGraficoActual = null;
        this.puntosIntermediosCable = [];
        // Prevenir menú contextual
        if (pointer.event && pointer.event.preventDefault) {
          pointer.event.preventDefault();
        }
      }
    });
  }

  redibujarCable(cableInfo) {
    if (!cableInfo || !cableInfo.grafico) return;
    const contInicio = cableInfo.puntoInicio?.contenedor;
    const contFin = cableInfo.puntoFin?.contenedor;
    if (!contInicio || !contFin) return;

    const pIni = cableInfo.puntoInicio?.punto || { x: 0, y: 0 };
    const pFin = cableInfo.puntoFin?.punto || { x: 0, y: 0 };

    const sxi = (typeof contInicio.scaleX === 'number') ? contInicio.scaleX : 1;
    const syi = (typeof contInicio.scaleY === 'number') ? contInicio.scaleY : 1;
    const sxf = (typeof contFin.scaleX === 'number') ? contFin.scaleX : 1;
    const syf = (typeof contFin.scaleY === 'number') ? contFin.scaleY : 1;

    const inicioX = contInicio.x + pIni.x * sxi;
    const inicioY = contInicio.y + pIni.y * syi;
    const finX = contFin.x + pFin.x * sxf;
    const finY = contFin.y + pFin.y * syf;

    // Redibujar gráfico
    const g = cableInfo.grafico;
    g.clear();
    g.lineStyle(3, 0x00ffff, 1.0);
    g.beginPath();
    
    // Si hay codos guardados (ahora incluyen inicio y fin)
    if (cableInfo.codos && cableInfo.codos.length > 1) {
      // Actualizar primer y último punto con posiciones actuales de los componentes
      const codosActualizados = [...cableInfo.codos];
      codosActualizados[0] = { x: inicioX, y: inicioY };
      codosActualizados[codosActualizados.length - 1] = { x: finX, y: finY };
      
      // Dibujar ruta completa
      g.moveTo(codosActualizados[0].x, codosActualizados[0].y);
      
      for (let i = 1; i < codosActualizados.length; i++) {
        const prevPunto = codosActualizados[i - 1];
        const currPunto = codosActualizados[i];
        g.lineTo(currPunto.x, prevPunto.y); // Horizontal
        g.lineTo(currPunto.x, currPunto.y); // Vertical
      }
    } else {
      // Sin codos: ruta simple H-V
      g.moveTo(inicioX, inicioY);
      g.lineTo(finX, inicioY);
      g.lineTo(finX, finY);
    }
    
    g.strokePath();
  }

  dibujarCuadricula() {
    const width = this.scale.width;
    const height = this.scale.height;
    const cellSize = 32; // Tamaño de celda en píxeles

    // Crear objeto de gráficos si no existe
    if (!this.gridGraphics) {
      this.gridGraphics = this.add.graphics();
    }

    // Limpiar gráficos anteriores
    this.gridGraphics.clear();

    // Establecer estilo de línea: grosor 1px, color cian, opacidad 0.2
    this.gridGraphics.lineStyle(1, 0x00ffff, 0.2);

    // Dibujar líneas verticales
    for (let x = 0; x <= width; x += cellSize) {
      this.gridGraphics.moveTo(x, 0);
      this.gridGraphics.lineTo(x, height);
    }

    // Dibujar líneas horizontales
    for (let y = 0; y <= height; y += cellSize) {
      this.gridGraphics.moveTo(0, y);
      this.gridGraphics.lineTo(width, y);
    }

    // Aplicar el dibujo
    this.gridGraphics.strokePath();
  }

  redibujarCuadricula(gameSize) {
    // Redibujar la cuadrícula con las nuevas dimensiones
    this.dibujarCuadricula();
  }

  agregarElementoJuego(herramienta) {
    // Calcular posición centrada con offset aleatorio
    const x = this.scale.width / 2 + (Math.random() - 0.5) * 100;
    const y = this.scale.height / 2 + (Math.random() - 0.5) * 100;

    // Crear instancia del componente según su tipo
    let nuevoComponente;
    
    switch (herramienta.id) {
      case 'bombilla':
        nuevoComponente = new BombillaComponente(this, x, y, herramienta);
        break;
        
      case 'bateria':
        nuevoComponente = new BateriaComponente(this, x, y, herramienta);
        break;
        
      case 'resistencia-fija':
      case 'resistencia-68':
      case 'resistencia-10':
      case 'resistencia-100':
      case 'resistencia-1k':
        nuevoComponente = new ResistenciaComponente(this, x, y, herramienta);
        break;
        
      case 'interruptor':
        nuevoComponente = new InterruptorComponente(this, x, y, herramienta);
        break;
        
      // Componentes que usan la clase genérica (por ahora)
      case 'cable':
      case 'iman-barra':
      case 'brujula':
      case 'bobina':
      case 'capacitor':
      case 'fuente-ca':
      case 'motor':
      case 'transformador':
      default:
        nuevoComponente = new ComponenteGenerico(this, x, y, herramienta);
        break;
    }
    
    // Añadir el componente a la escena
    this.add.existing(nuevoComponente);
    // Registrar en la lista de componentes activos
    if (Array.isArray(this.componentesActivos)) {
      this.componentesActivos.push(nuevoComponente);
    }
    
    console.log(`✅ Componente ${herramienta.nombre} añadido al lienzo`);
  }

  update() {
    // Dibujar línea temporal si estamos dibujando un cable
    if (this.estaDibujandoCable && this.cableGraficoActual && this.puntosIntermediosCable.length > 0) {
      // Limpiar gráfico temporal
      this.cableGraficoActual.clear();
      this.cableGraficoActual.lineStyle(2, 0x00ffff, 0.8);
      this.cableGraficoActual.beginPath();
      
      // Dibujar desde el inicio pasando por todos los codos
      this.cableGraficoActual.moveTo(this.puntosIntermediosCable[0].x, this.puntosIntermediosCable[0].y);
      
      for (let i = 1; i < this.puntosIntermediosCable.length; i++) {
        const prevPunto = this.puntosIntermediosCable[i - 1];
        const currPunto = this.puntosIntermediosCable[i];
        // Asegurar ortogonalidad: horizontal primero, luego vertical
        this.cableGraficoActual.lineTo(currPunto.x, prevPunto.y); // Horizontal
        this.cableGraficoActual.lineTo(currPunto.x, currPunto.y); // Vertical
      }
      
      // Dibujar el último segmento hacia el puntero (ajustado a grid)
      const tamanoCelda = 32;
      const snapPointerX = Math.round(this.input.activePointer.x / tamanoCelda) * tamanoCelda;
      const snapPointerY = Math.round(this.input.activePointer.y / tamanoCelda) * tamanoCelda;
      const ultimoPunto = this.puntosIntermediosCable[this.puntosIntermediosCable.length - 1];
      
      if (ultimoPunto) {
        // Dibujar ortogonalmente desde el último codo hasta el puntero
        this.cableGraficoActual.lineTo(snapPointerX, ultimoPunto.y); // Horizontal
        this.cableGraficoActual.lineTo(snapPointerX, snapPointerY); // Vertical
      }
      
      this.cableGraficoActual.strokePath();
    }
  }

  iniciarDibujoCable(puntoVisualInicio) {
    // Establecer estado de dibujo
    this.estaDibujandoCable = true;
    
    // Guardar información del punto de inicio
    this.puntoInicioCable = {
      objeto: puntoVisualInicio.getData('contenedorPadre'),
      punto: puntoVisualInicio.getData('posRelativa'),
      puntoVisual: puntoVisualInicio
    };
    
    // Crear objeto Graphics para la línea temporal
    this.cableGraficoActual = this.add.graphics();
    this.cableGraficoActual.lineStyle(2, 0x00ffff, 0.8);
    
    // Calcular posición global absoluta del punto de inicio
    const contInicio = this.puntoInicioCable.objeto;
    const ptoInicio = this.puntoInicioCable.punto;
    const sxi = (typeof contInicio.scaleX === 'number') ? contInicio.scaleX : 1;
    const syi = (typeof contInicio.scaleY === 'number') ? contInicio.scaleY : 1;
    const inicioXAbs = contInicio.x + ptoInicio.x * sxi;
    const inicioYAbs = contInicio.y + ptoInicio.y * syi;
    
    // Inicializar array con el punto de inicio como primer elemento de la ruta
    this.puntosIntermediosCable = [{ x: inicioXAbs, y: inicioYAbs }];
    
    console.log('Iniciando dibujo de cable desde:', this.puntoInicioCable.objeto.getData('herramientaInfo').nombre);
  }

  finalizarDibujoCable(puntoVisualFin) {
    if (!this.estaDibujandoCable) return;
    
    // Verificar que sea un punto válido y diferente al inicial
    const contenedorFin = puntoVisualFin.getData('contenedorPadre');
    const esValido = contenedorFin && (puntoVisualFin !== this.puntoInicioCable.puntoVisual);
    
    if (esValido) {
      // Obtener información del punto final
      const puntoFin = puntoVisualFin.getData('posRelativa');
      const herramientaInicio = this.puntoInicioCable.objeto.getData('herramientaInfo');
      const herramientaFin = contenedorFin.getData('herramientaInfo');
      
      // Calcular posición global absoluta del punto final
      const sxf = (typeof contenedorFin.scaleX === 'number') ? contenedorFin.scaleX : 1;
      const syf = (typeof contenedorFin.scaleY === 'number') ? contenedorFin.scaleY : 1;
      const finXAbs = contenedorFin.x + puntoFin.x * sxf;
      const finYAbs = contenedorFin.y + puntoFin.y * syf;
      
      // Añadir el punto final a la ruta
      this.puntosIntermediosCable.push({ x: finXAbs, y: finYAbs });
      
      // Crear cable permanente
      const cablePermanente = this.add.graphics();
      cablePermanente.lineStyle(3, 0x00ffff, 1); // Más grueso y opaco
      cablePermanente.beginPath();
      
      // Dibujar la ruta completa con todos los puntos (inicio → codos → fin)
      if (this.puntosIntermediosCable.length > 1) {
        cablePermanente.moveTo(this.puntosIntermediosCable[0].x, this.puntosIntermediosCable[0].y);
        
        for (let i = 1; i < this.puntosIntermediosCable.length; i++) {
          const prevPunto = this.puntosIntermediosCable[i - 1];
          const currPunto = this.puntosIntermediosCable[i];
          // Ortogonalidad: horizontal primero, luego vertical
          cablePermanente.lineTo(currPunto.x, prevPunto.y);
          cablePermanente.lineTo(currPunto.x, currPunto.y);
        }
      }
      
      cablePermanente.strokePath();
      
      // Enviar el cable al fondo para que aparezca detrás de los componentes
      this.children.sendToBack(cablePermanente);
      
      // Guardar el cable en la lista (codos incluye inicio y fin ahora)
      const codosParaGuardar = [...this.puntosIntermediosCable];

      // Definir hit area interactiva para permitir doble clic de eliminación
      if (codosParaGuardar && codosParaGuardar.length >= 2) {
        // Reconstruir los segmentos ortogonales H y V usados para dibujar
        const segmentos = [];
        for (let i = 1; i < codosParaGuardar.length; i++) {
          const p1 = codosParaGuardar[i - 1];
          const p2 = codosParaGuardar[i];
          // Segmento horizontal p1 -> (p2.x, p1.y)
          segmentos.push({ a: { x: p1.x, y: p1.y }, b: { x: p2.x, y: p1.y } });
          // Segmento vertical (p2.x, p1.y) -> p2
          segmentos.push({ a: { x: p2.x, y: p1.y }, b: { x: p2.x, y: p2.y } });
        }

        const hitAreaCallback = (segs, x, y) => {
          const tol = 6; // tolerancia en píxeles
          for (const seg of segs) {
            const ax = seg.a.x, ay = seg.a.y;
            const bx = seg.b.x, by = seg.b.y;
            if (ay === by) {
              // Horizontal
              const minX = Math.min(ax, bx) - tol;
              const maxX = Math.max(ax, bx) + tol;
              if (x >= minX && x <= maxX && Math.abs(y - ay) <= tol) return true;
            } else if (ax === bx) {
              // Vertical
              const minY = Math.min(ay, by) - tol;
              const maxY = Math.max(ay, by) + tol;
              if (y >= minY && y <= maxY && Math.abs(x - ax) <= tol) return true;
            }
          }
          return false;
        };

        // Hacer el gráfico interactivo con el callback personalizado
        cablePermanente.setInteractive(segmentos, hitAreaCallback, false);
        // Cursor tipo mano al pasar por encima
        if (cablePermanente.input) {
          cablePermanente.input.cursor = 'pointer';
        }
        // Apariencia por defecto ligeramente translúcida
        cablePermanente.setAlpha(0.95);
        
        // Indicador visual al pasar el mouse por encima del cable
        cablePermanente.on('pointerover', () => {
          cablePermanente.setAlpha(1.0);
          cablePermanente.setBlendMode(Phaser.BlendModes.ADD);
        });
        cablePermanente.on('pointerout', () => {
          cablePermanente.setAlpha(0.95);
          cablePermanente.setBlendMode(Phaser.BlendModes.NORMAL);
        });

        // Listener para doble clic izquierdo en el cable
        cablePermanente.on('pointerdown', (pointer) => {
          if (pointer.leftButtonDown()) {
            const now = this.time?.now ?? performance.now();
            const lastDownTime = cablePermanente.getData('lastDownTime') || 0;
            const lastDownX = cablePermanente.getData('lastDownX');
            const lastDownY = cablePermanente.getData('lastDownY');
            const dblTime = 350; // ms
            const dblDist = 12; // px
            const posDeltaDown = (typeof lastDownX === 'number' && typeof lastDownY === 'number')
              ? Phaser.Math.Distance.Between(lastDownX, lastDownY, pointer.x, pointer.y)
              : Number.MAX_SAFE_INTEGER;

            if (lastDownTime && (now - lastDownTime) <= dblTime && posDeltaDown <= dblDist) {
              // Reset y eliminar cable
              cablePermanente.setData('lastDownTime', 0);
              const info = cablePermanente.getData('cableInfo');
              if (info) {
                this.eliminarCable(info);
              } else {
                console.error('No se encontró cableInfo para eliminar.');
              }
            } else {
              cablePermanente.setData('lastDownTime', now);
              cablePermanente.setData('lastDownX', pointer.x);
              cablePermanente.setData('lastDownY', pointer.y);
            }
          }
        });
      } else {
        console.warn('No se pudo crear hit area para cable sin suficientes puntos.');
      }
      
      const cableInfo = {
        grafico: cablePermanente,
        puntoInicio: { contenedor: this.puntoInicioCable.objeto, punto: this.puntoInicioCable.punto },
        puntoFin: { contenedor: contenedorFin, punto: puntoFin },
        puntoVisualInicio: this.puntoInicioCable.puntoVisual,
        puntoVisualFin: puntoVisualFin,
        herramientaInicio: herramientaInicio,
        herramientaFin: herramientaFin,
        codos: codosParaGuardar
      };
      
      this.cablesCreados.push(cableInfo);
      // Guardar referencia inversa en el gráfico
      cablePermanente.setData('cableInfo', cableInfo);
      
      // Registrar en el modelo de conectividad
      // 1. Registrar en conexionesPorComponente
      const contInicio = cableInfo.puntoInicio.contenedor;
      const contFin = cableInfo.puntoFin.contenedor;
      
      if (!this.conexionesPorComponente.has(contInicio)) {
        this.conexionesPorComponente.set(contInicio, new Set());
      }
      this.conexionesPorComponente.get(contInicio).add(cableInfo);
      
      if (!this.conexionesPorComponente.has(contFin)) {
        this.conexionesPorComponente.set(contFin, new Set());
      }
      this.conexionesPorComponente.get(contFin).add(cableInfo);
      
  // 2. Registrar en cablePorPuntoVisual
      this.cablePorPuntoVisual.set(cableInfo.puntoVisualInicio, cableInfo);
      this.cablePorPuntoVisual.set(cableInfo.puntoVisualFin, cableInfo);
      
      // Loguear la conexión creada
      console.log(`✅ CABLE CONECTADO: ${herramientaInicio.nombre} → ${herramientaFin.nombre}`);
      console.log(`   Puntos en la ruta: ${this.puntosIntermediosCable.length} (incluye inicio y fin)`);
      console.log(`   Total de cables: ${this.cablesCreados.length}`);

      // Recalcular el estado visual del circuito (encender/apagar bombillas)
      if (typeof this.actualizarEstadoVisualCircuito === 'function') {
        this.actualizarEstadoVisualCircuito();
      }
      
      // Limpieza: destruir gráfico temporal y resetear estado
      if (this.cableGraficoActual) {
        this.cableGraficoActual.destroy();
      }
      
      this.estaDibujandoCable = false;
      this.puntoInicioCable = null;
      this.cableGraficoActual = null;
      this.puntosIntermediosCable = [];
    }
    // Si NO es válido, no hacer nada (dejar que el usuario siga dibujando)
  }

  /**
   * Elimina un cable del modelo y de la escena visual.
   * @param {Object} cableInfo
   */
  eliminarCable(cableInfo) {
    if (!cableInfo) return;

    console.log(`🗑️ Eliminando cable entre ${cableInfo.herramientaInicio?.nombre || '?'} y ${cableInfo.herramientaFin?.nombre || '?'}`);

    // 1. Eliminar de la lista principal de cables
    const index = this.cablesCreados.findIndex(c => c === cableInfo);
    if (index > -1) {
      this.cablesCreados.splice(index, 1);
    }

    // 2. Eliminar de conexionesPorComponente para ambos extremos
    const compInicio = cableInfo.puntoInicio?.contenedor;
    const compFin = cableInfo.puntoFin?.contenedor;
    if (compInicio && this.conexionesPorComponente.has(compInicio)) {
      this.conexionesPorComponente.get(compInicio).delete(cableInfo);
      if (this.conexionesPorComponente.get(compInicio).size === 0) {
        this.conexionesPorComponente.delete(compInicio);
      }
    }
    if (compFin && this.conexionesPorComponente.has(compFin)) {
      this.conexionesPorComponente.get(compFin).delete(cableInfo);
      if (this.conexionesPorComponente.get(compFin).size === 0) {
        this.conexionesPorComponente.delete(compFin);
      }
    }

    // 3. Eliminar de cablePorPuntoVisual para ambos puntos visuales
    if (cableInfo.puntoVisualInicio) {
      this.cablePorPuntoVisual.delete(cableInfo.puntoVisualInicio);
    }
    if (cableInfo.puntoVisualFin) {
      this.cablePorPuntoVisual.delete(cableInfo.puntoVisualFin);
    }

    // 4. Destruir el objeto Graphics del cable
    if (cableInfo.grafico && !cableInfo.grafico.destroyed) {
      cableInfo.grafico.destroy();
    }

    // 5. Actualizar el estado visual del circuito
    if (typeof this.actualizarEstadoVisualCircuito === 'function') {
      this.actualizarEstadoVisualCircuito();
    }
  }

  /**
   * Evalúa el circuito actual y actualiza el estado visual de las bombillas.
   */
  actualizarEstadoVisualCircuito() {
    try {
      const componentes = (Array.isArray(this.componentesActivos) && this.componentesActivos.length > 0)
        ? this.componentesActivos
        : Array.from(this.conexionesPorComponente.keys());
      const estadosBombillas = analizarEstadoCircuito(componentes, this.conexionesPorComponente, this.configuracionNivel?.configuracionSimulacion);

      // Guardar el mapa de estados para consulta externa
      this.ultimoMapaEstadosBombillas = estadosBombillas;

      // Actualizar estado visual de todas las bombillas conocidas
      const lista = Array.isArray(this.componentesActivos) && this.componentesActivos.length > 0
        ? this.componentesActivos
        : this.children.list;

      lista.forEach((comp) => {
        if (comp instanceof BombillaComponente) {
          const estado = estadosBombillas.get(comp) || 'apagada';
          switch (estado) {
            case 'encendida_correcta':
              comp.encender?.();
              break;
            case 'encendida_muy_brillante': // Brillo intenso con Glow FX
              comp.brillarIntenso?.(); // Llamar al nuevo método
              break;
            case 'encendida_tenue':
              comp.atenuar?.();
              break;
            case 'quemada':
              comp.quemar?.();
              break;
            case 'apagada':
            default:
              comp.apagar?.();
              break;
          }
        }
      });
    } catch (e) {
      console.warn('Error al actualizar estado visual del circuito:', e);
    }
  }

  esPuntoDeConexion(objeto) {
    // Verifica si el objeto tiene los datos que asignamos a los puntos de conexión
    if (!objeto || !objeto.getData) return false;
    return objeto.getData('contenedorPadre') !== undefined && objeto.getData('posRelativa') !== undefined;
  }

  /**
   * Establece la configuración del nivel desde el componente React.
   * @param {Object} config - Configuración del nivel con herramientas, objetivoTexto y objetivoValidacion
   */
  establecerConfiguracionNivel(config) {
    this.configuracionNivel = config;
  }

  /**
   * Reinicia completamente el estado del nivel: elimina componentes, cables y estados internos.
   * Mantiene la escena y la configuración del nivel.
   */
  reiniciarNivel() {
    try {
      // Cancelar dibujo temporal si existía
      if (this.cableGraficoActual && !this.cableGraficoActual.destroyed) {
        this.cableGraficoActual.destroy();
      }
      this.estaDibujandoCable = false;
      this.puntoInicioCable = null;
      this.cableGraficoActual = null;
      this.puntosIntermediosCable = [];

      // Eliminar todos los cables creados
      if (Array.isArray(this.cablesCreados)) {
        // Copia para evitar mutación mientras iteramos
        const copiaCables = [...this.cablesCreados];
        copiaCables.forEach((c) => this.eliminarCable(c));
      }

      // Eliminar todos los componentes activos
      if (Array.isArray(this.componentesActivos)) {
        this.componentesActivos.forEach((comp) => {
          if (comp && comp.destroy && !comp.destroyed) comp.destroy(true);
        });
      }

      // Limpiar estructuras de conectividad
      if (this.conexionesPorComponente?.clear) this.conexionesPorComponente.clear();
      if (this.cablePorPuntoVisual?.clear) this.cablePorPuntoVisual.clear();
      this.componentesActivos = [];
      this.cablesCreados = [];

      // Redibujar cuadrícula por si hubo alteraciones visuales
      this.dibujarCuadricula();

      // Actualizar estado visual del circuito (apagará bombillas si algo quedara)
      if (typeof this.actualizarEstadoVisualCircuito === 'function') {
        this.actualizarEstadoVisualCircuito();
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Error reiniciando el nivel:', e);
    }
  }

  /**
   * Valida si el circuito actual cumple con los objetivos del nivel.
   * @returns {boolean} - true si cumple, false en caso contrario
   */
  validarSolucionNivel() {
    if (!this.configuracionNivel || !this.configuracionNivel.objetivoValidacion) {
      console.warn('No hay configuración de objetivos para validar');
      return false;
    }

    const objetivos = this.configuracionNivel.objetivoValidacion;
    const componentes = (Array.isArray(this.componentesActivos) && this.componentesActivos.length > 0)
      ? this.componentesActivos
      : Array.from(this.conexionesPorComponente.keys());

      console.log('🔍 Validación - Componentes en escena:', componentes.length);
      console.log('🔍 Validación - Objetivos:', objetivos);

    // Obtener estado actual del circuito
  const estadosBombillas = analizarEstadoCircuito(componentes, this.conexionesPorComponente, this.configuracionNivel?.configuracionSimulacion);

  console.log('🔍 Validación - Estados bombillas:', Array.from(estadosBombillas.entries()));

    // Contar interruptores cerrados
    let interruptoresCerrados = 0;
    componentes.forEach((comp) => {
      if (comp instanceof InterruptorComponente && comp.obtenerEstado?.() === true) {
        interruptoresCerrados++;
      }
    });

      console.log('🔍 Validación - Interruptores cerrados:', interruptoresCerrados);

    // Validar objetivos
    let cumple = true;

    // Objetivo específico: cortocircuito en batería (cable entre dos terminales de la misma batería)
    if (objetivos.requiereCortocircuitoBateria) {
      // Buscar al menos una batería presente
      const bateria = componentes.find((comp) => comp instanceof BateriaComponente);
      let hayCortocircuito = false;
      if (bateria && Array.isArray(this.cablesCreados)) {
        for (const cableInfo of this.cablesCreados) {
          const contIni = cableInfo?.puntoInicio?.contenedor;
          const contFin = cableInfo?.puntoFin?.contenedor;
          if (contIni && contFin && contIni === contFin && contIni === bateria) {
            hayCortocircuito = true;
            break;
          }
        }
      }
      if (!hayCortocircuito) {
        cumple = false;
      }
    }

    if (objetivos.bombillasEncendidasMin !== undefined) {
      const encendidasCount = Array.from(estadosBombillas.values()).filter((e) => e === 'encendida_correcta' || e === 'encendida_muy_brillante' || e === 'encendida_tenue').length;
      console.log(`🔍 Validación - Comparando bombillas encendidas: ${encendidasCount} >= ${objetivos.bombillasEncendidasMin}`);
      if (encendidasCount < objetivos.bombillasEncendidasMin) {
        cumple = false;
      }
    }

    // NUEVA LÓGICA: cantidad mínima de bombillas en un estado específico
    if (objetivos.bombillasConEstadoMin && typeof objetivos.bombillasConEstadoMin === 'object') {
      const estadoRequerido = objetivos.bombillasConEstadoMin.estado;
      const cantidadRequerida = objetivos.bombillasConEstadoMin.cantidad;
      let contadorEstado = 0;

      if (this.ultimoMapaEstadosBombillas && this.ultimoMapaEstadosBombillas.size > 0) {
        for (const estadoActual of this.ultimoMapaEstadosBombillas.values()) {
          if (estadoActual === estadoRequerido) contadorEstado++;
        }
      } else if (estadosBombillas && estadosBombillas.size > 0) {
        // Fallback por si no está actualizado el último mapa
        for (const estadoActual of estadosBombillas.values()) {
          if (estadoActual === estadoRequerido) contadorEstado++;
        }
      }

      console.log(`🔍 Validación - Verificando bombillas con estado '${estadoRequerido}': Encontradas ${contadorEstado}, Requeridas ${cantidadRequerida}`);
      if (typeof cantidadRequerida === 'number' && contadorEstado < cantidadRequerida) {
        console.log(`❌ Validación Fallida: No hay suficientes bombillas en estado '${estadoRequerido}'.`);
        cumple = false;
      }
    }

    if (typeof objetivos.estadoBombillaEsperado === 'string') {
      const hayEstado = Array.from(estadosBombillas.values()).some((e) => e === objetivos.estadoBombillaEsperado);
      console.log(`🔍 Validación - Buscando estado '${objetivos.estadoBombillaEsperado}': ${hayEstado}`);
      if (!hayEstado) {
        cumple = false;
      }
    }

    if (objetivos.interruptoresCerradosMin !== undefined) {
        console.log(`🔍 Validación - Comparando interruptores: ${interruptoresCerrados} >= ${objetivos.interruptoresCerradosMin}`);
      if (interruptoresCerrados < objetivos.interruptoresCerradosMin) {
        cumple = false;
      }
    }

      console.log('🔍 Validación - Resultado final:', cumple);
    return cumple;
  }

  shutdown() {
    // Limpiar listener al apagar la escena
    this.scale.off('resize', this.redibujarCuadricula, this);
  }
}

export default EscenaPrincipal;
