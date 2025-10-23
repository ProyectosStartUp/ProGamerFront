
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState, AuthActions } from '../interfaces/state/AuthState';

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  mail: null,
  nombreUsuario: null,
  verificar2FA: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      ...initialState,

      // Método para establecer todos los datos de autenticación
      setAuth: (mail, nombreUsuario, verificar2FA) => 
        set({ 
          mail, 
          nombreUsuario, 
          verificar2FA 
        }),

      // Método para establecer solo el mail
      setMail: (mail) => 
        set({ mail }),

      // Método para establecer solo el nombre de usuario
      setNombreUsuario: (nombreUsuario) => 
        set({ nombreUsuario }),

      // Método para establecer el estado de 2FA
      setVerificar2FA: (verificar2FA) => 
        set({ verificar2FA }),

      // Método para limpiar toda la autenticación (logout)
      clearAuth: () => 
        set(initialState),

      // Método para verificar si el usuario está autenticado
      isAuthenticated: () => {
        const state = get();
        return state.mail !== null && state.nombreUsuario !== null;
      },
    }),
    {
      name: 'auth-storage', // Nombre de la clave en localStorage
      storage: createJSONStorage(() => localStorage), // Usa localStorage
      //  sessionStorage:
      // storage: createJSONStorage(() => sessionStorage),
    }
  )
);



export const useAuthData = () => {
  const { mail, nombreUsuario, verificar2FA } = useAuthStore();
  return { mail, nombreUsuario, verificar2FA };
};


export const useAuthActions = () => {
  const { setAuth, setMail, setNombreUsuario, setVerificar2FA, clearAuth, isAuthenticated } = useAuthStore();
  return { setAuth, setMail, setNombreUsuario, setVerificar2FA, clearAuth, isAuthenticated };
};