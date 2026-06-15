import { useState, useEffect } from "react";
import {
  getLeaveDashboard,
  getMyLeave,
  getLeaveRequests,
  getLeaveCalendar,
  getLeaveTypes,
  getLeaveReports,
} from "../services/leaveService";

export function useLeaveDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getLeaveDashboard().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useMyLeave(filters) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    getMyLeave(filters).then(setData).finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);
  return { data, loading };
}

export function useLeaveRequests(filters) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    getLeaveRequests(filters).then(setData).finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);
  return { data, loading };
}

export function useLeaveCalendar(filters) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    getLeaveCalendar(filters).then(setData).finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);
  return { data, loading };
}

export function useLeaveTypes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getLeaveTypes().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useLeaveReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getLeaveReports().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}
