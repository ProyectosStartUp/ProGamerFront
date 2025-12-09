import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState, AuthActions } from '../interfaces/state/AuthState';

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  id: null,
  mail: null,
  nombreUsuario: null,
  verificar2FA: false,
  uKey: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      ...initialState,

      // Método para establecer todos los datos de autenticación
      setAuth: (id, mail, nombreUsuario, verificar2FA,uKey) => 
        set({ 
          id,
          mail, 
          nombreUsuario, 
          verificar2FA,
          uKey
        }),

      // Método para establecer solo el id
      setId: (id) => 
        set({ id }),

      // Método para establecer solo el uKey
      setUkey: (uKey) => 
        set({ uKey }),

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
        return state.id !== null && state.mail !== null && state.nombreUsuario !== null;
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
  const { id, mail, nombreUsuario, verificar2FA,uKey} = useAuthStore();
  return { id, mail, nombreUsuario, verificar2FA , uKey};
};

export const useAuthActions = () => {
  const { setAuth, setId, setMail, setNombreUsuario, setVerificar2FA, clearAuth, isAuthenticated, uKey} = useAuthStore();
  return { setAuth, setId, setMail, setNombreUsuario, setVerificar2FA, clearAuth, isAuthenticated,uKey };
};