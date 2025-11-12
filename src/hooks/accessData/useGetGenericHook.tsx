import { useCallback, useEffect, useState } from 'react';
import axi from '../../services/apiClient';
 


interface IResultData<T = any> {
  data:  T | T[];
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>
}



const useGetGenericHook = (url:string): IResultData => {

  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axi.get<any[]>(url); 
      setData(response.data);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al cargar los datos.');
    } finally {
      setIsLoading(false);
    }
  }, []); 

  useEffect(() => {
    fetchData();
  }, [fetchData]); 

  return { data, isLoading, error, fetchData };
  
}

export default useGetGenericHook