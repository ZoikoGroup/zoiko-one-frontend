import { useState, useEffect, useCallback } from "react";
import {
  fetchExecutiveDashboard,
  fetchWorkforceAnalytics,
  fetchWorkforceTableData,
  fetchPayrollAnalytics,
  fetchFinancialAnalytics,
  fetchProjectAnalytics,
  fetchInventoryAnalytics,
  fetchComplianceAnalytics,
  fetchForecastingData,
  fetchCustomReportsData,
  fetchSavedReportsData,
} from "../services/insightsService.js";

export function useExecutiveDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchExecutiveDashboard().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useWorkforceAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchWorkforceAnalytics().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useWorkforceTableData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchWorkforceTableData().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function usePayrollAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchPayrollAnalytics().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useFinancialAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchFinancialAnalytics().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useProjectAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchProjectAnalytics().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useInventoryAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchInventoryAnalytics().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useComplianceAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchComplianceAnalytics().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useForecastingData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchForecastingData().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useCustomReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchCustomReportsData().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useSavedReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchSavedReportsData().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}
