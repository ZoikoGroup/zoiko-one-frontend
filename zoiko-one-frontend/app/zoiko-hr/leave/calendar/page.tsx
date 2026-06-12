"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import { fetchLeaveCalendar, type CalendarEvent } from "../../../lib/workforce-api";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function LeaveCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const startDate = new Date(year, month, 1).toISOString();
  const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

  useEffect(() => {
    setLoaded(false);
    fetchLeaveCalendar({ startDate, endDate })
      .then((res) => { setEvents(res); setLoaded(true); })
      .catch(() => { setLoaded(true); });
  }, [startDate, endDate]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const eventsByDate = new Map<string, CalendarEvent[]>();
  events.forEach((e) => {
    const start = new Date(e.start);
    const end = new Date(e.end);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split("T")[0];
      if (!eventsByDate.has(key)) eventsByDate.set(key, []);
      eventsByDate.get(key)!.push(e);
    }
  });

  const today = new Date().toISOString().split("T")[0];

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return eventsByDate.get(dateStr) ?? [];
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "SUBMITTED": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "IN_PROGRESS": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default: return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <SuperAdminShell>
      <PageHeader title="Leave Calendar" description="View leave requests across the organization." />

      <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between mb-6">
          <button type="button" onClick={prevMonth} className="rounded-3xl border border-slate-800 bg-slate-950 p-2 text-slate-300 transition hover:bg-slate-900">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold text-white">{MONTHS[month]} {year}</h2>
          <button type="button" onClick={nextMonth} className="rounded-3xl border border-slate-800 bg-slate-950 p-2 text-slate-300 transition hover:bg-slate-900">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-slate-800 rounded-2xl overflow-hidden">
          {DAYS.map((d) => (
            <div key={d} className="bg-slate-950 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">{d}</div>
          ))}
          {Array.from({ length: startPad }).map((_, i) => (
            <div key={`pad-${i}`} className="bg-[#0b1220] min-h-[120px] p-2" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayEvents = getEventsForDay(day);
            const isToday = dateStr === today;
            return (
              <div key={day} className={`bg-[#0b1220] min-h-[120px] p-2 transition hover:bg-slate-950/50 ${isToday ? "ring-1 ring-indigo-500" : ""}`}>
                <div className={`text-sm font-medium mb-1 ${isToday ? "text-indigo-400" : "text-slate-400"}`}>{day}</div>
                <div className="space-y-0.5 max-h-[80px] overflow-y-auto">
                  {dayEvents.slice(0, 3).map((e) => (
                    <Link key={e.id} href={`/zoiko-hr/leave/requests/${e.id}`}
                      className={`block truncate rounded-md border px-1.5 py-0.5 text-[10px] leading-tight transition ${statusColor(e.status)} hover:opacity-80`}>
                      {e.employeeName.split(" ")[0]} - {e.leaveTypeCode}
                    </Link>
                  ))}
                  {dayEvents.length > 3 && (
                    <p className="text-[10px] text-slate-500 pl-1">+{dayEvents.length - 3} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SuperAdminShell>
  );
}
