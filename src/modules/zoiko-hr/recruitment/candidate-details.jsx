import { useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, ExternalLink } from "lucide-react";
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

const allCandidates = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", phone: "+1 (555) 234-5678", position: "Senior Frontend Dev", status: "interviewed", appliedDate: "2025-03-20", source: "LinkedIn", location: "San Francisco, CA", experience: 6 },
  { id: 2, name: "Bob Smith", email: "bob@example.com", phone: "+1 (555) 345-6789", position: "Backend Engineer", status: "screening", appliedDate: "2025-03-22", source: "Referral", location: "Remote", experience: 4 },
  { id: 3, name: "Carol Davis", email: "carol@example.com", phone: "+1 (555) 456-7890", position: "Product Designer", status: "new", appliedDate: "2025-03-25", source: "Indeed", location: "New York, NY", experience: 5 },
  { id: 4, name: "David Lee", email: "david@example.com", phone: "+1 (555) 567-8901", position: "DevOps Engineer", status: "interviewed", appliedDate: "2025-03-18", source: "LinkedIn", location: "Remote", experience: 7 },
  { id: 5, name: "Eva Martinez", email: "eva@example.com", phone: "+1 (555) 678-9012", position: "Senior Frontend Dev", status: "offered", appliedDate: "2025-03-15", source: "Company Site", location: "Austin, TX", experience: 8 },
  { id: 6, name: "Frank Wilson", email: "frank@example.com", phone: "+1 (555) 789-0123", position: "Data Analyst", status: "screening", appliedDate: "2025-03-28", source: "Indeed", location: "Chicago, IL", experience: 3 },
  { id: 7, name: "Grace Kim", email: "grace@example.com", phone: "+1 (555) 890-1234", position: "Backend Engineer", status: "hired", appliedDate: "2025-03-10", source: "Referral", location: "Remote", experience: 5 },
  { id: 8, name: "Henry Brown", email: "henry@example.com", phone: "+1 (555) 901-2345", position: "Product Manager", status: "rejected", appliedDate: "2025-03-05", source: "LinkedIn", location: "Seattle, WA", experience: 10 },
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
  const m = { new: "bg-blue-100 text-blue-800", screening: "bg-yellow-100 text-yellow-800", interviewed: "bg-purple-100 text-purple-800", offered: "bg-orange-100 text-orange-800", hired: "bg-green-100 text-green-800", rejected: "bg-red-100 text-red-800" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${m[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try { return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return dateStr; }
}

export default function CandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const candidate = allCandidates.find((c) => c.id === Number(id));

  if (!candidate) {
    return (
      <HRPage title="Candidate Details" subtitle="View candidate information">
        <SubNav />
        <div className="p-6 text-gray-400">Candidate not found</div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Candidate Details" subtitle="View candidate information">
      <SubNav />
      <div className="max-w-3xl space-y-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4" /> Back to Candidates
        </button>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
              <p className="text-gray-500 mt-1">{candidate.position}</p>
            </div>
            <StatusBadge status={candidate.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-gray-600"><Mail className="w-4 h-4 text-gray-400" /> {candidate.email}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600"><Phone className="w-4 h-4 text-gray-400" /> {candidate.phone}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600"><MapPin className="w-4 h-4 text-gray-400" /> {candidate.location}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600"><Calendar className="w-4 h-4 text-gray-400" /> Applied {formatDate(candidate.appliedDate)}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600"><Briefcase className="w-4 h-4 text-gray-400" /> {candidate.experience} years experience</div>
            <div className="flex items-center gap-2 text-sm text-gray-600"><ExternalLink className="w-4 h-4 text-gray-400" /> Source: {candidate.source}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
              <div><p className="text-sm font-medium text-gray-900">Applied for position</p><p className="text-xs text-gray-400">{formatDate(candidate.appliedDate)}</p></div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500" />
              <div><p className="text-sm font-medium text-gray-900">Under review by hiring manager</p><p className="text-xs text-gray-400">Pending</p></div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-gray-300" />
              <div><p className="text-sm font-medium text-gray-400">Interview scheduled</p><p className="text-xs text-gray-400">Not yet</p></div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700">Schedule Interview</button>
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Send Message</button>
          <button className="px-4 py-2 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">Reject</button>
        </div>
      </div>
    </HRPage>
  );
}
