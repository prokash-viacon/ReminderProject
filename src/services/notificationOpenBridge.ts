type OpenListener = (reminderId: string) => void;

let listener: OpenListener | null = null;
let pendingReminderId: string | null = null;

export function setNotificationOpenListener(next: OpenListener | null): void {
  listener = next;
  if (listener && pendingReminderId) {
    const id = pendingReminderId;
    pendingReminderId = null;
    listener(id);
  }
}

export function emitNotificationOpen(reminderId: string): void {
  if (listener) {
    listener(reminderId);
    return;
  }
  pendingReminderId = reminderId;
}
