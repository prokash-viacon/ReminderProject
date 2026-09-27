import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { strings } from '../constants/strings';
import type { Reminder } from '../types/reminder';

export type PickerMode = 'date' | 'time';

export type TaskFormValues = {
  title: string;
  datetime: string;
};

type Options = {
  visible: boolean;
  reminder?: Reminder | null;
  onSave: (values: TaskFormValues) => Promise<void>;
  onSaved: () => void;
};

function defaultFutureDate(): Date {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 30);
  date.setSeconds(0, 0);
  return date;
}

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTimeLabel(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function useTaskForm({ visible, reminder, onSave, onSaved }: Options) {
  const isEdit = Boolean(reminder);

  const [title, setTitle] = useState('');
  const [datetime, setDatetime] = useState<Date>(defaultFutureDate());
  const [dateSet, setDateSet] = useState(false);
  const [timeSet, setTimeSet] = useState(false);
  const [pickerMode, setPickerMode] = useState<PickerMode | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }
    if (reminder) {
      setTitle(reminder.title);
      setDatetime(new Date(reminder.datetime));
      setDateSet(true);
      setTimeSet(true);
    } else {
      setTitle('');
      setDatetime(defaultFutureDate());
      setDateSet(false);
      setTimeSet(false);
    }
    setValidationError(null);
    setPickerMode(null);
  }, [visible, reminder]);

  const openPicker = (mode: PickerMode) => setPickerMode(mode);
  const closePicker = () => setPickerMode(null);

  const onPickerChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setPickerMode(null);
      if (event.type === 'dismissed') {
        return;
      }
    }
    if (!selected) {
      return;
    }

    setDatetime(prev => {
      const next = new Date(prev);
      if (pickerMode === 'date') {
        next.setFullYear(
          selected.getFullYear(),
          selected.getMonth(),
          selected.getDate(),
        );
        setDateSet(true);
      } else if (pickerMode === 'time') {
        next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
        setTimeSet(true);
      }
      return next;
    });
  };

  const clearForm = () => {
    setTitle('');
    setDatetime(defaultFutureDate());
    setDateSet(false);
    setTimeSet(false);
    setValidationError(null);
    setPickerMode(null);
  };

  const handleSave = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setValidationError(strings.validation.titleRequired);
      return;
    }
    if (!dateSet || !timeSet) {
      setValidationError(strings.validation.dateTimeRequired);
      return;
    }
    if (datetime.getTime() <= Date.now()) {
      setValidationError(strings.validation.futureTime);
      return;
    }

    setValidationError(null);
    setSaving(true);
    try {
      await onSave({ title: trimmed, datetime: datetime.toISOString() });
      onSaved();
    } catch (e) {
      setValidationError(
        e instanceof Error ? e.message : strings.validation.saveFailed,
      );
    } finally {
      setSaving(false);
    }
  };

  const dateLabel = useMemo(
    () => (dateSet ? formatDateLabel(datetime) : strings.form.datePlaceholder),
    [dateSet, datetime],
  );
  const timeLabel = useMemo(
    () => (timeSet ? formatTimeLabel(datetime) : strings.form.timePlaceholder),
    [timeSet, datetime],
  );

  return {
    isEdit,
    title,
    setTitle,
    datetime,
    dateSet,
    timeSet,
    dateLabel,
    timeLabel,
    pickerMode,
    openPicker,
    closePicker,
    onPickerChange,
    validationError,
    saving,
    clearForm,
    handleSave,
  };
}
