import Phaser from 'phaser';
import { HERRAMIENTAS_DISPONIBLES } from '../datos/definicionHerramientas';
import BombillaComponente from './componentes/BombillaComponente';
import BateriaComponente from './componentes/BateriaComponente';
import ResistenciaComponente from './componentes/ResistenciaComponente';
import InterruptorComponente from './componentes/InterruptorComponente';
import ComponenteGenerico from './componentes/ComponenteGenerico';

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

    // Variables de estado para dibujo de cables
    this.estaDibujandoCable = false;
    this.puntoInicioCable = null; // { objeto: Container, punto: {x, y}, puntoVisual: Arc }
    this.cableGraficoActual = null; // Graphics para línea temporal
    this.puntosIntermediosCable = []; // Array de {x, y} para segmentos
    this.cablesCreados = []; // Array de cables permanentes
    
    // Estructuras de datos para modelo de conectividad
    this.conexionesPorComponente = new Map(); // Clave: Container, Valor: Set<cableInfo>
    this.cablePorPuntoVisual = new Map(); // Clave: puntoVisual (Circle), Valor: cableInfo

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

  esPuntoDeConexion(objeto) {
    // Verifica si el objeto tiene los datos que asignamos a los puntos de conexión
    if (!objeto || !objeto.getData) return false;
    return objeto.getData('contenedorPadre') !== undefined && objeto.getData('posRelativa') !== undefined;
  }

  shutdown() {
    // Limpiar listener al apagar la escena
    this.scale.off('resize', this.redibujarCuadricula, this);
  }
}

export default EscenaPrincipal;
