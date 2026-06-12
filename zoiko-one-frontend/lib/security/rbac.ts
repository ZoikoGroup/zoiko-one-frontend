export const permissionKeys = [
  "tenants.*",
  "organizations.*",
  "users.*",
  "payroll.*",
  "compliance.*",
  "billing.*",
  "analytics.*",
  "audit.*",
  "system.*",
  "workforce.*",
  "performance.*",
] as const;

export const roles = [
  "SUPER_ADMIN",
  "PLATFORM_ADMIN",
  "TENANT_ADMIN",
  "HR_ADMIN",
  "PAYROLL_ADMIN",
  "COMPLIANCE_ADMIN",
  "AUDITOR",
] as const;

export const rolePermissionMap: Record<(typeof roles)[number], string[]> = {
  SUPER_ADMIN: [...permissionKeys],
  PLATFORM_ADMIN: ["tenants.*", "organizations.*", "users.*", "billing.*", "analytics.*", "audit.*", "system.*"],
  TENANT_ADMIN: ["organizations.*", "users.*", "analytics.*", "audit.*"],
  HR_ADMIN: ["organizations.*", "users.*", "analytics.*", "workforce.*", "performance.*"],
  PAYROLL_ADMIN: ["payroll.*", "audit.*"],
  COMPLIANCE_ADMIN: ["compliance.*", "audit.*"],
  AUDITOR: ["analytics.*", "audit.*", "compliance.*"],
};

export function hasPermission(grants: string[], required: string) {
  const [domain] = required.split(".");

  return grants.includes(required) || grants.includes(`${domain}.*`) || grants.includes("system.*");
}
