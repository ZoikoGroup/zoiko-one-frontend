import { Bell } from "lucide-react";

export default function NotificationBell() {
  return (
    <button
      type="button"
      className="uiverse-button"
      aria-label="View notifications"
      id="notification-bell"
    >
      <div className="button-outer">
        <div className="uiverse-button-inner uiverse-circular">
          <Bell className="h-4 w-4 text-slate-800" />
          <span
            className="absolute right-1 top-1 inline-flex h-2.5 w-2.5 rounded-full bg-amber-400"
            style={{ boxShadow: "0 0 0 2px rgba(255,255,255,0.8)" }}
          />
        </div>
      </div>
    </button>
  );
}
