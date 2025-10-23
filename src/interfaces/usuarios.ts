export interface IUsuarios{
    id : string;
    nombreUsuario : string;
    contrasenia : string;
    mail : string;
    activo : boolean;
    idPerfil : string;
    uKey : string;
    fechaRegistro : string;
    horaInicio : Date;
    horaFin : Date;
    mailVerificado : Date;
    verificar2FA : boolean;
    token : string;
}

export interface IUsuarioRespuesta {
    nombreUsuario : string;
    mail : string;
    verificar2FA : boolean;
    token : string;
    
}


export interface IUserRS {
  email: string;
  name: string;
  picture: string;
  sub: string; 
}