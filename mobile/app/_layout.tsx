import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function RootLayout() {
  const { loadFromStorage, isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    void loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const inAuthScreen = segments[0] === 'login' || segments[0] === 'register' || segments[0] === 'otp';
    if (!isAuthenticated && segments[0] === '(tabs)') {
      router.replace('/login');
    }
    if (isAuthenticated && inAuthScreen) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, isHydrated, router, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
