"use client";

import { useState } from "react";
import { Plus, Search, X, Briefcase, MapPin, Calendar, Users, Edit3, Trash2 } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { initialJobs, type Job } from "../mockData";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    department: "Engineering",
    location: "",
    type: "Full-Time",
    status: "Active" as "Active" | "Closed" | "Draft",
    description: "",
    requirements: ""
  });

  const handleOpenAdd = () => {
    setFormData({
      title: "",
      department: "Engineering",
      location: "",
      type: "Full-Time",
      status: "Active",
      description: "",
      requirements: ""
    });
    setEditingJob(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      status: job.status,
      description: job.description,
      requirements: job.requirements.join(", ")
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      setJobs(jobs.filter((j) => j.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedReqs = formData.requirements
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    if (editingJob) {
      setJobs(
        jobs.map((j) =>
          j.id === editingJob.id
            ? {
                ...j,
                title: formData.title,
                department: formData.department,
                location: formData.location,
                type: formData.type,
                status: formData.status as any,
                description: formData.description,
                requirements: parsedReqs
              }
            : j
        )
      );
    } else {
      const newJob: Job = {
        id: `job-${Date.now()}`,
        title: formData.title,
        department: formData.department,
        location: formData.location,
        type: formData.type,
        status: formData.status as any,
        applicantsCount: 0,
        datePosted: new Date().toISOString().split("T")[0],
        description: formData.description,
        requirements: parsedReqs
      };
      setJobs([newJob, ...jobs]);
    }
    setShowAddModal(false);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === "All" || job.department === deptFilter;
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === "Active").length;
  const draftJobs = jobs.filter((j) => j.status === "Draft").length;
  const closedJobs = jobs.filter((j) => j.status === "Closed").length;

  return (
    <SuperAdminShell>
      <PageHeader
        title="Jobs"
        description="Manage corporate job postings and active listings."
        action={
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" /> Add Job
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Total Postings</p>
          <h3 className="mt-2 text-3xl font-bold text-white">{totalJobs}</h3>
          <p className="mt-1 text-xs text-slate-400">Across all departments</p>
        </div>
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Active Openings</p>
          <h3 className="mt-2 text-3xl font-bold text-emerald-400">{activeJobs}</h3>
          <p className="mt-1 text-xs text-slate-400">Currently accepting applications</p>
        </div>
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Drafts</p>
          <h3 className="mt-2 text-3xl font-bold text-amber-400">{draftJobs}</h3>
          <p className="mt-1 text-xs text-slate-400">Under review or pending posting</p>
        </div>
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Closed Roles</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-400">{closedJobs}</h3>
          <p className="mt-1 text-xs text-slate-400">Hires successfully placed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by title, description or requirements..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
            />
          </div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Job Postings Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredJobs.length === 0 ? (
          <div className="col-span-2 rounded-[28px] border border-dashed border-slate-800 p-12 text-center text-slate-400">
            No job postings found matching the selected filters.
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="relative flex flex-col justify-between rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-md transition hover:border-slate-700"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded-full bg-slate-850 px-3 py-1 text-[10px] uppercase font-semibold text-indigo-400 border border-slate-800">
                      {job.department}
                    </span>
                    <h3 className="mt-3 text-xl font-bold text-white">{job.title}</h3>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                      job.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : job.status === "Draft"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <p className="mt-4 text-sm text-slate-400 line-clamp-3">{job.description}</p>

                <div className="mt-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span>{job.location}</span>
                    <span className="text-slate-650">•</span>
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span>Posted on {job.datePosted}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Users className="h-4 w-4 text-slate-500" />
                    <span>{job.applicantsCount} active applicants</span>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Key Requirements</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {job.requirements.map((req, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-slate-950 border border-slate-800 px-2.5 py-1 text-xs text-slate-300"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(job)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950 px-3.5 text-xs text-slate-300 transition hover:bg-slate-900 hover:text-white"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(job.id)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-850 bg-rose-500/10 px-3.5 text-xs text-rose-300 transition hover:bg-rose-500/20"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Job Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <h3 className="text-lg font-semibold text-white">
                {editingJob ? "Edit Job Posting" : "Create Job Posting"}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Lead React Developer"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-350 outline-none transition focus:border-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Job Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-350 outline-none transition focus:border-indigo-500"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. London, UK (Hybrid)"
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-355 outline-none transition focus:border-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Job Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide a detailed description of the job duties and environment..."
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Key Requirements (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="e.g. 5+ years React experience, Deep knowledge of Next.js"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-850 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-2 text-sm text-slate-300 transition hover:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-3xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  {editingJob ? "Update Posting" : "Create Posting"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
