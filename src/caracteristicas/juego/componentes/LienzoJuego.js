import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { HERRAMIENTAS_DISPONIBLES } from '../datos/definicionHerramientas';

const LienzoJuego = forwardRef((props, ref) => {
  const contenedorPhaserRef = useRef(null);
  const juegoRef = useRef(null);

  // Exponer métodos al componente padre a través del ref
  useImperativeHandle(ref, () => ({
    reiniciarSimulacion: () => {
      // eslint-disable-next-line no-console
      console.log('Reiniciando simulación...');
      // TODO: Implementar lógica de reinicio cuando se añada la simulación
    },
    agregarElementoPlaceholder: (herramienta) => {
      // eslint-disable-next-line no-console
      console.log('Phaser recibió orden de agregar:', herramienta.nombre);
      // Obtener la escena activa y agregar el placeholder
      const escena = juegoRef.current?.scene.getScene('EscenaPrincipal');
      // Redirigir al nuevo método que usa imágenes
      escena?.agregarElementoJuego(herramienta);
    },
  }));

  useEffect(() => {
    let montado = true;

    (async () => {
      try {
        const mod = await import('phaser');
        const Phaser = mod.default || mod;

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
            // Calcular posición centrada
            const x = this.scale.width / 2;
            const y = this.scale.height / 2;

            // Crear contenedor en el canvas (posición global)
            const contenedorElemento = this.add.container(x, y);

            // Imagen principal dentro del contenedor (coordenadas locales)
            const elementoImagen = this.add.image(0, 0, herramienta.id).setOrigin(0.5);

            // Ajustar escala de la imagen para no sobrecargar el área (máximo 80px)
            const maxDim = 80;
            const tex = this.textures.get(herramienta.id);
            const src = tex?.getSourceImage();
            const iw = src?.width || elementoImagen.width;
            const ih = src?.height || elementoImagen.height;
            const mayor = Math.max(iw, ih) || 1;
            if (mayor > maxDim) {
              const escala = maxDim / mayor;
              elementoImagen.setScale(escala);
            }

            // Añadir imagen al contenedor
            contenedorElemento.add(elementoImagen);
            contenedorElemento.setData('imagenPrincipal', elementoImagen);
            contenedorElemento.setData('herramientaInfo', herramienta);

            // Dibujar puntos de conexión si existen
            if (herramienta.puntosConexion && herramienta.puntosConexion.length > 0) {
              herramienta.puntosConexion.forEach((punto) => {
                const puntoVisual = this.add.circle(punto.x, punto.y, 6, 0x00ffff, 0.8);
                puntoVisual.setStrokeStyle(2, 0x00cccc, 1);
                
                // Hacer el punto interactivo
                puntoVisual.setInteractive({ useHandCursor: true });
                
                // Guardar referencias
                puntoVisual.setData('contenedorPadre', contenedorElemento);
                puntoVisual.setData('posRelativa', punto);
                
                // Listener pointerdown para iniciar dibujo de cable
                puntoVisual.on('pointerdown', (pointer, localX, localY, event) => {
                  if (pointer.leftButtonDown()) {
                    // Prevenir propagación al contenedor para evitar arrastre
                    event.stopPropagation();
                    
                    // Si NO estamos dibujando, iniciar dibujo desde este punto
                    if (!this.estaDibujandoCable) {
                      this.iniciarDibujoCable(puntoVisual);
                    }
                    // Si YA estamos dibujando, finalizar en este punto
                    else {
                      this.finalizarDibujoCable(puntoVisual);
                    }
                  }
                });
                
                contenedorElemento.add(puntoVisual);
                if (!contenedorElemento.getData('puntosConexionVisuales')) {
                  contenedorElemento.setData('puntosConexionVisuales', []);
                }
                contenedorElemento.getData('puntosConexionVisuales').push({
                  objetoPhaser: puntoVisual,
                  posRelativa: { x: punto.x, y: punto.y },
                });
              });
            }

            // Establecer tamaño del contenedor para interacción (usar display size de la imagen)
            const dispW = elementoImagen.displayWidth || elementoImagen.width;
            const dispH = elementoImagen.displayHeight || elementoImagen.height;
            contenedorElemento.setSize(dispW, dispH);

            // Pequeño offset aleatorio para evitar superposición total
            contenedorElemento.x += (Math.random() - 0.5) * 100;
            contenedorElemento.y += (Math.random() - 0.5) * 100;

            // Interactividad y arrastre en el CONTENEDOR
            contenedorElemento.setInteractive({ useHandCursor: true });
            this.input.setDraggable(contenedorElemento);

            // Doble clic para eliminar (en contenedor)
            contenedorElemento.on('pointerdown', (pointer) => {
              if (pointer.button === 0 || pointer.leftButtonDown()) {
                const now = this.time?.now ?? performance.now();
                const lastDownTime = contenedorElemento.getData('lastDownTime') || 0;
                const lastDownX = contenedorElemento.getData('lastDownX');
                const lastDownY = contenedorElemento.getData('lastDownY');
                const dblTime = 350; // ms
                const dblDist = 12; // px
                const posDeltaDown = (typeof lastDownX === 'number' && typeof lastDownY === 'number')
                  ? Phaser.Math.Distance.Between(lastDownX, lastDownY, pointer.x, pointer.y)
                  : Number.MAX_SAFE_INTEGER;

                if (lastDownTime && (now - lastDownTime) <= dblTime && posDeltaDown <= dblDist) {
                  contenedorElemento.setData('lastDownTime', 0);
                  contenedorElemento.setData('lastDownX', undefined);
                  contenedorElemento.setData('lastDownY', undefined);
                  
                  // Limpiar cables conectados antes de destruir el componente
                  if (this.conexionesPorComponente.has(contenedorElemento)) {
                    const cablesConectados = this.conexionesPorComponente.get(contenedorElemento);
                    
                    cablesConectados.forEach(cableInfo => {
                      // Destruir gráfico del cable
                      if (cableInfo.grafico) {
                        cableInfo.grafico.destroy();
                      }
                      
                      // Eliminar de this.cablesCreados
                      const index = this.cablesCreados.findIndex(c => c === cableInfo);
                      if (index > -1) {
                        this.cablesCreados.splice(index, 1);
                      }
                      
                      // Limpiar referencia en el otro componente conectado
                      const otroContenedor = cableInfo.puntoInicio.contenedor === contenedorElemento 
                        ? cableInfo.puntoFin.contenedor 
                        : cableInfo.puntoInicio.contenedor;
                      
                      if (this.conexionesPorComponente.has(otroContenedor)) {
                        this.conexionesPorComponente.get(otroContenedor).delete(cableInfo);
                      }
                      
                      // Limpiar referencias en cablePorPuntoVisual
                      if (cableInfo.puntoVisualInicio) {
                        this.cablePorPuntoVisual.delete(cableInfo.puntoVisualInicio);
                      }
                      if (cableInfo.puntoVisualFin) {
                        this.cablePorPuntoVisual.delete(cableInfo.puntoVisualFin);
                      }
                    });
                    
                    // Eliminar el componente del mapa principal
                    this.conexionesPorComponente.delete(contenedorElemento);
                    
                    console.log(`🗑️ Componente eliminado con ${cablesConectados.size} cables conectados`);
                  }
                  
                  // Ahora sí, destruir el contenedor
                  contenedorElemento.destroy();
                  return;
                }

                contenedorElemento.setData('lastDownTime', now);
                contenedorElemento.setData('lastDownX', pointer.x);
                contenedorElemento.setData('lastDownY', pointer.y);

                contenedorElemento.setData('startX', pointer.x);
                contenedorElemento.setData('startY', pointer.y);
                contenedorElemento.setData('pressedWithLeft', true);
              }
            });

            contenedorElemento.on('pointerup', () => {
              contenedorElemento.setData('isDragging', false);
              contenedorElemento.setData('pressedWithLeft', false);
            });
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
              
              // TODO: Tarea 5.10 - Guardar la conexión en el modelo de datos
              
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

        if (!montado || !contenedorPhaserRef.current) return;

        const config = {
          type: Phaser.AUTO,
          parent: contenedorPhaserRef.current,
          width: 800,
          height: 600,
          backgroundColor: '#0f1420',
          scene: [EscenaPrincipal],
          scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
          },
        };

        juegoRef.current = new Phaser.Game(config);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error inicializando Phaser:', e);
      }
    })();

    return () => {
      montado = false;
      if (juegoRef.current) {
        try {
          juegoRef.current.destroy(true);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('Error al destruir Phaser:', e);
        } finally {
          juegoRef.current = null;
        }
      }
    };
  }, []);

  return <div ref={contenedorPhaserRef} className="contenedor-phaser" />;
});

export default LienzoJuego;
