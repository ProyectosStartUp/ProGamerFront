import { useState } from 'react';
import axi from '../../services/apiClient';


interface UseDeleteGenericHookResult<T> {
  deleteData: (endpoint: string) => Promise<T | null>;
  isLoading: boolean;
  error: string | null;
}

const useDeleteGenericHook = <T,>(): UseDeleteGenericHookResult<T> => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteData = async (endpoint: string): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axi.delete<T>(endpoint);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.mensaje || 
                          err.response?.data?.error || 
                          err.message || 
                          'Error al eliminar el recurso';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteData, isLoading, error };
};

export default useDeleteGenericHook;