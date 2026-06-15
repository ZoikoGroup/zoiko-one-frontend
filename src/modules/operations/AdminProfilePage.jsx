import React from "react";
import PageHeader from "../../components/PageHeader";
import { Shield, Mail, Phone, Calendar, MapPin, BadgeCheck, Clock, User } from "lucide-react";

export default function AdminProfilePage() {
  const admin = {
    name: "Rugvedh Patil",
    role: "Super Admin / Platform Owner",
    email: "rugvedh@zoiko.one",
    phone: "+91 98765 43210",
    location: "Mumbai, India",
    since: "January 2024",
    lastActive: "Just now",
    status: "Active",
    initials: "RP",
  };

  return (
    <div className="space-y-6 font-sans">
      <PageHeader title="Platform Owner" description="Super admin profile and account details." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#FF7A00] to-orange-400 text-3xl font-bold text-white shadow-[0_4px_16px_rgba(255,122,0,0.3)]">
            {admin.initials}
          </div>
          <h2 className="text-xl font-bold text-slate-800">{admin.name}</h2>
          <p className="mt-1 text-sm text-slate-500">{admin.role}</p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            <BadgeCheck className="h-3.5 w-3.5" /> {admin.status}
          </span>
          <div className="mt-6 space-y-2 text-left">
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2 text-xs text-slate-600">
              <Clock className="h-3.5 w-3.5 text-slate-400" /> Last active: {admin.lastActive}
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2 text-xs text-slate-600">
              <Calendar className="h-3.5 w-3.5 text-slate-400" /> Member since: {admin.since}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-lg font-bold text-slate-800 flex items-center gap-2">
              <User className="h-5 w-5 text-[#FF7A00]" /> Personal Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> Email
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800">{admin.email}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> Phone
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800">{admin.phone}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> Location
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800">{admin.location}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" /> Role
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800">{admin.role}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-lg font-bold text-slate-800 flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#FF7A00]" /> Permissions & Access
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                <span className="text-sm text-slate-700">Platform Settings</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5">Full Access</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                <span className="text-sm text-slate-700">User Management</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5">Full Access</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                <span className="text-sm text-slate-700">Billing & Subscriptions</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5">Full Access</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                <span className="text-sm text-slate-700">Security & Audit</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5">Full Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
