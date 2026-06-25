import { api } from "./api";

export const superAdminService = {
  // Dashboard
  getDashboardStats: () => api.get("/super-admin/dashboard"),

  // Organizations
  getOrganizations: (params) => api.get("/super-admin/organizations", { params }),
  getOrganization: (id) => api.get(`/super-admin/organizations/${id}`),
  updateOrganization: (id, data) => api.put(`/super-admin/organizations/${id}`, data),
  suspendOrganization: (id) => api.put(`/super-admin/organizations/${id}/suspend`),
  activateOrganization: (id) => api.put(`/super-admin/organizations/${id}/activate`),
  deleteOrganization: (id) => api.delete(`/super-admin/organizations/${id}`),

  // Products
  getProducts: () => api.get("/super-admin/products"),
  getProduct: (id) => api.get(`/super-admin/products/${id}`),
  updateProductStatus: (id, status) => api.put(`/super-admin/products/${id}/status`, null, { params: { status_val: status } }),
  getOrganizationProducts: (orgId) => api.get(`/super-admin/organizations/${orgId}/products`),
  toggleOrganizationProduct: (orgId, productId, isEnabled) => api.put(`/super-admin/organizations/${orgId}/products/${productId}/toggle`, { is_enabled: isEnabled }),

  // Subscriptions
  getSubscriptions: () => api.get("/super-admin/subscriptions"),
  getOrganizationSubscription: (orgId) => api.get(`/super-admin/subscriptions/${orgId}`),
  updateSubscription: (orgId, data) => api.put(`/super-admin/subscriptions/${orgId}`, data),

  // Platform Users
  getUsers: (params) => api.get("/super-admin/users", { params }),

  // Audit Logs
  getAuditLogs: (params) => api.get("/super-admin/audit-logs", { params }),

  // System Health
  getSystemHealth: () => api.get("/super-admin/system-health"),
  runHealthCheck: () => api.post("/super-admin/system-health/check"),

  // Platform Settings
  getSettings: () => api.get("/super-admin/settings"),
  getSetting: (id) => api.get(`/super-admin/settings/${id}`),
  createSetting: (data) => api.post("/super-admin/settings", data),
  updateSetting: (id, data) => api.put(`/super-admin/settings/${id}`, data),

  // Analytics
  getAnalytics: () => api.get("/super-admin/analytics"),
};
