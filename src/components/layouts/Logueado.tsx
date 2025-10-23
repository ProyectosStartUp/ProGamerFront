import React from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import UserDropdownToggle from "./UserDropdownToggle";

interface ILoqueadoProps {
  nombreUsuario: string;
  handleLogout: () => void;
}

const Logueado: React.FC<ILoqueadoProps> = ({
  nombreUsuario='',
  handleLogout,
}) => {
  return (
    <>
      <Dropdown className="w-100 mt-4 mt-lg-0">
        <Dropdown.Toggle
          as={UserDropdownToggle}
          id="dropdown-custom-components"
        >
          {nombreUsuario}
        </Dropdown.Toggle>

        <Dropdown.Menu align="end">
          <Dropdown.Item as={Link} to="/profile">
            Perfil
          </Dropdown.Item>

          <Dropdown.Divider />

          <Dropdown.Item
            onClick={handleLogout} 
          >
            Cerrar sesión
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default Logueado;
