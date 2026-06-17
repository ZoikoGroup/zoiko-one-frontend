import { statusColor } from "./helpers";

export default function StatusBadge({ status }) {
  const colorClass = statusColor(status);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass}`}>
      {status ? status.replace(/_/g, " ") : "N/A"}
    </span>
  );
}
