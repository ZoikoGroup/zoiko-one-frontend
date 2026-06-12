"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import SuperAdminShell from "../../../../components/SuperAdminShell";
import PageHeader from "../../../../components/PageHeader";

export default function CreateEmployeePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/zoiko-hr/workforce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.get("firstName") as string,
          lastName: form.get("lastName") as string,
          email: form.get("email") as string,
          phoneNumber: form.get("phoneNumber") as string,
          personalEmail: form.get("personalEmail") as string,
          personalPhone: form.get("personalPhone") as string,
          joinDate: form.get("joinDate") as string,
          employmentType: form.get("employmentType") as string,
          gender: form.get("gender") as string,
          nationality: form.get("nationality") as string,
        }),
      });

      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Failed to create employee.");
        return;
      }

      router.push(`/zoiko-hr/workforce/employees/${body.data.id}`);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SuperAdminShell>
      <PageHeader
        title="Add Employee"
        description="Create a new employee record in the system."
        action={
          <Link
            href="/zoiko-hr/workforce/employees"
            className="inline-flex items-center gap-2 rounded-3xl border border-slate-800 bg-slate-950 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        }
      />

      <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        {error && (
          <div className="mb-6 rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
              Personal Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First Name" name="firstName" required />
              <Field label="Last Name" name="lastName" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Personal Email" name="personalEmail" type="email" />
              <Field label="Phone Number" name="phoneNumber" type="tel" />
              <Field label="Personal Phone" name="personalPhone" type="tel" />
              <Field label="Gender" name="gender" placeholder="Male / Female / Other" />
              <Field label="Nationality" name="nationality" />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
              Employment Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Employment Type
                </label>
                <select
                  name="employmentType"
                  defaultValue="FULL_TIME"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
                >
                  <option value="FULL_TIME">Full-Time</option>
                  <option value="PART_TIME">Part-Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERN">Intern</option>
                  <option value="TEMPORARY">Temporary</option>
                </select>
              </div>
              <Field label="Join Date" name="joinDate" type="date" required />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-800 pt-6">
            <Link
              href="/zoiko-hr/workforce/employees"
              className="rounded-3xl border border-slate-800 bg-slate-950 px-6 py-2.5 text-sm text-slate-300 transition hover:bg-slate-900"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-3xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Employee"}
            </button>
          </div>
        </form>
      </div>
    </SuperAdminShell>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
        {label}
        {required && <span className="ml-1 text-rose-400">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
      />
    </div>
  );
}
