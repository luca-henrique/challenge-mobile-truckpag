import { useEffect } from "react";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  queryClient,
  asyncStoragePersister,
  setupQueryFocusManager,
} from "./src/core/network/query-client";
import { ErrorBoundary } from "./src/core/ui/ErrorBoundary";
import { AuthGate } from "./src/modules/auth/presentation/components/AuthGate";
import { HomeScreen } from "./src/modules/dictionary/presentation/screens/HomeScreen";

export default function App() {
  useEffect(() => {
    const cleanup = setupQueryFocusManager();
    return cleanup;
  }, []);

  return (
    <SafeAreaProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: asyncStoragePersister,
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias de persistência local
        }}
      >
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary onReset={reset}>
              <AuthGate>
                <HomeScreen />
              </AuthGate>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
        <StatusBar style="dark" />
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
}
