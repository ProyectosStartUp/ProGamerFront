import React, { useState, useRef } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
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

var url = "usuarios/";

const Login = () => {
  const [session, setSession] = useState<ILogin>();
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

        setAuth(user.mail, user.nombreUsuario, user.verificar2FA);
        localStorage.setItem("token", user.token);

        if (user.verificar2FA) {
          setTimeout(() => navigate("/verify2fa"), 3000);
        } else {
          const redirectTo = (location.state as any)?.from?.pathname || "/";
          setTimeout(() => navigate(redirectTo), 3000);
        }
      } else {
        "error: " + error;
        captchaRef.current?.reset();
        setCaptchaToken(null);
      }
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 401) {
          error;
        }
      }
      captchaRef.current?.reset();
      setCaptchaToken(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSession({
      ...session!,
      [name]: value,
    });
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
              ? "Acceso exitoso! Redirigiendo... "
              : respuesta.error
          }
          header="Notificación!"
          bg={respuesta.exito ? "success" : "danger"}
          delay={4000}
          position="top-end"
        />

        <Container className="mt-5 mb-4">
          <Row className="justify-content-md-center">
            <Col md={4}>
              <h2 className="mb-2 text-left text-white">Bienvenido de nuevo</h2>
              <p className="mb-2 text-left text-white">
                Ingresa ahora a tu cuenta
              </p>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formIdentifier">
                  <Form.Label>Gamertag o Email</Form.Label>
                  <Form.Control
                    name="usuario"
                    type="text"
                    placeholder="Ingresa tu Gamertag o correo"
                    value={session?.usuario}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      name="pass"
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña"
                      value={session?.pass}
                      onChange={handleInputChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="link"
                      style={{
                        right: "10px",
                        bottom: "0px",
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
                  </div>
                </Form.Group>

                <div className="row mb-3">
                  <div className="col-5">
                    <Form.Check
                      type="checkbox"
                      id="checkRemember"
                      label="Recordarme"
                      className="custom-form-check"
                    />
                  </div>
                  <div className="col-7 text-end">
                    <Link to={"/ForgotPassword"} className="text-light">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                </div>

                {/* reCAPTCHA Component */}
                <div className="mb-3 d-flex justify-content-center">
                  <div
                    style={{
                      border: captchaError ? "1px solid #ff0000" : "none",
                      padding: captchaError ? "4px" : "0",
                      borderRadius: "4px",
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

                {captchaError && (
                  <Alert
                    className="px-2 py-1 mb-3"
                    style={{
                      backgroundColor: "transparent",
                      color: "#ff0000",
                      fontSize: "13px",
                      border: "1px solid #ff0000",
                      borderRadius: "0px",
                      textAlign: "center",
                    }}
                  >
                    {captchaError}
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-100 hub-btn-gamer mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-grow spinner-grow-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Verificando acceso...
                    </>
                  ) : (
                    "Ingresar"
                  )}
                </Button>

                <div className="o-linea mt-4 mb-4">
                  <span>o</span>
                </div>

                <LoginProviders />
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Login;
