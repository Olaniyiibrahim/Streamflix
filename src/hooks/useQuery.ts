import { useCallback, useEffect, useState } from "react";
interface QueryState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  lastFetched: number | null;
}


export function useQuery<T>(
  key: string,
  fetcher: () => Promise<T> | T,
  options: { staleTime?: number; cacheTime?: number; refetchInterval?: number } = {}
): QueryState<T> & { refetch: () => void } {
  const { staleTime = 300000, cacheTime = 600000, refetchInterval } = options;
  
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    isLoading: true,
    isError: false,
    error: null,
    lastFetched: null
});

const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, isError: false }));
      const result = await Promise.resolve(fetcher());
      setState({
        data: result,
        isLoading: false,
        isError: false,
        error: null,
        lastFetched: Date.now()
      });
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        isError: true,
        error: error as Error,
        lastFetched: null
      });
    }
  }, [fetcher]);

  useEffect(() => {
    const cached = sessionStorage.getItem(`query-${key}`);
    if (cached) {
      const { data, lastFetched } = JSON.parse(cached);
      if (Date.now() - lastFetched < cacheTime) {
        setState({
          data,
          isLoading: false,
          isError: false,
          error: null,
          lastFetched
        });
        
        if (Date.now() - lastFetched > staleTime) {
          fetchData();
        }
        return;
      }
    }
    fetchData();
  }, [key, fetchData, staleTime, cacheTime]);

  useEffect(() => {
    if (state.data && state.lastFetched) {
      sessionStorage.setItem(`query-${key}`, JSON.stringify({
        data: state.data,
        lastFetched: state.lastFetched
      }));
    }
  }, [key, state.data, state.lastFetched]);

  useEffect(() => {
    if (!refetchInterval) return;
    const interval = setInterval(fetchData, refetchInterval);
    return () => clearInterval(interval);
  }, [refetchInterval, fetchData]);

  return { ...state, refetch: fetchData };
}