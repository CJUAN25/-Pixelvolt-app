import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PaginaJuego.css';
import { HERRAMIENTAS_DISPONIBLES } from './datos/definicionHerramientas';
import { obtenerHerramientasParaNivel } from './datos/configuracionNiveles';
import LienzoJuego from './componentes/LienzoJuego';

function PaginaJuego() {
	// Extraer identificadores desde la ruta
	const { panelId, nivelId } = useParams();
	const navegar = useNavigate();

	// Referencia al lienzo de Phaser para controlar la simulación
	const lienzoRef = React.useRef();

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

	const manejarValidar = () => alert('Validando...');
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
				<h2 className="titulo-nivel">{`NIVEL ${nivelId || 'X'}: Nombre Placeholder`}</h2>
				<div className="objetivo-nivel">{`OBJETIVO: Objetivo Placeholder`}</div>
			</header>

			{/* Layout principal en 4 áreas */}
			<main className="layout-juego">
				{/* Área de simulación (futuro lienzo Phaser) */}
				<section className="area-simulacion" aria-label="Área de simulación">
					<div className="marco-simulacion">
						<LienzoJuego ref={lienzoRef} />
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

