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
  Clock,
  CreditCard,
  FileCheck2,
  FileText,
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
  Undo2,
  User,
  UserCheck,
  UserPlus,
  Users,
  WalletCards,
  Workflow,
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
            { label: "Dashboard", href: "/zoiko-hr", icon: LayoutDashboard },
            { label: "Documents", href: "/zoiko-hr/documents", icon: FileText },
            { label: "Departments", href: "/zoiko-hr/departments", icon: Building2 },
            { label: "Designations", href: "/zoiko-hr/designations", icon: BadgeCheck },
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
        { label: "Zoiko Billing", href: "/billing", icon: CreditCard, badge: "Billing" },
        { label: "Zoiko Projects", href: "/projects", icon: Layers, badge: "Projects" },
        { label: "Zoiko Comply", href: "/comply", icon: FileCheck2, badge: "Comply" },
        { label: "Zoiko Insights", href: "/insights", icon: Sparkles, badge: "Insights" },
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
