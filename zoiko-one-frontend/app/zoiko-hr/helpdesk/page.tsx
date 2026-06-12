"use client";

import { useState, useMemo } from "react";
import { MessageSquare, Ticket, Inbox, Clock, BookOpen, AlertCircle, CheckCircle, ArrowUpRight, User, Calendar } from "lucide-react";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";
import { initialTickets, initialEmployeeRequests, initialCases, initialSLAs, initialKnowledgeArticles } from "./mockData";

export default function HelpdeskDashboard() {
  const tickets = useMemo(() => initialTickets, []);
  const requests = useMemo(() => initialEmployeeRequests, []);
  const cases = useMemo(() => initialCases, []);
  const slas = useMemo(() => initialSLAs, []);
  const articles = useMemo(() => initialKnowledgeArticles, []);

  const openTickets = tickets.filter((t) => t.status === "Open" || t.status === "In Progress").length;
  const pendingRequests = requests.filter((r) => r.status === "Pending").length;
  const activeCases = cases.filter((c) => c.status === "New" || c.status === "Investigating").length;
  const avgCompliance = slas.filter((s) => s.status === "Active").reduce((sum, s) => sum + s.overallCompliance, 0) / slas.filter((s) => s.status === "Active").length;
  const criticalTickets = tickets.filter((t) => t.priority === "Critical" && t.status !== "Closed").length;

  return (
    <SuperAdminShell>
      <PageHeader
        title="HR Helpdesk"
        description="Centralized service desk for HR tickets, employee requests, case management, and knowledge base."
      />

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-3xl bg-indigo-500/10 p-3">
              <Ticket className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Open Tickets</p>
              <h3 className="mt-1 text-3xl font-bold text-white">{openTickets}</h3>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">{criticalTickets} critical • {tickets.length} total</p>
        </div>
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-3xl bg-amber-500/10 p-3">
              <Inbox className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Pending Requests</p>
              <h3 className="mt-1 text-3xl font-bold text-amber-400">{pendingRequests}</h3>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">{requests.length} total requests</p>
        </div>
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-3xl bg-rose-500/10 p-3">
              <AlertCircle className="h-5 w-5 text-rose-400" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Active Cases</p>
              <h3 className="mt-1 text-3xl font-bold text-rose-400">{activeCases}</h3>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">{cases.length} total cases</p>
        </div>
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="rounded-3xl bg-emerald-500/10 p-3">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">SLA Compliance</p>
              <h3 className="mt-1 text-3xl font-bold text-emerald-400">{avgCompliance.toFixed(1)}%</h3>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">{articles.length} knowledge articles</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Tickets */}
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <h3 className="text-sm font-semibold text-white">Recent Tickets</h3>
            <a href="/zoiko-hr/helpdesk/tickets" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition">
              View All <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          <div className="divide-y divide-slate-800">
            {tickets.slice(0, 5).map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between px-6 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${getPriorityStyle(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                  <span className="truncate text-sm text-slate-200">{ticket.ticketNumber}</span>
                  <span className="truncate text-sm text-slate-300">{ticket.title}</span>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${getStatusStyle(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SLA Overview */}
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <h3 className="text-sm font-semibold text-white">SLA Overview</h3>
            <a href="/zoiko-hr/helpdesk/sla" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition">
              View All <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          <div className="divide-y divide-slate-800">
            {slas.filter((s) => s.status === "Active").map((sla) => (
              <div key={sla.id} className="flex items-center justify-between px-6 py-3.5">
                <div className="min-w-0">
                  <p className="text-sm text-slate-200">{sla.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">Response: {sla.targetResponse}h • Resolution: {sla.targetResolution}h</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className={`text-sm font-semibold ${sla.overallCompliance >= 95 ? "text-emerald-400" : sla.overallCompliance >= 85 ? "text-amber-400" : "text-rose-400"}`}>
                    {sla.overallCompliance}%
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-500">{sla.breachCount} breaches</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Active Cases */}
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <h3 className="text-sm font-semibold text-white">Active Cases</h3>
            <a href="/zoiko-hr/helpdesk/cases" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition">
              View All <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          <div className="divide-y divide-slate-800">
            {cases.filter((c) => c.status === "New" || c.status === "Investigating").map((c) => (
              <div key={c.id} className="px-6 py-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-200">{c.title}</p>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${getCaseStatusStyle(c.status)}`}>
                    {c.status}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" />{c.assignedTo}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{c.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Knowledge Base */}
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <h3 className="text-sm font-semibold text-white">Popular Knowledge Base Articles</h3>
            <a href="/zoiko-hr/helpdesk/knowledge-base" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition">
              View All <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
          <div className="divide-y divide-slate-800">
            {articles.sort((a, b) => b.views - a.views).slice(0, 5).map((article) => (
              <div key={article.id} className="flex items-center justify-between px-6 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <BookOpen className="h-4 w-4 shrink-0 text-slate-500" />
                  <span className="truncate text-sm text-slate-200">{article.title}</span>
                </div>
                <div className="flex shrink-0 items-center gap-3 ml-4 text-xs text-slate-500">
                  <span>{article.views} views</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getCategoryStyle(article.category)}`}>
                    {article.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Employee Requests */}
      <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h3 className="text-sm font-semibold text-white">Recent Employee Requests</h3>
          <a href="/zoiko-hr/helpdesk/employee-requests" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition">
            View All <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
        <div className="divide-y divide-slate-800">
          {requests.slice(0, 5).map((req) => (
            <div key={req.id} className="flex items-center justify-between px-6 py-3.5">
              <div className="min-w-0">
                <p className="text-sm text-slate-200">{req.employeeName} — {req.requestType}</p>
                <p className="mt-0.5 text-xs text-slate-500">{req.description.slice(0, 60)}...</p>
              </div>
              <span className={`shrink-0 ml-4 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${getRequestStatusStyle(req.status)}`}>
                {req.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SuperAdminShell>
  );
}

function getPriorityStyle(priority: string) {
  switch (priority) {
    case "Critical": return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
    case "High": return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
    case "Medium": return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    default: return "bg-slate-800 text-slate-400 border border-slate-700";
  }
}

function getStatusStyle(status: string) {
  switch (status) {
    case "Open": return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    case "In Progress": return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    case "Resolved": return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
    default: return "bg-slate-800 text-slate-400 border border-slate-700";
  }
}

function getCaseStatusStyle(status: string) {
  switch (status) {
    case "New": return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    case "Investigating": return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    case "Resolved": return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
    default: return "bg-slate-800 text-slate-400 border border-slate-700";
  }
}

function getRequestStatusStyle(status: string) {
  switch (status) {
    case "Pending": return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    case "Approved": return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    default: return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
  }
}

function getCategoryStyle(category: string) {
  switch (category) {
    case "IT": return "bg-blue-500/10 text-blue-400";
    case "HR": return "bg-purple-500/10 text-purple-400";
    case "Payroll": return "bg-emerald-500/10 text-emerald-400";
    case "Onboarding": return "bg-cyan-500/10 text-cyan-400";
    case "Policy": return "bg-rose-500/10 text-rose-400";
    default: return "bg-slate-800 text-slate-400";
  }
}
