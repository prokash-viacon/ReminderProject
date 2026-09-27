import { useColorScheme } from 'react-native';
import { useReminders } from '../context/ReminderContext';
import { openNotificationSettings } from '../services/notificationService';
import { getColors } from '../theme/colors';

export function useNotificationPermissionGate() {
  const isDark = useColorScheme() === 'dark';
  const colors = getColors(isDark);
  const { permissionStatus } = useReminders();

  const openSettings = () => {
    openNotificationSettings().catch(() => {});
  };

  return {
    colors,
    blocked: permissionStatus === 'denied' || permissionStatus === 'blocked',
    openSettings,
  };
}
