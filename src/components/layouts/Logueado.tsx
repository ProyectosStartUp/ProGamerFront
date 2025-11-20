import React from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { User, LogOut, UserCircle } from "lucide-react";
import UserDropdownToggle from "./UserDropdownToggle";
import "./Logueado.css";

interface ILoqueadoProps {
  nombreUsuario: string;
  handleLogout: () => void;
}

const Logueado: React.FC<ILoqueadoProps> = ({
  nombreUsuario = '',
  handleLogout,
}) => {
  return (
    <>
      <Dropdown className="user-dropdown w-100 mt-4 mt-lg-0">
        <Dropdown.Toggle
          as={UserDropdownToggle}
          id="dropdown-custom-components"
        >
          <UserCircle size={25} className="user-icon" />
          <span className="user-name">{nombreUsuario}</span>
        </Dropdown.Toggle>
        
        <Dropdown.Menu align="end" className="user-dropdown-menu">
          <Dropdown.Item as={Link} to="/profile" className="dropdown-item-custom">
            <User size={22} />
            <span>Perfil</span>
          </Dropdown.Item>
          
          <Dropdown.Divider />
          
          <Dropdown.Item
            onClick={handleLogout}
            className="dropdown-item-custom dropdown-item-logout"
          >
            <LogOut size={22} />
            <span>Cerrar sesión</span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default Logueado;