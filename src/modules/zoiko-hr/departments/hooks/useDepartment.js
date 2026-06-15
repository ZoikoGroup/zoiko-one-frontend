import { useState, useEffect } from "react";
import {
  getDepartmentDashboard,
  getDepartments,
  getDepartmentReports,
} from "../services/departmentService";

export function useDepartmentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getDepartmentDashboard().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useDepartments(filters) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    getDepartments(filters).then(setData).finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);
  return { data, loading };
}

export function useDepartmentReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getDepartmentReports().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}
