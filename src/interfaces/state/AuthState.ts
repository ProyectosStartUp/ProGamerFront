export interface AuthState {
  mail: string | null;
  nombreUsuario: string | null;
  verificar2FA: boolean;
}

export interface AuthActions {
  setAuth: (mail: string, nombreUsuario: string, verificar2FA: boolean) => void;
  setMail: (mail: string) => void;
  setNombreUsuario: (nombreUsuario: string) => void;
  setVerificar2FA: (verificar2FA: boolean) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}