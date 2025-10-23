export interface IRespuesta<T = any> {
  exito: boolean;
  mensaje: string;
  error: string;
  data: T | T[];
}