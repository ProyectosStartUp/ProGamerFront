import React, { useState, type ChangeEvent, useEffect } from "react";
import { Modal, Form, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { 
  Eye, 
  EyeSlash, 
  CheckCircleFill, 
  Circle, 
  AlphabetUppercase, 
  Alphabet, 
  Hash, 
  Asterisk, 
  Icon8CircleFill 
} from "react-bootstrap-icons";
import usePostGenericHook from "../../../../hooks/accessData/usePostGenericHook";
import type { IRespuesta } from "../../../../interfaces/Respuesta";
import "./styles/Profile.css";
import type { IRecoveryPass } from "../../../../interfaces/usuarios";
import { useAuthStore } from "../../../../store/useAuthStore";


interface ChangePasswordModalProps {
  show: boolean;
  onHide: () => void;
  nombreUsuario: string;
  onPasswordChanged: () => void;
  onError: (message: string) => void;
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
  onPasswordChanged,
  onError
}) => {
  const [passwordData, setPasswordData] = useState<PasswordData>({
    contrasenia: "",
    confirmacionContrasenia: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const {uKey}=useAuthStore()
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    special: false,
  });

  // Hook para cambiar contraseña
  const { postData, isLoading } = usePostGenericHook<IRecoveryPass, IRespuesta<any>>(
    "Usuarios/RecuperarPassword"
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 990px)");
    const handleResize = () => {
      setIsLargeScreen(mediaQuery.matches);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));

    if (name === 'contrasenia') {
      updatePasswordValidation(value);
    }

    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const updatePasswordValidation = (password: string) => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?\":{}|<>]/.test(password),
    });
  };

  const validarContrasenia = (contrasenia: string): string | null => {
    if (!contrasenia) {
      return "La contraseña es requerida";
    }
    if (contrasenia.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
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

  const renderTooltip = (props: any) => (
    <Tooltip id="password-tooltip" {...props}>
      <div style={{ padding: "0", textAlign: "left"}}>La contraseña debe contener:</div>
      {renderPasswordRequirements()}
    </Tooltip>
  );

  const renderPasswordRequirements = () => (
    <ul>      
      <li className={passwordValidation.uppercase ? 'text-success' : 'opacity-40'}>
        {passwordValidation.uppercase ? <CheckCircleFill className="me-2" /> : <Circle className="me-2" />} 
        <span className="white">Una letra mayúscula</span>
      </li>
      <li className={passwordValidation.lowercase ? 'text-success' : 'opacity-40'}>
        {passwordValidation.lowercase ? <CheckCircleFill className="me-2" /> : <Circle className="me-2" />} 
        <span className="white">Una letra minúscula</span>
      </li>
      <li className={passwordValidation.digit ? 'text-success' : 'opacity-40'}>
        {passwordValidation.digit ? <CheckCircleFill className="me-2" /> : <Circle className="me-2" />} 
        <span className="white">Un dígito</span>
      </li>
      <li className={passwordValidation.special ? 'text-success' : 'opacity-40'}>
        {passwordValidation.special ? <CheckCircleFill className="me-2" /> : <Circle className="me-2" />} 
        <span className="white">Un caracter especial</span>
      </li>
      <li className={passwordValidation.length ? 'text-success' : 'opacity-40'}>
        {passwordValidation.length ? <CheckCircleFill className="me-2" /> : <Circle className="me-2" />} 
        <span className="white">Al menos 8 caracteres</span>
      </li>
    </ul>
  );

  const PasswordRequirementIcons = () => (
    <div style={{ display: 'flex', gap: '4px' }}>
      <OverlayTrigger placement="top" overlay={<Tooltip>Una letra mayúscula</Tooltip>}>
        <span style={{ marginLeft: "0px" }}>{passwordValidation.uppercase ? <AlphabetUppercase size={24} color='#00d647' /> : <AlphabetUppercase size={24} color='#8b8b8b' />}</span>
      </OverlayTrigger>
      <OverlayTrigger placement="top" overlay={<Tooltip>Una letra minúscula</Tooltip>}>
        <span style={{ marginLeft: "5px" }}>{passwordValidation.lowercase ? <Alphabet size={24} color='#00d647' /> : <Alphabet size={24} color='#8b8b8b' />}</span>
      </OverlayTrigger>
      <OverlayTrigger placement="top" overlay={<Tooltip>Un dígito</Tooltip>}>
        <span style={{ marginLeft: "0px" }}>{passwordValidation.digit ? <Hash size={22} color='#00d647' /> : <Hash size={22} color='#8b8b8b' />}</span>
      </OverlayTrigger>
      <OverlayTrigger placement="top" overlay={<Tooltip>Un carácter especial</Tooltip>}>
        <span style={{ marginLeft: "0px" }}>{passwordValidation.special ? <Asterisk size={16} color='#00d647' /> : <Asterisk size={16} color='#8b8b8b' />}</span>
      </OverlayTrigger>
      <OverlayTrigger placement="top" overlay={<Tooltip>Al menos 8 caracteres</Tooltip>}>
        <span style={{ marginLeft: "4px" }}>{passwordValidation.length ? <Icon8CircleFill size={18} color='#00d647' /> : <Icon8CircleFill size={18} color='#8b8b8b' />}</span>
      </OverlayTrigger>
    </div>
  );

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

    try {
      const dataToSend: IRecoveryPass = {
        usuario: uKey!,
        pass: passwordData.contrasenia
      };

      const response = await postData(dataToSend);

      if (response && response.exito) {
        onPasswordChanged();
        handleClose();
      } else {
        onError(response?.mensaje || "Error al cambiar la contraseña");
      }
    } catch (error) {
      onError("Error al cambiar la contraseña");
    }
  };

  const handleClose = () => {
    setPasswordData({ 
      contrasenia: "", 
      confirmacionContrasenia: "" 
    });
    setValidationErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowPasswordRequirements(false);
    setPasswordValidation({
      length: false,
      uppercase: false,
      lowercase: false,
      digit: false,
      special: false,
    });
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

        {isLargeScreen ? (
          <OverlayTrigger
            placement="right"
            show={showPasswordRequirements}
            overlay={renderTooltip}
          >
            <Form.Group className="mb-3" controlId="modalPassword">
              <Form.Label>Nueva Contraseña *</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Nueva contraseña"
                  value={passwordData.contrasenia}
                  onChange={handleInputChange}
                  name="contrasenia"
                  isInvalid={!!validationErrors.contrasenia}
                  disabled={isLoading}
                  onFocus={() => setShowPasswordRequirements(true)}
                  onBlur={() => setShowPasswordRequirements(false)}
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
                  disabled={isLoading}
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
          </OverlayTrigger>
        ) : (
          <Form.Group className="mb-3" controlId="modalPassword">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Form.Label>Nueva Contraseña *</Form.Label>
              {showPasswordRequirements && <PasswordRequirementIcons />}
            </div>
            <div className="position-relative">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Nueva contraseña"
                value={passwordData.contrasenia}
                onChange={handleInputChange}
                name="contrasenia"
                isInvalid={!!validationErrors.contrasenia}
                disabled={isLoading}
                onFocus={() => setShowPasswordRequirements(true)}
                onBlur={() => setShowPasswordRequirements(false)}
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
                disabled={isLoading}
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
        )}

        <Form.Group className="mb-3" controlId="modalConfirmPassword">
          <Form.Label>Confirmar Contraseña *</Form.Label>
          <div className="position-relative">
            <Form.Control
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repite tu contraseña"
              value={passwordData.confirmacionContrasenia}
              onChange={handleInputChange}
              name="confirmacionContrasenia"
              isInvalid={!!validationErrors.confirmacionContrasenia}
              disabled={isLoading}
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
              disabled={isLoading}
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
        <Button 
          id="btnCancelaCambiaPass"
          variant="secondary" 
          onClick={handleClose} 
          disabled={isLoading}
          >
          Cancelar
        </Button>
        <Button 
          id="btnGuardarCambiaPass"
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
              Guardando...
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