import ComponenteBase from './ComponenteBase';

/**
 * Componente Bombilla - Representa una bombilla eléctrica en el juego
 * Hereda de ComponenteBase y agrega lógica específica para estados visuales de brillo
 */
class BombillaComponente extends ComponenteBase {
  /**
   * @param {Phaser.Scene} scene - Escena de Phaser
   * @param {number} x - Posición X inicial
   * @param {number} y - Posición Y inicial
   * @param {Object} herramienta - Información de la herramienta desde definicionHerramientas.js
   */
  constructor(scene, x, y, herramienta) {
    super(scene, x, y, herramienta);
    
    // Propiedad para guardar la referencia al efecto de resplandor (Glow FX)
    this.glowEffect = null;
    
    // Iniciar apagada
    this.apagar();
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
