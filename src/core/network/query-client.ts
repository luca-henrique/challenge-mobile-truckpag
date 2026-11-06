import { QueryClient, focusManager } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { AppState, AppStateStatus, Platform } from 'react-native';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24, // 24 horas de cache
      gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias retido na memória / storage
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'TRUCKPAG_DICTIONARY_QUERY_CACHE',
});

/**
 * Sincroniza o status de foco do TanStack Query com o ciclo de vida do aplicativo (AppState)
 */
export function setupQueryFocusManager(): () => void {
  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active');
    }
  }

  const subscription = AppState.addEventListener('change', onAppStateChange);
  return () => subscription.remove();
}
