import React, { useState } from "react";
import { Container, Row, Col, Button, Tabs, Tab, Image} from "react-bootstrap";
import styles from "./productDetails.module.css";
import NavbarCategorias from "../../NavbarCategorias";
import CarouselComponent from "../../CarouselProductos";

interface ProductDetailProps {
  productId: string;
}

const ProductDetails: React.FC<ProductDetailProps> = ({ productId }) => {
  const [quantity, setQuantity] = useState(1);
  const product = {
    name: "GALAX Slider 04 Wired Optical Gaming Mouse - GALAX",
    rating: 3.8,
    reviews: 101,
    originalPrice: "1,200.00",
    price: "99.95",
    installments: 18,
    installmentPrice: "5.55",
    shippingCost: "180.99",
    images: [
      "/public/demoMouse.png",
      "/public/demoMouse.png",
      "/public/demoMouse.png",
      "/public/demoMouse.png",
    ],
    keyFeatures: [
      "Modelo: Micropack M101",
      "Botón: 3D",
      "Resolución: 1000dpi",
      "Lingitud del cable: 1.2m",
    ],
    specifications: {
      "Tipo de conexión": "Cableada",
      "Longitud del cable": "1.2m",
      "Botón": "3D",
      "Color": "Negro",
      "Peso": "150g",
      "Garantía": "2 años",
      "Resolución": "1000dpi",
      "Compatibilidad": "Windows, MacOS, Linux y cualquier sistema que soporte USB, incluyendo consolas, como PS4 y Xbox One",
      "Material": "Plástico ABS",
      "Dimensiones": "12cm x 8cm x 6cm",
      "Interfaz": "USB 2.0",
      "Sensor": "Óptico",
      "Iluminación": "RGB",
      "Software": "No requiere",
      "Accesorios incluidos": "Manual de usuario",
      "País de origen": "China",
      "Certificaciones": "CE, FCC",
      "Tipo de uso": "Gaming y oficina"
    }
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  return (
    <div className={styles.productDetailsContainer}>

      <NavbarCategorias />

      <Row className="mb-4">
          <Col>
            <div className={styles.breadcrumb}>
              <div>Inicio &#62; Categoría &#62; Subcategoría &#62; {product.name}</div>
            </div>
          </Col>
        </Row>

      <Container className="pt-5">
        
        <Row>
          
          <Col md={6} className="position-relative px-4">
            <div className={styles.wishlistIcon}>
              <i className="bi bi-heart text-light" />
            </div>
            <div className={styles.imageGallery}>
              <Image src={product.images[0]} fluid className={styles.mainImage} />
              <div className={styles.thumbnailContainer}>
                <Button variant="link" className={styles.thumbNav}>
                  <i className="bi bi-chevron-left text-light" />
                </Button>
                {product.images.map((img, index) => (
                  <Image key={index} src={img} thumbnail className={styles.thumbnail} />
                ))}
                <Button variant="link" className={styles.thumbNav}>
                  <i className="bi bi-chevron-right text-light" />
                </Button>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className={styles.productInfo}>              
              <h3>{product.name}</h3>

              <div className={styles.rating}>
                <div className="mt-0">
                  {Array.from({ length: 5 }, (_, i) => {
                    if (i < Math.floor(product.rating)) {
                      return (
                        <i key={i} className="bi bi-star-fill text-warning mx-1"></i>
                      );
                    } else if (i < product.rating) {
                      return (
                        <i key={i} className="bi bi-star-half text-warning mx-1"></i>
                      );
                    } else {
                      return <i key={i} className="bi bi-star mx-1"></i>;
                    }
                  })}
                  <span style={{ marginLeft:"12px" }}>{product.rating} ({product.reviews} Reviews)</span>
                </div>                
                <Button variant="outline-secondary" className="float-end" style={{ marginTop:"14px" }}>
                  <i className="bi bi-share-fill" /> Compartir
                </Button>
              </div>

              <Row>
                
                <Col md={6}>
                  <div>
                    <h4 className="mt- mb-2">Oferta flash <i className="bi bi-lightning-charge-fill text-warning"></i></h4>
                  </div>
                  <div className={styles.flashSale}>                
                    <div className={styles.countdown}>
                      <div className={styles.countdownNumbers}>
                        <span>03</span>:<span>21</span>:<span>05</span>
                      </div>                      
                      <div className={styles.countdownLabels}>
                        <span>HRS</span><span>MIN</span><span>SEG</span>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col md={6} className="text-end">
                  <div className={styles.priceSection}>
                    <span className={styles.originalPrice}>${product.originalPrice} MXN</span>
                    <span className={styles.currentPrice}>${product.price} MXN</span>
                  </div>
                  
                  <div className={styles.financing}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"right" }}>
                      <i className="bi bi-credit-card gradient-text" style={{ marginRight:"10px",  fontSize:"24px", lineHeight:"24px" }} />
                    <span>Hasta en {product.installments} pagos de ${product.installmentPrice}</span>
                    </div>
                    <a href="#">Conoce más</a>
                  </div>

                  <div className={styles.shipping}>
                    <span>Costo de envío: ${product.shippingCost}</span>
                    <a href="#"><span>Calcula la </span>fecha de entrega</a>
                  </div>
                </Col>

              </Row>

              <div className={styles.keyFeatures}>
                <h5>Características clave</h5>
                <ul>
                  {product.keyFeatures.map((feature, i) => <li key={i}>{feature}</li>)}
                </ul>
                <a href="#" className="d-block mb-4">Ver más</a>
              </div>
              
              <div className={styles.actions}>
                <Button variant="light" className={styles.addToCart}>Añade al Carrito</Button>
                <div className={styles.quantitySelector}>
                  <Button variant="dark" onClick={() => handleQuantityChange(-1)}>
                    <i className="bi bi-chevron-left" />
                  </Button>
                  <span className="play-font px-3" style={{ fontSize:"24px"}}>{quantity}</span>
                  <Button variant="dark" onClick={() => handleQuantityChange(1)}>
                    <i className="bi bi-chevron-right" />
                  </Button>
                </div>
                <Button className="hub-btn-gamer">Compra ahora</Button>
              </div>
            </div>
          </Col>
        </Row>

        

        <Row className="mt-5">
          <Col>
            <Tabs defaultActiveKey="specs" className={styles.productTabs}>
              <Tab eventKey="specs" title="Especificaciones">
                <div className={styles.tabContent}>
                  {Object.entries(product.specifications).map(([key, value], index)=> (
                    <div key={key} className={`${styles.specItem} ${index % 2 === 0 ? styles.strippedEven : ''}`}>
                      <strong className="me-3 ps-2">{key}</strong>
                      <span className="text-end pe-2">{value}</span>
                    </div>
                  ))}
                </div>
              </Tab>
              <Tab eventKey="desc" title="Descripción">
                <div className={styles.tabContent}>
                  <div className={styles.descriptionContainer}>
                    <h3>GALAX Slider 04 Wired Optical Gaming Mouse - GALAX</h3>
                    <p>Descubre el poder, precisión y comodidad del GALAX Slider 04, un mouse óptico gamer diseñado 
                      para jugadores que buscan rendimiento profesional sin compromisos. Con un diseño ergonómico, 
                      iluminación RGB personalizable y un sensor óptico de alta precisión, este mouse te ofrece el 
                      control total que necesitas para dominar en cualquier tipo de juego: FPS, MOBA, Battle Royale 
                      y más. Ya sea que estés reaccionando en milisegundos, realizando maniobras de micro-ajuste o 
                      jugando sesiones prolongadas, el Slider 04 está optimizado para brindarte una experiencia fluida, 
                      estable y completamente inmersiva.
                    </p>
                    <h3>Rendimiento óptico de alta precisión</h3>
                    <p>
                      Equipado con un sensor óptico avanzado, el GALAX Slider 04 ofrece un seguimiento rápido y 
                      preciso que responde instantáneamente a tus movimientos. Su resolución ajustable (DPI) te permite 
                      cambiar de sensibilidad al vuelo, adaptándose a tu estilo de juego ya sea que requieras 
                      movimientos amplios y veloces o apuntes milimétricos.
                    </p>
                    <ul>
                      <li>Seguimiento preciso y estable en distintas superficies.</li>
                      <li>DPI configurable al instante para cambios de sensibilidad durante la partida.</li>
                      <li>Baja latencia y respuesta inmediata pensada para players competitivos.</li>
                    </ul>
                    <h3>Iluminación RGB personalizable</h3>
                    <p>
                      Personaliza la estética de tu setup con iluminación RGB dinámica y múltiples efectos. Configura colores,
                      transiciones y modos para que el mouse combine con tu estilo de juego.
                    </p>
                    <h3>Comodidad ergonómica para largas sesiones</h3>
                    <p>
                      Diseñado pensando en la comodidad del jugador, el GALAX Slider 04 presenta una forma ergonómica 
                      que se adapta perfectamente a tu mano. Sus superficies texturizadas y botones estratégicamente 
                      ubicados garantizan un agarre seguro y un acceso rápido a todas las funciones, incluso durante 
                      las sesiones de juego más intensas.
                    </p>
                  </div>
                  </div>
              </Tab>
              <Tab eventKey="reviews" title={`Reseñas (${product.reviews})`}>
                <div className={styles.tabContent}>
                  <div className={styles.reviewsSection}>
                    <Row>
                      <Col md={4}>
                        <div className={styles.reviewsSummary}>
                          <h5>Opiniones de los clientes</h5>
                          <div className={styles.rating}>
                            <div className="mt-3">
                              {Array.from({ length: 5 }, (_, i) => {
                                if (i < Math.floor(product.rating)) {
                                  return <i key={i} className="bi bi-star-fill text-warning mx-1"></i>;
                                } else if (i < product.rating) {
                                  return <i key={i} className="bi bi-star-half text-warning mx-1"></i>;
                                } else {
                                  return <i key={i} className="bi bi-star mx-1"></i>;
                                }
                              })}
                              <span className="mt-1 ms-1" style={{ color: '#fff', display:"block" }}>{product.rating} de 5 estrellas</span>
                            </div>
                            <p className="text-light mt-2 mb-3">{product.reviews} calificaciones</p>
                          </div>
                          <div className={styles.ratingBreakdown}>
                            {
                              [
                                { star: 5, percent: 75 },
                                { star: 4, percent: 15 },
                                { star: 3, percent: 5 },
                                { star: 2, percent: 2 },
                                { star: 1, percent: 3 }
                              ].map(item => (
                                <div className={styles.ratingBreakdownItem} key={item.star}>
                                  <span className="text-light">{item.star} estrellas</span>
                                  <div className={styles.progressBar}>
                                    <div className={styles.progress} style={{ width: `${item.percent}%` }}></div>
                                  </div>
                                  <span className="text-light">{item.percent}%</span>
                                </div>
                              ))
                            }
                          </div>
                          <hr style={{ borderColor: '#444' }} />
                          <div className={styles.writeReview}>
                            <h6>¿Tienes una opinión sobre este producto?</h6>
                            <p className="text-light">Comparte tu experiencia con otros clientes</p>
                            <Button variant="outline-light" className="mt-2">Escribir una reseña</Button>
                          </div>
                        </div>
                      </Col>
                      <Col md={8}>
                        <div className={styles.customerReviews}>
                          <div className={styles.review}>
                            <div className="d-flex align-items-center mb-2">
                              <i className="bi bi-person-circle me-2 float-start" style={{ fontSize:"32px" }}></i>
                              <span className="play-font">Edgar Loeffelmann</span>
                            </div>
                            <div className={styles.rating}>
                              <i className="bi bi-star-fill text-warning"></i>
                              <i className="bi bi-star-fill text-warning"></i>
                              <i className="bi bi-star-fill text-warning"></i>
                              <i className="bi bi-star-fill text-warning"></i>
                              <i className="bi bi-star text-warning"></i>
                              <h6 className="mb-0 ms-2">¡Excelente mouse para gaming!</h6>
                            </div>
                            <p className="text-light mt-2">
                              Revisado en México el 1 de diciembre de 2023
                            </p>
                            <p className="text-light">
                              Este mouse es increíblemente preciso y cómodo. La iluminación RGB es un plus y se siente de muy buena calidad. Lo he usado por horas y no he tenido ningún problema. Totalmente recomendado para cualquier gamer.
                            </p>
                            <Button variant="btn btn-dark" size="sm">Me gusta</Button>
                            <hr style={{ borderColor: '#444' }} />
                          </div>
                          <div className={styles.review}>
                            <div className="d-flex align-items-center mb-2">
                              <i className="bi bi-person-circle me-2 float-start" style={{ fontSize:"32px" }}></i>
                              <span className="play-font">Josué Mezquite</span>
                            </div>
                            <div className={styles.rating}>
                              <i className="bi bi-star-fill text-warning"></i>
                              <i className="bi bi-star-fill text-warning"></i>
                              <i className="bi bi-star-fill text-warning"></i>
                              <i className="bi bi-star-half text-warning"></i>
                              <i className="bi bi-star text-warning"></i>
                              <h6 className="mb-0 ms-2">Buen producto, pero podría mejorar</h6>
                            </div>
                            <p className="text-light mt-2">
                              Revisado en España el 28 de noviembre de 2023
                            </p>
                            <p className="text-light">
                              El mouse funciona bien en general, pero el cable es un poco rígido y a veces se atora. La precisión es buena, pero no la mejor que he probado. Por el precio, es una opción decente.
                            </p>
                            <Button variant="btn btn-dark" size="sm">Me gusta</Button>
                            <hr style={{ borderColor: '#444' }} />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </Col>
        </Row>
        
        
        <Row className="mt-3">
            <Col>
                <div className={styles.relatedProducts}>
                    <h4>Podría gustarte</h4>
                    <CarouselComponent />                    
                </div>
            </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductDetails;
