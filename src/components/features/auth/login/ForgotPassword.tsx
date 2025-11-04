import React, { useState, type ChangeEvent } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ToastNotification from "../../../common/ToastNotification";
import usePostGenericHook from "../../../../hooks/accessData/usePostGenericHook";
// import type { IVerifyAccount } from "../../../../interfaces/login";
import type { IRespuesta } from "../../../../interfaces/Respuesta";
import type { Email } from "../../../../interfaces/correo";



const ForgotPassword: React.FC = () => {
  const [mail, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({
    message: '',
    isSuccess: false
  });
  const [emailError, setEmailError] = useState("");
  const {postData,}= usePostGenericHook<Email, IRespuesta>("usuarios/recoveryPassword");
  

  const navigate = useNavigate();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError("");
    }
  };

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setEmailError("El correo electrónico es requerido");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("El formato del correo electrónico no es válido");
      return false;
    }

    return true;
  };

  const showToastMessage = (message: string, isSuccess: boolean) => {
    setToastData({ message, isSuccess });
    setShowToast(true);
  };

  const handleSubmit = async () => {
    if (!validateEmail(mail)) {
      return;
    }

    setIsLoading(true);

    try {
      const _data: Email ={ parametro: mail}
      var response = await postData(_data);
      if (response) {
        showToastMessage(
          "Se ha enviado un correo con instrucciones para recuperar tu contraseña",
          true
        );        

        if(response.exito){
            setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
        
        
      }
    } catch (error) {
      console.error("Error al enviar correo:", error);
      showToastMessage(
        "Error al enviar el correo. Por favor, intenta nuevamente.",
        false
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hub-login-container">
      <ToastNotification
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastData.message}
        header={toastData.isSuccess ? "Revisa la bandeja de tu correo electrónico..." : "Error"}
        bg={toastData.isSuccess ? "success" : "danger"}
        delay={4000}
        position="top-end"
      />

      <div className="hub-login-back" style={{ top: "16px" }}>
        <Link to={"/login"} className="text-light">
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
          <Col md={5}>
            <div className="text-center mb-4">
              <h2 className="mb-3 text-white">
                Recuperar Contraseña
              </h2>
              <p className="text-light" style={{ fontSize: "14px", opacity: 0.8 }}>
                Ingresa el correo con el que te diste de alta en el sistema
              </p>
            </div>

            <Form.Group className="mb-4" controlId="formEmail">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="ejemplo@correo.com"
                value={mail}
                onChange={handleEmailChange}
                isInvalid={!!emailError}
                style={{
                  fontSize: "16px",
                  padding: "12px"
                }}
              />
              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              type="submit"
              className="w-100 hub-btn-gamer mb-3"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-grow spinner-grow-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Enviando...
                </>
              ) : (
                "Enviar Correo de Recuperación"
              )}
            </Button>

            <div className="text-center">
              <p className="text-light mb-1" style={{ fontSize: "13px", opacity: 0.7 }}>
                Recibirás un correo con instrucciones para restablecer tu contraseña
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPassword;