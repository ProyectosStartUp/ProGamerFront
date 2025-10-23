import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import ModalConfirmar from "../components/ModalConfirmar";
import NavbarCategorias from "../components/NavbarCategorias";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


import CarouselProductos from "../components/CarouselProductos";
import LeftBanner from "../components/features/home/LeftBanner";
import RightBanner from "../components/features/home/RightBanner";
import Carrusel from "../components/features/home/carrusel/Carrusel";

const Home: React.FC = () => {
	// Estado para controlar la visibilidad del modal
	const [showModal, setShowModal] = useState(false);

	// Funciones para manejar la apertura y cierre del modal
	const handleClose = () => setShowModal(false);
	const handleShow = () => setShowModal(true);

	// OPCIÓN 3 -> CAMBIAR LABEL *********************************************************************************

	const [texto, setTexto] = useState("Texto inicial!!!");

	const cambiarTexto = () => {
		setTexto("¡Texto cambiado con React!");
	};

	const alternarTexto = () => {
		setTexto((textoPrevio) =>
			textoPrevio === "Texto inicial!!!"
				? "¡Texto cambiado con React!"
				: "Texto inicial!!!"
		);
	};

	return (
		<>
			<NavbarCategorias />

			<div className="hub-container-fluid mt-0">
				{/* COLUMNAS PANTALLA PRINCIPAL */}

				<Row className="mt-3">
					
					{/* xs={12} md={3} lg={2} */}
					<LeftBanner/>

					{/* xs={12} md={6} lg={8} */}
					<Col xs={12} md={8} lg={9} xl={9} xxl={8} className="p-3 order-2 order-lg-2 py-0">
						{/* <Carousel>
							<Carousel.Item>
								<img
									className="d-block w-100"
									src="/banner-1.png"
									alt="First slide"
								/>
								<Carousel.Caption></Carousel.Caption>
							</Carousel.Item>
							<Carousel.Item>
								<img
									className="d-block w-100"
									src="/banner-2.png"
									alt="Second slide"
								/>
								<Carousel.Caption></Carousel.Caption>
							</Carousel.Item>
							<Carousel.Item>
								<img
									className="d-block w-100"
									src="/banner-3.png"
									alt="Third slide"
								/>
								<Carousel.Caption></Carousel.Caption>
							</Carousel.Item>
						</Carousel> */}
						<Carrusel/>

						<h2 className="mt-5 mb-2">Ofertas flash <i className="bi bi-lightning-charge-fill text-warning"></i></h2>

						<div className="p-0" style={{ height:"300", display:"flex", flexWrap:"wrap", justifyContent:"space-between", overflowY:"auto" }}>
							
							{/* Experimento: Componente carrusel con los cards marcados como "oferta flash" */}
							<CarouselProductos />

							{/* Aquí se va a iterar desde una llamada a la API */}
							<div className="mt-5 d-flex d-none">
								{/* <CardOfertaFlash />
								<CardOfertaFlash />
								<CardOfertaFlash /> */}
							</div>


						</div>
					</Col>

					{/* xs={12} md={3} lg={2} */}
					<RightBanner/>
				</Row>

				{/* COLUMNAS PANTALLA PRINCIPAL */}

				<div className="d-none">
					<h1>Bienvenido a la página principal</h1>
					<p id="parrafoNombrePagina">{texto}</p>

					<Button variant="secondary ms-2" onClick={cambiarTexto}>
						Cambiar texto
					</Button>

					<Button variant="dark ms-2" onClick={alternarTexto}>
						Alternar texto
					</Button>

					{/* Botón que abre el modal */}
					<Button variant="primary ms-2" onClick={handleShow}>
						Abrir Modal
					</Button>

					{/* Modal reutilizable */}
					<ModalConfirmar
						show={showModal}
						onClose={handleClose}
						onConfirm={() => alert("Acción confirmada (HOME)!")}
						title="Confirmar acción"
					>
						<p>¿Estás seguro de que quieres continuar?</p>
						<p>
							Este es un modal reutilizable que puedes usar en
							diferentes partes de tu aplicación.
						</p>
					</ModalConfirmar>
				</div>

			</div>
		</>
	);
};

export default Home;
