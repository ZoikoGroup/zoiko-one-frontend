import { useState, useEffect } from "react";
import {
  getComplianceDashboard, getPolicies, getComplianceTracking,
  getAudits, getViolations, getRiskAssessments,
  getRegulations, getCorrectiveActions, getComplianceReports,
} from "../services/complianceService";

export function useComplianceDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getComplianceDashboard().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function usePolicies() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getPolicies().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useComplianceTracking() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getComplianceTracking().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useAudits() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getAudits().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useViolations() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getViolations().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useRiskAssessments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getRiskAssessments().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useRegulations() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getRegulations().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useCorrectiveActions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getCorrectiveActions().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useComplianceReports() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getComplianceReports().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}
