import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { NavigationContainer, DefaultTheme as NavigationTheme } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';

import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { theme, colors } from './src/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Initialize Query Client
const queryClient = new QueryClient();

// Navigation Theme
const navigationTheme = {
  ...NavigationTheme,
  colors: {
    ...NavigationTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.onSurface,
    border: colors.outlineVariant,
    notification: colors.primary,
  },
};

export default function App() {
  // Load custom fonts
  // const [fontsLoaded] = useFonts({
  //   'sans-regular': require('./assets/fonts/Roboto-Regular.ttf'),
  //   'sans-medium': require('./assets/fonts/Roboto-Medium.ttf'),
  //   'sans-bold': require('./assets/fonts/Roboto-Bold.ttf'),
  // });

  // Set status bar style
  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  }, []);

  // if (!fontsLoaded) {
  //   return null; // Or a loading indicator
  // }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PaperProvider
          theme={theme}
          settings={{
            icon: props => <MaterialCommunityIcons {...props} />,
          }}
        >
          <StatusBar
            backgroundColor={colors.background}
            barStyle="dark-content"
          />
          <NavigationContainer theme={navigationTheme}>
            <AppNavigator />
          </NavigationContainer>
        </PaperProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
