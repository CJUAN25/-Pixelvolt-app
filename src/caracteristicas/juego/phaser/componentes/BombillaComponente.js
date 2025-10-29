import Phaser from 'phaser';

/**
 * Componente Bombilla - Representa una bombilla eléctrica en el juego
 * Extiende Phaser.GameObjects.Container para agrupar imagen y puntos de conexión
 */
class BombillaComponente extends Phaser.GameObjects.Container {
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
    
    // Propiedad para guardar la referencia al efecto de resplandor (Glow FX)
    this.glowEffect = null;
    
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
    
    // Configurar listener de doble clic para eliminar
    this.configurarDobleClicEliminar(scene);
    
    // Listener de pointerup
    this.on('pointerup', () => {
      this.setData('isDragging', false);
      this.setData('pressedWithLeft', false);
    });
    
    // Iniciar apagada
    this.apagar();
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
          
          // Notificar a la escena y actualizar lista de componentes antes de destruir
          if (scene) {
            if (Array.isArray(scene.componentesActivos)) {
              scene.componentesActivos = scene.componentesActivos.filter(c => c !== this);
            }
            if (typeof scene.actualizarEstadoVisualCircuito === 'function') {
              scene.actualizarEstadoVisualCircuito();
            }
          }
          
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
    if (scene && scene.conexionesPorComponente && scene.conexionesPorComponente.has(this)) {
      const cablesAEliminar = Array.from(scene.conexionesPorComponente.get(this));
      cablesAEliminar.forEach((cableInfo) => {
        if (typeof scene.eliminarCable === 'function') {
          scene.eliminarCable(cableInfo);
        }
      });
      // Eliminar entrada vacía para este componente (por limpieza)
      scene.conexionesPorComponente.delete(this);
      console.log(`🗑️ Bombilla eliminada con ${cablesAEliminar.length} cables conectados`);
    }
  }
  
  /**
   * Apaga la bombilla visualmente (sin tinte ni efectos)
   */
  apagar() {
    if (this.imagenPrincipal && this.imagenPrincipal.clearTint) {
      this.imagenPrincipal.clearTint();
      this.imagenPrincipal.setAlpha(1);
      // Asegurarse de quitar cualquier efecto de resplandor si existe
      if (this.imagenPrincipal.postFX && this.glowEffect) {
        this.imagenPrincipal.postFX.remove(this.glowEffect);
        this.glowEffect = null;
      }
    }
  }

  /**
   * Muestra la bombilla atenuada (brillo bajo - corriente insuficiente)
   */
  atenuar() {
    if (this.imagenPrincipal && this.imagenPrincipal.setTint) {
      this.imagenPrincipal.setTint(0xff9900); // Naranja oscuro/amarillo muy visible
      this.imagenPrincipal.setAlpha(0.5); // Más transparente para diferenciarlo
      // Quitar resplandor si lo hubiera
      if (this.imagenPrincipal.postFX && this.glowEffect) {
        this.imagenPrincipal.postFX.remove(this.glowEffect);
        this.glowEffect = null;
      }
    }
  }

  /**
   * Enciende la bombilla visualmente (tinte amarillo - corriente óptima)
   */
  encender() {
    if (this.imagenPrincipal && this.imagenPrincipal.setTint) {
      this.imagenPrincipal.setTint(0xffff00); // Tinte amarillo brillante normal
      this.imagenPrincipal.setAlpha(1);
      // Quitar resplandor si lo hubiera (para diferenciar de muy brillante)
      if (this.imagenPrincipal.postFX && this.glowEffect) {
        this.imagenPrincipal.postFX.remove(this.glowEffect);
        this.glowEffect = null;
      }
    }
  }

  /**
   * Muestra brillo muy intenso (corriente alta pero no quemada)
   */
  brillarIntenso() {
    if (this.imagenPrincipal && this.imagenPrincipal.setTint) {
      this.imagenPrincipal.setTint(0xffff99); // Amarillo brillante (base visible)
      this.imagenPrincipal.setAlpha(1);
      // Añadir o actualizar el efecto de resplandor intenso
      if (this.imagenPrincipal.postFX) {
        // Quitar efecto anterior si existe
        if (this.glowEffect) {
          this.imagenPrincipal.postFX.remove(this.glowEffect);
        }
        // Añadir un resplandor notable y más fuerte
        this.glowEffect = this.imagenPrincipal.postFX.addGlow(0xffff00, 4, 0, false, 0.2, 24);
      }
    }
  }

  /**
   * Indica bombilla quemada (tinte oscuro)
   */
  quemar() {
    if (this.imagenPrincipal && this.imagenPrincipal.setTint) {
      this.imagenPrincipal.setTint(0x333333); // Tinte gris oscuro
      this.imagenPrincipal.setAlpha(0.8); // Ligeramente opaco
      // Asegurarse de quitar cualquier efecto de resplandor
      if (this.imagenPrincipal.postFX && this.glowEffect) {
        this.imagenPrincipal.postFX.remove(this.glowEffect);
        this.glowEffect = null;
      }
    }
  }
}

export default BombillaComponente;
