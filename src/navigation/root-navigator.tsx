import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../modules/auth/presentation/state/useAuthStore';
import { HomeScreen } from '../modules/dictionary/presentation/screens/HomeScreen';
import { AuthScreen } from '../features/auth/ui/auth-screen';
import { LoadingScreen } from './loading-screen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { user, isGuest, isLoading, initSession } = useAuthStore();

  useEffect(() => {
    initSession();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const isAuthenticated = Boolean(user || isGuest);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      {isAuthenticated ? (
        // Rotas Privadas (Protegidas)
        <Stack.Screen name="Home" component={HomeScreen} />
      ) : (
        // Rotas Públicas (Autenticação)
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
};

