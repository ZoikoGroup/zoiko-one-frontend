import { createResourceClient } from "./resourceClient";

const mockData = {
  overview: { message: "Zoiko Insights overview (mock)" },
  dashboards: [],
  payrollAnalytics: [],
  revenueInsights: [],
  utilizationTrends: [],
  forecasts: [],
};

const client = createResourceClient("/api/insights", mockData);

export const getOverview = () => client.list("overview");
export const getDashboards = (params) => client.list("dashboards", params);
export const getPayrollAnalytics = (params) => client.list("payrollAnalytics", params);
export const getRevenueInsights = (params) => client.list("revenueInsights", params);
export const getUtilizationTrends = (params) => client.list("utilizationTrends", params);
export const getForecasts = (params) => client.list("forecasts", params);

export default client;
