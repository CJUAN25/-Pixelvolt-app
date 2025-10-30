import Phaser from 'phaser';

/**
 * GestorDeCables - Gestiona la lógica de dibujo de cables en tiempo real
 * 
 * Responsabilidades:
 * - Estado del dibujo activo de cables (inicio, codos, temporal)
 * - Listeners para añadir codos y cancelar con clic derecho
 * - Actualización del cable temporal en update()
 * - Creación de cables permanentes al finalizar
 * 
 * NO gestiona:
 * - Redibujo de cables existentes durante drag (eso queda en EscenaPrincipal)
 * - Eliminación de cables (eso queda en EscenaPrincipal)
 * - Lista de cablesCreados (eso queda en EscenaPrincipal)
 */
class GestorDeCables {
  /**
   * @param {Phaser.Scene} scene - Referencia a EscenaPrincipal
   */
  constructor(scene) {
    this.scene = scene;
    
    // Variables de estado para dibujo de cables
    this.estaDibujandoCable = false;
    this.puntoInicioCable = null; // { objeto: Container, punto: {x, y}, puntoVisual: Arc }
    this.cableGraficoActual = null; // Graphics para línea temporal
    this.puntosIntermediosCable = []; // Array de {x, y} para segmentos
  }

  /**
   * Inicia el dibujo de un cable desde un punto de conexión
   * @param {Phaser.GameObjects.Arc} puntoVisualInicio - Punto de conexión origen
   */
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
    this.cableGraficoActual = this.scene.add.graphics();
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

  /**
   * Finaliza el dibujo del cable conectándolo a un punto final
   * @param {Phaser.GameObjects.Arc} puntoVisualFin - Punto de conexión destino
   */
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
      const cablePermanente = this.scene.add.graphics();
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
      this.scene.children.sendToBack(cablePermanente);
      
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
            const now = this.scene.time?.now ?? performance.now();
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
                this.scene.eliminarCable(info);
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
      
      this.scene.cablesCreados.push(cableInfo);
      // Guardar referencia inversa en el gráfico
      cablePermanente.setData('cableInfo', cableInfo);
      
      // Registrar en el modelo de conectividad
      // 1. Registrar en conexionesPorComponente
      const contInicio = cableInfo.puntoInicio.contenedor;
      const contFin = cableInfo.puntoFin.contenedor;
      
      if (!this.scene.conexionesPorComponente.has(contInicio)) {
        this.scene.conexionesPorComponente.set(contInicio, new Set());
      }
      this.scene.conexionesPorComponente.get(contInicio).add(cableInfo);
      
      if (!this.scene.conexionesPorComponente.has(contFin)) {
        this.scene.conexionesPorComponente.set(contFin, new Set());
      }
      this.scene.conexionesPorComponente.get(contFin).add(cableInfo);
      
      // 2. Registrar en cablePorPuntoVisual
      this.scene.cablePorPuntoVisual.set(cableInfo.puntoVisualInicio, cableInfo);
      this.scene.cablePorPuntoVisual.set(cableInfo.puntoVisualFin, cableInfo);
      
      // Loguear la conexión creada
      console.log(`✅ CABLE CONECTADO: ${herramientaInicio.nombre} → ${herramientaFin.nombre}`);
      console.log(`   Puntos en la ruta: ${this.puntosIntermediosCable.length} (incluye inicio y fin)`);
      console.log(`   Total de cables: ${this.scene.cablesCreados.length}`);

      // Recalcular el estado visual del circuito (encender/apagar bombillas)
      if (typeof this.scene.actualizarEstadoVisualCircuito === 'function') {
        this.scene.actualizarEstadoVisualCircuito();
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
   * Registra los listeners globales para añadir codos y cancelar
   */
  registrarListenersGlobales() {
    // Listener global para añadir codos intermedios y cancelar con clic derecho
    this.scene.input.on('pointerdown', (pointer) => {
      // Añadir codos con clic izquierdo (si NO es sobre un punto de conexión)
      if (this.estaDibujandoCable && pointer.leftButtonDown() && !this.scene.esPuntoDeConexion(pointer.targetObject)) {
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

  /**
   * Actualiza el dibujo temporal del cable siguiendo el cursor
   * Debe llamarse desde update() de EscenaPrincipal
   */
  updateTemporal() {
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
      const snapPointerX = Math.round(this.scene.input.activePointer.x / tamanoCelda) * tamanoCelda;
      const snapPointerY = Math.round(this.scene.input.activePointer.y / tamanoCelda) * tamanoCelda;
      const ultimoPunto = this.puntosIntermediosCable[this.puntosIntermediosCable.length - 1];
      
      if (ultimoPunto) {
        // Dibujar ortogonalmente desde el último codo hasta el puntero
        this.cableGraficoActual.lineTo(snapPointerX, ultimoPunto.y); // Horizontal
        this.cableGraficoActual.lineTo(snapPointerX, snapPointerY); // Vertical
      }
      
      this.cableGraficoActual.strokePath();
    }
  }
}

export default GestorDeCables;
