export interface IAddressData {
     idCliente?: string;
     idDireccion: string;
     aliasDireccion: string;
     calle: string;
     numExt: string;
     numInt: string;
     codigoPostal: string;
     idCp: string;
     municipioId: string;
     referencias?: string;
     esFiscal: boolean;
     // Campos adicionales que vienen del backend
     colonia?: string;
     idMunicipio?: number;
     idEntidad?: number;
     entidadFva?: string | null;
     municipio?: string;
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
  aliasDireccion?: string;
  calle?: string;
  numExt?: string;
  codigoPostal?: string;
  coloniaId?: string;
  municipioId?: string;
  idCp?: string;
}

export interface IColoniaData {
  idColonia: number;
  colonia: string;
  codigoPostal: string;
  idMunicipio: number;
  municipio: string;
  idEntidad: number;
  entidad: string;
  idPais: number;
  pais: string;
}

export interface ISendDataAddress {
  idCliente?: string,
  idDireccion: string,
  aliasDireccion: string,
  calle: string,
  numExt: string,
  numInt: string,
  idCp: number,
  referencias: string,
  esFiscal: false
}