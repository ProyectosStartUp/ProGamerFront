import React from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./NavbarCategorias.css";
import { Controller, Laptop, Cpu, Mouse, Playstation } from 'react-bootstrap-icons';

const NavbarCategorias: React.FC = () => {
  
    interface HandleSelectEvent {
        (eventKey: string | null, event?: React.SyntheticEvent<unknown>): void;
    }

    const handleSelect: HandleSelectEvent = (eventKey) => console.log(`selected ${eventKey}`); 
  
    const iconNavigationZonaGamer = () => {
      return <><Controller className="ms-2 me-2 d-lg-none" style={{ fontSize:'24px' }} /><span className="d-none d-lg-inline">Zona Gamer</span></>
    };

    const iconNavigationComputadoras = () => {
      return <><Laptop className="ms-2 me-2 d-lg-none" style={{ fontSize:'24px' }} /><span className="d-none d-lg-inline">Computadoras</span></>
    };

    const iconNavigationComponentes = () => {
      return <><Cpu className="ms-2 me-2 d-lg-none" style={{ fontSize:'24px' }} /><span className="d-none d-lg-inline">Componentes</span></>
    };

    const iconNavigationAccesorios = () => {
      return <><Mouse className="ms-2 me-2 d-lg-none" style={{ fontSize:'24px' }} /><span className="d-none d-lg-inline">Accesorios</span></>
    };

    const iconNavigationVideojuegos = () => {
      return <><Playstation className="ms-2 me-2 d-lg-none" style={{ fontSize:'24px' }} /><span className="d-none d-lg-inline">Consolas y videojuegos</span></>
    };

    return (
    <>
      <Nav fill variant="underline" activeKey="0" className="hub-nav-underline" onSelect={handleSelect}>
        <Nav.Item>
          <Nav.Link eventKey="1" to="/" as={Link}>
            { iconNavigationZonaGamer() }
          </Nav.Link>
        </Nav.Item>
        <NavDropdown title={ iconNavigationComputadoras() } id="nav-dropdown">
          <NavDropdown.Item eventKey="4.1" to="/register" as={Link}>Laptops</NavDropdown.Item>
          <NavDropdown.Item eventKey="4.2" to="/register" as={Link}>Tablets</NavDropdown.Item>
          <NavDropdown.Item eventKey="4.2" to="/register" as={Link}>Computadoras de escritorio</NavDropdown.Item>
          <NavDropdown.Item eventKey="4.2" to="/register" as={Link}>Servidores</NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title={ iconNavigationComponentes() } id="nav-dropdown">
          <NavDropdown.Item eventKey="4.1" to="/register" as={Link}>Procesadores</NavDropdown.Item>
          <NavDropdown.Item eventKey="4.2" to="/register" as={Link}>Motherboards</NavDropdown.Item>
          <NavDropdown.Item eventKey="4.2" to="/register" as={Link}>Memorias RAM</NavDropdown.Item>
          <NavDropdown.Item eventKey="4.2" to="/register" as={Link}>Unidades SSD</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item eventKey="4.2" to="/register" as={Link}>Gabinetes</NavDropdown.Item>
          <NavDropdown.Item eventKey="4.2" to="/register" as={Link}>Fuentes de poder</NavDropdown.Item>
          <NavDropdown.Item eventKey="4.2" to="/register" as={Link}>Coolers</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item eventKey="4.2" to="/register" as={Link}>Tarjeta gráficas</NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title={ iconNavigationAccesorios() } id="nav-dropdown">
          <NavDropdown.Item eventKey="4.1" to="/register" as={Link}>Teclados</NavDropdown.Item>
          <NavDropdown.Item eventKey="4.2" to="/register" as={Link}>Ratones</NavDropdown.Item>
          <NavDropdown.Item eventKey="4.2" to="/register" as={Link}>Cables y conectores</NavDropdown.Item>
        </NavDropdown>        
        <NavDropdown title={ iconNavigationVideojuegos() } id="nav-dropdown">
          <NavDropdown.Item eventKey="4.1" to="/register" as={Link}>Videojuegos</NavDropdown.Item>
          <NavDropdown.Item eventKey="4.2" to="/register" as={Link}>Controles</NavDropdown.Item>
          <NavDropdown.Item eventKey="4.3" to="/register" as={Link}>Consolas</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item eventKey="4.4" to="/register" as={Link}>Más accesorios...</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </>
  );
};

export default NavbarCategorias;
