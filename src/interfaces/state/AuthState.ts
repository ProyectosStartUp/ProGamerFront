export interface AuthState {
  id:string | null;
  mail: string | null;
  nombreUsuario: string | null;
  verificar2FA: boolean;
  uKey:string | null;
}

export interface AuthActions {
  setAuth: (id: string,mail: string, nombreUsuario: string, verificar2FA: boolean,uKey: string) => void;
  setMail: (mail: string) => void;
  setId: (id: string) => void;
  setUkey: (uKey: string) => void;
  setNombreUsuario: (nombreUsuario: string) => void;
  setVerificar2FA: (verificar2FA: boolean) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}