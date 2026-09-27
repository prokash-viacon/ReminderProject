export type Reminder = {
  id: string;
  title: string;
  datetime: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ReminderInput = {
  title: string;
  datetime: string;
  completed?: boolean;
};
