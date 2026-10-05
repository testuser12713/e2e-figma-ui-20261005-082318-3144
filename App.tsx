import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Aleo_700Bold } from '@expo-google-fonts/aleo';
import {
  Inter_100Thin,
  Inter_400Regular,
  Inter_500Medium,
} from '@expo-google-fonts/inter';
import { Ubuntu_400Regular, Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';
import { Actor_400Regular } from '@expo-google-fonts/actor';

import { AppDataProvider } from './src/state/AppData';
import RootTabs from './src/navigation/RootTabs';
import { colors } from './src/theme';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.surface,
  },
};

/**
 * The product shell: safe area, shared app data and the tab navigator.
 * Exported separately so tests can render the wired app without the font gate.
 */
export function AppShell() {
  return (
    <SafeAreaProvider>
      <AppDataProvider>
        <NavigationContainer theme={navigationTheme}>
          <RootTabs />
        </NavigationContainer>
      </AppDataProvider>
    </SafeAreaProvider>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Aleo_700Bold,
    Inter_100Thin,
    Inter_400Regular,
    Inter_500Medium,
    Ubuntu_400Regular,
    Ubuntu_700Bold,
    Actor_400Regular,
  });

  if (!fontsLoaded && !fontError) {
    return <View style={styles.loading} testID="app-loading" />;
  }

  return (
    <>
      <AppShell />
      <StatusBar style="dark" />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
