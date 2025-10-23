
// CardOfertaFlash.tsx
import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Styles from "./CardOfertaFlash.module.css";

interface CardOfertaFlashProps {
  id: number;
  nombre: string;
  precioOriginal: number;
  precioOferta: number;
  rating: number; // de 0 a 5
  tiempoRestante: string; // formato "HH:mm:ss"
  imagen: string;
  onAgregarCarrito: (id: number) => void;
  linkDetalle: string;
}

const CardOfertaFlash: React.FC<CardOfertaFlashProps> = ({
  id,
  nombre,
  precioOriginal,
  precioOferta,
  rating,
  tiempoRestante,
  imagen,
  onAgregarCarrito,
  linkDetalle,
}) => {
  return (
    <Card className={Styles.cardProducto}>
      <Card.Body
        className={ Styles.cardBody }
        style={{ position: "relative", backgroundColor: "#22262a", padding:"10px", height:"198px" }}
      >
        {/* Imagen */}
        <a href={linkDetalle} style={{ display:"block", backgroundColor:"rgba(255,0,0,0.0)" }}>
          <Card.Img
            variant="top"
            src={imagen}
            className={Styles.cardImagenProducto}
          />
        </a>

        {/* Badge de oferta */}
        <Badge
          text="white"
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            fontSize: "0.9rem",
            background:
              "linear-gradient(135deg,rgba(15, 107, 249, 1) 0%, rgba(52, 241, 77, 1) 100%)",
            color: "white",
          }}
        >
          <i className="bi bi-lightning-charge-fill text-warning"></i> Oferta Flash
        </Badge>

        {/* Botón favorito (placeholder) */}
        <Button
          variant="outline-secondary"
          className={Styles.cardIconoAccion}
          style={{ bottom: "8px", right:"62px", lineHeight: "46px" }}
        >
          <i className="bi bi-heart text-light" />
        </Button>

        {/* Botón agregar al carrito */}
        <Button
          variant="outline-secondary"
          className={Styles.cardIconoAccion}
          style={{ bottom: "8px", right:"18px" }}
          onClick={() => onAgregarCarrito(id)}
        >
          <i className="bi bi-cart3" />
        </Button>
      </Card.Body>

      <Card.Body className="pt-0 text-center text-light">
        {/* Timer */}
        <Card.Text className={Styles.timerOferta}>{tiempoRestante}</Card.Text>

        {/* Nombre producto */}
        <Card.Text className={Styles.cartTituloProducto}>{nombre}</Card.Text>

        {/* Precio */}
        <div>
          <span className="text-danger text-decoration-line-through me-2">
            ${precioOriginal.toFixed(2)}
          </span>
          <h4 className="d-inline">${precioOferta.toFixed(2)}</h4>
        </div>

        {/* Rating */}
        <div className="mt-2">
          {Array.from({ length: 5 }, (_, i) => {
            if (i < Math.floor(rating)) {
              return (
                <i key={i} className="bi bi-star-fill text-warning mx-1"></i>
              );
            } else if (i < rating) {
              return (
                <i key={i} className="bi bi-star-half text-warning mx-1"></i>
              );
            } else {
              return <i key={i} className="bi bi-star mx-1"></i>;
            }
          })}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CardOfertaFlash;
