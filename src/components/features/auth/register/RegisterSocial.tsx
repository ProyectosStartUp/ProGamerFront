import React, { useState, type ChangeEvent } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import type { IRespuesta } from "../../../../interfaces/Respuesta";
import usePostGenericHook from "../../../../hooks/accessData/usePostGenericHook";
import ToastNotification from "../../../common/ToastNotification";
import type { IRegistroUsuario } from "../../../../interfaces/registroUsuario";

export interface IRegistroUsuarioRS {
  email: string;
  gamerTag: string;
  esRedesSociales: boolean;
}

interface RegisterSocialProps {
  email: string;
}

interface ValidationErrors {
  gamerTag?: string;
}

const RegisterSocial: React.FC<RegisterSocialProps> = () => {

  const [params]   = useSearchParams();
  
  const [registroUsuario, setRegistroUsuario] = useState<IRegistroUsuario>({
    email: params.get('email')?.toString()!,
    confirmacionEMail: "",
    contrasenia: "",
    confirmacionContrasenia: "",
    gamerTag: "",
    esRedSocial:true
  });
  
  const { postData, isLoading } = usePostGenericHook<IRegistroUsuario, IRespuesta>("usuarios/agregar");

  const [respuesta, setRespuesta] = useState<IRespuesta>({
    exito: false,
    mensaje: '',
    error: '',
    data: []
  });
  
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const navigate = useNavigate();
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRegistroUsuario(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const registroValido = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    // Validar gamerTag
    if (!registroUsuario.gamerTag || registroUsuario.gamerTag.trim() === "") {
      errors.gamerTag = "El Gamer Tag es requerido";
      isValid = false;
    } else if (registroUsuario.gamerTag.length < 6) {
      errors.gamerTag = "El Gamer Tag debe tener al menos 6 caracteres";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleRegistroUsuario = async () => {
    if (registroValido()) {
      try {
        const response =await postData(registroUsuario);
        
        if (response) {
          setRespuesta(response);
          setShowSuccessToast(true);    
          
          if (response.exito) {
            setTimeout(() => {
              navigate("/");
            }, 2000);
          }
        }
      } catch (error) {
        console.error("Error al registrar usuario:", error);
      }
    }
  };

  return (
    <div className="hub-login-container">
      <ToastNotification
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        message={respuesta.exito ? respuesta.mensaje : respuesta.error}
        header="Notificación!"
        bg={respuesta.exito ? "success" : "danger"}
        delay={4000}
        position="top-end"
      />

      <div className="hub-login-back" style={{ top: "16px" }}>
        <Link to={"/"} className="text-light">
          <i className="bi bi-arrow-left me-1 float-start"></i>
          Regresar
        </Link>
      </div>

      <div
        style={{
          width: "100%",
          height: 160,
          top: 0,
          overflow: "hidden",
          display: "none"
        }}
        className="bg-dark position-absolute"
      >
        <img src="../banner-1.png" alt="Banner" />
      </div>

      <Container className="mt-5 mb-4" style={{ zIndex: "2" }}>
        <Row className="justify-content-md-center">
          <Col md={4}>
            <h2 className="mb-4 text-left text-white">
              Completa tu registro
            </h2>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={registroUsuario.email}
                name="email"
                readOnly
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formGamertag">
              <Form.Label>Gamertag</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu gamertag"
                value={registroUsuario.gamerTag}
                onChange={handleInputChange}
                name="gamerTag"
                isInvalid={!!validationErrors.gamerTag}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.gamerTag}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              type="submit"
              className="w-100 hub-btn-gamer"
              disabled={isLoading}
              onClick={handleRegistroUsuario}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-grow spinner-grow-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Completando registro...
                </>
              ) : (
                "Completar registro"
              )}
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterSocial;