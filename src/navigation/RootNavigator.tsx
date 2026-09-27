import React, { useEffect, useRef } from 'react';
import { useColorScheme } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type NavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NotificationPermissionModal } from '../components/NotificationPermissionModal';
import { ReminderListScreen } from '../screens/ReminderListScreen';
import {
  consumeInitialNotification,
  registerForegroundEvents,
} from '../services/notificationService';
import { getColors } from '../theme/colors';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const isDark = useColorScheme() === 'dark';
  const colors = getColors(isDark);
  const navigationRef =
    useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    const unsubscribe = registerForegroundEvents();
    consumeInitialNotification();
    return unsubscribe;
  }, []);

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <NavigationContainer ref={navigationRef} theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ReminderList" component={ReminderListScreen} />
      </Stack.Navigator>
      <NotificationPermissionModal />
    </NavigationContainer>
  );
}
