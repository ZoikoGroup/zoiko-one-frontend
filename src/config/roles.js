export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  HR_ADMIN: "hr_admin",
  MANAGER: "manager",
  EMPLOYEE: "employee",
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.ADMIN]: "Organization Admin",
  [ROLES.HR_ADMIN]: "HR Admin",
  [ROLES.MANAGER]: "Manager",
  [ROLES.EMPLOYEE]: "Employee",
};

// Default landing after role-based redirect
export const ROLE_DEFAULT_REDIRECT = {
  [ROLES.SUPER_ADMIN]: "/super-admin/dashboard",
  [ROLES.ADMIN]: "/zoiko-hr",
  [ROLES.HR_ADMIN]: "/zoiko-hr",
  [ROLES.EMPLOYEE]: "/employee/ess",
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

  // HR Admin - only HR-related modules + user management
  [ROLES.HR_ADMIN]: [
    "/zoiko-hr",
    "/settings/",
  ],

  // Employee - Peoples/Employees subfolders: Profile, ESS, Leaves, Documents, Travel
  [ROLES.EMPLOYEE]: [
    // ── Profile ──────────────────────────────────────────────
    "/employee/profile",
    "/employee/profile/bank-details",
    "/employee/profile/assets",
    "/employee/profile/emergency-contacts",
    "/employee/profile/settings",

    // ── ESS ──────────────────────────────────────────────────
    "/employee/ess",
    "/employee/ess/attendance",
    "/employee/ess/requests",
    "/employee/ess/settings",

    // ── Leaves ───────────────────────────────────────────────
    "/employee/leaves",
    "/employee/leaves/apply",
    "/employee/leaves/calendar",
    "/employee/leaves/history",
    "/employee/leaves/types",

    // ── Documents ────────────────────────────────────────────
    "/employee/documents",
    "/employee/documents/my-files",
    "/employee/documents/payslips",
    "/employee/documents/contracts",
    "/employee/documents/tax",
    "/employee/documents/upload-request",

    // ── Travel ───────────────────────────────────────────────
    "/employee/travel",
    "/employee/travel/requests",
    "/employee/travel/approvals",
    "/employee/travel/expenses",
    "/employee/travel/settings",
  ],
};

<<<<<<< HEAD
// Role-based user creation permissions
// Maps each role to the list of roles they are allowed to create
export const ROLE_CREATION_RULES = {
  [ROLES.SUPER_ADMIN]: [ROLES.ADMIN],
  [ROLES.ADMIN]: [ROLES.ADMIN, ROLES.HR_ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  [ROLES.HR_ADMIN]: [ROLES.HR_ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE],
  [ROLES.MANAGER]: [],
  [ROLES.EMPLOYEE]: [],
};

export const VALID_ROLES = Object.values(ROLES);

=======
export const VALID_ROLES = Object.values(ROLES);
>>>>>>> edcd8e8662bbbbf8fa94bbcd5c7175c95346c1cb
