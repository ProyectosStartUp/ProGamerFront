import React from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import useGenericHook from "../../../../../hooks/accessData/usePostGenericHook";
import type { IUserRS, IUsuarioRespuesta } from '../../../../../interfaces/usuarios';
import type { IRespuesta } from '../../../../../interfaces/Respuesta';
import type { ILogin } from '../../../../../interfaces/login';
import { useAuthStore } from '../../../../../store/useAuthStore';




interface GoogleLoginButtonProps {
  onSuccess?: (user: IUserRS) => void;
  onError?: (error: string) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess, onError }) => {

  const {postData, } = useGenericHook<ILogin, IRespuesta<IUsuarioRespuesta>>( "usuarios/login");
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();


  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error('No se recibió credencial');
      }

      const decoded: IUserRS = jwtDecode(credentialResponse.credential);
      
      const email : ILogin = {
        usuario:decoded.email,
        pass:"",
        captchaToken:""
      }

      if(!email.usuario)
        return;

      const response = await postData(email);
      
      if (onSuccess) {
        onSuccess(decoded);
      }

      let user: IUsuarioRespuesta = {
                mail: "",
                nombreUsuario: "",
                verificar2FA: false,
                token: "",
              };  
      if(response?.exito){
        user = Array.isArray(response.data) ? response.data[0] : response.data;

        setAuth(user.mail, user.nombreUsuario, user.verificar2FA);
        localStorage.setItem("token", user.token);
        if (user.verificar2FA) {
          setTimeout(() => navigate("/verify2fa"), 1000);
        } else {
          const redirectTo = (location.state as any)?.from?.pathname || "/";
          setTimeout(() => navigate(redirectTo), 500);
        }

      }else {
        setTimeout(() => {          
          navigate("/registersocial?email="+ decoded.email)
        }, 500);       
      }      
    } catch (error) {
      console.error('Error en login con Google:', error);
      if (onError) {
        onError('Error al iniciar sesión con Google');
      }
    }
  };

  const handleError = () => {
    console.error('Login con Google falló');
    if (onError) {
      onError('Error al iniciar sesión con Google');
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        theme="filled_blue"
        size="large"
        text="signin"
        shape="rectangular"
        logo_alignment='center'
      />
    </div>
  );
};

export default GoogleLoginButton;