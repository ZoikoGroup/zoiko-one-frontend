import { useState, useEffect } from "react";
import {
  getDesignationDashboard,
  getDesignations,
  getDesignationById,
  getDesignationLevels,
  getDesignationReports,
} from "../services/designationService";

export function useDesignationDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getDesignationDashboard().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useDesignations(filters) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    getDesignations(filters).then(setData).finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);
  return { data, loading };
}

export function useDesignationLevels() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getDesignationLevels().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useDesignationReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getDesignationReports().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}
