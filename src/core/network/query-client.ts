import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24, // 24 horas de cache
      gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias retido na memória
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

