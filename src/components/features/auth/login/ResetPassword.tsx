import React, { useState, type ChangeEvent } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import ToastNotification from "../../../common/ToastNotification";

interface ValidationErrors {
  contrasenia?: string;
  confirmacionContrasenia?: string;
}

const ResetPassword: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [nombreUsuario] = useState(params.get('user') || "");
  const [email] = useState(params.get('email') || "");
  
  const [contrasenia, setContrasenia] = useState("");
  const [confirmacionContrasenia, setConfirmacionContrasenia] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({
    message: '',
    isSuccess: false
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "contrasenia") {
      setContrasenia(value);
    } else if (name === "confirmacionContrasenia") {
      setConfirmacionContrasenia(value);
    }

    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validarContrasenia = (contrasenia: string): string | null => {
    if (!contrasenia) {
      return "La contraseña es requerida";
    }
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

  const passwordValido = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    const errorContrasenia = validarContrasenia(contrasenia);
    if (errorContrasenia) {
      errors.contrasenia = errorContrasenia;
      isValid = false;
    }

    if (!confirmacionContrasenia) {
      errors.confirmacionContrasenia = "La confirmación de contraseña es requerida";
      isValid = false;
    } else if (contrasenia !== confirmacionContrasenia) {
      errors.confirmacionContrasenia = "Las contraseñas no coinciden";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const showToastMessage = (message: string, isSuccess: boolean) => {
    setToastData({ message, isSuccess });
    setShowToast(true);
  };

  const handleSubmit = async () => {
    if (!passwordValido()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Llamar al API para restablecer contraseña
      console.log("Restableciendo contraseña para:", nombreUsuario);

      await new Promise(resolve => setTimeout(resolve, 2000));

      showToastMessage("Contraseña restablecida exitosamente", true);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      showToastMessage(
        "Error al restablecer la contraseña. Por favor, intenta nuevamente.",
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
        header={toastData.isSuccess ? "¡Éxito!" : "Error"}
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
            <h2 className="mb-4 text-left text-white">
              Restablecer Contraseña
            </h2>

            <Form.Group className="mb-3" controlId="formNombreUsuario">
              <Form.Label>Nombre de Usuario</Form.Label>
              <Form.Control
                type="text"
                value={nombreUsuario}
                disabled
                style={{ 
                  backgroundColor: "#2a2a2a", 
                  color: "#999",
                  border: "1px solid #444"
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                value={email}
                disabled
                style={{ 
                  backgroundColor: "#2a2a2a", 
                  color: "#999",
                  border: "1px solid #444"
                }}
              />
            </Form.Group>

            <hr className="my-4" style={{ borderColor: "#444" }} />

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Nueva Contraseña</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={contrasenia}
                  onChange={handleInputChange}
                  name="contrasenia"
                  isInvalid={!!validationErrors.contrasenia}
                />
                <Button
                  type="button"
                  variant="link"
                  style={{
                    position: "absolute",
                    right: "10px",
                    bottom: validationErrors.contrasenia ? "26px" : "0px",
                    fontSize: "24px",
                    color: "#969696ff",
                    padding: 0,
                    border: 0,
                    background: "transparent"
                  }}
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

            <Form.Group className="mb-4" controlId="formConfirmPassword">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  value={confirmacionContrasenia}
                  onChange={handleInputChange}
                  name="confirmacionContrasenia"
                  isInvalid={!!validationErrors.confirmacionContrasenia}
                />
                <Button
                  type="button"
                  variant="link"
                  style={{
                    position: "absolute",
                    right: "10px",
                    bottom: validationErrors.confirmacionContrasenia ? "26px" : "0px",
                    fontSize: "24px",
                    color: "#969696ff",
                    padding: 0,
                    border: 0,
                    background: "transparent"
                  }}
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

            <Button
              type="submit"
              className="w-100 hub-btn-gamer"
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
                  Restableciendo...
                </>
              ) : (
                "Restablecer Contraseña"
              )}
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResetPassword;