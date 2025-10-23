import React, { useState, useEffect } from "react";
import { Carousel, Row, Col } from "react-bootstrap";
import CardOfertaFlash from "./CardOfertaFlash";

const productos = [
  { id: 1, nombre: "(1) Mouse gamer RGB", precioOriginal: 1290, precioOferta: 890, rating: 4.5, tiempoRestante: "00:15:42", imagen: "/demoMouse.png", linkDetalle: "/producto/1" },
  { id: 2, nombre: "(2) Teclado mecánico", precioOriginal: 1990, precioOferta: 1450, rating: 4, tiempoRestante: "01:05:20", imagen: "/demoKeyboard.png", linkDetalle: "/producto/2" },
  { id: 3, nombre: "(3) Audífonos inalámbricos", precioOriginal: 990, precioOferta: 750, rating: 4, tiempoRestante: "00:45:00", imagen: "/demoMonitor.png", linkDetalle: "/producto/3" },
    {
    id: 4,
    nombre: "(4) Silla gamer mamalona bien agustín",
    precioOriginal: 3990,
    precioOferta: 3450,
    rating: 2.5,
    tiempoRestante: "01:05:20",
    imagen: "/demoChair.png",
    linkDetalle: "/producto/3",
  },
  {
    id: 5,
    nombre: "(5) Control inalámbrico PS5 Genérico",
    precioOriginal: 3990,
    precioOferta: 3450,
    rating: 5,
    tiempoRestante: "00:00:01",
    imagen: "/demoControl.png",
    linkDetalle: "/producto/3",
  },
  {
    id: 6,
    nombre: "(6) Procesador AMD Threadripper 9000 Series",
    precioOriginal: 3990,
    precioOferta: 3450,
    rating: 5,
    tiempoRestante: "01:05:20",
    imagen: "/demoProcessor.png",
    linkDetalle: "/producto/3",
  },
  {
    id: 7,
    nombre: "(7) Procesador AMD Threadripper 9000 Series",
    precioOriginal: 3990,
    precioOferta: 3450,
    rating: 5,
    tiempoRestante: "01:05:20",
    imagen: "/demoHeadset.png",
    linkDetalle: "/producto/3",
  },
  {
    id: 8,
    nombre: "(8) Procesador AMD Threadripper 9000 Series",
    precioOriginal: 3990,
    precioOferta: 3450,
    rating: 5,
    tiempoRestante: "01:05:20",
    imagen: "/demoMicrophone.png",
    linkDetalle: "/producto/3",
  }
  // ...

];

// Función para agrupar
const groupProducts = (arr: any[], size: number) => {
  const groupedArr = [];
  for (let i = 0; i < arr.length; i += size) {
    groupedArr.push(arr.slice(i, i + size));
  }
  return groupedArr;
};

const CarouselProductos: React.FC = () => {
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  // Detectar ancho y ajustar número
  useEffect(() => {
    const updateItems = () => {
      if (window.innerWidth < 576) setItemsPerSlide(1); // xs
      else if (window.innerWidth < 768) setItemsPerSlide(1); // sm
      else if (window.innerWidth < 952) setItemsPerSlide(1); // md
      else if (window.innerWidth < 1200) setItemsPerSlide(2); // lg
      else if (window.innerWidth < 1600) setItemsPerSlide(3); //xl
      else setItemsPerSlide(4); // xxl
    };

    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  const productosAgrupados = groupProducts(productos, itemsPerSlide);

  return (
    <div style={{ padding: "0px", width: "100%" }}>
      <Carousel className="carouselProductos" interval={200000} wrap={true} indicators={false} style={{ overflow:"hidden"}}>
        {productosAgrupados.map((grupo, index) => (
          <Carousel.Item key={index}>
            <Row className="justify-content-center d-flex">
              {grupo.map((producto) => (
                <Col key={producto.id} className="d-flex mt-3 px-0 justify-content-center">
                  <CardOfertaFlash {...producto} onAgregarCarrito={(id) => console.log("Agregar:", id)} />
                </Col>
              ))}
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselProductos;