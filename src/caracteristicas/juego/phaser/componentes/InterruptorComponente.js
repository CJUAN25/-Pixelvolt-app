import ComponenteBase from './ComponenteBase';

/**
 * Componente Interruptor - Representa un interruptor eléctrico en el juego
 * Hereda de ComponenteBase y agrega lógica específica para cambio de estado ON/OFF
 */
class InterruptorComponente extends ComponenteBase {
  /**
   * @param {Phaser.Scene} scene - Escena de Phaser
   * @param {number} x - Posición X inicial
   * @param {number} y - Posición Y inicial
   * @param {Object} herramienta - Información de la herramienta desde definicionHerramientas.js
   */
  constructor(scene, x, y, herramienta) {
    super(scene, x, y, herramienta);
    
    // Estado del interruptor (false = abierto/OFF, true = cerrado/ON)
    this.estaCerrado = false;
    this.setData('estadoInterruptor', this.estaCerrado);
    
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
    
    // Notificar a la escena para recalcular el estado del circuito
    if (this.scene && typeof this.scene.actualizarEstadoVisualCircuito === 'function') {
      this.scene.actualizarEstadoVisualCircuito();
    }
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
