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




