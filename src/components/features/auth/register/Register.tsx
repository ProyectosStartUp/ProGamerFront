
import React, { useState, type ChangeEvent, useEffect } from "react";
import { Form, Button, Container, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeSlash, CheckCircleFill, Circle, TextareaT, ArrowUp, ArrowDown, Hash, Asterisk, ArrowUpCircle, ArrowDownCircleFill, ArrowUpCircleFill, Alphabet, AlphabetUppercase, Icon8CircleFill } from "react-bootstrap-icons";

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
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    special: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 990px)");
    const handleResize = () => {
      setIsLargeScreen(mediaQuery.matches);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRegistroUsuario(prevData => ({
      ...prevData,
      [name]: value
    }));
    

    if (name === 'contrasenia') {
      updatePasswordValidation(value);
    }
  };

  const validarEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validarContrasenia = (contrasenia: string): string | null => {
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

  const updatePasswordValidation = (password: string) => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?\":{}|<>]/.test(password),
    });
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
    <>
      <div className="hub-login-container" style={{ overflow:'scroll', minHeight:'696px' }}>
     
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
            Regresar al inicio
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
          <Row className="justify-content-sm-center">
            <Col sm={8} md={6} lg={5} xl={4} className="pb-4">
              
              <div className="mb-3">
                  <h3 className="text-white text-center pb-3">Crea una cuenta</h3>
              </div>

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

              {
                isLargeScreen ? (
                  <OverlayTrigger
                    placement="right"
                    show={showPasswordRequirements}
                    overlay={renderTooltip}
                  >
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
                          onFocus={() => setShowPasswordRequirements(true)}
                          onBlur={() => setShowPasswordRequirements(false)}
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
                  </OverlayTrigger>
                ) : (
                  <Form.Group className="mb-3" controlId="formPassword">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Form.Label>Contraseña</Form.Label>
                      {showPasswordRequirements && <PasswordRequirementIcons />}
                    </div>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña"
                        value={registroUsuario.contrasenia}
                        onChange={handleInputChange}
                        name="contrasenia"
                        isInvalid={!!validationErrors.contrasenia}
                        onFocus={() => setShowPasswordRequirements(true)}
                        onBlur={() => setShowPasswordRequirements(false)}
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
                )
              }

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

              {/* Link a Registro */}
              <div className="text-center mt-4">
                <p className="text-light mb-0" style={{ fontSize: "14px" }}>
                  ¿Ya tienes una cuenta?{" "}
                  <Link 
                    to={"/login"} 
                    className="text-white fw-semibold link-redirect"
                    style={{ textDecoration: "none" }}
                  >
                    Inicia sesión
                  </Link>
                </p>
              </div>

            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Register;