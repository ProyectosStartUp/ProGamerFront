export interface ICliente{
    id: string;
    nombres: string;
    telefono: string;
    idUsuario: string;
    pathFoto: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    auth2FA: boolean;
    esRedSocial: boolean;
 

}

export interface IUsuario{
    id: string;
    nombreUsuario: string;
    mail: string;
    activo: boolean;
    auth2FA: boolean;
    mailVerificado: boolean;
    intentosFallidos: number;
} 


export interface IPersonalData {
  id: string;
  idUsuario: string; 
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
}

export interface ISendDataPersonal {
  idUsuario: string,
  idCliente: string,
  nombre: string,
  apellidoP: string,
  apellidoM: string,
  telefono: string
    
}
