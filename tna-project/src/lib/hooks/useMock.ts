import { useState, useEffect } from 'react';

interface MockResponse<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export function useMock<T>(mockData: T, delay: number = 600): MockResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setData(mockData);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [mockData, delay]);

  return { data, isLoading, error };
}
