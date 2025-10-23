import React, { useState, type ChangeEvent } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import "./styles/Profile.css";

interface ChangePasswordModalProps {
  show: boolean;
  onHide: () => void;
  nombreUsuario: string;
  email: string;
  onPasswordChanged: () => void;
}

interface PasswordData {
  contrasenia: string;
  confirmacionContrasenia: string;
}

interface ValidationErrors {
  contrasenia?: string;
  confirmacionContrasenia?: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  show,
  onHide,
  nombreUsuario,
  email,
  onPasswordChanged
}) => {
  const [passwordData, setPasswordData] = useState<PasswordData>({
    contrasenia: "",
    confirmacionContrasenia: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));

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

    const errorContrasenia = validarContrasenia(passwordData.contrasenia);
    if (errorContrasenia) {
      errors.contrasenia = errorContrasenia;
      isValid = false;
    }

    if (!passwordData.confirmacionContrasenia) {
      errors.confirmacionContrasenia = "La confirmación de contraseña es requerida";
      isValid = false;
    } else if (passwordData.contrasenia !== passwordData.confirmacionContrasenia) {
      errors.confirmacionContrasenia = "Las contraseñas no coinciden";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!passwordValido()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Llamar al API para cambiar contraseña
      console.log("Cambiando contraseña para:", nombreUsuario);

      await new Promise(resolve => setTimeout(resolve, 2000));

      onPasswordChanged();
      handleClose();
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPasswordData({ contrasenia: "", confirmacionContrasenia: "" });
    setValidationErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-dark text-white border-secondary">
        <Modal.Title>Cambiar Contraseña</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="bg-dark text-white">
        <Form.Group className="mb-3" controlId="modalNombreUsuario">
          <Form.Label>Nombre de Usuario</Form.Label>
          <Form.Control
            type="text"
            value={nombreUsuario}
            disabled
            className="profile-disabled-input"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="modalEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            disabled
            className="profile-disabled-input"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="modalPassword">
          <Form.Label>Nueva Contraseña</Form.Label>
          <div className="position-relative">
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={passwordData.contrasenia}
              onChange={handleInputChange}
              name="contrasenia"
              isInvalid={!!validationErrors.contrasenia}
              style={{ backgroundColor: "#1a1a1a", color: "#fff", border: "1px solid #444" }}
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

        <Form.Group className="mb-3" controlId="modalConfirmPassword">
          <Form.Label>Confirmar Contraseña</Form.Label>
          <div className="position-relative">
            <Form.Control
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repite tu contraseña"
              value={passwordData.confirmacionContrasenia}
              onChange={handleInputChange}
              name="confirmacionContrasenia"
              isInvalid={!!validationErrors.confirmacionContrasenia}
              style={{ backgroundColor: "#1a1a1a", color: "#fff", border: "1px solid #444" }}
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
      </Modal.Body>
      
      <Modal.Footer className="bg-dark border-secondary">
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button 
          className="hub-btn-gamer" 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span
                className="spinner-grow spinner-grow-sm profile-spinner"
                role="status"
                aria-hidden="true"
              ></span>
              Cambiando...
            </>
          ) : (
            "Cambiar Contraseña"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePasswordModal;