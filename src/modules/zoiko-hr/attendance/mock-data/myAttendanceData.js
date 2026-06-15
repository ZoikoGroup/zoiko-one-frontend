export function getMyAttendance() {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const d2 = new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0];
  const d3 = new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0];
  const d4 = new Date(Date.now() - 4 * 86400000).toISOString().split("T")[0];
  const d5 = new Date(Date.now() - 5 * 86400000).toISOString().split("T")[0];
  const d6 = new Date(Date.now() - 6 * 86400000).toISOString().split("T")[0];

  return {
    today: {
      checkedIn: true,
      checkedOut: false,
      checkInTime: `${today}T09:00:00`,
      checkOutTime: null,
      status: "present",
      hoursWorked: "0",
    },
    summary: {
      present: 18,
      absent: 1,
      late: 2,
      wfh: 0,
      total: 22,
    },
    recentRecords: [
      { date: today, checkIn: `${today}T09:00:00`, checkOut: null, hours: "0", status: "present" },
      { date: yesterday, checkIn: `${yesterday}T08:55:00`, checkOut: `${yesterday}T17:30:00`, hours: "8.6", status: "present" },
      { date: d2, checkIn: `${d2}T09:15:00`, checkOut: `${d2}T17:45:00`, hours: "8.5", status: "late" },
      { date: d3, checkIn: `${d3}T09:00:00`, checkOut: `${d3}T17:00:00`, hours: "8.0", status: "present" },
      { date: d4, checkIn: `${d4}T08:45:00`, checkOut: `${d4}T17:15:00`, hours: "8.5", status: "present" },
      { date: d5, checkIn: "", checkOut: "", hours: "0", status: "absent" },
      { date: d6, checkIn: `${d6}T09:00:00`, checkOut: `${d6}T17:30:00`, hours: "8.5", status: "present" },
    ],
  };
}
