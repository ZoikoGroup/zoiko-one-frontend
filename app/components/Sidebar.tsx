"use client";

import { BadgeCheck, Briefcase, Building2, Calendar, ChevronDown, ChevronRight, CreditCard, FileCheck2, FileText, LayoutDashboard, MapPin, MessageSquare, Network, Phone, Shield, ShieldCheck, SlidersHorizontal, Sparkles, Target, Users, WalletCards, Workflow } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  badge?: string;
  children?: NavItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    title: "PLATFORM",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Organizations", href: "/organizations", icon: ShieldCheck, badge: "3" },
    ],
  },
  {
    title: "PRODUCTS",
    items: [
      {
        label: "Zoiko HR",
        icon: Users,
        badge: "HR",
        children: [
          { label: "Dashboard", href: "/zoiko-hr", icon: LayoutDashboard },
          {
            label: "Workforce",
            icon: Briefcase,
            children: [
              { label: "Employees", href: "/zoiko-hr/workforce/employees", icon: Users },
              { label: "Employee Documents", href: "/zoiko-hr/workforce/documents", icon: FileText },
              { label: "Employment Records", href: "/zoiko-hr/workforce/employment-records", icon: Briefcase },
              { label: "Emergency Contacts", href: "/zoiko-hr/workforce/emergency-contacts", icon: Phone },
              { label: "Addresses", href: "/zoiko-hr/workforce/addresses", icon: MapPin },
            ],
          },
          { label: "Documents", href: "/zoiko-hr/documents", icon: FileText },
          { label: "Departments", href: "/zoiko-hr/departments", icon: Building2 },
          { label: "Designations", href: "/zoiko-hr/designations", icon: BadgeCheck },
          {
            label: "Leave Management",
            icon: Calendar,
            children: [
              { label: "Leave Types", href: "/zoiko-hr/leave/leave-types", icon: FileText },
              { label: "Leave Requests", href: "/zoiko-hr/leave/requests", icon: Calendar },
              { label: "Leave Balances", href: "/zoiko-hr/leave/balances", icon: WalletCards },
              { label: "Calendar", href: "/zoiko-hr/leave/calendar", icon: Calendar },
            ],
          },
          {
            label: "Attendance Management",
            icon: Calendar,
            children: [
              { label: "Dashboard", href: "/zoiko-hr/attendance", icon: LayoutDashboard },
              { label: "Records", href: "/zoiko-hr/attendance/records", icon: FileText },
              { label: "Entry", href: "/zoiko-hr/attendance/entry", icon: FileCheck2 },
              { label: "Check In/Out", href: "/zoiko-hr/attendance/check-in-out", icon: ShieldCheck },
              { label: "Shifts", href: "/zoiko-hr/attendance/shifts", icon: Briefcase },
              { label: "Reports", href: "/zoiko-hr/attendance/reports", icon: SlidersHorizontal },
            ],
          },
          {
            label: "Performance Management",
            icon: Sparkles,
            children: [
              { label: "Dashboard", href: "/zoiko-hr/performance", icon: LayoutDashboard },
              { label: "Reviews", href: "/zoiko-hr/performance/reviews", icon: FileText },
              { label: "Goals", href: "/zoiko-hr/performance/goals", icon: Target },
              { label: "Feedback", href: "/zoiko-hr/performance/feedback", icon: MessageSquare },
            ],
          },
        ],
      },
      { label: "ZoikoTime", href: "/zoikotime", icon: ShieldCheck, badge: "Time" },
      { label: "Zoiko Payroll", href: "/payroll", icon: WalletCards, badge: "Payroll" },
      { label: "Zoiko Billing", href: "/billing", icon: CreditCard, badge: "Billing" },
      { label: "Zoiko Comply", href: "/comply", icon: FileCheck2, badge: "Comply" },
      { label: "Zoiko Insights", href: "/insights", icon: Sparkles, badge: "Insights" },
    ],
  },
  {
    title: "INFRASTRUCTURE",
    items: [
      { label: "ZoikoPay", href: "/zoikopay", icon: CreditCard },
      { label: "ZoikoCoreX", href: "/zoikocorex", icon: Network },
    ],
  },
  {
    title: "PLATFORM GOVERNANCE",
    items: [
      { label: "Users & Roles", href: "/roles", icon: Users, badge: "9" },
      { label: "Security Center", href: "/security-center", icon: Shield, badge: "1" },
      { label: "Trust Center", href: "/trust-center", icon: Sparkles },
      { label: "Audit Center", href: "/audit-center", icon: Workflow },
      { label: "Compliance Center", href: "/compliance-center", icon: FileCheck2, badge: "5" },
    ],
  },
  {
    title: "PLATFORM OPERATIONS",
    items: [
      { label: "Integrations", href: "/integrations", icon: Network },
      { label: "API Management", href: "/api-management", icon: ShieldCheck },
      { label: "Feature Flags", href: "/feature-flags", icon: SlidersHorizontal },
      { label: "Notifications", href: "/notifications", icon: WalletCards, badge: "12" },
      { label: "System Monitoring", href: "/system-monitoring", icon: Workflow },
      { label: "Support Center", href: "/support-center", icon: Users, badge: "2" },
    ],
  },
  {
    title: "CONFIGURATION",
    items: [{ label: "Settings", href: "/settings", icon: SlidersHorizontal }],
  },
];

function isActiveRoute(pathname: string, href?: string): boolean {
  if (!href) return false;
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/";
  }
  return pathname.startsWith(href);
}

function hasActiveChild(pathname: string, children?: NavItem[]): boolean {
  if (!children) return false;
  return children.some((child) => {
    if (child.href && isActiveRoute(pathname, child.href)) return true;
    if (child.children && hasActiveChild(pathname, child.children)) return true;
    return false;
  });
}

function NavLink({
  item,
  pathname,
  depth = 0,
  onClose,
}: {
  item: NavItem;
  pathname: string;
  depth?: number;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(item.href ? isActiveRoute(pathname, item.href) : hasActiveChild(pathname, item.children));
  const hasChildren = item.children && item.children.length > 0;
  const active = item.href ? isActiveRoute(pathname, item.href) : false;

  if (!hasChildren) {
    return (
      <Link
        href={item.href!}
        className={`flex items-center justify-between gap-3 rounded-3xl px-4 py-3 text-sm transition ${
          active ? "bg-slate-900 text-white" : "text-slate-300 hover:bg-slate-900 hover:text-white"
        }`}
        onClick={onClose}
      >
        <span className="flex items-center gap-3">
          <item.icon className="h-4 w-4 text-slate-400" />
          {item.label}
        </span>
        {item.badge ? <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-[0.24em] text-slate-400">{item.badge}</span> : null}
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((c) => !c)}
        className={`flex w-full items-center justify-between gap-3 rounded-3xl px-4 py-3 text-left text-sm transition ${
          active || hasActiveChild(pathname, item.children)
            ? "bg-slate-900 text-white"
            : "text-slate-300 hover:bg-slate-900 hover:text-white"
        }`}
      >
        <span className="flex items-center gap-3">
          <item.icon className="h-4 w-4 text-slate-400" />
          {item.label}
        </span>
        <span className="flex items-center gap-2">
          {item.badge ? <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-[0.24em] text-slate-400">{item.badge}</span> : null}
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </span>
      </button>
      <div className={`overflow-hidden transition-[max-height] duration-300 ${open ? "max-h-[2000px]" : "max-h-0"}`}>
        <div className={`space-y-1 ${depth === 0 ? "pl-3" : ""}`}>
          {item.children!.map((child) => (
            <NavLink key={child.label} item={child} pathname={pathname} depth={depth + 1} onClose={onClose} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [productOpen, setProductOpen] = useState(true);

  return (
    <>
      <div className={`fixed inset-0 z-30 bg-slate-950/70 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={onClose} />

      <aside className={`fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto border-r border-slate-800 bg-[#0B1220] p-5 shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Zoiko One</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">Super Admin</h2>
          </div>
          <button type="button" className="lg:hidden text-slate-400 hover:text-white" onClick={onClose}>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-7">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">{section.title}</h3>
              <div className="mt-3 space-y-1">
                {section.title === "PRODUCTS" ? (
                  <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/90">
                    <button
                      type="button"
                      onClick={() => setProductOpen((current) => !current)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-slate-900"
                    >
                      <span>Product Management</span>
                      {productOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                    <div className={`overflow-hidden transition-[max-height] duration-300 ${productOpen ? "max-h-[2000px]" : "max-h-0"}`}>
                      <div className="space-y-1 p-1">
                        {section.items.map((item) => (
                          <NavLink key={item.label} item={item} pathname={pathname} depth={0} onClose={onClose} />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  section.items.map((item) => (
                    <NavLink key={item.label} item={item} pathname={pathname} depth={0} onClose={onClose} />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/95 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-800 text-slate-200">SA</div>
            <div>
              <p className="text-sm font-semibold text-white">Super Admin</p>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Platform Owner</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <span className="rounded-3xl bg-slate-900 px-3 py-2 text-xs text-slate-300">Active since 2025</span>
            <span className="rounded-3xl bg-slate-900 px-3 py-2 text-xs text-slate-300">Last login 2h ago</span>
          </div>
        </div>

        <form action="/api/auth/logout" method="post" className="mt-6 border-t border-slate-800 pt-6">
          <button type="submit" className="flex w-full items-center justify-center gap-3 rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white">
            Logout
          </button>
        </form>
      </aside>
    </>
  );
}
