"use client";

import { use, useEffect, useState } from "react";
import { ArrowLeft, Briefcase, FileText, MapPin, Phone, Plus, User } from "lucide-react";
import Link from "next/link";
import SuperAdminShell from "../../../../components/SuperAdminShell";
import PageHeader from "../../../../components/PageHeader";
import StatusBadge from "../../../../components/StatusBadge";
import {
  fetchEmployee,
  fetchEmploymentRecords,
  fetchEmployeeDocuments,
  fetchEmergencyContacts,
  fetchEmployeeAddresses,
  upsertEmployeeProfile,
  createEmploymentRecord,
  createEmployeeDocument,
  createEmergencyContact,
  createEmployeeAddress,
  deleteEmployeeDocument,
  deleteEmergencyContact,
  deleteEmployeeAddress,
  type Employee,
  type EmploymentRecord,
  type EmployeeDocument,
  type EmergencyContact,
  type EmployeeAddress,
} from "../../../../lib/workforce-api";

const TABS = ["Personal Information", "Employment Records", "Documents", "Emergency Contacts", "Addresses"] as const;
type Tab = (typeof TABS)[number];

export default function EmployeeDetailPage({ params }: { params: Promise<{ employeeId: string }> }) {
  const { employeeId } = use(params);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [records, setRecords] = useState<EmploymentRecord[]>([]);
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [addresses, setAddresses] = useState<EmployeeAddress[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Personal Information");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchEmployee(employeeId)
      .then(({ data }) => {
        setEmployee(data);
        setLoaded(true);
      })
      .catch(() => {});
  }, [employeeId, refreshKey]);

  function reload() {
    setLoaded(false);
    setRefreshKey((k) => k + 1);
  }

  useEffect(() => {
    if (activeTab === "Employment Records") {
      fetchEmploymentRecords(employeeId).then(setRecords).catch(() => {});
    } else if (activeTab === "Documents") {
      fetchEmployeeDocuments(employeeId).then(setDocuments).catch(() => {});
    } else if (activeTab === "Emergency Contacts") {
      fetchEmergencyContacts(employeeId).then(setContacts).catch(() => {});
    } else if (activeTab === "Addresses") {
      fetchEmployeeAddresses(employeeId).then(setAddresses).catch(() => {});
    }
  }, [activeTab, employeeId]);

  if (!loaded) {
    return (
      <SuperAdminShell>
        <PageHeader title="Employee" description="Loading employee details..." />
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-12 text-center text-slate-400 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          Loading...
        </div>
      </SuperAdminShell>
    );
  }

  if (!employee) {
    return (
      <SuperAdminShell>
        <PageHeader title="Employee" description="Employee not found." />
      </SuperAdminShell>
    );
  }

  return (
    <SuperAdminShell>
      <PageHeader
        title={`${employee.firstName} ${employee.lastName}`}
        description={`${employee.employeeId} · ${employee.email}`}
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/zoiko-hr/workforce/employees"
              className="inline-flex items-center gap-2 rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <Link
              href={`/zoiko-hr/workforce/employees/${employee.id}/edit`}
              className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              Edit
            </Link>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <InfoCard label="Status" value={employee.status} badge />
        <InfoCard label="Type" value={employee.employmentType.replace(/_/g, " ")} />
        <InfoCard label="Joined" value={new Date(employee.joinDate).toLocaleDateString()} />
        <InfoCard label="Employee ID" value={employee.employeeId} />
      </div>

      <div className="mb-6 flex flex-wrap gap-1 rounded-[28px] border border-slate-800 bg-[#0b1220] p-1 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 rounded-3xl px-5 py-2.5 text-sm font-medium transition ${
              activeTab === tab
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab === "Personal Information" && <User className="h-4 w-4" />}
            {tab === "Employment Records" && <Briefcase className="h-4 w-4" />}
            {tab === "Documents" && <FileText className="h-4 w-4" />}
            {tab === "Emergency Contacts" && <Phone className="h-4 w-4" />}
            {tab === "Addresses" && <MapPin className="h-4 w-4" />}
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Personal Information" && (
        <ProfileTab employee={employee} onUpdate={reload} />
      )}
      {activeTab === "Employment Records" && (
        <EmploymentRecordsTab employeeId={employee.id} records={records} onUpdate={() => fetchEmploymentRecords(employee.id).then(setRecords)} />
      )}
      {activeTab === "Documents" && (
        <DocumentsTab employeeId={employee.id} documents={documents} onUpdate={() => fetchEmployeeDocuments(employee.id).then(setDocuments)} />
      )}
      {activeTab === "Emergency Contacts" && (
        <EmergencyContactsTab employeeId={employee.id} contacts={contacts} onUpdate={() => fetchEmergencyContacts(employee.id).then(setContacts)} />
      )}
      {activeTab === "Addresses" && (
        <AddressesTab employeeId={employee.id} addresses={addresses} onUpdate={() => fetchEmployeeAddresses(employee.id).then(setAddresses)} />
      )}
    </SuperAdminShell>
  );
}

function InfoCard({ label, value, badge }: { label: string; value: string; badge?: boolean }) {
  return (
    <div className="rounded-[24px] border border-slate-800 bg-slate-950 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">{label}</p>
      <p className="mt-2">
        {badge ? <StatusBadge status={value} /> : <span className="text-sm text-white">{value}</span>}
      </p>
    </div>
  );
}

function ProfileTab({ employee, onUpdate }: { employee: Employee; onUpdate: () => void }) {
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      await upsertEmployeeProfile(employee.id, {
        middleName: form.get("middleName") as string,
        preferredName: form.get("preferredName") as string,
        maritalStatus: form.get("maritalStatus") as string,
        bloodGroup: form.get("bloodGroup") as string,
        allergies: form.get("allergies") as string,
        disabilities: form.get("disabilities") as string,
        linkedinUrl: form.get("linkedinUrl") as string,
        bio: form.get("bio") as string,
      });
      setEditing(false);
      onUpdate();
    } catch {
      setError("Failed to save profile.");
    } finally {
      setSubmitting(false);
    }
  }

  const p = employee.profile;

  return (
    <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Profile Information</h3>
        <button
          type="button"
          onClick={() => setEditing(!editing)}
          className="rounded-3xl bg-indigo-600/10 px-4 py-2 text-xs font-medium text-indigo-300 transition hover:bg-indigo-600/20"
        >
          {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>
      )}

      {editing ? (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Middle Name" name="middleName" defaultValue={p?.middleName ?? ""} />
            <Field label="Preferred Name" name="preferredName" defaultValue={p?.preferredName ?? ""} />
            <SelectField
              label="Marital Status"
              name="maritalStatus"
              defaultValue={p?.maritalStatus ?? ""}
              options={[
                { value: "", label: "Not specified" },
                { value: "SINGLE", label: "Single" },
                { value: "MARRIED", label: "Married" },
                { value: "DIVORCED", label: "Divorced" },
                { value: "WIDOWED", label: "Widowed" },
                { value: "SEPARATED", label: "Separated" },
              ]}
            />
            <Field label="Blood Group" name="bloodGroup" defaultValue={p?.bloodGroup ?? ""} />
            <Field label="Allergies" name="allergies" defaultValue={p?.allergies ?? ""} />
            <Field label="Disabilities" name="disabilities" defaultValue={p?.disabilities ?? ""} />
            <Field label="LinkedIn URL" name="linkedinUrl" defaultValue={p?.linkedinUrl ?? ""} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Bio</label>
            <textarea
              name="bio"
              defaultValue={p?.bio ?? ""}
              rows={3}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-3xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem label="Middle Name" value={p?.middleName} />
          <DetailItem label="Preferred Name" value={p?.preferredName} />
          <DetailItem label="Marital Status" value={p?.maritalStatus} />
          <DetailItem label="Blood Group" value={p?.bloodGroup} />
          <DetailItem label="Allergies" value={p?.allergies} />
          <DetailItem label="Disabilities" value={p?.disabilities} />
          <DetailItem label="Dependents" value={String(p?.numberDependents ?? 0)} />
          {p?.linkedinUrl && (
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">LinkedIn</p>
              <a
                href={p.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm text-indigo-400 hover:underline"
              >
                {p.linkedinUrl}
              </a>
            </div>
          )}
          {p?.bio && (
            <div className="sm:col-span-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Bio</p>
              <p className="mt-1 text-sm text-slate-300">{p.bio}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmploymentRecordsTab({
  employeeId,
  records,
  onUpdate,
}: {
  employeeId: string;
  records: EmploymentRecord[];
  onUpdate: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      await createEmploymentRecord(employeeId, {
        jobTitle: form.get("jobTitle") as string,
        departmentId: form.get("departmentId") as string,
        employmentType: form.get("employmentType") as string,
        salaryAmount: form.get("salaryAmount") ? Number(form.get("salaryAmount")) : undefined,
        salaryCurrency: form.get("salaryCurrency") as string,
        changeReason: form.get("changeReason") as string,
        notes: form.get("notes") as string,
      });
      setShowForm(false);
      onUpdate();
    } catch {
      setError("Failed to create record.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <h3 className="text-lg font-semibold text-white">Employment Records</h3>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-indigo-500"
        >
          <Plus className="h-3 w-3" />
          Add Record
        </button>
      </div>

      {error && (
        <div className="mx-5 mt-4 rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>
      )}

      {showForm && (
        <div className="border-b border-slate-800 p-5">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <Field label="Job Title" name="jobTitle" required />
            <Field label="Department ID" name="departmentId" />
            <SelectField
              label="Employment Type"
              name="employmentType"
              defaultValue="FULL_TIME"
              options={[
                { value: "FULL_TIME", label: "Full-Time" },
                { value: "PART_TIME", label: "Part-Time" },
                { value: "CONTRACT", label: "Contract" },
                { value: "INTERN", label: "Intern" },
              ]}
            />
            <Field label="Salary Amount" name="salaryAmount" type="number" />
            <Field label="Salary Currency" name="salaryCurrency" defaultValue="USD" />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Change Reason <span className="text-rose-400">*</span>
              </label>
              <select
                name="changeReason"
                required
                defaultValue="HIRE"
                className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
              >
                <option value="HIRE">Hire</option>
                <option value="PROMOTION">Promotion</option>
                <option value="TRANSFER">Transfer</option>
                <option value="ROLE_CHANGE">Role Change</option>
                <option value="CONTRACT_RENEWAL">Contract Renewal</option>
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Notes</label>
              <textarea
                name="notes"
                rows={2}
                className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-3 sm:col-span-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-3xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Record"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm">
          <thead className="bg-slate-950 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Version</th>
              <th className="px-5 py-3 font-semibold">Job Title</th>
              <th className="px-5 py-3 font-semibold">Type</th>
              <th className="px-5 py-3 font-semibold">Salary</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Effective</th>
              <th className="px-5 py-3 font-semibold">Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {records.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                  No employment records found.
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} className="transition hover:bg-slate-900/80">
                  <td className="border-t border-slate-800 px-5 py-4 font-mono text-xs text-slate-400">
                    v{r.version}
                  </td>
                  <td className="border-t border-slate-800 px-5 py-4 text-white">{r.jobTitle ?? "—"}</td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                    {r.employmentType.replace(/_/g, " ")}
                  </td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                    {r.salaryCurrency} {r.salaryAmount.toLocaleString()}
                  </td>
                  <td className="border-t border-slate-800 px-5 py-4">
                    <StatusBadge status={r.employmentStatus} />
                  </td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                    {new Date(r.effectiveDate).toLocaleDateString()}
                  </td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                    {r.changeReason.replace(/_/g, " ")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DocumentsTab({
  employeeId,
  documents,
  onUpdate,
}: {
  employeeId: string;
  documents: EmployeeDocument[];
  onUpdate: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      await createEmployeeDocument(employeeId, {
        documentType: form.get("documentType") as string,
        fileName: form.get("fileName") as string,
        fileUrl: form.get("fileUrl") as string,
        status: (form.get("status") as string) || "PENDING",
        notes: form.get("notes") as string,
        expiryDate: (form.get("expiryDate") as string) || undefined,
      });
      setShowForm(false);
      onUpdate();
    } catch {
      setError("Failed to add document.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(documentId: string) {
    try {
      await deleteEmployeeDocument(employeeId, documentId);
      onUpdate();
    } catch {}
  }

  return (
    <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <h3 className="text-lg font-semibold text-white">Documents</h3>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-indigo-500"
        >
          <Plus className="h-3 w-3" />
          Add Document
        </button>
      </div>

      {error && (
        <div className="mx-5 mt-4 rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>
      )}

      {showForm && (
        <div className="border-b border-slate-800 p-5">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Document Type"
              name="documentType"
              required
              defaultValue=""
              options={[
                { value: "OFFER_LETTER", label: "Offer Letter" },
                { value: "CONTRACT", label: "Contract" },
                { value: "NDA", label: "NDA" },
                { value: "ID_PROOF", label: "ID Proof" },
                { value: "PAYSLIP", label: "Payslip" },
                { value: "TAX_FORM", label: "Tax Form" },
                { value: "BANK_DETAILS", label: "Bank Details" },
                { value: "CERTIFICATION", label: "Certification" },
                { value: "EDUCATION", label: "Education" },
                { value: "OTHER", label: "Other" },
              ]}
            />
            <Field label="File Name" name="fileName" />
            <Field label="File URL" name="fileUrl" />
            <Field label="Expiry Date" name="expiryDate" type="date" />
            <SelectField
              label="Status"
              name="status"
              defaultValue="PENDING"
              options={[
                { value: "PENDING", label: "Pending" },
                { value: "APPROVED", label: "Approved" },
                { value: "REJECTED", label: "Rejected" },
                { value: "EXPIRED", label: "Expired" },
              ]}
            />
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Notes</label>
              <textarea
                name="notes"
                rows={2}
                className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-3 sm:col-span-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-3xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
              >
                {submitting ? "Adding..." : "Add Document"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm">
          <thead className="bg-slate-950 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Type</th>
              <th className="px-5 py-3 font-semibold">File Name</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Expiry</th>
              <th className="px-5 py-3 font-semibold">Uploaded</th>
              <th className="px-5 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                  No documents found.
                </td>
              </tr>
            ) : (
              documents.map((d) => (
                <tr key={d.id} className="transition hover:bg-slate-900/80">
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                    {d.documentType.replace(/_/g, " ")}
                  </td>
                  <td className="border-t border-slate-800 px-5 py-4 text-white">{d.fileName ?? "—"}</td>
                  <td className="border-t border-slate-800 px-5 py-4">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                    {d.expiryDate ? new Date(d.expiryDate).toLocaleDateString() : "—"}
                  </td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border-t border-slate-800 px-5 py-4">
                    <button
                      type="button"
                      onClick={() => handleDelete(d.id)}
                      className="rounded-3xl bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 transition hover:bg-rose-500/20"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmergencyContactsTab({
  employeeId,
  contacts,
  onUpdate,
}: {
  employeeId: string;
  contacts: EmergencyContact[];
  onUpdate: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      await createEmergencyContact(employeeId, {
        firstName: form.get("firstName") as string,
        lastName: form.get("lastName") as string,
        relationship: form.get("relationship") as string,
        phoneNumber: form.get("phoneNumber") as string,
        email: form.get("email") as string,
        address: form.get("address") as string,
        city: form.get("city") as string,
        state: form.get("state") as string,
        notes: form.get("notes") as string,
      });
      setShowForm(false);
      onUpdate();
    } catch {
      setError("Failed to add contact.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(contactId: string) {
    try {
      await deleteEmergencyContact(employeeId, contactId);
      onUpdate();
    } catch {}
  }

  return (
    <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <h3 className="text-lg font-semibold text-white">Emergency Contacts</h3>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-indigo-500"
        >
          <Plus className="h-3 w-3" />
          Add Contact
        </button>
      </div>

      {error && (
        <div className="mx-5 mt-4 rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>
      )}

      {showForm && (
        <div className="border-b border-slate-800 p-5">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <Field label="First Name" name="firstName" required />
            <Field label="Last Name" name="lastName" required />
            <SelectField
              label="Relationship"
              name="relationship"
              required
              defaultValue=""
              options={[
                { value: "", label: "Select..." },
                { value: "SPOUSE", label: "Spouse" },
                { value: "PARENT", label: "Parent" },
                { value: "SIBLING", label: "Sibling" },
                { value: "CHILD", label: "Child" },
                { value: "FRIEND", label: "Friend" },
                { value: "OTHER", label: "Other" },
              ]}
            />
            <Field label="Phone Number" name="phoneNumber" type="tel" required />
            <Field label="Email" name="email" type="email" />
            <Field label="Address" name="address" />
            <Field label="City" name="city" />
            <Field label="State" name="state" />
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Notes</label>
              <textarea
                name="notes"
                rows={2}
                className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-3 sm:col-span-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-3xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
              >
                {submitting ? "Adding..." : "Add Contact"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm">
          <thead className="bg-slate-950 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Priority</th>
              <th className="px-5 py-3 font-semibold">Name</th>
              <th className="px-5 py-3 font-semibold">Relationship</th>
              <th className="px-5 py-3 font-semibold">Phone</th>
              <th className="px-5 py-3 font-semibold">Email</th>
              <th className="px-5 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                  No emergency contacts found.
                </td>
              </tr>
            ) : (
              contacts.map((c) => (
                <tr key={c.id} className="transition hover:bg-slate-900/80">
                  <td className="border-t border-slate-800 px-5 py-4">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-bold text-indigo-300">
                      {c.priority}
                    </span>
                  </td>
                  <td className="border-t border-slate-800 px-5 py-4 text-white">
                    {c.firstName} {c.lastName}
                  </td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                    {c.relationship}
                  </td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{c.phoneNumber}</td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{c.email ?? "—"}</td>
                  <td className="border-t border-slate-800 px-5 py-4">
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="rounded-3xl bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 transition hover:bg-rose-500/20"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddressesTab({
  employeeId,
  addresses,
  onUpdate,
}: {
  employeeId: string;
  addresses: EmployeeAddress[];
  onUpdate: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      await createEmployeeAddress(employeeId, {
        type: form.get("type") as string,
        isPrimary: form.get("isPrimary") === "on",
        address: form.get("address") as string,
        apt: form.get("apt") as string,
        city: form.get("city") as string,
        state: form.get("state") as string,
        postalCode: form.get("postalCode") as string,
        country: form.get("country") as string,
      });
      setShowForm(false);
      onUpdate();
    } catch {
      setError("Failed to add address.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(addressId: string) {
    try {
      await deleteEmployeeAddress(employeeId, addressId);
      onUpdate();
    } catch {}
  }

  return (
    <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <h3 className="text-lg font-semibold text-white">Addresses</h3>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-indigo-500"
        >
          <Plus className="h-3 w-3" />
          Add Address
        </button>
      </div>

      {error && (
        <div className="mx-5 mt-4 rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>
      )}

      {showForm && (
        <div className="border-b border-slate-800 p-5">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Type"
              name="type"
              required
              defaultValue="RESIDENTIAL"
              options={[
                { value: "RESIDENTIAL", label: "Residential" },
                { value: "MAILING", label: "Mailing" },
                { value: "WORK", label: "Work" },
                { value: "OTHER", label: "Other" },
              ]}
            />
            <Field label="Country" name="country" required defaultValue="United States" />
            <Field label="Address" name="address" />
            <Field label="Apt / Suite" name="apt" />
            <Field label="City" name="city" />
            <Field label="State" name="state" />
            <Field label="Postal Code" name="postalCode" />
            <div className="flex items-center gap-2 self-end pb-2">
              <input
                id="isPrimary"
                name="isPrimary"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-indigo-600"
              />
              <label htmlFor="isPrimary" className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Primary Address
              </label>
            </div>
            <div className="flex justify-end gap-3 sm:col-span-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-3xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
              >
                {submitting ? "Adding..." : "Add Address"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm">
          <thead className="bg-slate-950 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Type</th>
              <th className="px-5 py-3 font-semibold">Address</th>
              <th className="px-5 py-3 font-semibold">City</th>
              <th className="px-5 py-3 font-semibold">State</th>
              <th className="px-5 py-3 font-semibold">Postal Code</th>
              <th className="px-5 py-3 font-semibold">Country</th>
              <th className="px-5 py-3 font-semibold">Primary</th>
              <th className="px-5 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {addresses.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                  No addresses found.
                </td>
              </tr>
            ) : (
              addresses.map((a) => (
                <tr key={a.id} className="transition hover:bg-slate-900/80">
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                    {a.type.replace(/_/g, " ")}
                  </td>
                  <td className="border-t border-slate-800 px-5 py-4 text-white">{a.address ?? "—"}</td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{a.city ?? "—"}</td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{a.state ?? "—"}</td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{a.postalCode ?? "—"}</td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{a.country}</td>
                  <td className="border-t border-slate-800 px-5 py-4">
                    {a.isPrimary ? (
                      <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">Yes</span>
                    ) : (
                      <span className="text-slate-500">No</span>
                    )}
                  </td>
                  <td className="border-t border-slate-800 px-5 py-4">
                    <button
                      type="button"
                      onClick={() => handleDelete(a.id)}
                      className="rounded-3xl bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 transition hover:bg-rose-500/20"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-300">{value}</p>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
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
        defaultValue={defaultValue}
        className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  required,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
        {label}
        {required && <span className="ml-1 text-rose-400">*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
