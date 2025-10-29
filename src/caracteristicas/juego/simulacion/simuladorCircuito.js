// Lógica de simulación de circuitos eléctricos básicos (Fase 6.3-6.5)
// Detecta bombillas en circuito cerrado atravesando componentes pasivos en serie,
// respetando el estado de los interruptores.

import BateriaComponente from '../phaser/componentes/BateriaComponente';
import BombillaComponente from '../phaser/componentes/BombillaComponente';
import InterruptorComponente from '../phaser/componentes/InterruptorComponente';
import ResistenciaComponente from '../phaser/componentes/ResistenciaComponente';

/**
 * Analiza el estado del circuito y determina el estado de cada bombilla usando Ley de Ohm.
 * - Devuelve un Map<BombillaComponente, string> con estados: 'apagada', 'encendida_correcta',
 *   'encendida_muy_brillante' o 'quemada'.
 * - Respeta el estado de los interruptores (solo permiten paso si están cerrados).
 * - Usa valores de configuracionSimulacion cuando estén presentes; si no, toma valores de las
 *   herramientas (valorVoltaje en batería, valorResistencia en resistencias, corrienteOptima y
 *   corrienteMaxima en bombilla).
 *
 * @param {Array<Phaser.GameObjects.Container>} componentesEnEscena - Instancias de todos los componentes en la escena.
 * @param {Map<Phaser.GameObjects.Container, Set<Object>>} conexionesPorComponente - Mapa de conexiones (cableInfo) por componente.
 * @param {Object} configuracionSimulacion - Opcional. { voltajeBateria, corrienteOptimaBombilla, corrienteMaximaBombilla }
 * @returns {Map<BombillaComponente, string>} Estados por bombilla.
 */
export function analizarEstadoCircuito(componentesEnEscena, conexionesPorComponente, configuracionSimulacion = null) {
  const estados = new Map();
  if (!Array.isArray(componentesEnEscena) || !conexionesPorComponente) return estados;

  const bombillas = componentesEnEscena.filter((c) => c instanceof BombillaComponente);
  // Inicializar todas como apagadas por defecto
  bombillas.forEach((b) => estados.set(b, 'apagada'));

  const baterias = componentesEnEscena.filter((c) => c instanceof BateriaComponente);
  if (baterias.length === 0) return estados;

  // Mapa de severidad para combinar resultados de múltiples rutas:
  // apagada < tenue < correcta < muy_brillante < quemada
  const severidad = {
    'apagada': 0,
    'encendida_tenue': 1,
    'encendida_correcta': 2,
    'encendida_muy_brillante': 3,
    'quemada': 4
  };

  // Para cada batería y bombilla, evaluar si existe un lazo cerrado y calcular I
  for (const bateria of baterias) {
    for (const bombilla of bombillas) {
      const rutaContenedores = encontrarCaminoCerradoQueInvolucraBombilla(bateria, bombilla, conexionesPorComponente);
      if (!rutaContenedores) continue;

      // Sumar voltajes y resistencias de la ruta
      let Vtotal = 0;
      let Rtotal = 0;
      for (const comp of rutaContenedores) {
        const info = comp.getData ? comp.getData('herramientaInfo') : null;
        if (comp instanceof BateriaComponente) {
          const v = (configuracionSimulacion && typeof configuracionSimulacion.voltajeBateria === 'number')
            ? configuracionSimulacion.voltajeBateria
            : (info?.valorVoltaje || 0);
          Vtotal += (typeof v === 'number' ? v : 0);
        } else if (comp instanceof ResistenciaComponente) {
          const r = info?.valorResistencia;
          if (typeof r === 'number') Rtotal += r;
        } else if (comp instanceof BombillaComponente) {
          // Sumar la resistencia interna de la bombilla si está especificada
          const rBombilla = (configuracionSimulacion && typeof configuracionSimulacion.resistenciaBombilla === 'number')
            ? configuracionSimulacion.resistenciaBombilla
            : 0;
          if (rBombilla > 0) Rtotal += rBombilla;
        }
      }

      // Evitar división por cero: si no hay resistencias explícitas, asumir pequeña resistencia
      if (Rtotal <= 0) Rtotal = 0.1; // ohmios mínimos para evitar infinito

      const I = Vtotal / Rtotal; // Amperios

      // Log de depuración para ver valores calculados
      console.log(`💡 Bombilla: V=${Vtotal.toFixed(2)}V, R=${Rtotal.toFixed(2)}Ω, I=${I.toFixed(4)}A`);

      // Obtener parámetros de la bombilla
      const infoBomb = bombilla.getData ? bombilla.getData('herramientaInfo') : null;
      const Iopt = (configuracionSimulacion && typeof configuracionSimulacion.corrienteOptimaBombilla === 'number')
        ? configuracionSimulacion.corrienteOptimaBombilla
        : (infoBomb?.corrienteOptima ?? 0.05);
      const Imax = (configuracionSimulacion && typeof configuracionSimulacion.corrienteMaximaBombilla === 'number')
        ? configuracionSimulacion.corrienteMaximaBombilla
        : (infoBomb?.corrienteMaxima ?? 0.1);

      // Umbrales ajustados para mejor visualización de todos los estados
      const umbralMinimo = Iopt * 0.05; // 5% de corriente óptima - mínimo para empezar a brillar
      const umbralTenue = Iopt * 0.5;   // 50% de corriente óptima - brillo tenue
      const umbralNormal = Iopt * 0.75; // 75% de corriente óptima - brillo normal
      const umbralBrillante = Iopt * 1.3; // 130% de corriente óptima - muy brillante

      let estado = 'apagada';
      if (I > Imax) {
        estado = 'quemada';
      } else if (I >= umbralBrillante) {
        estado = 'encendida_muy_brillante';
      } else if (I >= umbralNormal) {
        estado = 'encendida_correcta';
      } else if (I >= umbralTenue) {
        estado = 'encendida_tenue';
      } else if (I >= umbralMinimo) {
        estado = 'encendida_tenue'; // Muy poca corriente, pero algo de brillo
      } else {
        estado = 'apagada';
      }

      // Log del estado determinado
      console.log(`   Estado: ${estado} (Iopt=${Iopt.toFixed(4)}A, Imax=${Imax.toFixed(4)}A)`);

      const estadoPrev = estados.get(bombilla) || 'apagada';
      if (severidad[estado] > severidad[estadoPrev]) {
        estados.set(bombilla, estado);
      } else if (estadoPrev === undefined) {
        estados.set(bombilla, estado);
      }
    }
  }

  return estados;
}

/**
 * Verifica, para una batería dada, qué bombillas pueden formar un circuito cerrado completo con ella.
 * @param {BateriaComponente} bateria
 * @param {Array<Phaser.GameObjects.Container>} componentes
 * @param {Map<Phaser.GameObjects.Container, Set<Object>>} conexiones
 * @returns {Set<BombillaComponente>}
 */
function verificarCaminoParaBateria(bateria, componentes, conexiones) {
  // Ya no se usa externamente en el nuevo flujo, pero se conserva si hiciera falta
  const encendidas = new Set();
  const terminales = obtenerTerminalesBateria(bateria);
  if (!terminales || !terminales.positivo || !terminales.negativo) return encendidas;
  const visitadosIda = new Set();
  const halladas = buscarBombillasEnCamino(terminales.positivo, conexiones, visitadosIda);
  for (const { bombilla, puntoEntradaBombilla } of halladas) {
    const puntoSalidaBombilla = obtenerOtrosPuntosEnComponente(bombilla, puntoEntradaBombilla)[0];
    if (!puntoSalidaBombilla) continue;
    const visitadosVuelta = new Set();
    const hayRegreso = buscarRegresoBateria(
      { contenedor: bombilla, punto: puntoSalidaBombilla },
      terminales.negativo,
      conexiones,
      visitadosVuelta
    );
    if (hayRegreso) encendidas.add(bombilla);
  }
  return encendidas;
}

/**
 * DFS que encuentra todas las bombillas alcanzables desde un nodo inicial (polo positivo de una batería),
 * respetando interruptores y atravesando componentes pasivos (resistencias, genéricos).
 * Detecta bombillas pero no las atraviesa (la travesía de bombillas ocurre en buscarRegresoBateria).
 * @param {{contenedor: Phaser.GameObjects.Container, punto: {x:number,y:number}}} nodoInicial
 * @param {Map<Phaser.GameObjects.Container, Set<Object>>} conexiones
 * @param {Set<Object>} visitadosCables - Set de cableInfo visitados en el camino actual
 * @returns {Array<{bombilla: BombillaComponente, puntoEntradaBombilla: {x:number,y:number}}>} 
 */
function buscarBombillasEnCamino(nodoInicial, conexiones, visitadosCables) {
  const resultados = [];

  const dfs = (nodo) => {
    const cables = obtenerCablesConectadosAlPunto(conexiones, nodo.contenedor, nodo.punto);
    for (const cableInfo of cables) {
      if (visitadosCables.has(cableInfo)) continue;
      visitadosCables.add(cableInfo);

      const otroExtremo = obtenerOtroExtremo(cableInfo, nodo);
      if (!otroExtremo) {
        visitadosCables.delete(cableInfo);
        continue;
      }
      const comp = otroExtremo.contenedor;
      const pto = otroExtremo.punto;

      if (comp instanceof InterruptorComponente) {
        // Si el interruptor está abierto, no pasa corriente
        if (!comp.obtenerEstado || !comp.obtenerEstado()) {
          visitadosCables.delete(cableInfo);
          continue;
        }
        // Interruptor cerrado: atravesar al/los otro(s) punto(s) del interruptor
        const otrosPuntos = obtenerOtrosPuntosEnComponente(comp, pto);
        for (const op of otrosPuntos) {
          dfs({ contenedor: comp, punto: op });
        }
      } else if (comp instanceof BombillaComponente) {
        // Detectar bombilla y registrarla
        resultados.push({ bombilla: comp, puntoEntradaBombilla: pto });
        // IMPORTANTE: También continuar la búsqueda atravesando la bombilla
        // para detectar otras bombillas más adelante en el circuito
        const otrosPuntos = obtenerOtrosPuntosEnComponente(comp, pto);
        for (const op of otrosPuntos) {
          dfs({ contenedor: comp, punto: op });
        }
      } else if (comp instanceof BateriaComponente) {
        // No atravesar batería durante la búsqueda de bombillas
        // (evitamos bucles triviales B+ -> B- sin bombillas)
      } else {
        // Componentes pasivos (ResistenciaComponente, ComponenteGenerico, etc.):
        // atravesar al/los otro(s) punto(s) para continuar la búsqueda
        const otrosPuntos = obtenerOtrosPuntosEnComponente(comp, pto);
        for (const op of otrosPuntos) {
          dfs({ contenedor: comp, punto: op });
        }
      }

      visitadosCables.delete(cableInfo);
    }
  };

  dfs(nodoInicial);
  return resultados;
}

/**
 * DFS que verifica si hay un camino desde nodoInicial hasta nodoObjetivo (terminal negativo de la misma batería),
 * respetando el estado de interruptores. Permite atravesar bombillas, resistencias y componentes pasivos.
 * @param {{contenedor: Phaser.GameObjects.Container, punto: {x:number,y:number}}} nodoInicial
 * @param {{contenedor: Phaser.GameObjects.Container, punto: {x:number,y:number}}} nodoObjetivo
 * @param {Map<Phaser.GameObjects.Container, Set<Object>>} conexiones
 * @param {Set<Object>} visitadosCables - Set de cableInfo visitados en el camino actual
 * @returns {boolean}
 */
function buscarRegresoBateria(nodoInicial, nodoObjetivo, conexiones, visitadosCables) {
  const objetivoKey = crearClaveNodo(nodoObjetivo);

  const dfs = (nodo) => {
    // ¿Llegamos al objetivo exacto?
    if (crearClaveNodo(nodo) === objetivoKey) return true;

    const cables = obtenerCablesConectadosAlPunto(conexiones, nodo.contenedor, nodo.punto);
    for (const cableInfo of cables) {
      if (visitadosCables.has(cableInfo)) continue;
      visitadosCables.add(cableInfo);

      const otroExtremo = obtenerOtroExtremo(cableInfo, nodo);
      if (!otroExtremo) {
        visitadosCables.delete(cableInfo);
        continue;
      }
      const comp = otroExtremo.contenedor;
      const pto = otroExtremo.punto;

      // Si el otro extremo es la batería objetivo y en el terminal correcto → éxito
      if (crearClaveNodo(otroExtremo) === objetivoKey) return true;

      if (comp instanceof InterruptorComponente) {
        if (!comp.obtenerEstado || !comp.obtenerEstado()) {
          visitadosCables.delete(cableInfo);
          continue; // Interruptor abierto, no continúa
        }
        // Interruptor cerrado: atravesar al/los otro(s) terminal(es)
        const otrosPuntos = obtenerOtrosPuntosEnComponente(comp, pto);
        for (const op of otrosPuntos) {
          if (dfs({ contenedor: comp, punto: op })) return true;
        }
      } else if (comp instanceof BateriaComponente) {
        // No atravesar batería; ya se comprobó si es el objetivo
        // Si es otra batería o el otro terminal de la misma pero no el objetivo, ignorar
      } else {
        // Componentes pasivos (ResistenciaComponente, ComponenteGenerico) Y bombillas:
        // atravesar al/los otros puntos para continuar buscando el terminal negativo
        const otrosPuntos = obtenerOtrosPuntosEnComponente(comp, pto);
        for (const op of otrosPuntos) {
          if (dfs({ contenedor: comp, punto: op })) return true;
        }
      }

      visitadosCables.delete(cableInfo);
    }

    return false;
  };

  return dfs(nodoInicial);
}

/**
 * Encuentra un camino cerrado desde el terminal positivo de una batería hasta su terminal negativo
 * que obligatoriamente atraviese la bombilla indicada. Devuelve la lista de contenedores (componentes)
 * únicos presentes en la ruta si existe, o null si no existe.
 * @param {BateriaComponente} bateria
 * @param {BombillaComponente} bombillaObjetivo
 * @param {Map<Phaser.GameObjects.Container, Set<Object>>} conexiones
 * @returns {Array<Phaser.GameObjects.Container>|null}
 */
function encontrarCaminoCerradoQueInvolucraBombilla(bateria, bombillaObjetivo, conexiones) {
  const terminales = obtenerTerminalesBateria(bateria);
  if (!terminales) return null;

  const objetivoKey = crearClaveNodo(terminales.negativo);
  const visitadosCables = new Set();

  const dfs = (nodo, vioBombilla, listaContenedores) => {
    if (crearClaveNodo(nodo) === objetivoKey && vioBombilla) {
      // Incluir la batería también en el conjunto
      const unicos = Array.from(new Set([bateria, ...listaContenedores]));
      return unicos;
    }

    const cables = obtenerCablesConectadosAlPunto(conexiones, nodo.contenedor, nodo.punto);
    for (const cableInfo of cables) {
      if (visitadosCables.has(cableInfo)) continue;
      visitadosCables.add(cableInfo);

      const otroExtremo = obtenerOtroExtremo(cableInfo, nodo);
      if (!otroExtremo) {
        visitadosCables.delete(cableInfo);
        continue;
      }
      const comp = otroExtremo.contenedor;
      const pto = otroExtremo.punto;

      if (crearClaveNodo(otroExtremo) === objetivoKey && vioBombilla) {
        const unicos = Array.from(new Set([bateria, ...listaContenedores]));
        return unicos;
      }

      if (comp instanceof InterruptorComponente) {
        if (!comp.obtenerEstado || !comp.obtenerEstado()) {
          visitadosCables.delete(cableInfo);
          continue;
        }
        const otrosPuntos = obtenerOtrosPuntosEnComponente(comp, pto);
        for (const op of otrosPuntos) {
          const res = dfs({ contenedor: comp, punto: op }, vioBombilla, [...listaContenedores, comp]);
          if (res) return res;
        }
      } else if (comp instanceof BateriaComponente) {
        // No atravesar batería salvo que sea el objetivo manejado arriba
      } else {
        // Componentes pasivos y bombillas: se atraviesan
        const esBombilla = comp instanceof BombillaComponente && comp === bombillaObjetivo;
        const otrosPuntos = obtenerOtrosPuntosEnComponente(comp, pto);
        for (const op of otrosPuntos) {
          const res = dfs({ contenedor: comp, punto: op }, vioBombilla || esBombilla, [...listaContenedores, comp]);
          if (res) return res;
        }
      }

      visitadosCables.delete(cableInfo);
    }
    return null;
  };

  return dfs(terminales.positivo, false, []);
}

// =========================
// Utilidades internas
// =========================

/**
 * Obtiene los terminales (positivo/negativo) de la batería.
 * Asume que la batería tiene exactamente 2 puntos de conexión y que el orden es [+, -].
 * @param {BateriaComponente} bateria
 * @returns {{positivo:{contenedor:any,punto:{x:number,y:number}}, negativo:{contenedor:any,punto:{x:number,y:number}}}|null}
 */
function obtenerTerminalesBateria(bateria) {
  if (!bateria) return null;
  const puntos = (bateria.getData && bateria.getData('puntosConexionVisuales')) || bateria.puntosConexionVisuales || [];
  if (!Array.isArray(puntos) || puntos.length < 2) return null;
  const pos = puntos[0]?.posRelativa;
  const neg = puntos[1]?.posRelativa;
  if (!pos || !neg) return null;
  return {
    positivo: { contenedor: bateria, punto: { x: pos.x, y: pos.y } },
    negativo: { contenedor: bateria, punto: { x: neg.x, y: neg.y } },
  };
}

/**
 * Dado un componente y un punto de conexión del mismo, retorna todos los otros puntos del componente
 * (excluyendo el punto proporcionado). Para la mayoría de componentes serán 1 (dos terminales),
 * pero soporta múltiples conectores devolviendo un array.
 * @param {Phaser.GameObjects.Container} componente
 * @param {{x:number,y:number}} puntoActual
 * @returns {Array<{x:number,y:number}>}
 */
function obtenerOtrosPuntosEnComponente(componente, puntoActual) {
  const puntos = (componente.getData && componente.getData('puntosConexionVisuales')) || componente.puntosConexionVisuales || [];
  const soloPos = puntos.map((p) => p.posRelativa).filter(Boolean);
  return soloPos.filter((p) => !puntosIguales(p, puntoActual));
}

/**
 * Obtiene los cables conectados exactamente al punto indicado de un componente.
 * @param {Map<Phaser.GameObjects.Container, Set<Object>>} conexiones
 * @param {Phaser.GameObjects.Container} componente
 * @param {{x:number,y:number}} punto
 * @returns {Array<Object>} Array de cableInfo
 */
function obtenerCablesConectadosAlPunto(conexiones, componente, punto) {
  const setCables = conexiones.get(componente);
  if (!setCables || setCables.size === 0) return [];
  const res = [];
  for (const cable of setCables) {
    const matchIni = cable?.puntoInicio?.contenedor === componente && puntosIguales(cable?.puntoInicio?.punto, punto);
    const matchFin = cable?.puntoFin?.contenedor === componente && puntosIguales(cable?.puntoFin?.punto, punto);
    if (matchIni || matchFin) res.push(cable);
  }
  return res;
}

/**
 * Dado un cable y el nodo en uno de sus extremos, retorna el otro extremo {contenedor, punto}.
 * @param {Object} cableInfo
 * @param {{contenedor:any,punto:{x:number,y:number}}} nodo
 * @returns {{contenedor:any,punto:{x:number,y:number}}|null}
 */
function obtenerOtroExtremo(cableInfo, nodo) {
  if (!cableInfo || !nodo) return null;
  const a = cableInfo.puntoInicio;
  const b = cableInfo.puntoFin;
  if (a?.contenedor === nodo.contenedor && puntosIguales(a?.punto, nodo.punto)) {
    return { contenedor: b?.contenedor, punto: b?.punto };
  }
  if (b?.contenedor === nodo.contenedor && puntosIguales(b?.punto, nodo.punto)) {
    return { contenedor: a?.contenedor, punto: a?.punto };
  }
  return null;
}

/**
 * Compara dos puntos {x,y} con igualdad estricta.
 * @param {{x:number,y:number}} p1
 * @param {{x:number,y:number}} p2
 */
function puntosIguales(p1, p2) {
  if (!p1 || !p2) return false;
  return p1.x === p2.x && p1.y === p2.y;
}

/**
 * Crea una clave de nodo basada en referencia del contenedor y coordenadas del punto.
 * Nota: usar referencia del objeto en string puede no ser único; como heurística,
 * usamos el índice del objeto en memoria si está disponible o toString, pero lo importante
 * aquí es combinar con coordenadas del punto.
 * @param {{contenedor:any,punto:{x:number,y:number}}} nodo
 */
function crearClaveNodo(nodo) {
  if (!nodo) return 'null';
  const idObj = nodo.contenedor ? (nodo.contenedor._nodeId || nodo.contenedor._uid || `${nodo.contenedor.constructor?.name}-${String(nodo.contenedor)}`) : 'null';
  return `${idObj}|${nodo.punto?.x}|${nodo.punto?.y}`;
}
