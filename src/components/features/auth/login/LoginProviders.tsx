
import React from 'react';
import GoogleLoginButton from './providersLogin/GoogleLoginButton';
import FacebookLoginButton from './providersLogin/FacebookLoginButton';

const LoginProviders = () => {
  return (
    <div className="hub-login-social mt-0">
      {/* Título o separador opcional */}
      <div className="text-center mb-3">
        <div className="d-flex align-items-center justify-content-center">
          <hr className="flex-grow-1" style={{ borderColor: '#4a5568' }} />
          {/* <span className="px-3 text-muted" style={{ fontSize: '0.875rem' }}>
            O continúa con
          </span> */}
          <hr className="flex-grow-1" style={{ borderColor: '#4a5568' }} />
        </div>
      </div>

      {/* Container de botones sociales */}
      <div className="social-buttons-container">
        <GoogleLoginButton />
        <FacebookLoginButton 
          customButton={true}
          buttonText="Continuar con Facebook"
        />
      </div>

      <style>{`
        .social-buttons-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }

        /* Asegurar que ambos botones tengan el mismo ancho */
        .social-buttons-container > * {
          width: 100% !important;
        }

        /* Estilos responsive */
        @media (max-width: 576px) {
          .social-buttons-container {
            max-width: 100%;
          }
        }

        /* Animación de entrada */
        .social-buttons-container > * {
          animation: fadeInUp 0.4s ease-out;
        }

        .social-buttons-container > *:nth-child(2) {
          animation-delay: 0.1s;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Hover effect para el contenedor */
        .social-buttons-container > *:hover {
          transition: transform 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default LoginProviders;