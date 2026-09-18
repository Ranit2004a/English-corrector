import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initDatabase } from '../db/database';
import { useUserStore } from '../store/useUserStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { Typography } from '../constants/theme';
import { useTheme } from '../constants/useTheme';
import { SplashScreen } from '../components/ui/SplashScreen';
import { Button } from '../components/ui/Button';

const queryClient = new QueryClient();

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const [splashFinished, setSplashFinished] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const loadUser = useUserStore(state => state.loadUser);
  const loadSettings = useSettingsStore(state => state.loadSettings);
  const { colors, isDark } = useTheme();

  const setup = useCallback(async () => {
    setInitError(null);
    try {
      await initDatabase();
      await loadSettings();
      await loadUser();
      setDbReady(true);
    } catch (e: any) {
      console.warn('Initialization error:', e);
      setInitError(e?.message || 'Failed to initialize database');
    }
  }, [loadSettings, loadUser]);

  useEffect(() => {
    setup();
  }, [setup]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        {initError ? (
          <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
            <Text style={[styles.errorTitle, { color: colors.error }]}>Initialization Failed</Text>
            <Text style={[styles.errorMessage, { color: colors.onSurfaceVariant }]}>{initError}</Text>
            <Button
              title="Try Again"
              variant="primary"
              onPress={setup}
              style={styles.retryButton}
            />
          </View>
        ) : (
          <>
            {dbReady && splashFinished && (
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: colors.background },
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
            )}

            {(!splashFinished || !dbReady) && (
              <SplashScreen
                isReady={dbReady}
                onFinish={() => setSplashFinished(true)}
              />
            )}
          </>
        )}
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorTitle: {
    ...Typography.headlineMd,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    ...Typography.bodyMd,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    minWidth: 160,
  },
});
