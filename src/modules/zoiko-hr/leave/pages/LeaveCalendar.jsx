import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FilterBar from "../components/FilterBar";
import { useLeaveCalendar } from "../hooks/useLeave";
import { LEAVE_TYPE } from "../types";

const deptOptions = [
  { value: "Engineering", label: "Engineering" },
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
  { value: "HR", label: "HR" },
  { value: "Finance", label: "Finance" },
];

const typeOptions = Object.entries(LEAVE_TYPE).map(([k, v]) => ({ value: v, label: k.charAt(0) + k.slice(1).toLowerCase() }));

const typeColors = {
  annual: "bg-blue-500", sick: "bg-pink-500", casual: "bg-orange-500", earned: "bg-teal-500",
  maternity: "bg-purple-500", paternity: "bg-indigo-500", unpaid: "bg-gray-500", study: "bg-cyan-500", emergency: "bg-red-500",
};

const typeLabels = {
  annual: "Annual", sick: "Sick", casual: "Casual", earned: "Earned",
  maternity: "Maternity", paternity: "Paternity", unpaid: "Unpaid", study: "Study", emergency: "Emergency",
};

export default function LeaveCalendar() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [filters, setFilters] = useState({});
  const { data, loading } = useLeaveCalendar(filters);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayLeaves = data.filter((l) => {
        return dateStr >= l.start_date && dateStr <= l.end_date;
      });
      days.push({ date: d, dateStr, leaves: dayLeaves });
    }
    return days;
  }, [data, currentYear, currentMonth, daysInMonth, firstDayOfWeek]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  };

  if (loading) return <div className="p-6 text-gray-400">Loading calendar...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leave Calendar</h1>
        <p className="text-sm text-gray-500 mt-1">Team leave calendar view</p>
      </div>

      <FilterBar
        search=""
        onSearchChange={() => {}}
        filters={[
          { key: "department", value: filters.department || "", placeholder: "All Departments", options: deptOptions },
          { key: "leave_type", value: filters.leave_type || "", placeholder: "All Leave Types", options: typeOptions },
        ]}
        onFilterChange={handleFilterChange}
      />

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">{monthNames[currentMonth]} {currentYear}</h2>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="bg-gray-50 px-2 py-2 text-center text-xs font-semibold text-gray-500 uppercase">
              {day}
            </div>
          ))}
          {calendarDays.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} className="bg-white min-h-[100px] p-1" />;
            const isToday = day.date === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            return (
              <div key={day.date} className={`bg-white min-h-[100px] p-1 ${isToday ? "ring-2 ring-teal-500 ring-inset" : ""}`}>
                <div className="text-xs font-medium text-gray-500 mb-1">{day.date}</div>
                <div className="space-y-0.5">
                  {day.leaves.slice(0, 3).map((l) => (
                    <div
                      key={l.id}
                      title={`${l.employee_name} - ${l.leave_type}`}
                      className={`text-[10px] leading-tight px-1 py-0.5 rounded text-white truncate ${typeColors[l.leave_type] || "bg-gray-400"}`}
                    >
                      {l.employee_name.split(" ")[0]}
                    </div>
                  ))}
                  {day.leaves.length > 3 && (
                    <div className="text-[10px] text-gray-400 font-medium px-1">+{day.leaves.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <span className="text-xs font-medium text-gray-500 mr-1">Legend:</span>
          {Object.entries(typeLabels).map(([type, label]) => (
            <span key={type} className="flex items-center gap-1 text-xs text-gray-600">
              <span className={`w-2.5 h-2.5 rounded ${typeColors[type]}`} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
