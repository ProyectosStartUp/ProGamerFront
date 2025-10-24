import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import ReCAPTCHA from "react-google-recaptcha";
import "./Login.css";
import type { ILogin } from "../../../../interfaces/login";
import useGenericHook from "../../../../hooks/accessData/usePostGenericHook";
import LoginProviders from "./LoginProviders";
import { useAuthStore } from "../../../../store/useAuthStore";
import type { IRespuesta } from "../../../../interfaces/Respuesta";
import type { IUsuarioRespuesta } from "../../../../interfaces/usuarios";
import ToastNotification from "../../../common/ToastNotification";

const REMEMBER_ME_KEY = "hub_remember_credentials";
const url = "usuarios/";

interface RememberedCredentials {
  usuario: string;
  rememberMe: boolean;
}

const Login = () => {
  const [session, setSession] = useState<ILogin>({
    usuario: "",
    pass: "",
    captchaToken: ""
  });
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const { postData, isLoading, error } = useGenericHook<
    ILogin,
    IRespuesta<IUsuarioRespuesta>
  >(url + "login");
 
  const { setAuth } = useAuthStore();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string>("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [respuesta, setRespuesta] = useState<IRespuesta>({
    exito: false,
    mensaje: "",
    error: "",
    data: [],
  });

  const captchaRef = useRef<ReCAPTCHA>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Cargar credenciales guardadas al montar el componente
  useEffect(() => {
    const savedCredentials = localStorage.getItem(REMEMBER_ME_KEY);
    if (savedCredentials) {
      try {
        const parsed: RememberedCredentials = JSON.parse(savedCredentials);
        setSession(prev => ({
          ...prev,
          usuario: parsed.usuario
        }));
        setRememberMe(parsed.rememberMe);
      } catch (error) {
        console.error("Error al cargar credenciales guardadas:", error);
      }
    }
  }, []);

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    if (token) {
      setCaptchaError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.usuario || !session.pass) {
      return;
    }

    // Validar captcha
    if (!captchaToken) {
      setCaptchaError("Por favor, completa el captcha para continuar");
      return;
    }

    try {
      // Incluir el token del captcha en la petición
      const loginData = {
        ...session,
        captchaToken: captchaToken,
      };

      const response = await postData(loginData);
      setRespuesta(response!);
      setShowSuccessToast(true);

      if (response?.exito) {
        let user: IUsuarioRespuesta = {
          mail: "",
          nombreUsuario: "",
          verificar2FA: false,
          token: "",
        };
        user = Array.isArray(response.data) ? response.data[0] : response.data;

        // Guardar o eliminar credenciales según el checkbox
        if (rememberMe) {
          const credentialsToSave: RememberedCredentials = {
            usuario: session.usuario,
            rememberMe: true
          };
          localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(credentialsToSave));
        } else {
          localStorage.removeItem(REMEMBER_ME_KEY);
        }

        setAuth(user.mail, user.nombreUsuario, user.verificar2FA);
        localStorage.setItem("token", user.token);

        if (user.verificar2FA) {
          setTimeout(() => navigate("/verify2fa"), 2000);
        } else {
          const redirectTo = (location.state as any)?.from?.pathname || "/";
          setTimeout(() => navigate(redirectTo), 2000);
        }
      } else {
        captchaRef.current?.reset();
        setCaptchaToken(null);
      }
    } catch (err: any) {
      console.error("Error en login:", err);
      captchaRef.current?.reset();
      setCaptchaToken(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSession({
      ...session,
      [name]: value,
    });
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  return (
    <>
      <div className="hub-login-container">
        <div className="hub-login-back">
          <Link to={"/"} className="text-light">
            <i className="bi bi-arrow-left me-1 float-start"></i>Regresar
          </Link>
        </div>
        
        <ToastNotification
          show={showSuccessToast}
          onClose={() => setShowSuccessToast(false)}
          message={
            respuesta.exito
              ? "¡Acceso exitoso! Redirigiendo..."
              : respuesta.error
          }
          header="Notificación"
          bg={respuesta.exito ? "success" : "danger"}
          delay={4000}
          position="top-end"
        />

        <Container className="mt-5 mb-4">
          <Row className="justify-content-md-center">
            <Col md={5} lg={4}>
              {/* Header */}
              <div className="mb-4">
                <h2 className="mb-2 text-white fw-bold text-center">Bienvenido a ProGamer</h2>
                {/* <p className="text-light mb-0" style={{ fontSize: "15px", opacity: 0.85 }}>
                  Ingresa ahora a tu cuenta
                </p> */}
              </div>

              <Form onSubmit={handleSubmit}>
                {/* Campo Usuario */}
                <Form.Group className="mb-3" controlId="formIdentifier">
                  <Form.Label className="fw-semibold">Gamertag o Email</Form.Label>
                  <Form.Control
                    name="usuario"
                    type="text"
                    placeholder="Ingresa tu Gamertag o correo"
                    value={session?.usuario}
                    onChange={handleInputChange}
                    required
                    style={{
                      padding: "12px 16px",
                      fontSize: "15px",
                      backgroundColor: "#2d3748",
                      border: "1px solid #4a5568",
                      color: "#fff",
                      borderRadius: "6px"
                    }}
                    className="login-input"
                  />
                </Form.Group>

                {/* Campo Contraseña */}
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label className="fw-semibold">Contraseña</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      name="pass"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
                      value={session?.pass}
                      onChange={handleInputChange}
                      required
                      style={{
                        padding: "12px 48px 12px 16px",
                        fontSize: "15px",
                        backgroundColor: "#2d3748",
                        border: "1px solid #4a5568",
                        color: "#fff",
                        borderRadius: "6px"
                      }}
                      className="login-input"
                    />
                    <Button
                      type="button"
                      variant="link"
                      className="position-absolute p-0 border-0 bg-transparent"
                      style={{
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#9ca3af",
                        zIndex: 5
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeSlash size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </Button>
                  </div>
                </Form.Group>

                {/* Recordarme y Olvidaste contraseña */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Form.Check
                    type="checkbox"
                    id="checkRemember"
                    label="Recordarme"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    style={{
                      fontSize: "14px"
                    }}
                    className="custom-form-check"
                  />
                  <Link 
                    to={"/ForgotPassword"} 
                    className="text-light"
                    style={{
                      fontSize: "14px",
                      textDecoration: "none",
                      opacity: 0.85
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                {/* reCAPTCHA Component */}
                <div className="mb-3 d-flex justify-content-center">
                  <div
                    style={{
                      padding: "8px",
                      backgroundColor: captchaError ? "rgba(239, 68, 68, 0.1)" : "#2d3748",
                      border: captchaError ? "1px solid #ef4444" : "1px solid #4a5568",
                      borderRadius: "6px",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <ReCAPTCHA
                      ref={captchaRef}
                      sitekey="6Lf58-UrAAAAANnjeLhjtkfN8Y507dh-oznE89fj"
                      onChange={handleCaptchaChange}
                      theme="dark"
                      onExpired={() => setCaptchaToken(null)}
                      onErrored={() => {
                        setCaptchaToken(null);
                        setCaptchaError(
                          "Error al cargar el captcha. Intenta de nuevo."
                        );
                      }}
                    />
                  </div>
                </div>

                {/* Error de Captcha */}
                {captchaError && (
                  <Alert
                    className="mb-3 d-flex align-items-center"
                    style={{
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      color: "#ef4444",
                      fontSize: "13px",
                      border: "1px solid #ef4444",
                      borderRadius: "6px",
                      padding: "10px 12px"
                    }}
                  >
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {captchaError}
                  </Alert>
                )}

                {/* Botón de Ingresar */}
                <Button
                  type="submit"
                  className="w-100 hub-btn-gamer mb-4"
                  disabled={isLoading}
                  style={{
                    padding: "1px",
                    fontSize: "16px",
                    fontWeight: "600"
                  }}
                >
                  {isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                        style={{
                          width: "18px",
                          height: "18px",
                          borderWidth: "2px"
                        }}
                      />
                      Verificando acceso...
                    </>
                  ) : (
                    "Ingresar"
                  )}
                </Button>

                {/* Divisor */}
                <div className="d-flex align-items-center mb-4">
                  <hr className="flex-grow-1" style={{ borderColor: "#4a5568", opacity: 0.5 }} />
                  <span className="px-3 text-muted" style={{ fontSize: "14px" }}>
                    O continúa con
                  </span>
                  <hr className="flex-grow-1" style={{ borderColor: "#4a5568", opacity: 0.5 }} />
                </div>

                {/* Login Providers */}
                <LoginProviders />

                {/* Link a Registro */}
                <div className="text-center mt-4">
                  <p className="text-light mb-0" style={{ fontSize: "14px" }}>
                    ¿No tienes una cuenta?{" "}
                    <Link 
                      to={"/register"} 
                      className="text-white fw-semibold"
                      style={{ textDecoration: "none" }}
                    >
                      Regístrate aquí
                    </Link>
                  </p>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Estilos adicionales */}
      <style>{`
        .login-input:focus {
          background-color: #2d3748 !important;
          border-color: #667eea !important;
          color: #fff !important;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
        }

        .login-input::placeholder {
          color: #9ca3af;
          opacity: 1;
        }

        .custom-form-check {
          color: #e5e7eb;
        }

        .custom-form-check .form-check-input {
          background-color: #2d3748;
          border-color: #4a5568;
          cursor: pointer;
        }

        .custom-form-check .form-check-input:checked {
          background-color: #667eea;
          border-color: #667eea;
        }

        .custom-form-check .form-check-input:focus {
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }

        .custom-form-check .form-check-label {
          cursor: pointer;
          user-select: none;
        }
      `}</style>
    </>
  );
};

export default Login;