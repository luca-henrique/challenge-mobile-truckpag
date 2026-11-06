import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { queryClient } from './src/core/network/query-client';
import { HomeScreen } from './src/modules/dictionary/presentation/screens/HomeScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <HomeScreen />
        <StatusBar style="dark" />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
