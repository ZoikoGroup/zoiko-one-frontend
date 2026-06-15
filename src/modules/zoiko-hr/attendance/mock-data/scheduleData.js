export function getSchedule() {
  const today = new Date().toISOString().split("T")[0];
  return {
    shifts: [
      { id: 1, name: "Morning Shift", startTime: "08:00", endTime: "16:00", department: "Engineering" },
      { id: 2, name: "Afternoon Shift", startTime: "14:00", endTime: "22:00", department: "Engineering" },
      { id: 3, name: "General Shift", startTime: "09:00", endTime: "18:00", department: "Marketing" },
      { id: 4, name: "Night Shift", startTime: "22:00", endTime: "06:00", department: "Support" },
      { id: 5, name: "Flexible Shift", startTime: "07:00", endTime: "15:00", department: "Sales" },
    ],
    assignments: [
      { id: 1, employee: "Alice Johnson", shift: "Morning Shift", date: today, department: "Engineering" },
      { id: 2, employee: "Bob Smith", shift: "General Shift", date: today, department: "Marketing" },
      { id: 3, employee: "Carol Davis", shift: "Flexible Shift", date: today, department: "Sales" },
      { id: 4, employee: "David Lee", shift: "Morning Shift", date: today, department: "Engineering" },
      { id: 5, employee: "Eve Wilson", shift: "General Shift", date: today, department: "HR" },
      { id: 6, employee: "Frank Brown", shift: "Morning Shift", date: today, department: "Finance" },
      { id: 7, employee: "Grace Taylor", shift: "Afternoon Shift", date: today, department: "Engineering" },
      { id: 8, employee: "Henry Martinez", shift: "Flexible Shift", date: today, department: "Sales" },
    ],
  };
}
