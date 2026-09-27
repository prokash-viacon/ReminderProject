import { useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { strings } from '../constants/strings';
import { useReminders } from '../context/ReminderContext';
import { setNotificationOpenListener } from '../services/notificationOpenBridge';
import { getColors } from '../theme/colors';
import type { Reminder } from '../types/reminder';
import type { TaskFormValues } from './useTaskForm';

export function useReminderList() {
  const isDark = useColorScheme() === 'dark';
  const colors = getColors(isDark);
  const {
    reminders,
    loading,
    error,
    scheduleError,
    clearScheduleError,
    reload,
    removeReminder,
    toggleComplete,
    createReminder,
    updateReminder,
    getReminderById,
  } = useReminders();

  const [query, setQuery] = useState('');
  const [sheetVisible, setSheetVisible] = useState(false);
  const [editing, setEditing] = useState<Reminder | null>(null);
  const [pendingOpenId, setPendingOpenId] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setSheetVisible(true);
  };

  const openEdit = (reminder: Reminder) => {
    setEditing(reminder);
    setSheetVisible(true);
  };

  const closeSheet = () => {
    setSheetVisible(false);
    setEditing(null);
  };

  useEffect(() => {
    setNotificationOpenListener(setPendingOpenId);
    return () => setNotificationOpenListener(null);
  }, []);

  // A cold-start tap can arrive before reminders are loaded from storage.
  useEffect(() => {
    if (loading || !pendingOpenId) {
      return;
    }
    const found = getReminderById(pendingOpenId);
    setPendingOpenId(null);
    if (found) {
      setEditing(found);
      setSheetVisible(true);
    }
  }, [loading, pendingOpenId, getReminderById]);

  const filteredReminders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return reminders;
    }
    return reminders.filter(r => r.title.toLowerCase().includes(q));
  }, [reminders, query]);

  const saveTask = async (values: TaskFormValues) => {
    if (editing) {
      await updateReminder(editing.id, {
        title: values.title,
        datetime: values.datetime,
        completed: editing.completed,
      });
    } else {
      await createReminder(values);
    }
  };

  let scheduleErrorMessage: string | null = null;
  if (scheduleError) {
    scheduleErrorMessage =
      scheduleError === strings.errors.permissionNotGranted
        ? strings.banners.notificationsDisabled
        : strings.banners.scheduleFailed(scheduleError);
  }

  return {
    isDark,
    colors,
    loading,
    error,
    reload,
    scheduleErrorMessage,
    clearScheduleError,
    query,
    setQuery,
    isSearching: query.length > 0,
    filteredReminders,
    removeReminder,
    toggleComplete,
    sheetVisible,
    editing,
    openCreate,
    openEdit,
    closeSheet,
    saveTask,
  };
}
