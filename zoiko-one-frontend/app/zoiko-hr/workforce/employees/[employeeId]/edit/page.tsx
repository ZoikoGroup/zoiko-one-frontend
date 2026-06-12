"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import SuperAdminShell from "../../../../../components/SuperAdminShell";
import PageHeader from "../../../../../components/PageHeader";
import { fetchEmployee } from "../../../../../lib/workforce-api";

export default function EditEmployeePage({ params }: { params: Promise<{ employeeId: string }> }) {
  const { employeeId } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [employee, setEmployee] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
    personalEmail?: string | null;
    personalPhone?: string | null;
    gender?: string | null;
    nationality?: string | null;
    dateOfBirth?: string | null;
  } | null>(null);

  useEffect(() => {
    fetchEmployee(employeeId)
      .then(({ data }) => {
        setEmployee({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          personalEmail: data.personalEmail,
          personalPhone: data.personalPhone,
          gender: data.gender,
          nationality: data.nationality,
          dateOfBirth: data.dateOfBirth,
        });
      })
      .catch(() => setError("Failed to load employee."))
      .finally(() => setLoading(false));
  }, [employeeId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch(`/api/zoiko-hr/workforce/${employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.get("firstName") as string,
          lastName: form.get("lastName") as string,
          email: form.get("email") as string,
          phoneNumber: form.get("phoneNumber") as string,
          personalEmail: form.get("personalEmail") as string,
          personalPhone: form.get("personalPhone") as string,
          gender: form.get("gender") as string,
          nationality: form.get("nationality") as string,
          dateOfBirth: form.get("dateOfBirth") as string,
        }),
      });

      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Failed to update employee.");
        return;
      }

      router.push(`/zoiko-hr/workforce/employees/${employeeId}`);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <SuperAdminShell>
        <PageHeader title="Edit Employee" description="Loading employee data..." />
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-12 text-center text-slate-400 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          Loading...
        </div>
      </SuperAdminShell>
    );
  }

  if (!employee && !loading) {
    return (
      <SuperAdminShell>
        <PageHeader title="Edit Employee" description="Employee not found." />
      </SuperAdminShell>
    );
  }

  return (
    <SuperAdminShell>
      <PageHeader
        title={`Edit ${employee?.firstName} ${employee?.lastName}`}
        description="Update employee information."
        action={
          <Link
            href={`/zoiko-hr/workforce/employees/${employeeId}`}
            className="inline-flex items-center gap-2 rounded-3xl border border-slate-800 bg-slate-950 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        }
      />

      <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        {error && (
          <div className="mb-6 rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
              Personal Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First Name" name="firstName" defaultValue={employee?.firstName} required />
              <Field label="Last Name" name="lastName" defaultValue={employee?.lastName} required />
              <Field label="Email" name="email" type="email" defaultValue={employee?.email} required />
              <Field label="Personal Email" name="personalEmail" type="email" defaultValue={employee?.personalEmail ?? ""} />
              <Field label="Phone Number" name="phoneNumber" type="tel" defaultValue={employee?.phoneNumber ?? ""} />
              <Field label="Personal Phone" name="personalPhone" type="tel" defaultValue={employee?.personalPhone ?? ""} />
              <Field label="Gender" name="gender" defaultValue={employee?.gender ?? ""} placeholder="Male / Female / Other" />
              <Field label="Nationality" name="nationality" defaultValue={employee?.nationality ?? ""} />
              <Field
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                defaultValue={employee?.dateOfBirth ? employee.dateOfBirth.split("T")[0] : ""}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-800 pt-6">
            <Link
              href={`/zoiko-hr/workforce/employees/${employeeId}`}
              className="rounded-3xl border border-slate-800 bg-slate-950 px-6 py-2.5 text-sm text-slate-300 transition hover:bg-slate-900"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-3xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Changes"}
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
