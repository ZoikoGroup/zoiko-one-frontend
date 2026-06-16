import { useState } from "react";
import { NavLink } from "react-router-dom";
import { MapPin, Building2, Clock, Users } from "lucide-react";
import HRPage from "../../../components/HRPage";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/recruitment" },
  { label: "Job Requisitions", href: "/zoiko-hr/recruitment/job-requisitions" },
  { label: "Open Positions", href: "/zoiko-hr/recruitment/open-positions" },
  { label: "Candidates", href: "/zoiko-hr/recruitment/candidates" },
  { label: "Interview Pipeline", href: "/zoiko-hr/recruitment/interview-pipeline" },
  { label: "Offer Management", href: "/zoiko-hr/recruitment/offers" },
  { label: "Hiring Schedule", href: "/zoiko-hr/recruitment/hiring-schedule" },
  { label: "Analytics", href: "/zoiko-hr/recruitment/analytics" },
  { label: "Reports", href: "/zoiko-hr/recruitment/reports" },
  { label: "Settings", href: "/zoiko-hr/recruitment/settings" },
];

const jobs = [
  { id: 1, title: "Senior Frontend Developer", department: "Engineering", location: "San Francisco, CA", openings: 2, priority: "high", status: "open", createdDate: "2025-03-15" },
  { id: 2, title: "Backend Engineer", department: "Engineering", location: "Remote", openings: 3, priority: "urgent", status: "open", createdDate: "2025-03-20" },
  { id: 3, title: "Product Designer", department: "Design", location: "New York, NY", openings: 1, priority: "medium", status: "open", createdDate: "2025-03-22" },
  { id: 4, title: "DevOps Engineer", department: "Engineering", location: "Remote", openings: 2, priority: "high", status: "open", createdDate: "2025-03-10" },
  { id: 5, title: "Product Manager", department: "Product", location: "San Francisco, CA", openings: 1, priority: "high", status: "open", createdDate: "2025-03-28" },
  { id: 6, title: "Data Analyst", department: "Data", location: "Chicago, IL", openings: 1, priority: "medium", status: "draft", createdDate: "2025-03-25" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/recruitment"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${isActive ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`
          }>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const m = { open: "bg-green-100 text-green-800", draft: "bg-gray-100 text-gray-800", high: "bg-red-100 text-red-800", urgent: "bg-red-100 text-red-800", medium: "bg-yellow-100 text-yellow-800" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${m[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

export default function OpenPositions() {
  const open = jobs.filter((j) => j.status === "open" || j.status === "draft");

  return (
    <HRPage title="Open Positions" subtitle="View and apply to current openings">
      <SubNav />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Open Positions</h1>
          <p className="text-sm text-gray-500 mt-1">{open.length} positions currently open</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {open.map((job) => (
            <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{job.title}</h3>
                <StatusBadge status={job.priority} />
              </div>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2"><Building2 className="w-4 h-4" /> {job.department}</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {job.location}</div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4" /> {job.openings} openings</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Created {job.createdDate}</div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 px-3 py-1.5 bg-orange-600 text-white rounded-lg text-xs font-medium hover:bg-orange-700">Apply Now</button>
                <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HRPage>
  );
}
