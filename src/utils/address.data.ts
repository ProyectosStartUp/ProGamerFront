import type { IMunicipio, IColonia } from "../interfaces/address";


export const MUNICIPIOS_DUMMY: IMunicipio[] = [
  { id: "1", descripcion: "Pachuca de Soto" },
  { id: "2", descripcion: "Mineral de la Reforma" },
  { id: "3", descripcion: "Tulancingo" },
  { id: "4", descripcion: "Tizayuca" },
  { id: "5", descripcion: "Huejutla de Reyes" }
];

export const COLONIAS_DUMMY: IColonia[] = [
  // Código Postal 42000 - Pachuca
  { id: "1", descripcion: "Centro", codigoPostal: "42000" },
  { id: "2", descripcion: "Revolución", codigoPostal: "42000" },
  { id: "3", descripcion: "Periodistas", codigoPostal: "42000" },
  { id: "4", descripcion: "Electricistas", codigoPostal: "42000" },
  { id: "5", descripcion: "Venta Prieta", codigoPostal: "42000" },
  
  // Código Postal 42080 - Pachuca
  { id: "6", descripcion: "Doctores", codigoPostal: "42080" },
  { id: "7", descripcion: "Santa Julia", codigoPostal: "42080" },
  { id: "8", descripcion: "Jardines de la Concepción", codigoPostal: "42080" },
  
  // Código Postal 42100 - Mineral de la Reforma
  { id: "9", descripcion: "Zona Plateada", codigoPostal: "42100" },
  { id: "10", descripcion: "El Venado", codigoPostal: "42100" },
  { id: "11", descripcion: "Pueblo Nuevo", codigoPostal: "42100" },
  
  // Código Postal 42184 - Mineral de la Reforma
  { id: "12", descripcion: "Fracc. Privadas del Álamo", codigoPostal: "42184" },
  { id: "13", descripcion: "Fracc. La Providencia", codigoPostal: "42184" },
  { id: "14", descripcion: "Fracc. Los Cedros", codigoPostal: "42184" },
  
  // Código Postal 43600 - Tulancingo
  { id: "15", descripcion: "Centro de Tulancingo", codigoPostal: "43600" },
  { id: "16", descripcion: "Vicente Guerrero", codigoPostal: "43600" },
  { id: "17", descripcion: "Felipe Ángeles", codigoPostal: "43600" },
  
  // Código Postal 43830 - Tizayuca
  { id: "18", descripcion: "Centro de Tizayuca", codigoPostal: "43830" },
  { id: "19", descripcion: "Los Alcatraces", codigoPostal: "43830" },
  { id: "20", descripcion: "Haciendas de Tizayuca", codigoPostal: "43830" }
];

// Función helper para obtener colonias por código postal
export const getColoniasByCP = (codigoPostal: string): IColonia[] => {
  return COLONIAS_DUMMY.filter(colonia => colonia.codigoPostal === codigoPostal);
};

// Función helper para obtener municipio por código postal (simulado)
export const getMunicipioByCP = (codigoPostal: string): string => {
  const cpMap: Record<string, string> = {
    "42000": "1", // Pachuca
    "42080": "1", // Pachuca
    "42100": "2", // Mineral de la Reforma
    "42184": "2", // Mineral de la Reforma
    "43600": "3", // Tulancingo
    "43830": "4"  // Tizayuca
  };
  
  return cpMap[codigoPostal] || "";
};