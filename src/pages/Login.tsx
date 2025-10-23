import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeSlash } from "react-bootstrap-icons";
//import axios from "axios";
import "./Login.css";
import type { ILogin } from "../interfaces/login";
import useGenericHook from "../hooks/usePostGenericHook";
import type { IUsuarios } from "../interfaces/usuarios";
//import useGetGenericHook from "../hooks/useGetGenericHook";

var url = "https://api.pgpc.hub-development.net/api/usuarios/";
//var url = "https://localhost:44357/api/usuarios/";

const Login = () => {
  const [ session, setSession ] = useState<ILogin>();
  const {postData, isLoading, error}= useGenericHook<ILogin, IUsuarios>(url + "login");

  
  const [showPassword, setShowPassword] = useState<boolean>(false);
  //const {data, fetchData, isLoading: isLoadingGet, error: errorGet } = useGetGenericHook (url+"obtenertodos")
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    if (!session?.usuario || !session.pass) {
      return;
    }

    try {
      const response = await postData(session!);
      console.log(response);
      if (response) {
        localStorage.setItem("token", response.token);

        if (response.verificar2FA) {

          // 🚀 Ir a pantalla de verificación de 2FA
          navigate("/verify2fa", { state: { email: response.mail } });
        } else {
          // 🚀 Redirigir a la página de donde venía o al home
          const redirectTo = (location.state as any)?.from?.pathname || "/";
          // Esperar un poco para mostrar el mensaje de éxito
          setTimeout(() => navigate(redirectTo), 800);
        }
      } else {
        "error: "+ error;
      }
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 401) {
          error;
        } 
      }
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

      <Container className="mt-5 mb-4">
        <Row className="justify-content-md-center">
          <Col md={4}>
            <h2 className="mb-2 text-left text-white">Bienvenido de nuevo</h2>
            <p className="mb-2 text-left text-white">
              Ingresa ahora a tu cuenta
            </p>

            <div className="" style={{ minHeight: "40px" }}>
              {error && (
                <Alert
                  className="px-2 py-1 m-0"
                  style={{
                    backgroundColor: "transparent",
                    color: "#ff0000",
                    fontSize: "13px",
                    border: "1px solid #212529",
                    borderRadius: "0px",
                  }}
                >
                  {error}
                </Alert>
              )}
              {!error && (
                <Alert
                  className="px-2 py-1 m-0"
                  style={{
                    backgroundColor: "transparent",
                    color: "#32e956",
                    fontSize: "13px",
                    border: "1px solid #212529",
                    borderRadius: "0px",
                  }}
                >
                  ¡Inicio de sesión exitoso!
                </Alert>
              )}
            </div>

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

              <div className="row mb-5">
                <div className="col-5">
                  <Form.Check
                    type="checkbox"
                    id="checkRemember"
                    label="Recordarme"
                    className="custom-form-check"
                    //checked={isChecked}
                    //onChange={handleChangeCheckbox}
                  />
                </div>
                <div className="col-7 text-end">
                  <Link to={"/"} className="text-light">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              <Button type="submit" className="w-100 hub-btn-gamer" disabled={isLoading}>
                {
                  isLoading ? (
                    <>
                      <span
                        className="spinner-grow spinner-grow-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Verificando acceso...
                    </>
                  ) : ("Ingresar")
                }
              </Button>

              <div className="o-linea mt-4 mb-4">
                <span>o</span>
              </div>

              <div className="hub-login-social mt-0 text-center">
                <Button variant="outline-dark">
                  <img src="/logoGoogle.svg" height={24} alt="Google" />
                </Button>

                <Button variant="outline-dark mx-2">
                  <img src="/logoFacebook.svg" height={24} alt="Facebook" />
                </Button>

                <Button variant="outline-dark">
                  <img src="/logoApple.svg" height={24} alt="Apple" />
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
    </>
   
  );
};

export default Login;
