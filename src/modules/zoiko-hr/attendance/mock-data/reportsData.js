export function getAttendanceReports() {
  return [
    { id: 1, title: "Daily Attendance Summary", description: "Complete attendance record for today", type: "PDF", date: "2025-06-15", size: "1.2 MB" },
    { id: 2, title: "Weekly Attendance Report", description: "Weekly attendance statistics by department", type: "Excel", date: "2025-06-14", size: "890 KB" },
    { id: 3, title: "Monthly Attendance Overview", description: "Monthly trends and attendance percentages", type: "PDF", date: "2025-06-01", size: "2.4 MB" },
    { id: 4, title: "Late Arrivals Report", description: "Employees with late check-ins this month", type: "Excel", date: "2025-06-10", size: "650 KB" },
    { id: 5, title: "Overtime Analysis", description: "Overtime hours by department and employee", type: "PDF", date: "2025-06-05", size: "1.8 MB" },
    { id: 6, title: "Absenteeism Report", description: "Absentee rates and patterns analysis", type: "Excel", date: "2025-05-28", size: "1.1 MB" },
    { id: 7, title: "Department Attendance Comparison", description: "Cross-department attendance metrics", type: "PDF", date: "2025-05-20", size: "3.0 MB" },
    { id: 8, title: "Shift-wise Attendance Report", description: "Attendance broken down by shift type", type: "Excel", date: "2025-05-15", size: "750 KB" },
  ];
}
