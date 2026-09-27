import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { strings } from '../constants/strings';
import type { Reminder, ReminderInput } from '../types/reminder';
import { loadReminders, saveReminders } from '../storage/reminderStorage';
import {
  cancelReminder,
  ensureChannel,
  getPermissionStatus,
  reconcileNotifications,
  requestPermission,
  rescheduleReminder,
  scheduleReminder,
  type PermissionStatus,
} from '../services/notificationService';

export type ReminderStore = {
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
  scheduleError: string | null;
  permissionStatus: PermissionStatus;
  clearScheduleError: () => void;
  reload: () => Promise<void>;
  createReminder: (input: ReminderInput) => Promise<Reminder>;
  updateReminder: (id: string, input: ReminderInput) => Promise<Reminder>;
  removeReminder: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  getReminderById: (id: string) => Reminder | undefined;
  refreshPermissionStatus: () => Promise<void>;
};

function createId(): string {
  const cryptoObj = (globalThis as { crypto?: { randomUUID?: () => string } })
    .crypto;
  if (typeof cryptoObj?.randomUUID === 'function') {
    return cryptoObj.randomUUID();
  }
  return `rem_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function sortByDatetime(reminders: Reminder[]): Reminder[] {
  return [...reminders].sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
  );
}

export function useReminderStore(): ReminderStore {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus>('unknown');
  const lastPermission = useRef<PermissionStatus>('unknown');
  const initialRequestDone = useRef(false);

  const persist = useCallback(async (next: Reminder[]) => {
    const sorted = sortByDatetime(next);
    setReminders(sorted);
    await saveReminders(sorted);
    return sorted;
  }, []);

  const syncPermission = useCallback(
    async (read: () => Promise<PermissionStatus>) => {
      let status: PermissionStatus;
      try {
        status = await read();
      } catch {
        status = 'unknown';
      }
      const becameGranted =
        status === 'granted' && lastPermission.current !== 'granted';
      lastPermission.current = status;
      setPermissionStatus(status);

      if (becameGranted) {
        try {
          await ensureChannel();
          await reconcileNotifications(await loadReminders());
        } catch {
          // Reminders stay persisted; reconcile runs again on next grant
        }
      }
    },
    [],
  );

  const refreshPermissionStatus = useCallback(
    () => syncPermission(getPermissionStatus),
    [syncPermission],
  );

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setReminders(sortByDatetime(await loadReminders()));
    } catch (e) {
      setError(e instanceof Error ? e.message : strings.errors.loadFailed);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
    syncPermission(requestPermission).finally(() => {
      initialRequestDone.current = true;
    });
  }, [reload, syncPermission]);

  // Picks up changes made in system Settings while the app was backgrounded.
  // Skipped until the launch prompt resolves, since Android reports
  // "denied" before the user has been asked.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active' && initialRequestDone.current) {
        refreshPermissionStatus();
      }
    });
    return () => subscription.remove();
  }, [refreshPermissionStatus]);

  const createReminder = useCallback(
    async (input: ReminderInput) => {
      const now = new Date().toISOString();
      const reminder: Reminder = {
        id: createId(),
        title: input.title.trim(),
        datetime: input.datetime,
        completed: false,
        createdAt: now,
        updatedAt: now,
      };

      await persist([...reminders, reminder]);

      try {
        await scheduleReminder(reminder);
        setScheduleError(null);
        await refreshPermissionStatus();
      } catch (e) {
        const message =
          e instanceof Error ? e.message : strings.errors.scheduleFailed;
        setScheduleError(message);
        await refreshPermissionStatus();
      }

      return reminder;
    },
    [persist, reminders, refreshPermissionStatus],
  );

  const updateReminder = useCallback(
    async (id: string, input: ReminderInput) => {
      const existing = reminders.find(r => r.id === id);
      if (!existing) {
        throw new Error(strings.errors.reminderNotFound);
      }

      const updated: Reminder = {
        ...existing,
        title: input.title.trim(),
        datetime: input.datetime,
        completed: input.completed ?? existing.completed,
        updatedAt: new Date().toISOString(),
      };

      await persist(reminders.map(r => (r.id === id ? updated : r)));

      try {
        if (updated.completed) {
          await cancelReminder(updated.id);
        } else {
          await rescheduleReminder(updated);
        }
        setScheduleError(null);
        await refreshPermissionStatus();
      } catch (e) {
        const message =
          e instanceof Error ? e.message : strings.errors.scheduleFailed;
        setScheduleError(message);
        await refreshPermissionStatus();
      }

      return updated;
    },
    [persist, reminders, refreshPermissionStatus],
  );

  const removeReminder = useCallback(
    async (id: string) => {
      await persist(reminders.filter(r => r.id !== id));
      try {
        await cancelReminder(id);
      } catch {
        // Reminder already removed from storage
      }
    },
    [persist, reminders],
  );

  const toggleComplete = useCallback(
    async (id: string) => {
      const existing = reminders.find(r => r.id === id);
      if (!existing) {
        return;
      }

      const updated: Reminder = {
        ...existing,
        completed: !existing.completed,
        updatedAt: new Date().toISOString(),
      };

      await persist(reminders.map(r => (r.id === id ? updated : r)));

      try {
        if (updated.completed) {
          await cancelReminder(updated.id);
          setScheduleError(null);
        } else if (new Date(updated.datetime).getTime() > Date.now()) {
          await scheduleReminder(updated);
          setScheduleError(null);
        }
        await refreshPermissionStatus();
      } catch (e) {
        const message =
          e instanceof Error ? e.message : strings.errors.scheduleFailed;
        setScheduleError(message);
        await refreshPermissionStatus();
      }
    },
    [persist, reminders, refreshPermissionStatus],
  );

  const getReminderById = useCallback(
    (id: string) => reminders.find(r => r.id === id),
    [reminders],
  );

  const clearScheduleError = useCallback(() => setScheduleError(null), []);

  return useMemo<ReminderStore>(
    () => ({
      reminders,
      loading,
      error,
      scheduleError,
      permissionStatus,
      clearScheduleError,
      reload,
      createReminder,
      updateReminder,
      removeReminder,
      toggleComplete,
      getReminderById,
      refreshPermissionStatus,
    }),
    [
      reminders,
      loading,
      error,
      scheduleError,
      permissionStatus,
      clearScheduleError,
      reload,
      createReminder,
      updateReminder,
      removeReminder,
      toggleComplete,
      getReminderById,
      refreshPermissionStatus,
    ],
  );
}
