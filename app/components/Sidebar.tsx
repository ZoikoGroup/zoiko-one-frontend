"use client";

import { Activity, AlertTriangle, Award, BadgeCheck, BarChart3, Bell, BookOpen, Briefcase, Building2, Calendar, CalendarCheck, ChevronDown, ChevronRight, CircleDollarSign, ClipboardCheck, Clock, CreditCard, FileCheck2, FileText, Globe, GraduationCap, HeartHandshake, History, LayoutDashboard, Layers, MapPin, MessageSquare, MinusCircle, Network, Package, Phone, Plane, PlusCircle, Receipt, Search, Send, Shield, ShieldCheck, SlidersHorizontal, Sparkles, Tags, Target, Undo2, User, UserCheck, UserPlus, Users, WalletCards, Workflow, UserRoundCheck, Wrench } from "lucide-react";
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
              { label: "Dashboard", href: "/zoiko-hr/workforce", icon: LayoutDashboard },
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
              { label: "Dashboard", href: "/zoiko-hr/leave", icon: LayoutDashboard },
              { label: "Leave Types", href: "/zoiko-hr/leave/leave-types", icon: FileText },
              { label: "Leave Requests", href: "/zoiko-hr/leave/requests", icon: Calendar },
              { label: "Leave Balances", href: "/zoiko-hr/leave/balances", icon: WalletCards },
              { label: "Calendar", href: "/zoiko-hr/leave/calendar", icon: Calendar },
            ],
          },
          {
            label: "Attendance Management",
            icon: Clock,
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
          {
            label: "Recruitment Management",
            icon: UserPlus,
            children: [
              { label: "Dashboard", href: "/zoiko-hr/recruitment", icon: LayoutDashboard },
              { label: "Job Openings", href: "/zoiko-hr/recruitment/job-openings", icon: Briefcase },
              { label: "Candidates", href: "/zoiko-hr/recruitment/candidates", icon: Users },
              { label: "Interviews", href: "/zoiko-hr/recruitment/interviews", icon: Calendar },
              { label: "Offers", href: "/zoiko-hr/recruitment/offers", icon: BadgeCheck },
              { label: "Reports", href: "/zoiko-hr/recruitment/reports", icon: SlidersHorizontal },
            ],
          },
          {
            label: "Onboarding Management",
            icon: UserRoundCheck,
            children: [
              { label: "Dashboard", href: "/zoiko-hr/onboarding", icon: LayoutDashboard },
              { label: "New Joiners", href: "/zoiko-hr/onboarding/new-joiners", icon: Users },
              { label: "Document Verification", href: "/zoiko-hr/onboarding/document-verification", icon: FileText },
              { label: "Asset Allocation", href: "/zoiko-hr/onboarding/asset-allocation", icon: Briefcase },
              { label: "Welcome Kit", href: "/zoiko-hr/onboarding/welcome-kit", icon: BadgeCheck },
              { label: "Probation Tracking", href: "/zoiko-hr/onboarding/probation", icon: Calendar },
              { label: "Reports", href: "/zoiko-hr/onboarding/reports", icon: SlidersHorizontal },
            ],
          },
          {
            label: "Asset Management",
            icon: Package,
            children: [
              { label: "Dashboard", href: "/zoiko-hr/assets", icon: LayoutDashboard },
              { label: "Inventory", href: "/zoiko-hr/assets/inventory", icon: Package },
              { label: "Categories", href: "/zoiko-hr/assets/categories", icon: Layers },
              { label: "Allocation", href: "/zoiko-hr/assets/allocation", icon: ClipboardCheck },
              { label: "Returns", href: "/zoiko-hr/assets/returns", icon: Undo2 },
              { label: "Maintenance", href: "/zoiko-hr/assets/maintenance", icon: Wrench },
              { label: "Reports", href: "/zoiko-hr/assets/reports", icon: SlidersHorizontal },
            ],
          },
          {
            label: "Learning & Development",
            icon: GraduationCap,
            children: [
              { label: "Dashboard", href: "/zoiko-hr/learning", icon: LayoutDashboard },
              { label: "Courses", href: "/zoiko-hr/learning/courses", icon: BookOpen },
              { label: "Learning Paths", href: "/zoiko-hr/learning/learning-paths", icon: Layers },
              { label: "Certifications", href: "/zoiko-hr/learning/certifications", icon: BadgeCheck },
              { label: "Assessments", href: "/zoiko-hr/learning/assessments", icon: ClipboardCheck },
              { label: "Enrollments", href: "/zoiko-hr/learning/enrollments", icon: Users },
              { label: "Reports", href: "/zoiko-hr/learning/reports", icon: SlidersHorizontal },
            ],
          },
          {
            label: "Compensation & Benefits",
            icon: CircleDollarSign,
            children: [
              { label: "Dashboard", href: "/zoiko-hr/compensation", icon: LayoutDashboard },
              { label: "Salary Structures", href: "/zoiko-hr/compensation/salary-structures", icon: Layers },
              { label: "Pay Grades", href: "/zoiko-hr/compensation/pay-grades", icon: BarChart3 },
              { label: "Allowances", href: "/zoiko-hr/compensation/allowances", icon: PlusCircle },
              { label: "Deductions", href: "/zoiko-hr/compensation/deductions", icon: MinusCircle },
              { label: "Benefits", href: "/zoiko-hr/compensation/benefits", icon: HeartHandshake },
              { label: "Bonuses & Incentives", href: "/zoiko-hr/compensation/bonuses", icon: Award },
              { label: "Compensation Reviews", href: "/zoiko-hr/compensation/reviews", icon: ClipboardCheck },
              { label: "Salary Revision History", href: "/zoiko-hr/compensation/salary-history", icon: History },
              { label: "Reports", href: "/zoiko-hr/compensation/reports", icon: SlidersHorizontal },
            ],
          },
          {
            label: "Employee Self Service",
            icon: Users,
            children: [
              { label: "Dashboard", href: "/zoiko-hr/ess", icon: LayoutDashboard },
              { label: "My Profile", href: "/zoiko-hr/ess/my-profile", icon: User },
              { label: "My Attendance", href: "/zoiko-hr/ess/my-attendance", icon: Clock },
              { label: "My Leave", href: "/zoiko-hr/ess/my-leave", icon: CalendarCheck },
              { label: "My Documents", href: "/zoiko-hr/ess/my-documents", icon: FileText },
              { label: "My Assets", href: "/zoiko-hr/ess/my-assets", icon: Package },
              { label: "My Learning", href: "/zoiko-hr/ess/my-learning", icon: BookOpen },
              { label: "My Performance", href: "/zoiko-hr/ess/my-performance", icon: Sparkles },
              { label: "My Payslips", href: "/zoiko-hr/ess/my-payslips", icon: WalletCards },
              { label: "My Requests", href: "/zoiko-hr/ess/my-requests", icon: Send },
              { label: "Notifications", href: "/zoiko-hr/ess/notifications", icon: Bell },
            ],
          },
          {
            label: "Travel & Expense Management",
            icon: Plane,
            children: [
              { label: "Dashboard", href: "/zoiko-hr/travel", icon: LayoutDashboard },
              { label: "Travel Requests", href: "/zoiko-hr/travel/travel-requests", icon: Globe },
              { label: "Expense Claims", href: "/zoiko-hr/travel/expense-claims", icon: Receipt },
              { label: "Expense Categories", href: "/zoiko-hr/travel/expense-categories", icon: Tags },
              { label: "Approvals", href: "/zoiko-hr/travel/approvals", icon: ClipboardCheck },
              { label: "Reimbursements", href: "/zoiko-hr/travel/reimbursements", icon: CircleDollarSign },
              { label: "Corporate Travel", href: "/zoiko-hr/travel/corporate-travel", icon: Briefcase },
              { label: "Policy Management", href: "/zoiko-hr/travel/policy-management", icon: FileText },
              { label: "Reports", href: "/zoiko-hr/travel/reports", icon: SlidersHorizontal },
            ],
          },
          {
            label: "Compliance & Policy Management",
            icon: ShieldCheck,
            children: [
              { label: "Dashboard", href: "/zoiko-hr/compliance", icon: LayoutDashboard },
              { label: "Policies", href: "/zoiko-hr/compliance/policies", icon: FileText },
              { label: "Policy Categories", href: "/zoiko-hr/compliance/policy-categories", icon: Layers },
              { label: "Employee Acknowledgements", href: "/zoiko-hr/compliance/acknowledgements", icon: UserCheck },
              { label: "Compliance Requirements", href: "/zoiko-hr/compliance/requirements", icon: ClipboardCheck },
              { label: "Audits", href: "/zoiko-hr/compliance/audits", icon: Search },
              { label: "Violations", href: "/zoiko-hr/compliance/violations", icon: AlertTriangle },
              { label: "Corrective Actions", href: "/zoiko-hr/compliance/corrective-actions", icon: Wrench },
              { label: "Training Compliance", href: "/zoiko-hr/compliance/training-compliance", icon: GraduationCap },
              { label: "Reports", href: "/zoiko-hr/compliance/reports", icon: SlidersHorizontal },
            ],
          },
          {
            label: "Employee Engagement & Surveys",
            icon: HeartHandshake,
            children: [
              { label: "Dashboard", href: "/zoiko-hr/engagement", icon: LayoutDashboard },
              { label: "Surveys", href: "/zoiko-hr/engagement/surveys", icon: MessageSquare },
              { label: "Survey Templates", href: "/zoiko-hr/engagement/survey-templates", icon: Layers },
              { label: "Pulse Surveys", href: "/zoiko-hr/engagement/pulse-surveys", icon: Activity },
              { label: "Feedback Campaigns", href: "/zoiko-hr/engagement/feedback-campaigns", icon: Send },
              { label: "Recognition Programs", href: "/zoiko-hr/engagement/recognition-programs", icon: Award },
              { label: "Employee Recognition", href: "/zoiko-hr/engagement/employee-recognition", icon: BadgeCheck },
              { label: "Engagement Scores", href: "/zoiko-hr/engagement/engagement-scores", icon: BarChart3 },
              { label: "Sentiment Analysis", href: "/zoiko-hr/engagement/sentiment-analysis", icon: Sparkles },
              { label: "Action Plans", href: "/zoiko-hr/engagement/action-plans", icon: Target },
              { label: "Reports", href: "/zoiko-hr/engagement/reports", icon: SlidersHorizontal },
            ],
          },
          {
            label: "Workforce Planning",
            icon: Workflow,
            children: [
              { label: "Dashboard", href: "/zoiko-hr/workforce-planning", icon: LayoutDashboard },
              { label: "Headcount Planning", href: "/zoiko-hr/workforce-planning/headcount", icon: Users },
              { label: "Workforce Forecasting", href: "/zoiko-hr/workforce-planning/forecasting", icon: BarChart3 },
              { label: "Hiring Plans", href: "/zoiko-hr/workforce-planning/hiring-plans", icon: UserPlus },
              { label: "Capacity Planning", href: "/zoiko-hr/workforce-planning/capacity", icon: Layers },
              { label: "Skills Gap Analysis", href: "/zoiko-hr/workforce-planning/skill-gaps", icon: Search },
              { label: "Succession Planning", href: "/zoiko-hr/workforce-planning/succession", icon: Target },
              { label: "Budget Planning", href: "/zoiko-hr/workforce-planning/budget", icon: CircleDollarSign },
              { label: "Scenarios", href: "/zoiko-hr/workforce-planning/scenarios", icon: Sparkles },
              { label: "Reports", href: "/zoiko-hr/workforce-planning/reports", icon: SlidersHorizontal },
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
                    <div className={`overflow-hidden transition-[max-height] duration-300 ${productOpen ? "max-h-[10000px]" : "max-h-0"}`}>
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
