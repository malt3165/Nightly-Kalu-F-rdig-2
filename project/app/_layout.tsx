import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { LiveDataProvider } from '@/contexts/LiveDataContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <ProfileProvider>
        <NotificationProvider>
          <LiveDataProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="auth" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="menu" />
              <Stack.Screen name="profile" />
              <Stack.Screen name="friends" />
              <Stack.Screen name="groups" />
              <Stack.Screen name="preparty" />
              <Stack.Screen name="subscription" />
              <Stack.Screen name="notifications" />
              <Stack.Screen name="blocked-users" />
              <Stack.Screen name="security-settings" />
              <Stack.Screen name="chat/friend" />
              <Stack.Screen name="chat/group" />
              <Stack.Screen name="club/[id]" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="light" />
          </LiveDataProvider>
        </NotificationProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}