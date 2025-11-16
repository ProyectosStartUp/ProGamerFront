import React, { useState, useRef, useEffect, type ChangeEvent } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Nav,
  OverlayTrigger,
  Tooltip,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { PersonCircle, Camera } from "react-bootstrap-icons";
import { useAuthData, useAuthActions } from "../../../../store/useAuthStore";
import ToastNotification from "../../../common/ToastNotification";
import ChangePasswordModal from "./ChangePasswordModal";
import PersonalData from "./PersonalData";
import ShippingData from "./ShippingData";
import BillingData from "./BillingData";
import useGetGenericHook from "../../../../hooks/accessData/useGetGenericHook";
import usePostGenericHook from "../../../../hooks/accessData/usePostGenericHook";
import type { IRespuesta } from "../../../../interfaces/Respuesta";
import type { ICliente, IPersonalData } from "../../../../interfaces/clientes";
import "./styles/Profile.css";
import type { IGenericParam } from "../../../../interfaces/parametros";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { id, mail, nombreUsuario } = useAuthData();
  const { isAuthenticated } = useAuthActions();

  // Validar autenticación al cargar el componente
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Hook genérico para obtener datos del perfil
  const { data, isLoading, error } = useGetGenericHook(
    `Clientes/ObtenerPorUserId/${id}`
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<string>("personal");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [auth2FALocal, setAuth2FALocal] = useState<boolean>(false);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showChangePass, setShowChangePass] = useState(true);
  const [idCliente, setIdCliente] = useState("");
  
  // Estado para datos personales
  const [personalDataInitial, setPersonalDataInitial] = useState<IPersonalData | null>(null);

  // Hook para subir foto 
  const {
    postData,
    isLoading: isLoadingPhoto,
    error: errorPhoto,
  } = usePostGenericHook<FormData, IRespuesta<any>>(
    `Clientes/GuardarFoto/${idCliente || id || ''}`
  );

  // Hook para activar/desactivar 2FA
  const {
    postData: post2FA,
    isLoading: isLoading2FA,
    error: error2FA,
  } = usePostGenericHook<IGenericParam, IRespuesta<any>>(
    "Usuarios/Activar2FN"
  );

  // Procesar datos cuando se cargan
  useEffect(() => {
    if (data) {
      const response = data as IRespuesta<ICliente>;

      if (response.exito && response.data) {
        const clienteData = Array.isArray(response)
          ? response[0].data
          : response.data;

        // Asignar pathFoto si existe
        if (clienteData.pathFoto) {
          setProfileImage(clienteData.pathFoto);
        }
        
        if (clienteData.id) {
          setIdCliente(clienteData.id);
        }

        // Asignar auth2FA al estado local
        if (clienteData.auth2FA !== undefined) {
          setAuth2FALocal(clienteData.auth2FA);
        }

        setShowChangePass(clienteData.auth2FA);

        // Preparar datos personales para el componente hijo
        setPersonalDataInitial({
          id: clienteData.id || "",
          idUsuario: clienteData.idUsuario || "",
          nombres: clienteData.nombres || "",
          apellidoPaterno: clienteData.apellidoPaterno || "",
          apellidoMaterno: clienteData.apellidoMaterno || "",
          telefono: clienteData.telefono || "",
        });
      }
    }
  }, [data, id]);

  // Mostrar error si falla la carga
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setShowErrorToast(true);
    }
  }, [error]);

  // Manejar errores de la subida de foto
  useEffect(() => {
    if (errorPhoto) {
      setErrorMessage(errorPhoto);
      setShowErrorToast(true);
    }
  }, [errorPhoto]);

  // Manejar errores del 2FA
  useEffect(() => {
    if (error2FA) {
      setErrorMessage(error2FA);
      setShowErrorToast(true);
    }
  }, [error2FA]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validaciones
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Por favor, selecciona un archivo de imagen válido");
      setShowErrorToast(true);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("La imagen no debe superar los 5MB");
      setShowErrorToast(true);
      return;
    }

    // Mostrar preview de la imagen
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Subir imagen al servidor
    await uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('photo', file, file.name);

      const response = await postData(formData);

      if (response && response.exito) {
        setErrorMessage("Imagen de perfil actualizada exitosamente");
        setShowSuccessToast(true);
      } else {
        setErrorMessage(response?.mensaje || "Error al guardar la imagen");
        setShowErrorToast(true);
        setProfileImage(null);
      }
    } catch (error) {
      setErrorMessage("Error al guardar la imagen");
      setShowErrorToast(true);
      setProfileImage(null);
    }
  };

  const handleClickUpload = () => {
    if (!isLoadingPhoto) {
      fileInputRef.current?.click();
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

  const handle2FAChange = async (checked: boolean) => {
    // Actualizar el estado local inmediatamente para feedback visual
    const previousValue = auth2FALocal;
    setAuth2FALocal(checked);

    try {
      const param: IGenericParam = {
        parametro: id || ""
      };

      const response = await post2FA(param);

      if (response && response.exito) {
        setErrorMessage(
          checked 
            ? "Autenticación de doble factor activada exitosamente" 
            : "Autenticación de doble factor desactivada exitosamente"
        );
        setShowSuccessToast(true);
        setShowChangePass(checked);
      } else {
        // Revertir el cambio si falla
        setAuth2FALocal(previousValue);
        setErrorMessage(response?.mensaje || "Error al actualizar la configuración de 2FA");
        setShowErrorToast(true);
      }
    } catch (error) {
      // Revertir el cambio si hay error
      setAuth2FALocal(previousValue);
      setErrorMessage("Error al actualizar la configuración de 2FA");
      setShowErrorToast(true);
    }
  };

  const renderTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      Doble factor de autenticación
    </Tooltip>
  );

  // Mostrar loader mientras carga
  if (isLoading) {
    return (
      <div
        className="hub-login-container d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
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
        nombreUsuario={mail || ""}
        onPasswordChanged={handlePasswordChanged}
        onError={handleError}
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
                disabled={isLoadingPhoto}
              >
                {isLoadingPhoto ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <Camera size={20} />
                )}
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                disabled={isLoadingPhoto}
              />
            </div>

            <div className="mt-3">
              <h4 className="text-white mb-2 profile-username">
                {nombreUsuario || "Usuario"}
              </h4>
              <h6 className="text-light mb-3 profile-email">{mail}</h6>

              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                >
                  <div className="d-flex align-items-center">
                    <Form.Check
                      type="switch"
                      id="2fa-switch"
                      checked={auth2FALocal}
                      onChange={(e) => handle2FAChange(e.target.checked)}
                      label="Requiere 2FA"
                      className="text-light profile-2fa-switch"
                      disabled={isLoading2FA}
                    />
                    {isLoading2FA && (
                      <Spinner animation="border" size="sm" className="ms-2" />
                    )}
                  </div>
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
            <h2 className="mb-4 text-left text-white">Mi Perfil</h2>

            <Nav
              fill
              variant="tabs"
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k || "personal")}
            >
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
              {activeTab === "personal" && personalDataInitial && (
                <PersonalData 
                  initialData={personalDataInitial}
                  onSuccess={handleSuccess} 
                  onError={handleError} 
                />
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