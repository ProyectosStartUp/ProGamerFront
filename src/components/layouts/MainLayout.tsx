import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./mainLayout.css";
import { useAuthActions, useAuthData, useAuthStore } from "../../store/useAuthStore";
import Logueado from "./Logueado";

const Layout: React.FC = () => {

  const isAuth = useAuthStore(state => state.isAuthenticated());
   const {  nombreUsuario } = useAuthData();
   const { clearAuth } = useAuthActions();
   const navigate = useNavigate();

   const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };




  return (
    <>
      <header>
        <Navbar
          // fixed="top"
          expand="lg"
          className="hub-bg-dark"

          data-bs-theme="dark"
        >
          <Container className="hub-container-fluid">
            
            <Navbar.Brand href="/" className="hub-navbar-brand d-lg-none d-xl-none">
              <img src="/logoPG.png" alt="ProGamerPC" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />

            <Navbar.Collapse id="navbarScroll">
              <Container className="hub-container-fluid">
                <Row>
                  
                  {/* Logotipo marca */}

                  <Col xs={12} md={3} lg={3} xl={2} className="d-none d-lg-flex align-items-center">
                    <Navbar.Brand className="hub-navbar-brand " href="/">
                      <img src="/logoPG.png" alt="ProGamerPC" />
                    </Navbar.Brand>
                  </Col>

                  {/* Buscador, favoritos y carrito */}

                  <Col xs={12} md={8} lg={6} xl={8} className="d-flex align-items-center pt-3 pt-lg-0">
                    <Form style={{ width: "100%" }}>
                      <Form.Control
                            type="text"
                            placeholder="¿Qué estás buscando?"
                            className="hub-input-navbar mr-sm-2"
                          />
                    </Form>
                    <Button variant="outline-secondary" className="hub-button-navbar ms-3">
                      <i className="bi bi-heart" />
                    </Button>
                    <Button variant="outline-secondary" className="hub-button-navbar ms-1">
                      <i className="bi bi-cart3" />
                    </Button>
                  </Col>

                  {/* Botones sesión */}

                  <Col xs={12} md={4} lg={3} xl={2} className="justify-content-between justify-content-md-end d-flex align-items-center">
                  {
                    isAuth ? (
                      <Logueado nombreUsuario={nombreUsuario!} handleLogout={handleLogout}/>
                    )
                    :(
                      <>
                      <Link className="ms-0 mt-4 mt-lg-0 btn hub-btn-gamer w-100 text-truncate" to="/register">Registrate</Link>
                      <Link className="ms-2 mt-4 mt-lg-0 btn btn-dark" to="/login">Login</Link>
                      </>
                  )
                  }
                  </Col>                  

                </Row>
              </Container>
              
            </Navbar.Collapse>
          </Container>
        </Navbar>
        
      </header>

      <main className="">
        <Outlet />
      </main>

      <footer>© 2025 ProGamerPC</footer>
    </>
  );
};

export default Layout;
