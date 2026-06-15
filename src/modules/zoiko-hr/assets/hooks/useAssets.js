import { useState, useEffect } from "react";
import {
  getAssetsDashboardData, getAssetsList, getAssetById,
  getAssetByEmployee, getAssetRequestsList, getMaintenanceRecordsList,
  getAssetReportsList,
} from "../services/assetsService";

export function useAssetsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getAssetsDashboardData().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useAssets() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getAssetsList().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useAsset(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (id) getAssetById(id).then(setData).finally(() => setLoading(false)); }, [id]);
  return { data, loading };
}

export function useMyAssets() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getAssetByEmployee().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useAssetRequests() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getAssetRequestsList().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useMaintenance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getMaintenanceRecordsList().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useAssetReports() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getAssetReportsList().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}
