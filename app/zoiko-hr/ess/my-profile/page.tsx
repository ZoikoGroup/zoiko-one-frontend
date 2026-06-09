"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Building2, Calendar, MapPin, User, Shield, Globe, AlertCircle } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { fetchESSProfile, type ESSProfile } from "../../../lib/workforce-api";

export default function MyProfilePage() {
  const [profile, setProfile] = useState<ESSProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchESSProfile()
      .then((res) => setProfile(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <SuperAdminShell>
      <PageHeader title="My Profile" description="View and manage your personal and employment information." />
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    </SuperAdminShell>
  );

  if (error) return (
    <SuperAdminShell>
      <PageHeader title="My Profile" description="View and manage your personal and employment information." />
      <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">{error}</div>
    </SuperAdminShell>
  );

  return (
    <SuperAdminShell>
      <PageHeader
        title="My Profile"
        description="View and manage your personal and employment information."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-600/20 text-4xl font-bold text-indigo-400">
              {profile!.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-white">{profile!.name}</h2>
            <p className="text-sm text-slate-400">{profile!.designation}</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 uppercase tracking-wider">{profile!.employmentType}</span>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{profile!.employeeId}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-950 p-4">
                <Mail className="h-5 w-5 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm text-white">{profile!.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-950 p-4">
                <Phone className="h-5 w-5 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="text-sm text-white">{profile!.phone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Employment Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-950 p-4">
                <Building2 className="h-5 w-5 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Department</p>
                  <p className="text-sm text-white">{profile!.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-950 p-4">
                <User className="h-5 w-5 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Manager</p>
                  <p className="text-sm text-white">{profile!.manager}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-950 p-4">
                <Calendar className="h-5 w-5 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Joined Date</p>
                  <p className="text-sm text-white">{profile!.joinDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-950 p-4">
                <MapPin className="h-5 w-5 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Location</p>
                  <p className="text-sm text-white">{profile!.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-950 p-4">
                <Shield className="h-5 w-5 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Designation</p>
                  <p className="text-sm text-white">{profile!.designation}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-950 p-4">
                <Globe className="h-5 w-5 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Nationality</p>
                  <p className="text-sm text-white">{profile!.nationality}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Personal Details</h3>
              <div className="space-y-3">
                {[
                  { label: "Date of Birth", value: profile!.dateOfBirth },
                  { label: "Gender", value: profile!.gender },
                  { label: "Marital Status", value: profile!.maritalStatus },
                  { label: "Nationality", value: profile!.nationality },
                  { label: "Address", value: profile!.address },
                ].map((f) => (
                  <div key={f.label} className="flex justify-between rounded-2xl bg-slate-950 px-4 py-3">
                    <span className="text-xs text-slate-500">{f.label}</span>
                    <span className="text-sm text-white text-right max-w-[200px]">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Emergency Contact</h3>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-950 p-4 mb-3">
                <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Contact Person</p>
                  <p className="text-sm text-white">{profile!.emergencyContact}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-950 p-4">
                <Phone className="h-5 w-5 text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Emergency Phone</p>
                  <p className="text-sm text-white">{profile!.emergencyPhone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminShell>
  );
}
