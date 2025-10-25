import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';
import type { ILogin } from '../../../../../interfaces/login';
import type { IRespuesta } from '../../../../../interfaces/Respuesta';
import type { IUsuarioRespuesta, IUsuarios } from '../../../../../interfaces/usuarios';
import { useAuthStore } from '../../../../../store/useAuthStore';
import useGenericHook from "../../../../../hooks/accessData/usePostGenericHook";
import ToastNotification from '../../../../common/ToastNotification';

interface FacebookUser {
  email: string;
  name: string;
  picture?: string;
  id: string;
}

interface FacebookLoginButtonProps {
  onSuccess?: (user: FacebookUser) => void;
  onError?: (error: string) => void;
  customButton?: boolean;
  buttonText?: string;
  buttonImage?: string;
}

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

const FacebookLoginButton: React.FC<FacebookLoginButtonProps> = ({
  onSuccess,
  onError,
  customButton = true,
  buttonText = "Acceder",
  buttonImage
}) => {
  const { postData } = useGenericHook<ILogin, IRespuesta<IUsuarios>>("usuarios/login");
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoading, setIsLoading] = useState(false);
  const [respuesta, setRespuesta] = useState<IRespuesta>({
    exito: false,
    mensaje: '',
    error: '',
    data: []
  });
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const appId = import.meta.env.VITE_REACT_APP_FACEBOOK_APP_ID || '792938500176830';

  useEffect(() => {
    if (!window.FB) {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: appId,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
      };

      (function (d, s, id) {
        const fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        const js = d.createElement(s) as HTMLScriptElement;
        js.id = id;
        js.src = "https://connect.facebook.net/es_LA/sdk.js";
        fjs.parentNode?.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }
  }, [appId]);

  const handleFacebookLogin = () => {
    if (!window.FB) {
      if (onError) {
        onError('Facebook SDK no está cargado');
      }
      return;
    }

    setIsLoading(true);

    window.FB.login((response: any) => {
      if (response.authResponse) {
        window.FB.api('/me', { fields: 'name,email,picture' }, async (userData: any) => {
          try {
            console.log('Facebook Email del usuario:', userData.email);

            const email: ILogin = {
              usuario: userData.email,
              pass: "",
              captchaToken: ""
            };

            if (!email.usuario) {
              setIsLoading(false);
              if (onError) {
                onError('No se pudo obtener el email del usuario');
              }
              return;
            }

            const response = await postData(email);

            if (onSuccess) {
              onSuccess(userData);
            }

            if (response) {
              setRespuesta(response);
            }

            const _data = Array.isArray(response?.data) ? response.data[0] : response?.data;

            // Usuario existe pero no está activo
            if (response?.exito && !_data?.activo) {
              setShowSuccessToast(true);
              setIsLoading(false);
              return;
            }

            // Usuario existe y está activo - Login exitoso
            if (response?.exito && _data?.activo) {
              setShowSuccessToast(true);

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
                setTimeout(() => {
                  setIsLoading(false);
                  navigate("/verify2fa");
                }, 1000);
              } else {
                const redirectTo = (location.state as any)?.from?.pathname || "/";
                setTimeout(() => {
                  setIsLoading(false);
                  navigate(redirectTo);
                }, 500);
              }
            } else {
              // Usuario no existe - Redirigir a registro
              setTimeout(() => {
                setIsLoading(false);
                navigate("/registersocial?email=" + userData.email);
              }, 500);
            }

          } catch (error) {
            console.error('Error en login con Facebook:', error);
            setIsLoading(false);
            if (onError) {
              onError('Error al iniciar sesión con Facebook');
            }
          }
        });
      } else {
        // Usuario canceló el login
        setIsLoading(false);
        if (onError) {
          onError('Login con Facebook cancelado');
        }
      }
    }, { scope: 'public_profile,email' });
  };

  // Botón personalizado (ancho completo con texto)
  if (customButton) {
    return (
      <>
        <ToastNotification
          show={showSuccessToast}
          onClose={() => setShowSuccessToast(false)}
          message={respuesta.exito ? respuesta.mensaje : respuesta.error}
          header="Notificación!"
          bg={respuesta.exito ? "success" : "danger"}
          delay={4000}
          position="top-end"
        />
        <Button
          onClick={handleFacebookLogin}
          disabled={isLoading}
          className="w-100 facebook-login-btn"
          style={{
            backgroundColor: isLoading ? '#166FE5' : '#1877F2',
            color: '#fff',
            border: 'none',
            padding: '12px',
            fontSize: '16px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.3s ease',
            opacity: isLoading ? 0.8 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#166FE5';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 119, 242, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#1877F2';
              e.currentTarget.style.boxShadow = 'none';
            }
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
                style={{
                  width: '20px',
                  height: '20px',
                  borderWidth: '2px'
                }}
              />
              <span>Iniciando sesión...</span>
            </>
          ) : (
            <>
              {buttonImage ? (
                <img
                  src={buttonImage}
                  alt="Facebook"
                  style={{ width: '20px', height: '20px' }}
                />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              )}
              <span>{buttonText}</span>
            </>
          )}
        </Button>
      </>
    );
  }

  // Botón compacto (solo icono)
  return (
    <>
      <ToastNotification
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        message={respuesta.exito ? respuesta.mensaje : respuesta.error}
        header="Notificación!"
        bg={respuesta.exito ? "success" : "danger"}
        delay={4000}
        position="top-end"
      />
      <Button
        onClick={handleFacebookLogin}
        disabled={isLoading}
        className="d-flex align-items-center justify-content-center facebook-icon-btn"
        style={{
          width: '48px',
          height: '48px',
          padding: '0',
          backgroundColor: isLoading ? '#166FE5' : '#1877F2',
          border: 'none',
          borderRadius: '4px',
          transition: 'all 0.3s ease',
          opacity: isLoading ? 0.8 : 1,
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = '#166FE5';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 119, 242, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = '#1877F2';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
      >
        {isLoading ? (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            style={{
              width: '24px',
              height: '24px',
              borderWidth: '2px',
              color: 'white'
            }}
          />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        )}
      </Button>
    </>
  );
};

export default FacebookLoginButton;