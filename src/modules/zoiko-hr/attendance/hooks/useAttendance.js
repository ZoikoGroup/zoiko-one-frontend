import { useState, useEffect } from "react";
import {
  getAttendanceDashboard,
  getDailyRecords,
  getMyAttendance,
  getCorrections,
  getSchedule,
  getAttendanceReports,
} from "../services/attendanceService";

export function useAttendanceDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getAttendanceDashboard().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useDailyRecords(filters) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    getDailyRecords(filters).then(setData).finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);
  return { data, loading };
}

export function useMyAttendance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getMyAttendance().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useCorrections() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getCorrections().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useSchedule() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getSchedule().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useAttendanceReports() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getAttendanceReports().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}
