
export interface ILogin{
    usuario: string ;
    pass: string;
    captchaToken?: string; 
}

export interface IVerifyAccount {
    uKey: string,
    usuario: string,
    codigo: string
}

export interface ILoginRS {
    email: string;
    esRedesSocial: boolean;
}