import { useState, useEffect } from "react";
import { getDashboardStats, getGoalsOKRs, getKPIs, getFeedback, getReviews, getAppraisals, getPerformanceAnalytics } from "../services/performanceService";

export function usePerformanceDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getDashboardStats().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useGoalsOKRs() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getGoalsOKRs().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useKPIs() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getKPIs().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useFeedback() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getFeedback().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useReviews() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getReviews().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useAppraisals() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getAppraisals().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function usePerformanceAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getPerformanceAnalytics().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}
