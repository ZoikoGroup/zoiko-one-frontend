import { useState, useMemo } from "react";
import { useCalendar } from "../hooks/useComply";
import StatsCard from "../components/StatsCard";
import StatusBadge from "../components/StatusBadge";
import { formatDate, daysUntil } from "../utils/helpers";
import { Calendar as CalendarIcon, CalendarDays, CalendarRange, List, FileSearch, ClipboardCheck, Clock, AlertTriangle } from "lucide-react";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function ComplianceCalendar() {
  const { events, summary, loading } = useCalendar();
  const [view, setView] = useState("month");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const eventTypeIcon = (type) => {
    switch (type) {
      case "audit": return <FileSearch className="w-3.5 h-3.5" />;
      case "filing": return <ClipboardCheck className="w-3.5 h-3.5" />;
      case "review": return <Clock className="w-3.5 h-3.5" />;
      case "deadline": return <AlertTriangle className="w-3.5 h-3.5" />;
      default: return <CalendarIcon className="w-3.5 h-3.5" />;
    }
  };

  const monthEvents = useMemo(() => {
    return (events || []).filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [events, currentMonth, currentYear]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  if (loading) return <div className="p-6 text-gray-500">Loading calendar...</div>;

  const navigateMonth = (dir) => {
    if (dir === "prev") {
      if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
      else setCurrentMonth(m => m - 1);
    } else {
      if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
      else setCurrentMonth(m => m + 1);
    }
  };

  const getEventsForDay = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return monthEvents.filter(e => e.date === dateStr || (e.date <= dateStr && e.endDate >= dateStr));
  };

  const upcomingEvents = (events || [])
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compliance Calendar</h1>
        <p className="text-sm text-gray-500 mt-1">Track audits, reviews, filings, deadlines, and obligations</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Events" value={summary?.total || 50} icon={CalendarDays} />
        <StatsCard title="Upcoming (30d)" value={summary?.upcoming || 0} icon={CalendarRange} trend="up" change={10} />
        <StatsCard title="Audits" value={summary?.byType?.audit || 0} icon={FileSearch} />
        <StatsCard title="Overdue" value={summary?.overdue || 0} icon={AlertTriangle} trend="down" change={-5} />
      </div>

      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => setView("month")} className={`px-3 py-1.5 text-sm rounded-lg ${view === "month" ? "bg-emerald-100 text-emerald-700 font-medium" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Month</button>
        <button onClick={() => setView("week")} className={`px-3 py-1.5 text-sm rounded-lg ${view === "week" ? "bg-emerald-100 text-emerald-700 font-medium" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Week</button>
        <button onClick={() => setView("agenda")} className={`px-3 py-1.5 text-sm rounded-lg ${view === "agenda" ? "bg-emerald-100 text-emerald-700 font-medium" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Agenda</button>
      </div>

      {view === "month" && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigateMonth("prev")} className="text-sm text-gray-500 hover:text-gray-700">← {currentMonth === 0 ? "December" : MONTHS[currentMonth - 1]}</button>
            <h3 className="text-base font-semibold text-gray-900">{MONTHS[currentMonth]} {currentYear}</h3>
            <button onClick={() => navigateMonth("next")} className="text-sm text-gray-500 hover:text-gray-700">{currentMonth === 11 ? "January" : MONTHS[currentMonth + 1]} →</button>
          </div>
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="bg-gray-50 px-2 py-1.5 text-xs font-medium text-gray-500 text-center">{d}</div>
            ))}
            {calendarDays.map((day, i) => (
              <div key={i} className={`bg-white min-h-[80px] p-1 ${day ? "" : "bg-gray-50/50"}`}>
                {day && (
                  <>
                    <span className={`text-xs font-medium ${new Date(currentYear, currentMonth, day).toDateString() === new Date().toDateString() ? "bg-emerald-500 text-white w-5 h-5 rounded-full inline-flex items-center justify-center" : "text-gray-700"}`}>{day}</span>
                    <div className="mt-1 space-y-0.5">
                      {getEventsForDay(day).slice(0, 3).map(e => (
                        <div key={e.id} className={`flex items-center gap-1 px-1 py-0.5 rounded text-[10px] ${e.type === "audit" ? "bg-blue-50 text-blue-700" : e.type === "filing" ? "bg-purple-50 text-purple-700" : e.type === "review" ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-700"} truncate`}>
                          {eventTypeIcon(e.type)}
                          <span className="truncate">{e.title}</span>
                        </div>
                      ))}
                      {getEventsForDay(day).length > 3 && <span className="text-[10px] text-gray-400 pl-1">+{getEventsForDay(day).length - 3} more</span>}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "week" && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">This Week's Events</h3>
          <div className="space-y-3">
            {events.filter(e => {
              const d = new Date(e.date);
              const now = new Date();
              const weekStart = new Date(now);
              weekStart.setDate(now.getDate() - now.getDay());
              const weekEnd = new Date(weekStart);
              weekEnd.setDate(weekStart.getDate() + 7);
              return d >= weekStart && d <= weekEnd;
            }).sort((a, b) => new Date(a.date) - new Date(b.date)).map(e => (
              <div key={e.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="p-2 rounded-lg text-gray-400 bg-gray-50">{eventTypeIcon(e.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 text-sm">{e.title}</span>
                    <StatusBadge status={e.type} />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{formatDate(e.date)} {e.endDate !== e.date ? ` - ${formatDate(e.endDate)}` : ""} | {e.owner}</p>
                </div>
                <StatusBadge status={e.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "agenda" && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Upcoming Deadlines & Events</h3>
          <div className="space-y-2">
            {upcomingEvents.map(e => (
              <div key={e.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0 w-12 text-center">
                  <p className="text-lg font-bold text-gray-900">{new Date(e.date).getDate()}</p>
                  <p className="text-xs text-gray-500">{MONTHS[new Date(e.date).getMonth()].slice(0, 3)}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 text-sm">{e.title}</span>
                    <StatusBadge status={e.type} />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{e.owner}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={e.status} />
                  <p className="text-xs text-gray-400 mt-1">
                    {daysUntil(e.date) !== null ? (daysUntil(e.date) === 0 ? "Today" : `${daysUntil(e.date)}d`) : "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
