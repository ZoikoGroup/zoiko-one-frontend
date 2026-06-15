import React from "react";
import PageHeader from "../../components/PageHeader";
import { FileText, Download, Plus, Search, UploadCloud, FolderOpen } from "lucide-react";

export default function DocumentsPage() {
  const documents = [
    { name: "Employee Handbook 2026.pdf", category: "HR Policies", size: "2.4 MB", updated: "June 10, 2026", author: "Sarah Jenkins" },
    { name: "Corporate NDA Agreement.pdf", category: "Legal Agreements", size: "1.8 MB", updated: "June 08, 2026", author: "Liam O'Connor" },
    { name: "PostgreSQL Database Backup Schema.sql", category: "Database Tech", size: "940 KB", updated: "June 05, 2026", author: "System Admin" },
    { name: "Quarterly Financial Statement.xlsx", category: "Billing & Finance", size: "4.5 MB", updated: "May 28, 2026", author: "David Kim" }
  ];

  return (
    <div className="space-y-6 font-sans">
      <PageHeader 
        title="Documents" 
        description="Access and manage files, HR handbooks, corporate guidelines, and secure document vaults."
        action={
          <button className="flex items-center gap-2 rounded-full bg-[#FF7A00] hover:bg-[#e56e00] text-white px-4 py-2.5 text-sm font-semibold transition shadow-[0_4px_14px_rgba(255,122,0,0.3)]">
            <Plus className="h-4 w-4" /> Add Document
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Document list */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-[#FF7A00]" /> Document Repository
            </h3>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Filter files..." 
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#FF7A00]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">File Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Uploaded</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc, idx) => (
                  <tr key={idx} className="text-sm text-slate-650 hover:bg-slate-50/50 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <FileText className="h-5 w-5 text-slate-400 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800 leading-snug">{doc.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{doc.size} • by {doc.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 font-medium">
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500">{doc.updated}</td>
                    <td className="py-4 px-4 text-right">
                      <button className="p-1 text-slate-400 hover:text-[#FF7A00] transition" aria-label="Download document">
                        <Download className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload box */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Upload Box</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">Drag and drop file documents, handbooks, reports, or invoices to securely upload them.</p>
            <div className="border-2 border-dashed border-slate-200 hover:border-[#FF7A00]/50 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50/50 cursor-pointer transition">
              <UploadCloud className="h-10 w-10 text-slate-400 mb-3" />
              <p className="text-xs font-bold text-slate-700">Click to upload file</p>
              <p className="text-[10px] text-slate-400 mt-1">PDF, DOCX, XLSX, SQL (Max 20MB)</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-[10px] text-slate-400 font-semibold">Securely encrypted with AES-256</span>
          </div>
        </div>
      </div>
    </div>
  );
}
