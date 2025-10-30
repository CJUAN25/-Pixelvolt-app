import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PaginaJuego.css';
import { HERRAMIENTAS_DISPONIBLES } from './datos/definicionHerramientas';
import { obtenerHerramientasParaNivel, obtenerConfiguracionNivel } from './datos/configuracionNiveles';
import LienzoJuego from './componentes/LienzoJuego';
import { useAuth } from '../../contexto/ContextoAutenticacion';
import { fetchConToken } from '../../api/apiCliente';
import ModalFeedback from './componentes/ModalFeedback';

function PaginaJuego() {
	// Extraer identificadores desde la ruta
	const { panelId, nivelId } = useParams();
	const navegar = useNavigate();
	const { usuario, setUsuario } = useAuth();

	// Referencia al lienzo de Phaser para controlar la simulación
	const lienzoRef = React.useRef();

		// Obtener configuración completa del nivel
		const configuracionNivel = useMemo(() => obtenerConfiguracionNivel(panelId, nivelId), [panelId, nivelId]);

		// Estado del tutorial (solo aplica para niveles con dialogoTutorSecuencial)
			const [pasoTutorialActual, setPasoTutorialActual] = useState(0);
			const [indicePistaPasoActual, setIndicePistaPasoActual] = useState(0);
			const [objetivoCumplido, setObjetivoCumplido] = useState(false);

	// Estado para el modal de feedback
	const [modal, setModal] = useState({
		visible: false,
		tipo: 'info',
		mensaje: ''
	});

	// Helper para mostrar el modal
	const mostrarModal = (tipo, mensaje, callback) => {
		setModal({
			visible: true,
			tipo,
			mensaje,
			callback // Callback opcional que se ejecuta al cerrar
		});
	};

	// Handler para cerrar el modal
	const cerrarModal = () => {
		const callbackTemp = modal.callback;
		setModal({ visible: false, tipo: 'info', mensaje: '', callback: null });
		// Ejecutar callback si existe (para navegación u otras acciones post-modal)
		if (callbackTemp) callbackTemp();
	};

		// Resetear índice de pista al cambiar de paso
		useEffect(() => {
			setIndicePistaPasoActual(0);
		}, [pasoTutorialActual]);

	// Calcular herramientas del nivel actual
		const herramientasDelNivel = useMemo(() => {
		const idsHerramientasPermitidas = obtenerHerramientasParaNivel(panelId, nivelId);
		return HERRAMIENTAS_DISPONIBLES.filter((herramienta) =>
			idsHerramientasPermitidas.includes(herramienta.id)
		);
	}, [panelId, nivelId]);

	// Handlers básicos (placeholders)
		const manejarSalir = () => {
  navegar('/subtemas'); // ruta fija confirmada
};

	// Guardar progreso en el backend
	const guardarProgresoRemoto = async (panelIdActual, nivelIdActual) => {
		try {
			// Normalizar IDs a números simples (soporta 'panel-2-...' y 'nivel-1-...')
			const normalizarPanel = (pid) => {
				if (typeof pid === 'string' && pid.startsWith('panel-')) {
					const partes = pid.split('-');
					return Number(partes[1]) || pid;
				}
				return Number(pid) || pid;
			};
			const normalizarNivel = (nid) => {
				if (typeof nid === 'string' && nid.startsWith('nivel-')) {
					const partes = nid.split('-');
					return Number(partes[1]) || nid;
				}
				return Number(nid) || nid;
			};

			const panelKey = normalizarPanel(panelIdActual);
			const nivelKey = normalizarNivel(nivelIdActual);
			const puntosNivel = configuracionNivel?.puntosAlCompletar || 0;

			await fetchConToken('/progreso/completar', {
				method: 'POST',
				body: {
					panelId: panelKey,
					nivelId: nivelKey,
					puntos_ganados: puntosNivel
				}
			});

			console.log(`✅ Nivel ${panelKey}-${nivelKey} completado! Puntos ganados: ${puntosNivel}`);
		} catch (error) {
			console.error('Error al guardar progreso:', error);
			// Mostrar error al usuario
			mostrarModal('error', 'No se pudo guardar tu progreso. Por favor, intenta nuevamente.');
		}
	};


	const manejarValidar = async () => {
		// En el tutorial del Panel 1 Nivel 1, la validación solo se permite en el paso 6
		if (String(panelId) === '1' && String(nivelId) === '1') {
			if (pasoTutorialActual !== 6) {
				return; // Ignorar validación fuera del paso 6
			}
		}

		const resultado = lienzoRef.current?.ejecutarValidacion();
		if (resultado) {
			if (String(panelId) === '1' && String(nivelId) === '1' && configuracionNivel?.feedbackExito) {
				mostrarModal('exito', configuracionNivel.feedbackExito, () => {
					setObjetivoCumplido(true);
					setPasoTutorialActual(7); // continuar tutorial tras validar en paso 6
				});
			} else {
				await guardarProgresoRemoto(panelId, nivelId);
				// Actualización de puntos en caliente en el contexto
				const puntosGanados = configuracionNivel?.puntosAlCompletar || 0;
				if (puntosGanados > 0 && typeof setUsuario === 'function') {
					setUsuario((usuarioActual) => ({
						...usuarioActual,
						puntos: (usuarioActual?.puntos || 0) + puntosGanados,
					}));
				}
				mostrarModal('exito', `¡Nivel Completado! Has ganado ${configuracionNivel?.puntosAlCompletar || 0} puntos.`, () => {
					navegar('/subtemas');
				});
			}
		} else {
			// Lógica de fallo - Mostrar feedback contextual
			const ultimoEstadoSimulacion = lienzoRef.current?.obtenerUltimoEstadoSimulacion();
			let feedbackFalloMostrado = configuracionNivel?.feedbackFallo_CircuitoIncorrecto || configuracionNivel?.feedbackFallo || "Revisa el circuito. ¿Está bien conectado y el interruptor cerrado?";

			if (ultimoEstadoSimulacion && ultimoEstadoSimulacion.size > 0) {
				// Obtener estados de todas las bombillas
				const estadosArray = Array.from(ultimoEstadoSimulacion.values());
				const algunaQuemada = estadosArray.some(e => e === 'quemada');
				const algunaEncendidaMuyBrillante = estadosArray.some(e => e === 'encendida_muy_brillante');
				const algunaEncendidaCorrectamente = estadosArray.some(e => e === 'encendida_correcta');
				const algunaTenue = estadosArray.some(e => e === 'encendida_tenue');
				const todasApagadas = estadosArray.every(e => e === 'apagada');
				const cantidadBombillas = estadosArray.length;

				// LÓGICA ESPECÍFICA PARA NIVEL 4 (Serie): Detectar 1 bombilla muy brillante
				const esNivel4 = String(panelId) === '2' && String(nivelId) === '4';
				if (esNivel4 && cantidadBombillas === 1 && algunaEncendidaMuyBrillante) {
					// Caso especial: una sola bombilla muy brillante en el nivel de serie
					feedbackFalloMostrado = configuracionNivel?.feedbackFallo_UnaBombilla
						|| "Solo tienes una bombilla y está brillando demasiado. Necesitas **DOS bombillas en serie** para repartir la corriente.";
				} else if (algunaQuemada) {
					// Preferir mensaje específico de quemada si existe
					feedbackFalloMostrado = configuracionNivel?.feedbackFallo_Quemada
						|| configuracionNivel?.feedbackFallo_MuchaCorriente
						|| "¡POP! Demasiada corriente. La bombilla se ha quemado.";
				} else if (algunaEncendidaMuyBrillante) {
					// Corriente alta pero no llega a quemarse: preferir mensaje de muy brillante
					feedbackFalloMostrado = configuracionNivel?.feedbackFallo_MuyBrillante
						|| configuracionNivel?.feedbackFallo_MuchaCorriente
						|| "La bombilla está demasiado brillante: hay mucha corriente. Ajusta la resistencia (prueba 100 Ω).";
				} else if ((todasApagadas || algunaTenue) && !algunaEncendidaCorrectamente) {
					feedbackFalloMostrado = configuracionNivel?.feedbackFallo_MuyPocaCorriente || "La bombilla no enciende o hay un error en el circuito.";
				}
			}

			mostrarModal('error', feedbackFalloMostrado);
		}
	};		const manejarPista = () => {
		// Soportar dos formatos: pistasPorPaso (objeto por paso) o pistas (array simple)
		const pistasPorPaso = configuracionNivel?.pistasPorPaso;
		const pistasSimples = configuracionNivel?.pistas;

		// Si hay pistasPorPaso (formato tutorial con pasos)
		if (pistasPorPaso && Object.keys(pistasPorPaso).length > 0) {
			const clavePaso = String(pasoTutorialActual);
			const pistas = pistasPorPaso[clavePaso];
			if (!pistas || pistas.length === 0) {
				mostrarModal('pista', 'No hay pistas para este paso.');
				return;
			}
			const pista = pistas[indicePistaPasoActual % pistas.length];
			mostrarModal('pista', pista);
			setIndicePistaPasoActual((i) => i + 1);
			return;
		}

		// Si hay pistas simples (array de strings)
		if (pistasSimples && Array.isArray(pistasSimples) && pistasSimples.length > 0) {
			const pista = pistasSimples[indicePistaPasoActual % pistasSimples.length];
			mostrarModal('pista', pista);
			setIndicePistaPasoActual((i) => i + 1);
			return;
		}

		// No hay pistas disponibles
		mostrarModal('pista', 'No hay pistas disponibles para este nivel.');
	};

			const manejarReiniciar = () => {
			lienzoRef.current?.reiniciarSimulacion();
			setPasoTutorialActual(0);
			setIndicePistaPasoActual(0);
				setObjetivoCumplido(false);
		};

	const manejarSeleccionHerramienta = (herramientaSeleccionada) => {
		// eslint-disable-next-line no-console
		console.log('Herramienta seleccionada:', herramientaSeleccionada.nombre);
		lienzoRef.current?.agregarElementoPlaceholder(herramientaSeleccionada);
	};

		// Diálogo actual del tutor
		const dialogos = Array.isArray(configuracionNivel?.dialogoTutorSecuencial)
			? configuracionNivel.dialogoTutorSecuencial
			: (Array.isArray(configuracionNivel?.dialogoTutorInicial) ? configuracionNivel.dialogoTutorInicial : []);
		const ultimoPaso = Math.max(0, (dialogos?.length || 1) - 1);
		const dialogoActual = dialogos?.[pasoTutorialActual] || '¡Hola! Tu objetivo aquí es conectar los elementos para completar el circuito.';
			const esTutorial11 = String(panelId) === '1' && String(nivelId) === '1';
			const deshabilitarSiguiente = esTutorial11 && pasoTutorialActual === 6 && !objetivoCumplido;

				const manejarSiguiente = async () => {
					if (deshabilitarSiguiente) {
						mostrarModal('info', 'Antes de continuar, arma el cortocircuito de batería y presiona [VALIDAR].');
						return;
					}
				if (pasoTutorialActual < ultimoPaso) {
					setPasoTutorialActual((p) => Math.min(p + 1, ultimoPaso));
				} else {
					// Fin de los diálogos
						if (esTutorial11) {
						if (objetivoCumplido) {
							await guardarProgresoRemoto(panelId, nivelId);
							const puntosGanados = configuracionNivel?.puntosAlCompletar || 0;
							if (puntosGanados > 0 && typeof setUsuario === 'function') {
								setUsuario((usuarioActual) => ({
									...usuarioActual,
									puntos: (usuarioActual?.puntos || 0) + puntosGanados,
								}));
							}
							mostrarModal('exito', `¡Tutorial completado! Has ganado ${configuracionNivel?.puntosAlCompletar || 0} puntos.`, () => {
								navegar('/subtemas');
							});
						} else {
							mostrarModal('info', 'Aún no has validado el objetivo del paso 6. Conecta los terminales de la batería y presiona [VALIDAR].', () => {
								setPasoTutorialActual(6);
							});
						}
					} else {
						// Para niveles no tutoriales, no completar solo por terminar diálogos
						mostrarModal('info', 'Para completar el nivel, construye el circuito y presiona [VALIDAR].');
					}
				}
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
								<strong>VOLTIO</strong>
								<p dangerouslySetInnerHTML={{ __html: dialogoActual }} />
														{Array.isArray(dialogos) && dialogos.length > 0 && (
															<div style={{ marginTop: '8px', display: 'flex', gap: '8px', justifyContent: 'space-between', width: '100%' }}>
																<button className="boton-pixel boton-siguiente" onClick={() => setPasoTutorialActual((p) => Math.max(0, p - 1))}>
																	◀ Anterior
																</button>
																<button className="boton-pixel boton-siguiente" onClick={manejarSiguiente} disabled={deshabilitarSiguiente}>
																	Siguiente ▶
																</button>
															</div>
														)}
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

			{/* Modal de Feedback */}
			<ModalFeedback
				visible={modal.visible}
				tipo={modal.tipo}
				mensaje={modal.mensaje}
				onCerrar={cerrarModal}
			/>
		</div>
	);

}

export default PaginaJuego;

