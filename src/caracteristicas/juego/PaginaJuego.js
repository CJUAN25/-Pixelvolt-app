import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PaginaJuego.css';
import { HERRAMIENTAS_DISPONIBLES } from './datos/definicionHerramientas';
import { obtenerHerramientasParaNivel, obtenerConfiguracionNivel } from './datos/configuracionNiveles';
import LienzoJuego from './componentes/LienzoJuego';
import { useAuth } from '../../contexto/ContextoAutenticacion';

function PaginaJuego() {
	// Extraer identificadores desde la ruta
	const { panelId, nivelId } = useParams();
	const navegar = useNavigate();
  const { usuario } = useAuth();
  const userId = usuario?.id || 'anonimo';

	// Referencia al lienzo de Phaser para controlar la simulación
	const lienzoRef = React.useRef();

	// Obtener configuración completa del nivel
	const configuracionNivel = React.useMemo(() => 
		obtenerConfiguracionNivel(panelId, nivelId),
		[panelId, nivelId]
	);

	// Calcular herramientas del nivel actual
	const herramientasDelNivel = React.useMemo(() => {
		const idsHerramientasPermitidas = obtenerHerramientasParaNivel(panelId, nivelId);
		return HERRAMIENTAS_DISPONIBLES.filter((herramienta) =>
			idsHerramientasPermitidas.includes(herramienta.id)
		);
	}, [panelId, nivelId]);

	// Handlers básicos (placeholders)
		const manejarSalir = () => {
  navegar('/subtemas'); // ruta fija confirmada
};

	// Guardar progreso local (niveles completados por usuario y puntos acumulados)
	const guardarProgresoLocal = (panelIdActual, nivelIdActual) => {
		const claveProgreso = `pixelvolt_progreso_${userId}`;
		let progreso = {};
		try {
			const progresoGuardado = localStorage.getItem(claveProgreso);
			if (progresoGuardado) {
				progreso = JSON.parse(progresoGuardado);
			}
		} catch (e) {
			console.error('Error al leer progreso de localStorage:', e);
			progreso = { nivelesCompletados: {}, puntos: 0 };
		}

		// Inicializar estructuras si no existen
		if (!progreso.nivelesCompletados) progreso.nivelesCompletados = {};
		// Normalizar IDs a números/cadenas simples (soporta 'panel-2-...' y 'nivel-1-...')
		const normalizarPanel = (pid) => {
			if (typeof pid === 'string' && pid.startsWith('panel-')) {
				const partes = pid.split('-');
				return partes[1] || pid;
			}
			return pid;
		};
		const normalizarNivel = (nid) => {
			if (typeof nid === 'string' && nid.startsWith('nivel-')) {
				const partes = nid.split('-');
				return partes[1] || nid;
			}
			return nid;
		};

		const panelKey = String(normalizarPanel(panelIdActual));
		const nivelKey = String(normalizarNivel(nivelIdActual));

		if (!progreso.nivelesCompletados[panelKey]) progreso.nivelesCompletados[panelKey] = {};
		progreso.nivelesCompletados[panelKey][nivelKey] = true;

		// Otorgar puntos
		const puntosNivel = configuracionNivel?.puntosAlCompletar || 0;
		progreso.puntos = (progreso.puntos || 0) + puntosNivel;
		// eslint-disable-next-line no-console
		console.log(`Nivel ${panelKey}-${nivelKey} completado! Puntos ganados: ${puntosNivel}, Total: ${progreso.puntos}`);

		// Guardar en localStorage
		try {
			localStorage.setItem(claveProgreso, JSON.stringify(progreso));
			// Notificar a toda la app que los puntos/progreso cambiaron
			window.dispatchEvent(new Event('pixelvolt_progreso_update'));
		} catch (e) {
			console.error('Error al guardar progreso en localStorage:', e);
		}
	};

	const manejarValidar = () => {
		const resultado = lienzoRef.current?.ejecutarValidacion();
		if (resultado) {
			guardarProgresoLocal(panelId, nivelId);
			alert(`¡Nivel Completado! Has ganado ${configuracionNivel?.puntosAlCompletar || 0} puntos.`);
			navegar('/subtemas');
		} else {
			alert('El circuito aún no cumple con los objetivos del nivel. Intenta nuevamente.');
		}
	};
	const manejarPista = () => alert('Mostrando pista...');
	const manejarReiniciar = () => {
		lienzoRef.current?.reiniciarSimulacion();
	};

	const manejarSeleccionHerramienta = (herramientaSeleccionada) => {
		// eslint-disable-next-line no-console
		console.log('Herramienta seleccionada:', herramientaSeleccionada.nombre);
		lienzoRef.current?.agregarElementoPlaceholder(herramientaSeleccionada);
	};

	return (
		<div className="pagina-juego">
			{/* Cabecera con título y objetivo del nivel (placeholders) */}
			<header className="cabecera-juego" aria-label="Cabecera del juego">
				<h2 className="titulo-nivel">{`NIVEL ${nivelId || 'X'}: Panel ${panelId || 'X'}`}</h2>
				<div className="objetivo-nivel">{`OBJETIVO: ${configuracionNivel.objetivoTexto || 'Sin objetivo definido'}`}</div>
			</header>

			{/* Layout principal en 4 áreas */}
			<main className="layout-juego">
				{/* Área de simulación (futuro lienzo Phaser) */}
				<section className="area-simulacion" aria-label="Área de simulación">
					<div className="marco-simulacion">
						<LienzoJuego ref={lienzoRef} configuracionNivel={configuracionNivel} />
					</div>
				</section>

				{/* Caja de herramientas */}
				<aside className="caja-herramientas" aria-label="Caja de herramientas">
					<h3>HERRAMIENTAS</h3>
					{herramientasDelNivel.length > 0 ? (
						<ul className="lista-herramientas">
							{herramientasDelNivel.map((herramienta) => (
								<li 
									key={herramienta.id}
									onClick={() => manejarSeleccionHerramienta(herramienta)}
									style={{ cursor: 'pointer' }}
								>
									<span className="icono-herramienta" aria-hidden="true">
										<img src={herramienta.icono} alt={herramienta.nombre} />
									</span>
									<span className="nombre-herramienta">{herramienta.nombre}</span>
								</li>
							))}
						</ul>
					) : (
						<p className="sin-herramientas">No hay herramientas para este nivel.</p>
					)}
				</aside>

				{/* Panel del tutor */}
				<section className="panel-tutor" aria-label="Panel del tutor">
					<div className="avatar-tutor" role="img" aria-label="Avatar del tutor" />
					<div className="dialogo-tutor">
						<strong>TUTOR</strong>
						<p>
							¡Hola! Tu objetivo aquí es conectar los elementos para completar el
							circuito.
						</p>
					</div>
				</section>

				{/* Controles del nivel */}
						<footer className="controles-nivel" aria-label="Controles del nivel">
							<h3 className="titulo-controles">LEVEL</h3>
							<div className="grupo-botones">
								<button className="boton-pixel validar" onClick={manejarValidar}>
									[VALIDAR]
								</button>
								<button className="boton-pixel pista" onClick={manejarPista}>
									[PISTA]
								</button>
								<button className="boton-pixel reiniciar" onClick={manejarReiniciar}>
									[REINICIAR]
								</button>
								<button className="boton-pixel salir" onClick={manejarSalir}>
									[SALIR]
								</button>
							</div>
						</footer>
			</main>
		</div>
	);
}

export default PaginaJuego;

