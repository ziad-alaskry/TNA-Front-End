import { useState, useEffect } from 'react';
import { AppError } from '@/lib/api/types';

interface MockResponse<T> {
  data: T | null;
  isLoading: boolean;
  error: AppError | null;
}

export function useMock<T>(mockData: T, delay: number = 600): MockResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setData(mockData);
        setIsLoading(false);
      } catch (err) {
        setError(new AppError(
          err instanceof Error ? err.message : 'Unknown error',
          undefined,
          'MOCK_ERROR'
        ));
        setIsLoading(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [mockData, delay]);

  return { data, isLoading, error };
}
