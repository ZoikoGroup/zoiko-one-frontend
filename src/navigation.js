import {
  Activity,
  AlertTriangle,
  Award,
  BadgeCheck,
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CalendarCheck,
  CircleDollarSign,
  ClipboardCheck,
  Download,
  RefreshCw,
  ClipboardList,
  Clock,
  CreditCard,
  FileCheck2,
  FileText,
  GitBranch,
  Globe,
  GraduationCap,
  HeartHandshake,
  History,
  LayoutDashboard,
  Layers,
  MapPin,
  MessageSquare,
  MinusCircle,
  Network,
  Package,
  Phone,
  Plane,
  PlayCircle,
  PlusCircle,
  Receipt,
  Search,
  Send,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tags,
  Target,
  TrendingUp,
  Undo2,
  User,
  UserCheck,
  UserPlus,
  Users,
  WalletCards,
  Workflow,
  Save,
  UserRoundCheck,
  Wrench,
} from "lucide-react";

// Shared Layers – first‑class section
const sharedLayers = {
  title: "SHARED LAYERS",
  items: [
    { label: "API Gateway", href: "/shared/api-gateway", icon: Network },
    { label: "Common UI Kit", href: "/shared/ui-kit", icon: Layers },
  ],
};

// Platform core commands
const platform = {
  title: "PLATFORM",
  items: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Organizations", href: "/organizations", icon: ShieldCheck, badge: "3" },
  ],
};

// Super Admin / Platform Owner
const superAdmin = {
  title: "SUPER ADMIN",
  items: [
    {
      label: "Platform Owner",
      href: "/admin-profile",
      icon: User,
      dp: true,
    },
  ],
};
// Platform Command collapsible section
const platformCommand = {
  title: "PLATFORM COMMAND",
  items: [
    {
      label: "Platform Command",
      icon: SlidersHorizontal,
      children: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Organizations", href: "/organizations", icon: ShieldCheck, badge: "3" },
        { label: "Plans & Subscriptions", href: "/subscriptions", icon: CreditCard },
      ],
    },
  ],
};

// Products (including Zoiko HR and other products)
const products = {
  title: "PRODUCTS",
  items: [
    {
      label: "Products",
      icon: Package,
      children: [
        {
          label: "Zoiko HR",
          icon: Users,
          badge: "HR",
          children: [
            { label: "Dashboard",          href: "/zoiko-hr",                    icon: LayoutDashboard },
            { label: "Workforce",          href: "/zoiko-hr/workforce",          icon: Users },
            { label: "Documents",          icon: FileText, children: [
              { label: "Dashboard",            href: "/zoiko-hr/documents",                   icon: LayoutDashboard },
              { label: "Employee Documents",   href: "/zoiko-hr/documents/employee-documents", icon: FileText },
              { label: "Company Documents",    href: "/zoiko-hr/documents/company-documents",  icon: Building2 },
              { label: "Templates",            href: "/zoiko-hr/documents/templates",          icon: FileCheck2 },
              { label: "Policies",             href: "/zoiko-hr/documents/policies",           icon: ShieldCheck },
              { label: "Compliance Documents", href: "/zoiko-hr/documents/compliance",         icon: Shield },
              { label: "Approval Workflow",    href: "/zoiko-hr/documents/approvals",          icon: ClipboardCheck },
              { label: "Expiring Documents",   href: "/zoiko-hr/documents/expiring-documents", icon: Clock },
              { label: "Archive",              href: "/zoiko-hr/documents/archive",            icon: History },
              { label: "Reports",              href: "/zoiko-hr/documents/reports",            icon: FileText },
              { label: "Settings",             href: "/zoiko-hr/documents/settings",           icon: SlidersHorizontal },
            ]},
            { label: "Departments",        icon: Building2, children: [
              { label: "Dashboard",            href: "/zoiko-hr/departments",             icon: LayoutDashboard },
              { label: "Department List",      href: "/zoiko-hr/departments/list",        icon: Building2 },
              { label: "Structure",            href: "/zoiko-hr/departments/structure",    icon: GitBranch },
              { label: "Reports",              href: "/zoiko-hr/departments/reports",      icon: FileText },
              { label: "Settings",             href: "/zoiko-hr/departments/settings",     icon: SlidersHorizontal },
            ]},
            { label: "Designations",       icon: BadgeCheck, children: [
              { label: "Dashboard",            href: "/zoiko-hr/designations",             icon: LayoutDashboard },
              { label: "Designation List",     href: "/zoiko-hr/designations/list",        icon: BadgeCheck },
              { label: "Level Matrix",         href: "/zoiko-hr/designations/levels",       icon: Layers },
              { label: "Reports",              href: "/zoiko-hr/designations/reports",      icon: FileText },
              { label: "Settings",             href: "/zoiko-hr/designations/settings",     icon: SlidersHorizontal },
            ]},
            { label: "Leave",              icon: Calendar, children: [
              { label: "Dashboard",            href: "/zoiko-hr/leave",                    icon: LayoutDashboard },
              { label: "My Leave",             href: "/zoiko-hr/leave/my-leave",            icon: User },
              { label: "Leave Requests",       href: "/zoiko-hr/leave/requests",            icon: ClipboardCheck },
              { label: "Calendar",             href: "/zoiko-hr/leave/calendar",            icon: Calendar },
              { label: "Leave Types",          href: "/zoiko-hr/leave/leave-types",         icon: Tags },
              { label: "Reports",              href: "/zoiko-hr/leave/reports",             icon: FileText },
              { label: "Settings",             href: "/zoiko-hr/leave/settings",            icon: SlidersHorizontal },
            ]},
            { label: "Attendance", icon: Clock, children: [
              { label: "Dashboard",              href: "/zoiko-hr/attendance",             icon: LayoutDashboard },
              { label: "Daily Attendance",       href: "/zoiko-hr/attendance/daily",       icon: ClipboardList },
              { label: "Attendance Regularization", href: "/zoiko-hr/attendance/regularization", icon: AlertTriangle },
              { label: "Attendance Policies",    href: "/zoiko-hr/attendance/policies",    icon: FileCheck2 },
              { label: "Shift Management",       href: "/zoiko-hr/attendance/shifts",      icon: Clock },
              { label: "Shift Rosters",          href: "/zoiko-hr/attendance/rosters",     icon: Calendar },
              { label: "My Attendance",          href: "/zoiko-hr/attendance/my-attendance", icon: User },
              { label: "Biometric Integration",  href: "/zoiko-hr/attendance/biometric",   icon: ShieldCheck },
              { label: "Geofencing",             href: "/zoiko-hr/attendance/geofencing",  icon: MapPin },
              { label: "Overtime Management",    href: "/zoiko-hr/attendance/overtime",    icon: TrendingUp },
              { label: "Attendance Reports",     href: "/zoiko-hr/attendance/reports",     icon: FileText },
              { label: "Attendance Analytics",   href: "/zoiko-hr/attendance/analytics",   icon: BarChart3 },
              { label: "Attendance Exceptions",  href: "/zoiko-hr/attendance/exceptions",  icon: AlertTriangle },
              { label: "Holiday Calendar",       href: "/zoiko-hr/attendance/holidays",    icon: Calendar },
              { label: "Weekend Configuration",  href: "/zoiko-hr/attendance/weekends",    icon: CalendarCheck },
              { label: "Audit Logs",             href: "/zoiko-hr/attendance/audit-logs",  icon: History },
              { label: "Settings",               href: "/zoiko-hr/attendance/settings",    icon: SlidersHorizontal },
            ]},
            { label: "Performance",        icon: Activity, children: [
              { label: "Dashboard",             href: "/zoiko-hr/performance",              icon: LayoutDashboard },
              { label: "Goals & OKRs",          href: "/zoiko-hr/performance/goals",        icon: Target },
              { label: "Performance Reviews",   href: "/zoiko-hr/performance/reviews",      icon: ClipboardCheck },
              { label: "Appraisals",            href: "/zoiko-hr/performance/appraisals",   icon: Award },
              { label: "Performance Analytics", href: "/zoiko-hr/performance/analytics",    icon: BarChart3 },
            ]},
            { label: "Recruitment",        icon: UserPlus, children: [
              { label: "Dashboard",              href: "/zoiko-hr/recruitment",                 icon: LayoutDashboard },
              { label: "Job Requisitions",       href: "/zoiko-hr/recruitment/job-requisitions", icon: Briefcase },
              { label: "Open Positions",         href: "/zoiko-hr/recruitment/open-positions",   icon: UserPlus },
              { label: "Candidates",             href: "/zoiko-hr/recruitment/candidates",       icon: Users },
              { label: "Interview Pipeline",     href: "/zoiko-hr/recruitment/interview-pipeline", icon: Calendar },
              { label: "Offer Management",       href: "/zoiko-hr/recruitment/offers",           icon: FileCheck2 },
              { label: "Hiring Schedule",        href: "/zoiko-hr/recruitment/hiring-schedule",  icon: Calendar },
              { label: "Recruitment Analytics",  href: "/zoiko-hr/recruitment/analytics",        icon: BarChart3 },
              { label: "Reports",                href: "/zoiko-hr/recruitment/reports",          icon: FileText },
              { label: "Settings",               href: "/zoiko-hr/recruitment/settings",         icon: SlidersHorizontal },
            ]},
            { label: "Onboarding",         icon: UserCheck, children: [
              { label: "Dashboard",             href: "/zoiko-hr/onboarding",               icon: LayoutDashboard },
              { label: "New Hires",             href: "/zoiko-hr/onboarding/new-hires",      icon: UserPlus },
              { label: "Pre-Onboarding",        href: "/zoiko-hr/onboarding/pre-onboarding", icon: CalendarCheck },
              { label: "Documents",             href: "/zoiko-hr/onboarding/documents",       icon: FileText },
              { label: "Checklists",            href: "/zoiko-hr/onboarding/checklists",     icon: ClipboardCheck },
              { label: "Dept Assignment",       href: "/zoiko-hr/onboarding/department-assignment", icon: Building2 },
              { label: "Manager Assignment",    href: "/zoiko-hr/onboarding/manager-assignment",   icon: UserCheck },
              { label: "Assets & Access",       href: "/zoiko-hr/onboarding/assets-access",   icon: Package },
              { label: "Orientation",           href: "/zoiko-hr/onboarding/orientation",     icon: Calendar },
              { label: "Training",              href: "/zoiko-hr/onboarding/training",        icon: BookOpen },
              { label: "Progress",              href: "/zoiko-hr/onboarding/progress",        icon: Activity },
              { label: "Reports",               href: "/zoiko-hr/onboarding/reports",         icon: BarChart3 },
              { label: "Settings",              href: "/zoiko-hr/onboarding/settings",        icon: SlidersHorizontal },
            ]},
            { label: "Assets",             icon: Package, children: [
              { label: "Dashboard",          href: "/zoiko-hr/assets",                icon: LayoutDashboard },
              { label: "My Assets",          href: "/zoiko-hr/assets/my-assets",       icon: Package },
              { label: "Asset Catalog",      href: "/zoiko-hr/assets/catalog",         icon: Layers },
              { label: "Asset Requests",     href: "/zoiko-hr/assets/requests",        icon: ClipboardList },
              { label: "Maintenance",        href: "/zoiko-hr/assets/maintenance",     icon: Wrench },
              { label: "Reports",            href: "/zoiko-hr/assets/reports",         icon: FileText },
              { label: "Settings",           href: "/zoiko-hr/assets/settings",        icon: SlidersHorizontal },
            ]},
            { label: "Learning",           icon: BookOpen, children: [
              { label: "Dashboard",          href: "/zoiko-hr/learning",               icon: LayoutDashboard },
              { label: "Courses",            href: "/zoiko-hr/learning/courses",        icon: BookOpen },
              { label: "Training Programs",  href: "/zoiko-hr/learning/training-programs", icon: GraduationCap },
              { label: "Learning Paths",     href: "/zoiko-hr/learning/paths",          icon: GitBranch },
              { label: "Certifications",     href: "/zoiko-hr/learning/certifications", icon: Award },
              { label: "Skill Matrix",       href: "/zoiko-hr/learning/skills",         icon: BarChart3 },
              { label: "Assessments",        href: "/zoiko-hr/learning/assessments",    icon: ClipboardCheck },
              { label: "Calendar",           href: "/zoiko-hr/learning/calendar",       icon: Calendar },
              { label: "Progress",           href: "/zoiko-hr/learning/progress",       icon: TrendingUp },
              { label: "Reports",            href: "/zoiko-hr/learning/reports",        icon: FileText },
            ]},
            { label: "Compensation",       icon: CircleDollarSign, children: [
              { label: "Dashboard",          href: "/zoiko-hr/compensation",               icon: LayoutDashboard },
              { label: "Salary Structures",  href: "/zoiko-hr/compensation/salary-structures", icon: CircleDollarSign },
              { label: "Pay Grades",         href: "/zoiko-hr/compensation/pay-grades",     icon: BadgeCheck },
              { label: "Salary Components",  href: "/zoiko-hr/compensation/salary-components", icon: Layers },
              { label: "Compensation Bands", href: "/zoiko-hr/compensation/bands",          icon: BarChart3 },
              { label: "Salary Revisions",   href: "/zoiko-hr/compensation/revisions",      icon: History },
              { label: "Allowances",         href: "/zoiko-hr/compensation/allowances",     icon: WalletCards },
              { label: "Benefits",           href: "/zoiko-hr/compensation/benefits",       icon: HeartHandshake },
            ]},
            { label: "ESS",                icon: User, children: [
              { label: "Dashboard",          href: "/zoiko-hr/ess",                   icon: LayoutDashboard },
              { label: "Profile",            href: "/zoiko-hr/ess/profile",           icon: User },
              { label: "Leave Management",   href: "/zoiko-hr/ess/leave",             icon: Calendar },
              { label: "Attendance",         href: "/zoiko-hr/ess/attendance",        icon: Clock },
              { label: "My Documents",       href: "/zoiko-hr/ess/my-documents",      icon: FileText },
              { label: "Requests",           href: "/zoiko-hr/ess/requests",          icon: ClipboardList },
              { label: "Settings",           href: "/zoiko-hr/ess/settings",          icon: SlidersHorizontal },
            ]},
            { label: "Travel",             icon: Plane, children: [
              { label: "Dashboard",          href: "/zoiko-hr/travel",                icon: LayoutDashboard },
              { label: "Travel Requests",    href: "/zoiko-hr/travel/requests",       icon: Plane },
              { label: "Approvals",          href: "/zoiko-hr/travel/approvals",      icon: ClipboardCheck },
              { label: "Itineraries",        href: "/zoiko-hr/travel/itineraries",    icon: MapPin },
              { label: "Expenses",           href: "/zoiko-hr/travel/expenses",       icon: Receipt },
              { label: "Reports",            href: "/zoiko-hr/travel/reports",        icon: FileText },
              { label: "Settings",           href: "/zoiko-hr/travel/settings",       icon: SlidersHorizontal },
            ]},
            { label: "Compliance",        icon: ShieldCheck, children: [
              { label: "Dashboard",           href: "/zoiko-hr/compliance",             icon: LayoutDashboard },
              { label: "Policy Library",      href: "/zoiko-hr/compliance/policies",    icon: FileCheck2 },
              { label: "Compliance Tracking", href: "/zoiko-hr/compliance/tracking",    icon: ClipboardCheck },
              { label: "Audits",              href: "/zoiko-hr/compliance/audits",      icon: Search },
              { label: "Violations",          href: "/zoiko-hr/compliance/violations",  icon: AlertTriangle },
              { label: "Risk Assessment",     href: "/zoiko-hr/compliance/risks",       icon: Shield },
              { label: "Regulations",         href: "/zoiko-hr/compliance/regulations", icon: BookOpen },
              { label: "Corrective Actions",  href: "/zoiko-hr/compliance/corrective-actions", icon: Briefcase },
              { label: "Reports",             href: "/zoiko-hr/compliance/reports",     icon: FileText },
              { label: "Settings",            href: "/zoiko-hr/compliance/settings",    icon: SlidersHorizontal },
            ]},
            { label: "Engagement",         icon: HeartHandshake, children: [
              { label: "Wellness Programs", href: "/zoiko-hr/engagement/wellness", icon: HeartHandshake },
              { label: "CSR Activities",    href: "/zoiko-hr/engagement/csr",      icon: Globe },
              { label: "Communications",    href: "/zoiko-hr/engagement/communications", icon: MessageSquare },
              { label: "Announcements",     href: "/zoiko-hr/engagement/announcements", icon: Bell },
              { label: "NPS Surveys",       href: "/zoiko-hr/engagement/nps",      icon: BarChart3 },
              { label: "Analytics",         href: "/zoiko-hr/engagement/analytics", icon: BarChart3 },
              { label: "Reports",           href: "/zoiko-hr/engagement/reports",   icon: FileText },
              { label: "Settings",          href: "/zoiko-hr/engagement/settings",  icon: SlidersHorizontal },
            ]},
            { label: "Workforce Planning", icon: Target, children: [
              { label: "Dashboard",             href: "/zoiko-hr/workforce-planning",       icon: LayoutDashboard },
              { label: "Plans",                 href: "/zoiko-hr/workforce-planning/plans",  icon: Target },
              { label: "Headcount",             href: "/zoiko-hr/workforce-planning/headcount", icon: Users },
              { label: "Succession",            href: "/zoiko-hr/workforce-planning/succession", icon: UserCheck },
              { label: "Scenario Planning",     href: "/zoiko-hr/workforce-planning/scenarios", icon: GitBranch },
              { label: "Reports",               href: "/zoiko-hr/workforce-planning/reports", icon: FileText },
              { label: "Settings",              href: "/zoiko-hr/workforce-planning/settings", icon: SlidersHorizontal },
            ]},
          ],
        },
        { label: "ZoikoTime", href: "/zoikotime", icon: ShieldCheck, badge: "Time" },
        {
          label: "Zoiko Payroll",
          icon: WalletCards,
          badge: "Payroll",
          children: [
            { label: "Dashboard", href: "/payroll", icon: LayoutDashboard },
            { label: "Company Setup", href: "/payroll/company-setup", icon: Building2 },
            { label: "Employees", href: "/payroll/employees", icon: Users },
            { label: "Payroll Runs", href: "/payroll/payroll-runs", icon: PlayCircle },
            { label: "Exceptions", href: "/payroll/exceptions", icon: AlertTriangle },
            { label: "Approvals", href: "/payroll/approvals", icon: FileCheck2 },
            { label: "Payments", href: "/payroll/payments", icon: CreditCard },
            { label: "Payslips", href: "/payroll/payslips", icon: FileText },
            { label: "Reports", href: "/payroll/reports", icon: BarChart3 },
            { label: "Audit & Compliance", href: "/payroll/audit", icon: ShieldCheck },
            { label: "Settings", href: "/payroll/settings", icon: SlidersHorizontal },
          ],
        },
        {
          label: "Zoiko Billing",
          icon: CreditCard,
          badge: "Billing",
          children: [
            { label: "Dashboard", href: "/billing", icon: LayoutDashboard },
            { label: "Invoices", href: "/billing/invoices", icon: FileText },
            { label: "Invoice Schedules", href: "/billing/invoice-schedules", icon: Calendar },
            { label: "Usage Billing", href: "/billing/usage-billing", icon: TrendingUp },
            { label: "Tax", href: "/billing/tax", icon: Receipt },
            { label: "Collections & Receivables", href: "/billing/collections-receivables", icon: WalletCards },
            { label: "Credit Notes & Adjustments", href: "/billing/credit-notes", icon: CircleDollarSign },
            { label: "Dunning", href: "/billing/dunning", icon: ClipboardCheck },
            { label: "Reports", href: "/billing/reports", icon: BarChart3 },
          ],
        },
        {
          label: "Zoiko Spend",
          icon: WalletCards,
          badge: "Spend",
          children: [
            { label: "Purchase Requests",   href: "/spend/purchase-requests",   icon: ClipboardList },
            { label: "Purchase Orders",     href: "/spend/purchase-orders",     icon: FileText },
            { label: "Vendors",             href: "/spend/vendors",             icon: Building2 },
            { label: "Supplier Invoices",   href: "/spend/supplier-invoices",   icon: Receipt },
            { label: "AP Workflow",         href: "/spend/ap-workflow",         icon: Workflow },
            { label: "Spend Policy",        href: "/spend/spend-policy",        icon: FileCheck2 },
            { label: "Approvals",           href: "/spend/approvals",           icon: ClipboardCheck },
            { label: "Payment Preparation", href: "/spend/payment-preparation", icon: CreditCard },
          ],
        },
        { label: "Zoiko Projects", href: "/projects", icon: Layers, badge: "Projects" },
        {
          label: "Zoiko Inventory",
          icon: Package,
          badge: "Inventory",
          children: [
            { label: "Items", href: "/inventory/items", icon: Layers },
            { label: "Locations", href: "/inventory/locations", icon: MapPin },
            { label: "Stock", href: "/inventory/stock", icon: Package },
            { label: "Receiving", href: "/inventory/receiving", icon: Download },
            { label: "Goods Issue", href: "/inventory/goods-issue", icon: Send },
            { label: "Transfers", href: "/inventory/transfers", icon: GitBranch },
            { label: "Stock Counts", href: "/inventory/stock-counts", icon: ClipboardList },
            { label: "Reorder", href: "/inventory/reorder", icon: RefreshCw },
            { label: "Assets", href: "/inventory/assets", icon: Package },
            { label: "Reports", href: "/inventory/reports", icon: FileText },
          ],
        },
        {
          label: "Zoiko Comply",
          icon: FileCheck2,
          badge: "Comply",
          children: [
            { label: "Dashboard", href: "/comply", icon: LayoutDashboard },
            { label: "Policies", href: "/comply/policies", icon: FileCheck2 },
            { label: "Audits", href: "/comply/audits", icon: Search },
            { label: "Incidents", href: "/comply/incidents", icon: Activity },
            { label: "Certifications", href: "/comply/certifications", icon: Award },
            { label: "Compliance Monitoring", href: "/comply/compliance-monitoring", icon: ClipboardCheck },
            { label: "Reports", href: "/comply/reports", icon: BarChart3 },
            { label: "Settings", href: "/comply/settings", icon: SlidersHorizontal },
            { label: "Risk Management", href: "/comply/risk-management", icon: AlertTriangle },
            { label: "Controls", href: "/comply/controls", icon: Shield },
            { label: "Compliance Training", href: "/comply/training", icon: BookOpen },
          ],
        },
        {
          label: "Zoiko Insights",
          icon: Sparkles,
          badge: "Insights",
          children: [
            { label: "Dashboard", href: "/insights", icon: LayoutDashboard },
            { label: "Workforce Analytics", href: "/insights/workforce", icon: Users },
            { label: "Payroll Analytics", href: "/insights/payroll", icon: CircleDollarSign },
            { label: "Analytics", href: "/insights/analytics", icon: TrendingUp },
            { label: "Attendance Insights", href: "/insights/attendance", icon: Clock },
            { label: "Engagement Insights", href: "/insights/engagement", icon: HeartHandshake },
            { label: "Performance Insights", href: "/insights/performance", icon: Activity },
            { label: "Recruitment Insights", href: "/insights/recruitment", icon: UserPlus },
            { label: "Reports", href: "/insights/reports", icon: FileText },
            { label: "Settings", href: "/insights/settings", icon: SlidersHorizontal },
          ],
        },
      ],
    },
  ],
};

// Infrastructure
const infrastructure = {
  title: "INFRASTRUCTURE",
  items: [
    { label: "ZoikoPay", href: "/zoikopay", icon: CreditCard },
    { label: "ZoikoCoreX", href: "/zoikocorex", icon: Network },
  ],
};

// Platform Operations
const platformOperations = {
  title: "PLATFORM OPERATIONS",
  items: [
    {
      label: "Platform Operations",
      icon: Wrench,
      children: [
        { label: "Integrations", href: "/operations/integrations", icon: Globe },
        { label: "API Management", href: "/operations/api-management", icon: Network },
        { label: "Feature Flags", href: "/operations/feature-flags", icon: SlidersHorizontal },
        { label: "Notifications", href: "/operations/notifications", icon: Bell },
        { label: "System Monitoring", href: "/operations/system-monitoring", icon: Activity },
        { label: "Support Center", href: "/operations/support-center", icon: MessageSquare },
      ],
    },
  ],
};
// Platform Governance – directly after Platform
const platformGovernance = {
  title: "PLATFORM GOVERNANCE",
  items: [
    {
      label: "Platform Governance",
      icon: Shield,
      children: [
        { label: "User and Roles", href: "/roles", icon: Users, badge: "9" },
        { label: "Security Center", href: "/security-center", icon: ShieldCheck, badge: "1" },
        { label: "Trust Center", href: "/trust-center", icon: Sparkles },
        { label: "Audit Center", href: "/audit-center", icon: FileText },
        { label: "Compliance Center", href: "/compliance-center", icon: ClipboardCheck },
      ],
    },
  ],
};

// Shared Layers collapsible section
const sharedLayersSection = {
  title: "SHARED LAYERS",
  items: [
    {
      label: "Shared Layers",
      icon: Layers,
      children: [
        { label: "Zoiko ID", href: "/shared/id", icon: User },
        { label: "Zoiko Workflow", href: "/shared/workflow", icon: Workflow },
        { label: "Zoiko Hub", href: "/shared/hub", icon: Layers },
        { label: "Zoiko Connect", href: "/shared/connect", icon: Globe },
        { label: "Documents", href: "/shared/documents", icon: FileText },
        { label: "Approvals", href: "/shared/approvals", icon: FileCheck2 },
        { label: "Expenses", href: "/shared/expenses", icon: WalletCards },
        { label: "AI Assistance", href: "/shared/ai-assistance", icon: Sparkles },
      ],
    },
  ],
};

export const sections = [
  superAdmin,
  platformCommand,
  platformGovernance,
  products,
  sharedLayersSection,
  infrastructure,
  platformOperations,
];

function flattenItems(items) {
  return items.flatMap((item) => {
    const current = item.href ? [{ label: item.label, href: item.href, badge: item.badge }] : [];
    const children = item.children ? flattenItems(item.children) : [];
    return [...current, ...children];
  });
}

export const flatRoutes = flattenItems(sections.flatMap((section) => section.items));
