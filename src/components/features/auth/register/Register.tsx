
import React, { useState, type ChangeEvent } from "react";
import { Form, Button, Container, Row, Col, } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeSlash } from "react-bootstrap-icons";

import type { IRegistroUsuario } from "../../../../interfaces/registroUsuario";

import usePostGenericHook from "../../../../hooks/accessData/usePostGenericHook";
import type { IRespuesta } from "../../../../interfaces/Respuesta";
import ToastNotification from "../../../common/ToastNotification";

interface ValidationErrors {
  email?: string;
  confirmacionEMail?: string;
  contrasenia?: string;
  confirmacionContrasenia?: string;
  gamerTag?: string;
}

const Register: React.FC = () => {

  
  const [registroUsuario, setRegistroUsuario] = useState<IRegistroUsuario>({
    email: "",
    confirmacionEMail: "",
    contrasenia: "",
    confirmacionContrasenia: "",
    gamerTag: "",
    esRedSocial:false
  });
  
  const { postData, isLoading } = usePostGenericHook<IRegistroUsuario, IRespuesta>( "usuarios/agregar");

  const [respuesta, setRespuesta] = useState<IRespuesta>({
	exito:false,
	mensaje:'',
	error:'',
	data:[]
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const navigate = useNavigate();
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRegistroUsuario(prevData => ({
      ...prevData,
      [name]: value
    }));
    

    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validarEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validarContrasenia = (contrasenia: string): string | null => {
    if (contrasenia.length < 12) {
      return "La contraseña debe tener al menos 12 caracteres";
    }
    if (!/[A-Z]/.test(contrasenia)) {
      return "La contraseña debe contener al menos una letra mayúscula";
    }
    if (!/[a-z]/.test(contrasenia)) {
      return "La contraseña debe contener al menos una letra minúscula";
    }
    if (!/[0-9]/.test(contrasenia)) {
      return "La contraseña debe contener al menos un dígito";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(contrasenia)) {
      return "La contraseña debe contener al menos un carácter especial";
    }
    return null;
  };

  const registroValido = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    // Validar email
    if (!registroUsuario.email) {
      errors.email = "El correo electrónico es requerido";
      isValid = false;
    } else if (!validarEmail(registroUsuario.email)) {
      errors.email = "El formato del correo electrónico no es válido";
      isValid = false;
    }

    // Validar confirmación de email
    if (!registroUsuario.confirmacionEMail) {
      errors.confirmacionEMail = "La confirmación del correo es requerida";
      isValid = false;
    } else if (registroUsuario.email !== registroUsuario.confirmacionEMail) {
      errors.confirmacionEMail = "Los correos electrónicos no coinciden";
      isValid = false;
    }

    // Validar contraseña
    if (!registroUsuario.contrasenia) {
      errors.contrasenia = "La contraseña es requerida";
      isValid = false;
    } else {
      const errorContrasenia = validarContrasenia(registroUsuario.contrasenia);
      if (errorContrasenia) {
        errors.contrasenia = errorContrasenia;
        isValid = false;
      }
    }

    // Validar confirmación de contraseña
    if (!registroUsuario.confirmacionContrasenia) {
      errors.confirmacionContrasenia = "La confirmación de contraseña es requerida";
      isValid = false;
    } else if (registroUsuario.contrasenia !== registroUsuario.confirmacionContrasenia) {
      errors.confirmacionContrasenia = "Las contraseñas no coinciden";
      isValid = false;
    }

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
        const response = await postData(registroUsuario);

		console.log(response,'Respuesta Registro')
        
        if (response) {
		 setRespuesta(response);
          setShowSuccessToast(true);    
		  
		  if(response.exito){
			  setTimeout(() => {
				navigate("/VerifyAccount?token=" + response.data.uKey);
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
        bg={respuesta.exito ? "success":"danger"}
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
              Crea tu cuenta
            </h2>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu correo"
                value={registroUsuario.email}
                onChange={handleInputChange}
                name="email"
                isInvalid={!!validationErrors.email}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmEmail">
              <Form.Label>Confirmar Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Confirma tu correo"
                value={registroUsuario.confirmacionEMail}
                onChange={handleInputChange}
                name="confirmacionEMail"
                isInvalid={!!validationErrors.confirmacionEMail}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.confirmacionEMail}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Contraseña</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={registroUsuario.contrasenia}
                  onChange={handleInputChange}
                  name="contrasenia"
                  isInvalid={!!validationErrors.contrasenia}
                />
                <Button
                  type="button"
                  variant="link"
                  style={{
                    right: "10px",
                    bottom: validationErrors.contrasenia ? "26px" : "0px",
                    fontSize: "24px",
                    color: "#969696ff",
                  }}
                  className="position-absolute p-0 border-0 bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlash style={{ height: "46px" }} />
                  ) : (
                    <Eye style={{ height: "46px" }} />
                  )}
                </Button>
                <Form.Control.Feedback type="invalid">
                  {validationErrors.contrasenia}
                </Form.Control.Feedback>
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  value={registroUsuario.confirmacionContrasenia}
                  onChange={handleInputChange}
                  name="confirmacionContrasenia"
                  isInvalid={!!validationErrors.confirmacionContrasenia}
                />
                <Button
                  type="button"
                  variant="link"
                  style={{
                    right: "10px",
                    bottom: validationErrors.confirmacionContrasenia ? "26px" : "0px",
                    fontSize: "24px",
                    color: "#969696ff",
                  }}
                  className="position-absolute p-0 border-0 bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlash style={{ height: "46px" }} />
                  ) : (
                    <Eye style={{ height: "46px" }} />
                  )}
                </Button>
                <Form.Control.Feedback type="invalid">
                  {validationErrors.confirmacionContrasenia}
                </Form.Control.Feedback>
              </div>
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
                  Registrando...
                </>
              ) : (
                "Registrarse"
              )}
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;