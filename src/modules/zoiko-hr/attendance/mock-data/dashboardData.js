export function getAttendanceDashboard() {
  return {
    stats: {
      present: 42,
      absent: 5,
      late: 3,
      onLeave: 4,
      wfh: 6,
      totalEmployees: 60,
    },
    todaySummary: {
      date: new Date().toISOString().split("T")[0],
      checkIns: 48,
      onTime: 42,
      late: 3,
      absent: 5,
    },
    weeklyTrend: [
      { day: "Mon", present: 45, absent: 3 },
      { day: "Tue", present: 48, absent: 2 },
      { day: "Wed", present: 42, absent: 5 },
      { day: "Thu", present: 47, absent: 4 },
      { day: "Fri", present: 44, absent: 6 },
      { day: "Sat", present: 20, absent: 30 },
      { day: "Sun", present: 0, absent: 50 },
    ],
    departmentStats: [
      { dept: "Engineering", present: 15, absent: 1, late: 1 },
      { dept: "Marketing", present: 8, absent: 0, late: 1 },
      { dept: "Sales", present: 10, absent: 2, late: 0 },
      { dept: "HR", present: 4, absent: 1, late: 0 },
      { dept: "Finance", present: 5, absent: 1, late: 1 },
    ],
  };
}
