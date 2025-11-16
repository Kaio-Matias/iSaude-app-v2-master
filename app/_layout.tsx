import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import '../global.css'; // Importa seu Tailwind!
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from '../hooks/useAuth';

const InitialLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Check if navigation is ready
    if (segments.length === 0) {
      return;
    }

    const inTabsGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && inTabsGroup) {
      router.replace('/login');
    } else if (isAuthenticated && (segments[0] === 'login' || segments[0] === 'index')) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, segments]);

  return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="RegisterScreen" />
        <Stack.Screen name="ConnectTypeScreen" />
        <Stack.Screen name="ForgotPasswordScreen" />
        <Stack.Screen name="NovaSenhaScreen" />
        <Stack.Screen name="SenhaAlteradaScreen" />
        <Stack.Screen name="Terms" />
        <Stack.Screen name="Polity" />
        
        {/* Telas dos Grupos de Rotas */}
        <Stack.Screen name="(pacient)" />
        <Stack.Screen name="(professional)" />
        <Stack.Screen name="(clinic)" />
      </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}