import { useState, useEffect } from "react";
import {
  getEssDashboardData,
  getLeaveBalanceData,
  getLeaveRequestsData,
  getAttendanceSummaryData,
  getProfileData,
  getMyDocumentsData,
  getEssRequestsData,
  getEssSettingsData,
} from "../services/essService";

export function useEssDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getEssDashboardData().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useLeaveBalance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getLeaveBalanceData().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useLeaveRequests() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getLeaveRequestsData().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useAttendance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getAttendanceSummaryData().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getProfileData().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useMyDocuments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getMyDocumentsData().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useEssRequests() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getEssRequestsData().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useEssSettings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getEssSettingsData().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}
