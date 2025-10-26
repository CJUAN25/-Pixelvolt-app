import Phaser from 'phaser';

/**
 * Componente Interruptor - Representa un interruptor eléctrico en el juego
 * Extiende Phaser.GameObjects.Container para agrupar imagen y puntos de conexión
 */
class InterruptorComponente extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene - Escena de Phaser
   * @param {number} x - Posición X inicial
   * @param {number} y - Posición Y inicial
   * @param {Object} herramienta - Información de la herramienta desde definicionHerramientas.js
   */
  constructor(scene, x, y, herramienta) {
    super(scene, x, y);
    
    // Guardar información de la herramienta
    this.setData('herramientaInfo', herramienta);
    
    // Estado del interruptor (false = abierto/OFF, true = cerrado/ON)
    this.estaCerrado = false;
    this.setData('estadoInterruptor', this.estaCerrado);
    
    // Crear imagen principal (coordenadas locales al contenedor)
    this.imagenPrincipal = scene.add.image(0, 0, herramienta.id).setOrigin(0.5);
    
    // Ajustar escala si es necesario (máximo 80px)
    const maxDim = 80;
    const tex = scene.textures.get(herramienta.id);
    const src = tex?.getSourceImage();
    const iw = src?.width || this.imagenPrincipal.width;
    const ih = src?.height || this.imagenPrincipal.height;
    const mayor = Math.max(iw, ih) || 1;
    
    if (mayor > maxDim) {
      const escala = maxDim / mayor;
      this.imagenPrincipal.setScale(escala);
    }
    
    // Añadir imagen al contenedor
    this.add(this.imagenPrincipal);
    this.setData('imagenPrincipal', this.imagenPrincipal);
    
    // Crear puntos de conexión si existen
    this.puntosConexionVisuales = [];
    if (herramienta.puntosConexion && herramienta.puntosConexion.length > 0) {
      herramienta.puntosConexion.forEach((punto) => {
        const puntoVisual = scene.add.circle(punto.x, punto.y, 6, 0x00ffff, 0.8);
        puntoVisual.setStrokeStyle(2, 0x00cccc, 1);
        puntoVisual.setInteractive({ useHandCursor: true });
        
        // Guardar referencias
        puntoVisual.setData('contenedorPadre', this);
        puntoVisual.setData('posRelativa', punto);
        
        // Listener para iniciar/finalizar dibujo de cables
        puntoVisual.on('pointerdown', (pointer, localX, localY, event) => {
          if (pointer.leftButtonDown()) {
            event.stopPropagation();
            
            if (!scene.estaDibujandoCable) {
              scene.iniciarDibujoCable(puntoVisual);
            } else {
              scene.finalizarDibujoCable(puntoVisual);
            }
          }
        });
        
        this.add(puntoVisual);
        this.puntosConexionVisuales.push({
          objetoPhaser: puntoVisual,
          posRelativa: { x: punto.x, y: punto.y },
        });
      });
    }
    
    this.setData('puntosConexionVisuales', this.puntosConexionVisuales);
    
    // Establecer tamaño del contenedor
    const dispW = this.imagenPrincipal.displayWidth || this.imagenPrincipal.width;
    const dispH = this.imagenPrincipal.displayHeight || this.imagenPrincipal.height;
    this.setSize(dispW, dispH);
    
    // Configurar interactividad y arrastre
    this.setInteractive({ useHandCursor: true });
    scene.input.setDraggable(this);
    
    // ⚡ LISTENER PARA CLIC DERECHO - Cambiar estado del interruptor
    this.on('pointerdown', (pointer, localX, localY, event) => {
      // Verificar si fue clic derecho
      if (pointer.rightButtonDown()) {
        // Prevenir el menú contextual del navegador
        if (pointer.event && pointer.event.preventDefault) {
          pointer.event.preventDefault();
        }
        // Detener la propagación para que no lo capture la escena
        event.stopPropagation();
        // Cambiar el estado del interruptor
        this.toggleEstado();
      }
    });
    
    // Configurar listener de doble clic para eliminar
    this.configurarDobleClicEliminar(scene);
    
    // Listener de pointerup
    this.on('pointerup', () => {
      this.setData('isDragging', false);
      this.setData('pressedWithLeft', false);
    });
  }
  
  /**
   * Configura el comportamiento de doble clic para eliminar el componente
   * @param {Phaser.Scene} scene - Escena de Phaser
   */
  configurarDobleClicEliminar(scene) {
    this.on('pointerdown', (pointer) => {
      if (pointer.button === 0 || pointer.leftButtonDown()) {
        const now = scene.time?.now ?? performance.now();
        const lastDownTime = this.getData('lastDownTime') || 0;
        const lastDownX = this.getData('lastDownX');
        const lastDownY = this.getData('lastDownY');
        const dblTime = 350; // ms
        const dblDist = 12; // px
        const posDeltaDown = (typeof lastDownX === 'number' && typeof lastDownY === 'number')
          ? Phaser.Math.Distance.Between(lastDownX, lastDownY, pointer.x, pointer.y)
          : Number.MAX_SAFE_INTEGER;

        if (lastDownTime && (now - lastDownTime) <= dblTime && posDeltaDown <= dblDist) {
          this.setData('lastDownTime', 0);
          this.setData('lastDownX', undefined);
          this.setData('lastDownY', undefined);
          
          // Eliminar cables conectados
          this.eliminarCablesConectados(scene);
          
          // Destruir el componente
          this.destroy();
          return;
        }

        this.setData('lastDownTime', now);
        this.setData('lastDownX', pointer.x);
        this.setData('lastDownY', pointer.y);
        this.setData('startX', pointer.x);
        this.setData('startY', pointer.y);
        this.setData('pressedWithLeft', true);
      }
    });
  }
  
  /**
   * Elimina todos los cables conectados a este componente
   * @param {Phaser.Scene} scene - Escena de Phaser
   */
  eliminarCablesConectados(scene) {
    if (scene.conexionesPorComponente.has(this)) {
      const cablesConectados = scene.conexionesPorComponente.get(this);
      
      cablesConectados.forEach(cableInfo => {
        // Destruir gráfico del cable
        if (cableInfo.grafico) {
          cableInfo.grafico.destroy();
        }
        
        // Eliminar de cablesCreados
        const index = scene.cablesCreados.findIndex(c => c === cableInfo);
        if (index > -1) {
          scene.cablesCreados.splice(index, 1);
        }
        
        // Limpiar referencia en el otro componente
        const otroContenedor = cableInfo.puntoInicio.contenedor === this 
          ? cableInfo.puntoFin.contenedor 
          : cableInfo.puntoInicio.contenedor;
        
        if (scene.conexionesPorComponente.has(otroContenedor)) {
          scene.conexionesPorComponente.get(otroContenedor).delete(cableInfo);
        }
        
        // Limpiar referencias en cablePorPuntoVisual
        if (cableInfo.puntoVisualInicio) {
          scene.cablePorPuntoVisual.delete(cableInfo.puntoVisualInicio);
        }
        if (cableInfo.puntoVisualFin) {
          scene.cablePorPuntoVisual.delete(cableInfo.puntoVisualFin);
        }
      });
      
      // Eliminar del mapa principal
      scene.conexionesPorComponente.delete(this);
      
      console.log(`🗑️ Interruptor eliminado con ${cablesConectados.size} cables conectados`);
    }
  }
  
  /**
   * Cambia el estado del interruptor (ON/OFF)
   */
  toggleEstado() {
    this.estaCerrado = !this.estaCerrado;
    this.setData('estadoInterruptor', this.estaCerrado);
    
    console.log(`🔘 Interruptor ahora está ${this.estaCerrado ? 'CERRADO (ON)' : 'ABIERTO (OFF)'}`);
    
    // Cambiar apariencia visual
    if (this.estaCerrado) {
      // Interruptor cerrado (ON) - tinte verde
      this.imagenPrincipal.setTint(0x00ff00);
    } else {
      // Interruptor abierto (OFF) - sin tinte
      this.imagenPrincipal.clearTint();
    }
    
    // TODO: Aquí podrías cambiar textura/frame si tienes sprites con estados
  }
  
  /**
   * Obtiene el estado actual del interruptor
   * @returns {boolean} true si está cerrado (ON), false si está abierto (OFF)
   */
  obtenerEstado() {
    return this.estaCerrado;
  }
}

export default InterruptorComponente;
