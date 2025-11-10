import { QueryClient, onlineManager, focusManager } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import { AppState } from 'react-native';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnReconnect: true,
      refetchOnMount: false,
    },
  },
});

onlineManager.setEventListener((setOnline) => {
  const checkConnection = async () => {
    const state = await Network.getNetworkStateAsync();
    setOnline(!!state.isConnected);
  };
  checkConnection();
  const interval = setInterval(checkConnection, 5000);
  return () => clearInterval(interval);
});

focusManager.setEventListener((handleFocus) => {
  const subscription = AppState.addEventListener('change', (state) => {
    handleFocus(state === 'active');
  });
  return () => subscription.remove();
});

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

const [unsubscribe, restorePromise] = persistQueryClient({
  queryClient,
  persister: asyncStoragePersister,
  maxAge: 1000 * 60 * 60 * 24,
});

restorePromise.catch(() => {});