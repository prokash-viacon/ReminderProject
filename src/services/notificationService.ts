import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  EventType,
  TimestampTrigger,
  TriggerType,
  type Event,
} from '@notifee/react-native';
import { Linking, Platform } from 'react-native';
import { strings } from '../constants/strings';
import type { Reminder } from '../types/reminder';
import { emitNotificationOpen } from './notificationOpenBridge';

export const REMINDER_CHANNEL_ID = 'reminders';

export type PermissionStatus = 'granted' | 'denied' | 'blocked' | 'unknown';

function mapAuthorizationStatus(status: number): PermissionStatus {
  switch (status) {
    case AuthorizationStatus.AUTHORIZED:
    case AuthorizationStatus.PROVISIONAL:
      return 'granted';
    case AuthorizationStatus.DENIED:
      return 'denied';
    default:
      return 'unknown';
  }
}

export async function getPermissionStatus(): Promise<PermissionStatus> {
  const settings = await notifee.getNotificationSettings();
  return mapAuthorizationStatus(settings.authorizationStatus);
}

export async function requestPermission(): Promise<PermissionStatus> {
  const settings = await notifee.requestPermission();
  return mapAuthorizationStatus(settings.authorizationStatus);
}

export async function openNotificationSettings(): Promise<void> {
  if (Platform.OS === 'android') {
    await notifee.openNotificationSettings();
    return;
  }
  await Linking.openSettings();
}

export async function ensureChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  await notifee.createChannel({
    id: REMINDER_CHANNEL_ID,
    name: strings.notification.channelName,
    importance: AndroidImportance.HIGH,
  });
}

export async function cancelReminder(reminderId: string): Promise<void> {
  await notifee.cancelTriggerNotification(reminderId);
  await notifee.cancelNotification(reminderId);
}

export async function scheduleReminder(reminder: Reminder): Promise<void> {
  const timestamp = new Date(reminder.datetime).getTime();
  if (Number.isNaN(timestamp) || timestamp <= Date.now()) {
    throw new Error(strings.errors.timeNotInFuture);
  }

  const permission = await getPermissionStatus();
  if (permission !== 'granted') {
    throw new Error(strings.errors.permissionNotGranted);
  }

  await ensureChannel();

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp,
  };

  await notifee.createTriggerNotification(
    {
      id: reminder.id,
      title: reminder.title,
      body: strings.notification.body,
      data: { reminderId: reminder.id },
      android: {
        channelId: REMINDER_CHANNEL_ID,
        smallIcon: 'ic_stat_notification',
        color: '#FF5722',
        pressAction: { id: 'default' },
      },
    },
    trigger,
  );
}

export async function rescheduleReminder(reminder: Reminder): Promise<void> {
  await cancelReminder(reminder.id);
  await scheduleReminder(reminder);
}

/**
 * Ensures incomplete future reminders have a scheduled notification.
 * Prefers inspecting existing trigger IDs; only schedules when missing.
 */
export async function reconcileNotifications(
  reminders: Reminder[],
): Promise<void> {
  const now = Date.now();
  const candidates = reminders.filter(
    reminder =>
      !reminder.completed && new Date(reminder.datetime).getTime() > now,
  );

  if (candidates.length === 0) {
    return;
  }

  let existingIds: Set<string>;
  try {
    const ids = await notifee.getTriggerNotificationIds();
    existingIds = new Set(ids);
  } catch {
    // Fallback: cancel + reschedule when inspection is unavailable
    for (const reminder of candidates) {
      try {
        await rescheduleReminder(reminder);
      } catch {
        // Keep going; reminder remains persisted
      }
    }
    return;
  }

  for (const reminder of candidates) {
    if (existingIds.has(reminder.id)) {
      continue;
    }
    try {
      await scheduleReminder(reminder);
    } catch {
      // Keep going; reminder remains persisted
    }
  }
}

function reminderIdFromEvent(event: Event): string | null {
  const data = event.detail.notification?.data;
  const id = data?.reminderId;
  return typeof id === 'string' && id.length > 0 ? id : null;
}

export function registerForegroundEvents(): () => void {
  return notifee.onForegroundEvent(event => {
    if (event.type !== EventType.PRESS) {
      return;
    }
    const reminderId = reminderIdFromEvent(event);
    if (reminderId) {
      emitNotificationOpen(reminderId);
    }
  });
}

export function registerBackgroundEventHandler(): void {
  notifee.onBackgroundEvent(async event => {
    if (event.type !== EventType.PRESS) {
      return;
    }
    const reminderId = reminderIdFromEvent(event);
    if (reminderId) {
      emitNotificationOpen(reminderId);
    }
  });
}

export async function consumeInitialNotification(): Promise<void> {
  const initial = await notifee.getInitialNotification();
  const id = initial?.notification?.data?.reminderId;
  if (typeof id === 'string' && id.length > 0) {
    emitNotificationOpen(id);
  }
}
