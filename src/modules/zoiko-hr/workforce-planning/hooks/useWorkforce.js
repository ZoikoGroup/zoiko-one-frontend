import { useState, useEffect } from "react";
import {
  getWorkforceDashboard, getWorkforcePlans, getHeadcountData,
  getSuccessionPlans, getScenarios, getWorkforceReports,
} from "../services/workforceService";

export function useWorkforceDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getWorkforceDashboard().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useWorkforcePlans() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getWorkforcePlans().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useHeadcountData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getHeadcountData().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useSuccessionPlans() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getSuccessionPlans().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useScenarios() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getScenarios().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useWorkforceReports() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getWorkforceReports().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}
