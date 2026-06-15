import { useState } from "react";
import { Search, Calendar, MapPin, User, Briefcase, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "../utils/helpers";

const scheduleData = [
  { id: 1, candidate: "Alice Johnson", position: "Senior Frontend Dev", type: "Technical Interview", date: "2025-04-01", time: "10:00 AM", duration: "60 min", interviewer: "Mike Chen", location: "Room 301 / Zoom", status: "confirmed" },
  { id: 2, candidate: "Bob Smith", position: "Backend Engineer", type: "Phone Screen", date: "2025-04-01", time: "2:00 PM", duration: "30 min", interviewer: "Sarah Lee", location: "Phone Call", status: "confirmed" },
  { id: 3, candidate: "Carol Davis", position: "Product Designer", type: "Portfolio Review", date: "2025-04-02", time: "11:00 AM", duration: "90 min", interviewer: "Tom Wilson", location: "Room 205", status: "pending" },
  { id: 4, candidate: "David Lee", position: "DevOps Engineer", type: "Technical Interview", date: "2025-04-02", time: "3:30 PM", duration: "60 min", interviewer: "Jane Park", location: "Teams Call", status: "confirmed" },
  { id: 5, candidate: "Eva Martinez", position: "Senior Frontend Dev", type: "Final Panel", date: "2025-04-03", time: "9:00 AM", duration: "120 min", interviewer: "Panel (5)", location: "Boardroom", status: "confirmed" },
  { id: 6, candidate: "Frank Wilson", position: "Data Analyst", type: "Phone Screen", date: "2025-04-03", time: "1:00 PM", duration: "30 min", interviewer: "Lisa Brown", location: "Phone Call", status: "pending" },
  { id: 7, candidate: "Grace Kim", position: "Backend Engineer", type: "System Design", date: "2025-04-04", time: "10:30 AM", duration: "90 min", interviewer: "Alex Rivera", location: "Room 302", status: "confirmed" },
  { id: 8, candidate: "Henry Brown", position: "Product Manager", type: "Cultural Fit", date: "2025-04-04", time: "2:00 PM", duration: "45 min", interviewer: "Emily Clark", location: "Cafe Area", status: "completed" },
  { id: 9, candidate: "Ivy Wang", position: "QA Engineer", type: "Technical Interview", date: "2025-04-05", time: "11:00 AM", duration: "60 min", interviewer: "Mike Chen", location: "Zoom", status: "pending" },
  { id: 10, candidate: "Jack Turner", position: "Data Analyst", type: "Case Study", date: "2025-04-05", time: "3:00 PM", duration: "60 min", interviewer: "Lisa Brown", location: "Room 205", status: "confirmed" },
];

export default function HiringSchedule() {
  const [search, setSearch] = useState("");
  const [currentWeek, setCurrentWeek] = useState(0);

  const filtered = search
    ? scheduleData.filter((s) => s.candidate.toLowerCase().includes(search.toLowerCase()) || s.position.toLowerCase().includes(search.toLowerCase()))
    : scheduleData;

  const getDayEvents = (date) => filtered.filter((s) => s.date === date);

  const weekDates = ["2025-04-01", "2025-04-02", "2025-04-03", "2025-04-04", "2025-04-05"];
  const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hiring Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">Weekly interview and hiring event calendar</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 w-64" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium">
            <Calendar className="w-4 h-4" /> New Event
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Week Calendar</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentWeek((w) => w - 1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-600">Week of Apr 1</span>
            <button onClick={() => setCurrentWeek((w) => w + 1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {weekDates.map((date, idx) => (
            <div key={date} className="border border-gray-200 rounded-lg min-h-[300px]">
              <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 rounded-t-lg">
                <p className="text-xs font-medium text-gray-500">{weekLabels[idx]}</p>
                <p className="text-lg font-bold text-gray-900">{date.split("-")[2]}</p>
              </div>
              <div className="p-2 space-y-2">
                {getDayEvents(date).map((event) => (
                  <div key={event.id} className={`p-2 rounded-lg border text-xs ${
                    event.status === "confirmed" ? "border-orange-200 bg-orange-50" :
                    event.status === "completed" ? "border-green-200 bg-green-50" :
                    "border-gray-200 bg-gray-50"
                  }`}>
                    <p className="font-medium text-gray-900 truncate">{event.candidate}</p>
                    <p className="text-gray-500 truncate">{event.type}</p>
                    <div className="flex items-center gap-1 mt-1 text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{event.location.split("/")[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Candidate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Position</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Interviewer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Location</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event) => (
                <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4"><div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /><span className="font-medium text-gray-900">{event.candidate}</span></div></td>
                  <td className="py-3 px-4 text-gray-600">{event.position}</td>
                  <td className="py-3 px-4 text-gray-600">{event.type}</td>
                  <td className="py-3 px-4 text-gray-600">{formatDate(event.date)}</td>
                  <td className="py-3 px-4 flex items-center gap-1 text-gray-600"><Clock className="w-3 h-3" />{event.time}</td>
                  <td className="py-3 px-4 text-gray-600">{event.interviewer}</td>
                  <td className="py-3 px-4 text-gray-600">{event.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
