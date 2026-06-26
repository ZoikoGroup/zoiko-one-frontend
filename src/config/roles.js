export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  HR_ADMIN: "hr_admin",
  EMPLOYEE: "employee",
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.ADMIN]: "Organization Admin",
  [ROLES.HR_ADMIN]: "HR Admin",
  [ROLES.EMPLOYEE]: "Employee",
};

// Default landing after role-based redirect
export const ROLE_DEFAULT_REDIRECT = {
  [ROLES.SUPER_ADMIN]: "/dashboard",
  [ROLES.ADMIN]: "/zoiko-hr",
  [ROLES.HR_ADMIN]: "/zoiko-hr",
  [ROLES.EMPLOYEE]: "/zoiko-hr/ess",
};

// Route-prefix access matrix (authoritative for both guards and sidebar filtering)
export const ROLE_ALLOWED_PREFIXES = {
  [ROLES.SUPER_ADMIN]: [
    "/super-admin/dashboard",
    "/super-admin/organizations",
    "/super-admin/products",
    "/super-admin/subscriptions",
    "/super-admin/users",
    "/super-admin/analytics",
    "/super-admin/audit-logs",
    "/super-admin/system-health",
    "/super-admin/settings",
    "/dashboard",
    "/organizations",
    "/subscriptions",
    "/shared/",
    "/zoiko-hr",
    "/zoikotime",
    "/payroll",
    "/spend",
    "/billing",
    "/inventory",
    "/comply",
    "/insights",
    "/roles",
    "/security-center",
    "/trust-center",
    "/audit-center",
    "/compliance-center",
    "/operations",
    "/admin-profile",
    "/settings/",
  ],

  // Organization Admin - allowed: full Zoiko HR + Payroll/Billing/Insights/Spend/Inventory/ZoikoTime + Settings
  [ROLES.ADMIN]: [
    "/zoiko-hr",
    "/payroll",
    "/billing",
    "/spend",
    "/insights",
    "/zoikotime",
    "/inventory",
    "/settings/",
  ],

  // HR Admin - only HR-related modules
  [ROLES.HR_ADMIN]: [
    "/zoiko-hr",
  ],

  // Employee - allowed: Zoiko HR ESS + My Leave + My Documents + Travel
  [ROLES.EMPLOYEE]: [
    "/zoiko-hr/ess",
    "/zoiko-hr/leave/my-leave",
    "/zoiko-hr/leave/", // keep leave tree visible (even if only some leaves are intended)
    "/zoiko-hr/ess/my-documents",
    "/zoiko-hr/travel",
    "/zoiko-hr/travel/requests",
    "/zoiko-hr/travel/expenses",
  ],
};

export const VALID_ROLES = Object.values(ROLES);

