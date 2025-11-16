import React, { useState } from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Button, Spinner } from 'react-bootstrap';
import useGenericHook from "../../../../../hooks/accessData/usePostGenericHook";
import type { IUserRS, IUsuarioRespuesta, IUsuarios } from '../../../../../interfaces/usuarios';
import type { IRespuesta } from '../../../../../interfaces/Respuesta';
import type { ILogin } from '../../../../../interfaces/login';
import { useAuthStore } from '../../../../../store/useAuthStore';
import ToastNotification from '../../../../common/ToastNotification';

interface GoogleLoginButtonProps {
  onSuccess?: (user: IUserRS) => void;
  onError?: (error: string) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess, onError }) => {
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

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    setIsLoading(true);
    
    try {
      if (!credentialResponse.credential) {
        setIsLoading(false);
        throw new Error('No se recibió credencial');
      }

      const decoded: IUserRS = jwtDecode(credentialResponse.credential);
      
      const email: ILogin = {
        usuario: decoded.email,
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
        onSuccess(decoded);
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

      let user: IUsuarioRespuesta = {
        id:_data?.id!,
        mail: _data?.mail!,
        nombreUsuario: _data?.nombreUsuario!,
        verificar2FA: _data?.verificar2FA!,
        token: _data?.token!,
        uKey:_data?.uKey!
      };

      // Usuario existe y está activo - Login exitoso
      if (response?.exito) {
        // user = Array.isArray(response.data) ? response.data[0] : response.data;

        setAuth(user.id,user.mail, user.nombreUsuario, user.verificar2FA,_data?.uKey!);

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
          navigate("/registersocial?email=" + decoded.email);
        }, 500);
      }
    } catch (error) {
      console.error('Error en login con Google:', error);
      setIsLoading(false);
      if (onError) {
        onError('Error al iniciar sesión con Google');
      }
    }
  };

  const handleError = () => {
    console.error('Login con Google falló');
    setIsLoading(false);
    if (onError) {
      onError('Error al iniciar sesión con Google');
    }
  };

  const handleGoogleClick = () => {
    // Trigger del botón de Google oculto
    const googleButton = document.querySelector('[aria-labelledby="button-label"]') as HTMLElement;
    if (googleButton) {
      googleButton.click();
    }
  };

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

      {/* Botón visible personalizado */}
      <Button
        onClick={handleGoogleClick}
        disabled={isLoading}
        className="w-100 google-login-btn"
        style={{
          backgroundColor: isLoading ? 'rgb(0, 43, 115)' : 'rgb(0, 43, 115)',
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
            e.currentTarget.style.backgroundColor = 'rgba(0, 43, 115, 0.8)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 43, 115, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = 'rgb(0, 43, 115)';
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Continuar con Google</span>
          </>
        )}
      </Button>

      {/* Botón de Google oculto */}
      <div style={{ display: 'none' }}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
          theme="filled_blue"
          size="large"
          text="signin"
          shape="rectangular"
          logo_alignment="center"
        />
      </div>
    </>
  );
};

export default GoogleLoginButton;