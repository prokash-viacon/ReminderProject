export const strings = {
  list: {
    title: 'Reminders',
    searchPlaceholder: 'Search for tasks',
    createTask: 'Create task',
    emptyTitle: 'No tasks yet',
    emptySubtitle: 'Tap + to create a task and get a reminder.',
    noMatchTitle: 'No matching tasks',
    noMatchSubtitle: 'Try a different search.',
  },

  emptyState: {
    title: 'No tasks yet',
    subtitle: 'Create a task and we’ll remind you at the right time.',
    action: 'Create task',
  },

  loading: {
    reminders: 'Loading reminders…',
  },

  row: {
    edit: 'Edit',
    delete: 'Delete',
    duePrefix: 'Due: ',
    completedSuffix: ' · Done',
  },

  form: {
    newTitle: 'New Task',
    editTitle: 'Edit Task',
    titleLabel: 'Title',
    titlePlaceholder: 'Enter Task',
    dateLabel: 'Reminder Date',
    datePlaceholder: 'Set Date',
    timeLabel: 'Reminder Time',
    timePlaceholder: 'Set Time',
    done: 'Done',
    save: 'Save',
    saving: 'Saving…',
    clear: 'Clear',
  },

  validation: {
    titleRequired: 'Title is required.',
    dateTimeRequired: 'Set both reminder date and time.',
    futureTime: 'Choose a time in the future.',
    saveFailed: 'Failed to save reminder',
  },

  banners: {
    retry: 'Retry',
    dismiss: 'Dismiss',
    permissionOff:
      'Notifications are off. Reminders are saved, but you won’t get alerts until permission is enabled.',
    openSettings: 'Open Settings',
    notificationsDisabled: 'Reminder saved, but notifications are disabled.',
    scheduleFailed: (reason: string) =>
      `Reminder saved, but couldn’t schedule notification: ${reason}`,
  },

  errors: {
    loadFailed: 'Failed to load reminders',
    scheduleFailed: "Couldn't schedule notification",
    reminderNotFound: 'Reminder not found',
    timeNotInFuture: 'Reminder time must be in the future',
    permissionNotGranted: 'Notification permission not granted',
  },

  notification: {
    channelName: 'Reminders',
    body: 'Reminder',
  },

  icons: {
    search: '⌕',
    filter: '☰',
    add: '+',
    calendar: '📅',
    dropdown: '▼',
  },
} as const;
