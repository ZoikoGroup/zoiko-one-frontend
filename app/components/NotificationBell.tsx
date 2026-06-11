import { Bell } from "lucide-react";

export default function NotificationBell() {
  return (
    <button
      type="button"
      className="header-btn relative inline-flex h-12 w-12 items-center justify-center"
      aria-label="View notifications"
      id="notification-bell"
    >
      <Bell className="header-icon h-5 w-5" />
      <span
        className="absolute right-2 top-2 inline-flex h-2.5 w-2.5 rounded-full bg-amber-400"
        style={{ boxShadow: "0 0 0 2px var(--bg-surface)" }}
      />
    </button>
  );
}
