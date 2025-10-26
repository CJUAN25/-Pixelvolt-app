import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import EscenaPrincipal from '../phaser/EscenaPrincipal';

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
