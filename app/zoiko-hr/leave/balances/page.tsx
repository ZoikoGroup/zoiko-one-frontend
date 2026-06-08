"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { fetchLeaveBalances, fetchLeaveTypes, fetchEmployees, type LeaveBalance, type LeaveType, type Employee } from "../../../lib/workforce-api";

export default function LeaveBalancesPage() {
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);

  useEffect(() => {
    fetchLeaveBalances({
      employeeId: employeeFilter || undefined,
      leaveTypeId: typeFilter || undefined,
      year: yearFilter,
    }).then((res) => { setBalances(res); setLoaded(true); }).catch(() => {});
  }, [employeeFilter, typeFilter, yearFilter]);

  useEffect(() => {
    fetchEmployees({ take: 100, orderBy: "firstName", orderDir: "asc" }).then((res) => setEmployees(res.data)).catch(() => {});
    fetchLeaveTypes({ take: 100 }).then((res) => setLeaveTypes(res.data)).catch(() => {});
  }, []);

  const grouped = balances.reduce<Record<string, LeaveBalance[]>>((acc, b) => {
    const key = b.employeeId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {});

  const employeeMap = new Map(employees.map((e) => [e.id, e]));
  const typeMap = new Map(leaveTypes.map((t) => [t.id, t]));

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <SuperAdminShell>
      <PageHeader title="Leave Balances" description="Track employee leave allocations and usage." />

      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <select value={employeeFilter} onChange={(e) => setEmployeeFilter(e.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
              <option value="">All Employees</option>
              {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.employeeId})</option>)}
            </select>
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
            <option value="">All Leave Types</option>
            {leaveTypes.map((lt) => <option key={lt.id} value={lt.id}>{lt.name}</option>)}
          </select>
          <select value={yearFilter} onChange={(e) => setYearFilter(Number(e.target.value))}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">Leave Balances <span className="ml-2 text-sm font-normal text-slate-400">({balances.length} records)</span></h2>
        </div>
        {!loaded ? (
          <div className="px-5 py-12 text-center text-slate-400">Loading...</div>
        ) : balances.length === 0 ? (
          <div className="px-5 py-12 text-center text-slate-400">No balances found. Allocate leave balances to employees to see them here.</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {Object.entries(grouped).map(([empId, records]) => {
              const emp = employeeMap.get(empId);
              return (
                <div key={empId} className="px-5 py-4">
                  <p className="text-sm font-medium text-white mb-3">{emp?.firstName} {emp?.lastName} <span className="text-xs text-slate-500 font-normal">{emp?.employeeId}</span></p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {records.map((b) => {
                      const lt = typeMap.get(b.leaveTypeId);
                      const pct = b.allocatedDays > 0 ? Math.round((b.usedDays / b.allocatedDays) * 100) : 0;
                      return (
                        <div key={b.id} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">{lt?.name ?? b.leaveTypeId}</span>
                            <span className="text-2xl font-semibold text-white">{b.availableDays}</span>
                          </div>
                          <div className="mb-2 h-1.5 rounded-full bg-slate-800">
                            <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Used: {b.usedDays}</span>
                            <span>Allocated: {b.allocatedDays}</span>
                            <span>Pending: {b.pendingDays}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </SuperAdminShell>
  );
}
