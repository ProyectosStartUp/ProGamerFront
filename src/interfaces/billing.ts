export interface IComboItem {
  combo: string;
  valor: string;
  texto: string;
}

export interface IFiscalData {
  id?: string;
  usuarioId: string;
  razonSocial: string;
  rfc: string;
  correoFactura: string;
  regimenFiscalId: string;
  cpFiscal: string;
  usoCfdiId: string;
  formaPagoId: string;
  metodoPagoId: string;
}

export interface ValidationErrors {
  razonSocial?: string;
  rfc?: string;
  correoFactura?: string;
  regimenFiscalId?: string;
  cpFiscal?: string;
  usoCfdiId?: string;
  formaPagoId?: string;
  metodoPagoId?: string;
}