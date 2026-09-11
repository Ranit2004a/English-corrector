import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initDatabase } from '../db/database';
import { useUserStore } from '../store/useUserStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/theme';

const queryClient = new QueryClient();

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const loadUser = useUserStore(state => state.loadUser);
  const loadSettings = useSettingsStore(state => state.loadSettings);

  useEffect(() => {
    async function setup() {
      try {
        await initDatabase();
        await loadSettings();
        await loadUser();
      } catch (e) {
        console.warn('Initialization error:', e);
      } finally {
        setDbReady(true);
      }
    }
    setup();
  }, []);

  if (!dbReady) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="practice/session" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
        <Stack.Screen name="practice/summary" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="mistakes/index" options={{ headerShown: false }} />
        <Stack.Screen name="vocabulary/index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
