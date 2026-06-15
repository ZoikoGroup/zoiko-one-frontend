export function getAttendanceSummary() {
  return {
    today: {
      date: "2026-06-15",
      checkIn: "08:52 AM",
      checkOut: "05:08 PM",
      status: "present",
      hoursWorked: "8h 16m",
    },
    weekly: [
      { date: "2026-06-15", checkIn: "08:52 AM", checkOut: "05:08 PM", hoursWorked: "8h 16m", status: "present" },
      { date: "2026-06-12", checkIn: "09:05 AM", checkOut: "05:30 PM", hoursWorked: "8h 25m", status: "present" },
      { date: "2026-06-11", checkIn: "08:45 AM", checkOut: "04:50 PM", hoursWorked: "8h 05m", status: "present" },
      { date: "2026-06-10", checkIn: "09:15 AM", checkOut: "05:15 PM", hoursWorked: "8h 00m", status: "late" },
      { date: "2026-06-09", checkIn: "08:55 AM", checkOut: "05:10 PM", hoursWorked: "8h 15m", status: "present" },
    ],
    monthly: [
      { date: "2026-06-01", checkIn: "08:50 AM", checkOut: "05:05 PM", hoursWorked: "8h 15m", status: "present" },
      { date: "2026-06-02", checkIn: "08:48 AM", checkOut: "05:12 PM", hoursWorked: "8h 24m", status: "present" },
      { date: "2026-06-03", checkIn: "09:20 AM", checkOut: "05:00 PM", hoursWorked: "7h 40m", status: "late" },
      { date: "2026-06-04", checkIn: "08:55 AM", checkOut: "05:30 PM", hoursWorked: "8h 35m", status: "present" },
      { date: "2026-06-05", checkIn: "-", checkOut: "-", hoursWorked: "0h 0m", status: "on_leave" },
      { date: "2026-06-08", checkIn: "08:42 AM", checkOut: "05:18 PM", hoursWorked: "8h 36m", status: "present" },
      { date: "2026-06-09", checkIn: "08:55 AM", checkOut: "05:10 PM", hoursWorked: "8h 15m", status: "present" },
      { date: "2026-06-10", checkIn: "09:15 AM", checkOut: "05:15 PM", hoursWorked: "8h 00m", status: "late" },
      { date: "2026-06-11", checkIn: "08:45 AM", checkOut: "04:50 PM", hoursWorked: "8h 05m", status: "present" },
      { date: "2026-06-12", checkIn: "09:05 AM", checkOut: "05:30 PM", hoursWorked: "8h 25m", status: "present" },
    ],
    monthlyStats: {
      totalDays: 22,
      present: 16,
      late: 3,
      absent: 0,
      onLeave: 2,
      halfDays: 1,
      avgHoursWorked: "7.9h",
    },
  };
}
