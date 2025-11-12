import React, { useState, useRef, useEffect, type ChangeEvent } from "react";
import { Form, Button, Container, Row, Col, Nav, OverlayTrigger, Tooltip, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { PersonCircle, Camera } from "react-bootstrap-icons";

import { useAuthData, useAuthActions } from "../../../../store/useAuthStore";
import ToastNotification from "../../../common/ToastNotification";
import ChangePasswordModal from "./ChangePasswordModal";
import PersonalData from "./PersonalData";
import ShippingData from "./ShippingData";
import BillingData from "./BillingData";
import useGetGenericHook from "../../../../hooks/accessData/useGetGenericHook";
import type { IRespuesta } from "../../../../interfaces/Respuesta";
import type { ICliente } from "../../../../interfaces/clientes";
import "./styles/Profile.css";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { id, mail, nombreUsuario } = useAuthData();
  const { isAuthenticated } = useAuthActions();
  
  // Validar autenticación al cargar el componente
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Hook genérico para obtener datos del perfil
  const { data, isLoading, error } = useGetGenericHook (`Clientes/ObtenerPorUserId/${id}`);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<string>("personal");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [auth2FALocal, setAuth2FALocal] = useState<boolean>(false);
  
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showChangePass,setShowChangePass] = useState(true);
  const [idCliente,setIdCliente] = useState("");

  // Procesar datos cuando se cargan
  useEffect(() => {
        console.log('data', data);

    if (data ) {
      const response = data as IRespuesta<ICliente>;


      console.log('response', response.data);

      
      if (response.exito && response.data) {
        const clienteData = Array.isArray(response) ? response[0].data : response.data;
        debugger;
        // Asignar pathFoto si existe
        if (clienteData.pathFoto) {
          setProfileImage(`/imagenes/perfiles/${clienteData.pathFoto}`);
        }
        if(clienteData.id){
          setIdCliente(clienteData.id)
        }
        
        // Asignar auth2FA al estado local
        console.log('2fa', clienteData);
        
        if (clienteData.auth2FA) {
          setAuth2FALocal(clienteData.auth2FA);
        }

        setShowChangePass(clienteData.auth2FA);
      }
    }
  }, [data]);

  // Mostrar error si falla la carga
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setShowErrorToast(true);
    }
  }, [error]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage("Por favor, selecciona un archivo de imagen válido");
        setShowErrorToast(true);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("La imagen no debe superar los 5MB");
        setShowErrorToast(true);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        // Aquí implementar lógica para subir al servidor
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();

    console.log(fileInputRef.current?.click());
    

  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSuccess = () => {
    setShowSuccessToast(true);
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
    setShowErrorToast(true);
  };

  const handlePasswordChanged = () => {
    setErrorMessage("Contraseña actualizada exitosamente");
    setShowSuccessToast(true);
  };

  const handle2FAChange = (checked: boolean) => {
    setAuth2FALocal(checked);
    // Aquí implementar lógica para actualizar en el servidor
    console.log('Actualizar 2FA a:', checked);
  };

  const renderTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      Doble factor de autenticación
    </Tooltip>
  );

  // Mostrar loader mientras carga
  if (isLoading) {
    return (
      <div className="hub-login-container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" variant="light" role="status">
          <span className="visually-hidden">Cargando perfil...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="hub-login-container">
      <ToastNotification
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        message="¡Datos actualizados exitosamente!"
        header="¡Éxito!"
        bg="success"
        delay={3000}
        position="top-end"
      />

      <ToastNotification
        show={showErrorToast}
        onClose={() => setShowErrorToast(false)}
        message={errorMessage}
        header="Error"
        bg="danger"
        delay={5000}
        position="top-end"
      />

      <ChangePasswordModal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        nombreUsuario={nombreUsuario || ""}
        email={mail || ""}
        onPasswordChanged={handlePasswordChanged}
      />

      <div className="hub-login-back profile-back-button">
        <Link to={"/"} className="text-light">
          <i className="bi bi-arrow-left me-1 float-start"></i>
          Regresar
        </Link>
      </div>

      <div className="bg-dark position-absolute profile-banner">
        <img src="../banner-1.png" alt="Banner" />
      </div>

      <Container className="mt-5 mb-4" style={{ zIndex: "2" }}>
        <Row className="justify-content-md-center">
          <Col md={3} className="text-center mb-4">
            <div className="position-relative d-inline-block">
              <div className="profile-avatar-container">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="profile-avatar-image"
                  />
                ) : (
                  <PersonCircle className="profile-avatar-icon" />
                )}
              </div>

              <Button
                variant="light"
                onClick={handleClickUpload}
                className="profile-camera-button"
              >
                <Camera size={20} />
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>

            <div className="mt-3">
              <p className="text-white mb-1 profile-username">
                {nombreUsuario || "Usuario"}
              </p>
              <p className="text-light mb-3 profile-email">
                {mail}
              </p>

              {profileImage && (
                <Button
                  variant="link"
                  className="text-danger p-0 mb-3 d-block profile-remove-photo"
                  onClick={handleRemoveImage}
                >
                  Eliminar foto
                </Button>
              )}

              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                >
                  <Form.Check
                    type="switch"
                    id="2fa-switch"
                    checked={auth2FALocal}
                    onChange={(e) => handle2FAChange(e.target.checked)}
                    label="Requiere 2FA"
                    className="text-light profile-2fa-switch"
                  />
                </OverlayTrigger>
              </div>              

              <div className="mt-3 text-light profile-image-info">
                Formato: JPG, PNG, GIF
                <br />
                Tamaño máximo: 5MB
              </div>

              <Button
                variant="link"
                className="text-light p-0 profile-change-password"
                onClick={() => setShowPasswordModal(true)}
                hidden={!showChangePass}
              >
                Cambiar contraseña
              </Button>



            </div>
          </Col>

          <Col md={8}>
            <h2 className="mb-4 text-left text-white">
              Mi Perfil
            </h2>

            <Nav fill variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k || "personal")}>
              <Nav.Item>
                <Nav.Link eventKey="personal" className="text-light">
                  Datos Personales
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="shipping" className="text-light">
                  Datos de Envío
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="billing" className="text-light">
                  Datos de Facturación
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <div className="profile-tab-content-container">
              {activeTab === "personal" && (
                <PersonalData onSuccess={handleSuccess} onError={handleError} />
              )}
              {activeTab === "shipping" && (
                <ShippingData onSuccess={handleSuccess} onError={handleError} />
              )}
              {activeTab === "billing" && (
                <BillingData onSuccess={handleSuccess} onError={handleError} />
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;