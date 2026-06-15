export function getDailyRecords() {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  return [
    { id: 1, employee: "Alice Johnson", department: "Engineering", date: today, checkIn: `${today}T08:55:00`, checkOut: `${today}T17:30:00`, hoursWorked: "8.6", status: "present", notes: "" },
    { id: 2, employee: "Bob Smith", department: "Marketing", date: today, checkIn: `${today}T09:15:00`, checkOut: `${today}T18:00:00`, hoursWorked: "8.8", status: "late", notes: "Traffic delay" },
    { id: 3, employee: "Carol Davis", department: "Sales", date: today, checkIn: "", checkOut: "", hoursWorked: "0", status: "absent", notes: "Sick leave" },
    { id: 4, employee: "David Lee", department: "Engineering", date: today, checkIn: `${today}T08:30:00`, checkOut: `${today}T17:00:00`, hoursWorked: "8.5", status: "present", notes: "" },
    { id: 5, employee: "Eve Wilson", department: "HR", date: today, checkIn: `${today}T09:00:00`, checkOut: `${today}T17:30:00`, hoursWorked: "8.5", status: "present", notes: "" },
    { id: 6, employee: "Frank Brown", department: "Finance", date: today, checkIn: "", checkOut: "", hoursWorked: "0", status: "on_leave", notes: "Annual leave" },
    { id: 7, employee: "Grace Taylor", department: "Engineering", date: today, checkIn: `${today}T08:45:00`, checkOut: `${today}T17:15:00`, hoursWorked: "8.5", status: "present", notes: "" },
    { id: 8, employee: "Henry Martinez", department: "Sales", date: today, checkIn: `${today}T09:30:00`, checkOut: `${today}T18:30:00`, hoursWorked: "9.0", status: "late", notes: "Doctor appointment" },
    { id: 9, employee: "Ivy Anderson", department: "Marketing", date: today, checkIn: `${today}T08:00:00`, checkOut: `${today}T16:30:00`, hoursWorked: "8.5", status: "present", notes: "" },
    { id: 10, employee: "Jack Thomas", department: "Engineering", date: yesterday, checkIn: `${yesterday}T09:00:00`, checkOut: `${yesterday}T17:00:00`, hoursWorked: "8.0", status: "present", notes: "" },
    { id: 11, employee: "Kate White", department: "HR", date: yesterday, checkIn: `${yesterday}T08:30:00`, checkOut: `${yesterday}T17:30:00`, hoursWorked: "9.0", status: "present", notes: "" },
    { id: 12, employee: "Leo Garcia", department: "Finance", date: yesterday, checkIn: "", checkOut: "", hoursWorked: "0", status: "wfh", notes: "Working from home" },
  ];
}
