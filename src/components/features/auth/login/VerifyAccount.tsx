import React, { useState, useRef, type ChangeEvent, type KeyboardEvent } from "react";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import ToastNotification from "../../../common/ToastNotification";
import type { IVerifyAccount } from "../../../../interfaces/login";
import usePostGenericHook from "../../../../hooks/accessData/usePostGenericHook";
import type { IRespuesta } from "../../../../interfaces/Respuesta";
import type { Email } from "../../../../interfaces/correo";

const VerifyAccount: React.FC = () => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  const { postData, isLoading } = usePostGenericHook<IVerifyAccount, IRespuesta>("usuarios/ConfirmarCorreo");
  const { postData: postDataResend, isLoading: isLoadingResend } = usePostGenericHook<Email, IRespuesta>("usuarios/reenvioCodigo");
  const [params] = useSearchParams();
  const [respuesta, setRespuesta] = useState<IRespuesta>({
    exito: false,
    mensaje: '',
    error: '',
    data: []
  });
  
  // Referencias para los inputs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const navigate = useNavigate();

  // Manejar cambio en los inputs - SOLO NÚMEROS
  const handleInputChange = (index: number, value: string) => {
    // Solo permitir números (0-9)
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    
    if (sanitizedValue.length <= 1) {
      const newCode = [...code];
      newCode[index] = sanitizedValue;
      setCode(newCode);

      // Mover al siguiente input automáticamente
      if (sanitizedValue && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Manejar teclas especiales
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Backspace: borrar y volver al input anterior
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Flechas izquierda/derecha para navegar
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Prevenir entrada de letras y caracteres especiales
    const isNumber = /^[0-9]$/.test(e.key);
    const isControlKey = [
      "Backspace",
      "Delete",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End"
    ].includes(e.key);
    const isCopyPaste = (e.ctrlKey || e.metaKey) && ["c", "v", "x", "a"].includes(e.key.toLowerCase());

    if (!isNumber && !isControlKey && !isCopyPaste) {
      e.preventDefault();
    }
  };

  // Manejar pegado de código completo - SOLO NÚMEROS
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    // Solo extraer números del texto pegado
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    
    if (pastedData.length === 0) {
      setRespuesta({
        exito: false,
        mensaje: '',
        error: 'El código debe contener solo números',
        data: []
      });
      setShowSuccessToast(true);
      return;
    }

    const newCode = [...code];
    for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);
    
    // Enfocar el último input lleno o el primero vacío
    const nextEmptyIndex = newCode.findIndex(c => !c);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerifyAccount = async () => {
    // Unimos los dígitos capturados por el usuario
    const verificationCode = code.join("");
    
    if (verificationCode.length !== 6) {
      setRespuesta({
        exito: false,
        mensaje: '',
        error: 'Capture los 6 dígitos enviados a su correo',
        data: []
      });
      setShowSuccessToast(true);
      return;
    }

    // Validar que todos sean números
    if (!/^\d{6}$/.test(verificationCode)) {
      setRespuesta({
        exito: false,
        mensaje: '',
        error: 'El código debe contener solo números',
        data: []
      });
      setShowSuccessToast(true);
      return;
    }

    try {
      const _data: IVerifyAccount = {
        codigo: verificationCode,
        usuario: params.get('user')?.toString()!,
        uKey: params.get('token')?.toString()!,
      };
      
      const response = await postData(_data!);
      
      if (response) {
        setRespuesta(response);
        setShowSuccessToast(true);

        if (response.exito) {
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } 
    } catch (error) {
      console.error("Error al verificar cuenta:", error);
      setRespuesta({
        exito: false,
        mensaje: '',
        error: 'Error al verificar cuenta: ' + error,
        data: []
      });
      setShowSuccessToast(true);
    } 
  };

  const handleResendCode = async () => {
    try {
      console.log("Reenviando código...");

      const email: Email = {
        parametro: params.get('token')?.toString()!
      };

      const responseResend = await postDataResend(email);

      if (responseResend) {
        setRespuesta(responseResend);
        setShowSuccessToast(true);
      } 
    } catch (error) {
      console.error("Error al reenviar código:", error);
      setRespuesta({
        exito: false,
        mensaje: '',
        error: 'Error al reenviar código',
        data: []
      });
      setShowSuccessToast(true);
    }
  };

  return (
    <div className="hub-login-container">
      <ToastNotification
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        message={respuesta.exito ? respuesta.mensaje : (respuesta.error || "Hubo un problema al verificar la cuenta")}
        header="Notificación!"
        bg={respuesta.exito ? "success" : "danger"}
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
              <h2 className="mb-2 text-white">
                Verifica tu cuenta
              </h2>
              <p className="text-light" style={{ fontSize: "14px", opacity: 0.8 }}>
                Ingresa el código de 6 dígitos que enviamos a tu correo electrónico
              </p>
            </div>

            <Form.Group className="mb-4">
              <div className="d-flex justify-content-center gap-2">
                {code.map((digit, index) => (
                  <Form.Control
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(index, e.target.value)
                    }
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                      handleKeyDown(index, e)
                    }
                    onPaste={handlePaste}
                    disabled={isLoading || isLoadingResend}
                    style={{
                      width: "50px",
                      height: "60px",
                      fontWeight: "bold",
                    }}
                    className="text-center"
                  />
                ))}
              </div>
            </Form.Group>

            <Button
              type="submit"
              className="w-100 hub-btn-gamer mb-3"
              disabled={isLoading || isLoadingResend || code.some(c => !c)}
              onClick={handleVerifyAccount}
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
                  />
                  Verificando...
                </>
              ) : (
                "Verificar Cuenta"
              )}
            </Button>

            <div className="text-center">
              <p className="text-light mb-2" style={{ fontSize: "14px" }}>
                ¿No recibiste el código?
              </p>
              <Button
                variant="link"
                className="text-light p-0 d-inline-flex align-items-center"
                style={{ 
                  fontSize: "14px",
                  textDecoration: isLoadingResend ? "none" : "underline",
                  opacity: isLoadingResend ? 0.6 : 0.8,
                  cursor: isLoadingResend ? "not-allowed" : "pointer"
                }}
                onClick={handleResendCode}
                disabled={isLoading || isLoadingResend}
              >
                {isLoadingResend ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                      style={{
                        width: "14px",
                        height: "14px",
                        borderWidth: "2px"
                      }}
                    />
                    Reenviando código...
                  </>
                ) : (
                  "Reenviar código"
                )}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default VerifyAccount;