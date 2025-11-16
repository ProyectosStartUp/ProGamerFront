import axios, { type AxiosInstance } from "axios";

const axi: AxiosInstance = axios.create({
  baseURL: "https://api.pgpc.hub-development.net/api/",
  // baseURL: "https://localhost:7122/api/",
 
  timeout: 15000
});

// Interceptor para manejar los headers dinámicamente
// axi.interceptors.request.use(
//   (config) => {
 
//     if (!(config.data instanceof FormData)) {
//       config.headers['Content-Type'] = 'application/json';
//     }
//     // Si es FormData, Axios establecerá automáticamente 
//     // 'multipart/form-data' con el boundary correcto
    
//     // Agregar token de autenticación si existe
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
    
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default axi;

