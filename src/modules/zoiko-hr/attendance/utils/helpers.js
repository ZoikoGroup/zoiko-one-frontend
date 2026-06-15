export function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatTime(timeStr) {
  if (!timeStr) return "-";
  const d = new Date(timeStr);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function statusColor(status) {
  const map = {
    present: "bg-green-100 text-green-800",
    absent: "bg-red-100 text-red-800",
    late: "bg-orange-100 text-orange-800",
    on_leave: "bg-blue-100 text-blue-800",
    wfh: "bg-purple-100 text-purple-800",
    half_day: "bg-yellow-100 text-yellow-800",
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    early: "bg-teal-100 text-teal-800",
    not_clocked: "bg-gray-100 text-gray-800",
    overtime: "bg-indigo-100 text-indigo-800",
    holiday: "bg-pink-100 text-pink-800",
    morning: "bg-blue-100 text-blue-800",
    afternoon: "bg-orange-100 text-orange-800",
    night: "bg-indigo-100 text-indigo-800",
    general: "bg-gray-100 text-gray-800",
    custom: "bg-purple-100 text-purple-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
}

export function hoursWorked(checkIn, checkOut) {
  if (!checkIn || !checkOut) return "0";
  const inTime = new Date(checkIn);
  const outTime = new Date(checkOut);
  const diff = (outTime - inTime) / (1000 * 60 * 60);
  return diff > 0 ? diff.toFixed(1) : "0";
}

export function daysBetween(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  return Math.max(0, Math.floor((e - s) / (1000 * 60 * 60 * 24)));
}
