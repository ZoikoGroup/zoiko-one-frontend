import { useState } from "react";
import {
  User, Briefcase, MapPin, Calendar, Mail, Phone, Building2,
  Clock, Users, ChevronRight, Shield
} from "lucide-react";

const employee = {
  name: "Arjun Mehta",
  title: "Senior Software Engineer",
  department: "Engineering",
  employeeId: "EMP-20241087",
  dateOfJoining: "March 12, 2021",
  avatar: null,
  email: "arjun.mehta@company.com",
  personalEmail: "arjun.mehta@gmail.com",
  phone: "+91 98765 43210",
  dob: "July 14, 1993",
  gender: "Male",
  address: "42, Jubilee Hills, Hyderabad, Telangana - 500033",
  manager: "Priya Sharma",
  workLocation: "Hyderabad HQ",
  employmentType: "Full-time",
  shiftTiming: "9:00 AM – 6:00 PM IST",
  emergencyContact: { name: "Sunita Mehta", relation: "Spouse", phone: "+91 94456 78901" },
};

const TABS = ["Personal Details", "Work Details"];

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
    <div className="mt-0.5 p-1.5 rounded-lg bg-indigo-50">
      <Icon size={15} className="text-indigo-500" />
    </div>
    <div>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm text-slate-800 font-medium mt-0.5">{value}</p>
    </div>
  </div>
);

export default function EmployeeProfile() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Employees</p>
          <h1 className="text-2xl font-bold text-slate-800 mt-1">Employee Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-lg mb-4">
                <span className="text-3xl font-bold text-white">
                  {employee.name.split(" ").map(n => n[0]).join("")}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-800">{employee.name}</h2>
              <p className="text-sm text-indigo-600 font-medium mt-0.5">{employee.title}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                <Building2 size={12} /> {employee.department}
              </span>

              <div className="w-full mt-5 pt-5 border-t border-slate-100 space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium">Employee ID</span>
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{employee.employeeId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium">Joined</span>
                  <span className="text-xs font-semibold text-slate-700">{employee.dateOfJoining}</span>
                </div>
              </div>
            </div>

            {/* Quick Emergency Contact */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} className="text-red-500" />
                <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Emergency Contact</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">{employee.emergencyContact.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{employee.emergencyContact.relation}</p>
              <p className="text-xs text-slate-600 font-medium mt-1">{employee.emergencyContact.phone}</p>
            </div>
          </aside>

          {/* Main Content */}
          <main className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-100">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                    activeTab === i
                      ? "text-indigo-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab}
                  {activeTab === i && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-t" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 0 ? (
                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <div>
                      <InfoRow icon={User} label="Full Name" value={employee.name} />
                      <InfoRow icon={Mail} label="Personal Email" value={employee.personalEmail} />
                      <InfoRow icon={Phone} label="Contact Number" value={employee.phone} />
                    </div>
                    <div>
                      <InfoRow icon={Calendar} label="Date of Birth" value={employee.dob} />
                      <InfoRow icon={User} label="Gender" value={employee.gender} />
                      <InfoRow icon={MapPin} label="Permanent Address" value={employee.address} />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Work Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <div>
                      <InfoRow icon={Users} label="Reporting Manager" value={employee.manager} />
                      <InfoRow icon={MapPin} label="Work Location" value={employee.workLocation} />
                    </div>
                    <div>
                      <InfoRow icon={Briefcase} label="Employment Type" value={employee.employmentType} />
                      <InfoRow icon={Clock} label="Shift Timing" value={employee.shiftTiming} />
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wide">Company Email</p>
                      <p className="text-sm font-semibold text-slate-800 mt-0.5">{employee.email}</p>
                    </div>
                    <ChevronRight size={16} className="text-indigo-300" />
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}