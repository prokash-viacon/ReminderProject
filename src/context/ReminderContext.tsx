import React, { createContext, useContext } from 'react';
import {
  useReminderStore,
  type ReminderStore,
} from '../hooks/useReminderStore';

const ReminderContext = createContext<ReminderStore | null>(null);

export function ReminderProvider({ children }: { children: React.ReactNode }) {
  const store = useReminderStore();

  return (
    <ReminderContext.Provider value={store}>
      {children}
    </ReminderContext.Provider>
  );
}

export function useReminders(): ReminderStore {
  const ctx = useContext(ReminderContext);
  if (!ctx) {
    throw new Error('useReminders must be used within ReminderProvider');
  }
  return ctx;
}
