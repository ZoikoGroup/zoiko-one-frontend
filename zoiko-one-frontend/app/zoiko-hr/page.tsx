import Link from "next/link";
import SuperAdminShell from "../components/SuperAdminShell";
import PageHeader from "../components/PageHeader";
import {
  Users,
  Calendar,
  Clock,
  Sparkles,
  UserPlus,
  GraduationCap,
  CircleDollarSign,
  HeartHandshake,
  MessageSquare,
  Award,
  Plane,
  ShieldCheck,
  Workflow,
  UserRoundCheck,
  Briefcase,
} from "lucide-react";

const hrModules = [
  {
    title: "Workforce",
    description: "Manage employees, records, documents and contacts.",
    href: "/zoiko-hr/workforce",
    icon: Briefcase,
    color: "from-indigo-600/30 to-indigo-900/10",
    iconColor: "text-indigo-400",
  },
  {
    title: "Leave Management",
    description: "Handle leave types, requests, balances and calendar.",
    href: "/zoiko-hr/leave",
    icon: Calendar,
    color: "from-emerald-600/30 to-emerald-900/10",
    iconColor: "text-emerald-400",
  },
  {
    title: "Attendance",
    description: "Track check-ins, shifts, records and attendance reports.",
    href: "/zoiko-hr/attendance",
    icon: Clock,
    color: "from-cyan-600/30 to-cyan-900/10",
    iconColor: "text-cyan-400",
  },
  {
    title: "Performance",
    description: "Goals, reviews and 360° feedback cycles.",
    href: "/zoiko-hr/performance",
    icon: Sparkles,
    color: "from-violet-600/30 to-violet-900/10",
    iconColor: "text-violet-400",
  },
  {
    title: "Recruitment",
    description: "Job openings, candidates, interviews and offers.",
    href: "/zoiko-hr/recruitment",
    icon: UserPlus,
    color: "from-sky-600/30 to-sky-900/10",
    iconColor: "text-sky-400",
  },
  {
    title: "Onboarding",
    description: "New joiners, document verification, probation and kits.",
    href: "/zoiko-hr/onboarding",
    icon: UserRoundCheck,
    color: "from-teal-600/30 to-teal-900/10",
    iconColor: "text-teal-400",
  },
  {
    title: "Learning & Development",
    description: "Courses, certifications, learning paths and enrollments.",
    href: "/zoiko-hr/learning",
    icon: GraduationCap,
    color: "from-amber-600/30 to-amber-900/10",
    iconColor: "text-amber-400",
  },
  {
    title: "Compensation & Benefits",
    description: "Salary structures, pay grades, allowances and reviews.",
    href: "/zoiko-hr/compensation",
    icon: CircleDollarSign,
    color: "from-lime-600/30 to-lime-900/10",
    iconColor: "text-lime-400",
  },
  {
    title: "Employee Engagement",
    description: "Surveys, pulse checks, recognition and sentiment analysis.",
    href: "/zoiko-hr/engagement",
    icon: HeartHandshake,
    color: "from-rose-600/30 to-rose-900/10",
    iconColor: "text-rose-400",
  },
  {
    title: "HR Helpdesk",
    description: "Tickets, employee requests, cases and SLA tracking.",
    href: "/zoiko-hr/helpdesk",
    icon: MessageSquare,
    color: "from-orange-600/30 to-orange-900/10",
    iconColor: "text-orange-400",
  },
  {
    title: "Rewards & Recognition",
    description: "Awards, programs, points and achievement tracking.",
    href: "/zoiko-hr/rewards",
    icon: Award,
    color: "from-yellow-600/30 to-yellow-900/10",
    iconColor: "text-yellow-400",
  },
  {
    title: "Travel & Expenses",
    description: "Travel requests, expense claims, approvals and reimbursements.",
    href: "/zoiko-hr/travel",
    icon: Plane,
    color: "from-fuchsia-600/30 to-fuchsia-900/10",
    iconColor: "text-fuchsia-400",
  },
  {
    title: "Compliance & Policy",
    description: "Policies, requirements, audits, violations and training.",
    href: "/zoiko-hr/compliance",
    icon: ShieldCheck,
    color: "from-red-600/30 to-red-900/10",
    iconColor: "text-red-400",
  },
  {
    title: "Workforce Planning",
    description: "Headcount, forecasting, hiring plans and succession.",
    href: "/zoiko-hr/workforce-planning",
    icon: Workflow,
    color: "from-blue-600/30 to-blue-900/10",
    iconColor: "text-blue-400",
  },
  {
    title: "Employee Self Service",
    description: "Employee portal for leave, payslips, documents and profile.",
    href: "/zoiko-hr/ess",
    icon: Users,
    color: "from-pink-600/30 to-pink-900/10",
    iconColor: "text-pink-400",
  },
];

export default function ZoikoHRPage() {
  return (
    <SuperAdminShell>
      <PageHeader
        title="Zoiko HR"
        description="Complete Human Resource Management — workforce, compliance, performance and more."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {hrModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.href}
              href={mod.href}
              className={`group relative overflow-hidden rounded-[24px] border border-slate-800 bg-gradient-to-br ${mod.color} p-5 shadow-[0_16px_60px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-[0_24px_80px_rgba(0,0,0,0.4)]`}
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900/60">
                <Icon className={`h-5 w-5 ${mod.iconColor}`} />
              </div>
              <h3 className="text-sm font-semibold text-white">{mod.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                {mod.description}
              </p>
              <div className="mt-3 text-xs font-medium text-slate-500 transition group-hover:text-slate-300">
                Open →
              </div>
            </Link>
          );
        })}
      </div>
    </SuperAdminShell>
  );
}
