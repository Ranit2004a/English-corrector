import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initDatabase } from '../db/database';
import { useUserStore } from '../store/useUserStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { Colors } from '../constants/theme';
import { SplashScreen } from '../components/ui/SplashScreen';

const queryClient = new QueryClient();

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const [splashFinished, setSplashFinished] = useState(false);
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

  return (
    <SafeAreaProvider>
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

        {(!splashFinished || !dbReady) && (
          <SplashScreen
            isReady={dbReady}
            onFinish={() => setSplashFinished(true)}
          />
        )}
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
