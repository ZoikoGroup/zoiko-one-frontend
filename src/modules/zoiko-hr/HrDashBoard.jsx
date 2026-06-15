import {
  Users,
  UserCheck,
  Calendar,
  Briefcase,
  Clock,
  TrendingUp,
  Bell,
} from "lucide-react";

export default function ZoikoHRModule() {
  const stats = [
    {
      title: "Total Employees",
      value: "1,248",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Present Today",
      value: "1,180",
      icon: UserCheck,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "On Leave",
      value: "42",
      icon: Calendar,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Open Positions",
      value: "18",
      icon: Briefcase,
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="bg-transparent text-slate-800 p-6 font-sans">
      {/* Header */}
      <div className="mb-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#FF6B00]/10 via-[#FF8C38]/5 to-transparent border border-[#FF6B00]/15 p-8 shadow-[0_4px_20px_rgba(255,107,0,0.02)]">
          <h1 className="text-4xl font-extrabold text-slate-850">Zoiko HR</h1>
          <p className="mt-2 text-slate-650 text-lg max-w-3xl">
            Manage workforce, attendance, leaves, recruitment and employee
            engagement from one unified platform.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-[#FF6B00]/40 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-500 text-sm font-medium">{item.title}</p>
                <h2 className="text-3xl font-extrabold text-slate-800 mt-2">{item.value}</h2>
              </div>

              <div
                className={`h-14 w-14 rounded-2xl bg-gradient-to-r ${item.color} text-white flex items-center justify-center`}
              >
                <item.icon size={26} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid xl:grid-cols-3 gap-6 mt-8">
        {/* Attendance */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              Attendance Overview
            </h2>
            <Clock className="text-[#FF6B00]" />
          </div>

          <div className="space-y-5">
            {[
              { name: "Present", value: "94%" },
              { name: "Remote", value: "22%" },
              { name: "On Leave", value: "3%" },
              { name: "Absent", value: "1%" },
            ].map((item) => (
              <div key={item.name} className="text-sm font-medium text-slate-700">
                <div className="flex justify-between mb-2">
                  <span>{item.name}</span>
                  <span className="text-slate-900 font-semibold">{item.value}</span>
                </div>

                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF8C38] rounded-full"
                    style={{ width: item.value }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="text-amber-500" />
            <h2 className="text-xl font-bold text-slate-800">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-100 text-slate-700 rounded-xl p-4 text-sm font-medium">
              Payroll processing scheduled tomorrow.
            </div>

            <div className="bg-slate-50 border border-slate-100 text-slate-700 rounded-xl p-4 text-sm font-medium">
              12 leave requests awaiting approval.
            </div>

            <div className="bg-slate-50 border border-slate-100 text-slate-700 rounded-xl p-4 text-sm font-medium">
              New employee onboarding this week.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        {/* Recruitment */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Recruitment Pipeline
          </h2>

          <div className="space-y-4 text-sm font-medium text-slate-700">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span>Applications</span>
              <span className="text-slate-950 font-semibold">245</span>
            </div>

            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span>Interviews</span>
              <span className="text-slate-950 font-semibold">48</span>
            </div>

            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span>Offers</span>
              <span className="text-slate-950 font-semibold">12</span>
            </div>

            <div className="flex justify-between pt-1">
              <span>Hired</span>
              <span className="text-slate-950 font-bold text-[#FF6B00]">8</span>
            </div>
          </div>
        </div>

        {/* Holidays */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Upcoming Holidays
          </h2>

          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm font-medium text-slate-700">
              Independence Day — Aug 15
            </div>

            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm font-medium text-slate-700">
              Gandhi Jayanti — Oct 2
            </div>

            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm font-medium text-slate-700">
              Diwali — Nov 12
            </div>
          </div>
        </div>

        {/* Activities */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-emerald-500" />
            <h2 className="text-xl font-bold text-slate-800">
              Recent Activities
            </h2>
          </div>

          <div className="space-y-4 text-sm font-medium text-slate-750">
            <div className="border-l-2 border-indigo-500 pl-4">
              Employee onboarding completed.
            </div>

            <div className="border-l-2 border-emerald-500 pl-4">
              Attendance synced successfully.
            </div>

            <div className="border-l-2 border-pink-500 pl-4">
              Leave request approved.
            </div>

            <div className="border-l-2 border-amber-500 pl-4">
              New recruitment campaign launched.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}