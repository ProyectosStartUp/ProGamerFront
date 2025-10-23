import { useState } from 'react';
import { AxiosError } from 'axios';
import axi from '../../services/apiClient';

type ApiHookResult<TData, TResponse> = {
  postData: (data: TData) => Promise<TResponse | null>;
  isLoading: boolean;
  error: string | null;
};

 //tanStack Querycd
export const usePostGenericHook = <TData, TResponse>(url:string): ApiHookResult<TData, TResponse> => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
 
  const postData = async (data: TData): Promise<TResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axi.post<TResponse>(url, data);
      setLoading(false);
      return response.data;
    } catch (e) {
      setLoading(false);
      const axiosError = e as AxiosError;
     
      if (axiosError.response) {
       
        setError(`Error del servidor: ${axiosError.response.status}`);
      } else if (axiosError.request) {
       
        setError('No se recibió respuesta del servidor.');
      } else {
       
        setError(`Error al enviar la petición: ${axiosError.message}`);
      }
      return null;
    }
  };
 
  return { postData, isLoading, error };
};
 


export default usePostGenericHook