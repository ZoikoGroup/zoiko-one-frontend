"use client";

import { useState } from "react";
import { Plus, Search, X, User, Mail, Briefcase, Trash2, Send } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { initialTalentPool, type TalentProfile } from "../mockData";

export default function TalentPoolPage() {
  const [profiles, setProfiles] = useState<TalentProfile[]>(initialTalentPool);
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentRole: "",
    skills: "",
    experienceYears: 1,
    source: "LinkedIn"
  });

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      email: "",
      currentRole: "",
      skills: "",
      experienceYears: 1,
      source: "LinkedIn"
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this profile from the talent pool?")) {
      setProfiles(profiles.filter((p) => p.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsList = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newProfile: TalentProfile = {
      id: `talent-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      currentRole: formData.currentRole,
      skills: skillsList,
      experienceYears: Number(formData.experienceYears),
      source: formData.source
    };

    setProfiles([newProfile, ...profiles]);
    setShowAddModal(false);
  };

  // Get all unique skills for filter dropdown
  const allSkills = Array.from(
    new Set(profiles.flatMap((p) => p.skills))
  );

  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.currentRole.toLowerCase().includes(search.toLowerCase()) ||
      p.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesSkill = selectedSkill === "All" || p.skills.includes(selectedSkill);

    return matchesSearch && matchesSkill;
  });

  return (
    <SuperAdminShell>
      <PageHeader
        title="Talent Pool"
        description="Nurture relationships with prospective, high-potential future candidates."
        action={
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" /> Add Prospect
          </button>
        }
      />

      {/* Filter Toolbar */}
      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, role or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
          />
        </div>
        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500"
        >
          <option value="All">All Skills</option>
          {allSkills.map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>
      </div>

      {/* Grid of Prospects */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProfiles.length === 0 ? (
          <div className="col-span-full rounded-[28px] border border-dashed border-slate-800 p-12 text-center text-slate-500">
            No prospective talent profiles found matching the filters.
          </div>
        ) : (
          filteredProfiles.map((p) => (
            <div
              key={p.id}
              className="flex flex-col justify-between rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-md hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-850 font-bold text-slate-200">
                      {p.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{p.name}</h4>
                      <p className="text-xs text-indigo-400 font-medium">{p.currentRole}</p>
                    </div>
                  </div>

                  <span className="rounded-full bg-slate-950 border border-slate-850 px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-semibold text-slate-400">
                    {p.source}
                  </span>
                </div>

                <div className="mt-5 space-y-2 border-t border-slate-900 pt-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Mail className="h-4 w-4 text-slate-500 shrink-0" />
                    <span className="truncate">{p.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Briefcase className="h-4 w-4 text-slate-500 shrink-0" />
                    <span>{p.experienceYears} Years Experience</span>
                  </div>
                </div>

                <div className="mt-5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-550 block mb-2">
                    Expertise
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {p.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-slate-950 border border-slate-850 px-2 py-0.5 text-[10px] text-slate-300 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-900 pt-4">
                <button
                  type="button"
                  onClick={() => alert(`Sending follow-up outreach email to: ${p.email}`)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-indigo-600/10 border border-indigo-500/20 px-3.5 text-xs text-indigo-300 transition hover:bg-indigo-600/20"
                >
                  <Send className="h-3.5 w-3.5" /> Reach Out
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  className="rounded-full p-2 border border-slate-850 text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-450 hover:border-rose-500/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Prospect Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <h3 className="text-lg font-semibold text-white">Add Prospect to Pool</h3>
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
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rebecca Finch"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="r.finch@example.com"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Current Role / Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.currentRole}
                  onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                  placeholder="e.g. Senior Software Architect"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Source Channel
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-350 outline-none transition focus:border-indigo-500"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Referral">Referral</option>
                    <option value="Careers Page">Careers Page</option>
                    <option value="Agency">Agency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Expertise Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g. React, NodeJS, AWS, Docker"
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
                  Add to Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
