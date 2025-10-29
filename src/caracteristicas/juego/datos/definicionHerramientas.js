// src/caracteristicas/juego/datos/definicionHerramientas.js

/**
 * Catálogo central de herramientas disponibles en el juego PixelVolt.
 * Cada herramienta tiene un id único, nombre descriptivo en español e icono (imagen importada).
 */

import iconoCable from '../../../assets/iconos/herramientas/cable.png';
import iconoBateria from '../../../assets/iconos/herramientas/bateria.png';
import iconoResistencia from '../../../assets/iconos/herramientas/resistencia-fija.png';
import iconoBombilla from '../../../assets/iconos/herramientas/bombilla.png';
import iconoInterruptor from '../../../assets/iconos/herramientas/interruptor.png';
import iconoImanBarra from '../../../assets/iconos/herramientas/iman-barra.png';
import iconoBrujula from '../../../assets/iconos/herramientas/brujula.png';
import iconoBobina from '../../../assets/iconos/herramientas/bobina.png';
import iconoCapacitor from '../../../assets/iconos/herramientas/capacitor.png';
import iconoFuenteCA from '../../../assets/iconos/herramientas/fuente-ca.png';
import iconoMotor from '../../../assets/iconos/herramientas/motor.png';
import iconoTransformador from '../../../assets/iconos/herramientas/transformador.png';

export const HERRAMIENTAS_DISPONIBLES = [
  { id: 'cable', nombre: 'Cable Conector', icono: iconoCable, puntosConexion: [] },
  { id: 'bateria', nombre: 'Batería (CC)', icono: iconoBateria, valorVoltaje: 5, puntosConexion: [ { x: -16, y: 0 }, { x: 16, y: 0 } ] },
  // Resistencia fija (se mantiene) y nuevas variantes con valores específicos
  { id: 'resistencia-fija', nombre: 'Resistencia Fija (50 Ω)', icono: iconoResistencia, valorResistencia: 50, puntosConexion: [ { x: -16, y: 0 }, { x: 16, y: 0 } ] },
  { id: 'resistencia-68', nombre: 'Resistencia (68 Ω)', icono: iconoResistencia, valorResistencia: 68, puntosConexion: [ { x: -16, y: 0 }, { x: 16, y: 0 } ] },
  { id: 'resistencia-10', nombre: 'Resistencia (10 Ω)', icono: iconoResistencia, valorResistencia: 10, puntosConexion: [ { x: -16, y: 0 }, { x: 16, y: 0 } ] },
  { id: 'resistencia-100', nombre: 'Resistencia (100 Ω)', icono: iconoResistencia, valorResistencia: 100, puntosConexion: [ { x: -16, y: 0 }, { x: 16, y: 0 } ] },
  { id: 'resistencia-1k', nombre: 'Resistencia (1 kΩ)', icono: iconoResistencia, valorResistencia: 1000, puntosConexion: [ { x: -16, y: 0 }, { x: 16, y: 0 } ] },
  { id: 'bombilla', nombre: 'Bombilla', icono: iconoBombilla, corrienteOptima: 0.05, corrienteMaxima: 0.1, puntosConexion: [ { x: -5, y: 14 }, { x: 5, y: 14 } ] },
  { id: 'interruptor', nombre: 'Interruptor', icono: iconoInterruptor, puntosConexion: [ { x: -16, y: 0 }, { x: 16, y: 0 } ] },
  { id: 'iman-barra', nombre: 'Imán de Barra', icono: iconoImanBarra, puntosConexion: [] },
  { id: 'brujula', nombre: 'Brújula', icono: iconoBrujula, puntosConexion: [] },
  { id: 'bobina', nombre: 'Bobina (Inductor)', icono: iconoBobina, puntosConexion: [ { x: -16, y: 0 }, { x: 16, y: 0 } ] },
  { id: 'capacitor', nombre: 'Capacitor', icono: iconoCapacitor, puntosConexion: [ { x: -5, y: 16 }, { x: 5, y: 16 } ] },
  { id: 'fuente-ca', nombre: 'Fuente de CA', icono: iconoFuenteCA, puntosConexion: [ { x: -16, y: 0 }, { x: 16, y: 0 } ] },
  { id: 'motor', nombre: 'Motor Simple', icono: iconoMotor, puntosConexion: [ { x: -8, y: 16 }, { x: 8, y: 16 } ] },
  { id: 'transformador', nombre: 'Transformador', icono: iconoTransformador, puntosConexion: [ { x: -16, y: -8 }, { x: -16, y: 8 }, { x: 16, y: -8 }, { x: 16, y: 8 } ] },
];
