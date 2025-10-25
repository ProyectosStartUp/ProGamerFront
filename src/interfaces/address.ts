export interface IAddressData {
  usuarioId: string;
  tipoDireccion: 1 | 2; // 1 = Envío, 2 = Facturación
  alias: string;
  calle: string;
  numExt: string;
  numInt: string;
  codigoPostal: string;
  coloniaId: string;
  municipioId: string;
  referencias?: string; // Solo para direcciones de envío
}

export interface IColonia {
  id: string;
  descripcion: string;
  codigoPostal: string;
}

export interface IMunicipio {
  id: string;
  descripcion: string;
}

export interface ValidationErrors {
  alias?: string;
  calle?: string;
  numExt?: string;
  codigoPostal?: string;
  coloniaId?: string;
  municipioId?: string;
}