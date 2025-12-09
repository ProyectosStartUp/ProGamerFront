export interface IComboItem {
  combo: string;
  valor: string;
  texto: string;
}

export interface IFiscalData {
  id?: string;
  idCliente: string;
  razonSocial: string;
  rfc: string;
  correoFacturacion: string;
  idRegimenFiscal: string;
  codigoPostal: string;
  idUsoCfdi: string;
  idFormaPago: string;
  idMetodoPago: string;
}

export interface ValidationErrors {
  razonSocial?: string;
  rfc?: string;
  correoFacturacion?: string;
  idRegimenFiscal?: string;
  codigoPostal?: string;
  idUsoCfdi?: string;
  idFormaPago?: string;
  idMetodoPago?: string;
}



export interface IDataBilling {
  idCliente: string;
  idDatoFacturacion: string;
  razonSocial: string;
  rfc: string;
  correo: string;
  cpFiscal: string;
  idRegimen: string;
  regimen: string;
  idUsoCfdi: string;
  usoCfdi: string;
  idFormaPago: string;
  formaPago: string;
  idMetodoPago: string;
  metodoPago: string;
}


export interface IFiscalDataResponse {
  idCliente: string;
  idDatoFacturacion: string;
  razonSocial: string;
  rfc: string;
  correo: string;
  cpFiscal: string;
  idRegimen: string;
  regimen: string;
  idUsoCfdi: string | null;
  usoCfdi: string | null;
  idFormaPago: string;
  formaPago: string;
  idMetodoPago: string;
  metodoPago: string;
}