import { useState, useEffect } from "react";
import { getDashboardStats, getEmployeeDocuments, getCompanyDocuments, getTemplates, getApprovals, getExpiryTracking, getComplianceDocuments, getDocumentsAnalytics } from "../services/documentsService";

export function useDocumentsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getDashboardStats().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useEmployeeDocuments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getEmployeeDocuments().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useCompanyDocuments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getCompanyDocuments().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useTemplates() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getTemplates().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useApprovals() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getApprovals().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useExpiryTracking() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getExpiryTracking().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useComplianceDocuments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getComplianceDocuments().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useDocumentsAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getDocumentsAnalytics().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}
