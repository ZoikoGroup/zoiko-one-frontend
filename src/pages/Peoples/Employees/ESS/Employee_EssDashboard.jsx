import { useState, useEffect } from "react";
import { getMyLeave } from "../../../../service/hrService";
import { getMyAttendanceLegacy } from "../../../../service/hrService";

export default function EssDashboard() {
  const [stats, setStats] = useState([
    { label: "Leave Balance", value: "-", sub: "Annual leave remaining", color: "#4F46E5" },
    { label: "Attendance", value: "-", sub: "This month", color: "#059669" },
    { label: "Pending Requests", value: "-", sub: "Awaiting approval", color: "#D97706" },
    { label: "Documents", value: "-", sub: "Files uploaded", color: "#0EA5E9" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMyLeave().catch(() => null),
      getMyAttendanceLegacy().catch(() => null),
    ]).then(([leaveData, attendanceData]) => {
      const leaveBalance = leaveData?.balance || leaveData?.total_leave_balance || "-";
      const attendanceRate = attendanceData?.rate || attendanceData?.this_month || "-";
      setStats([
        { label: "Leave Balance", value: leaveBalance, sub: "Annual leave remaining", color: "#4F46E5" },
        { label: "Attendance", value: attendanceRate, sub: "This month", color: "#059669" },
        { label: "Pending Requests", value: leaveData?.pending_requests ?? "-", sub: "Awaiting approval", color: "#D97706" },
        { label: "Documents", value: "-", sub: "Files uploaded", color: "#0EA5E9" },
      ]);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "32px", background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>
          Employee Self Service
        </h1>
        <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
          Welcome back! Here's your personal overview for today.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ padding: "20px", borderRadius: "12px", background: "white", border: "1.5px solid #E5E7EB" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>{s.label}</p>
            <p style={{ fontSize: "28px", fontWeight: "800", color: s.color, margin: "0 0 4px 0" }}>{loading ? "..." : s.value}</p>
            <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}