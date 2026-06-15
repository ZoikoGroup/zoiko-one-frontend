import { useState, useEffect } from "react";
import {
  getTravelDashboard,
  getTravelRequests,
  getTravelRequestById,
  getApprovals,
  getItineraries,
  getExpenses,
  getTravelReports,
} from "../services/travelService";

export function useTravelDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getTravelDashboard().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useTravelRequests() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getTravelRequests().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useTravelRequest(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (id) getTravelRequestById(id).then(setData).finally(() => setLoading(false)); }, [id]);
  return { data, loading };
}

export function useApprovals() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getApprovals().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useItineraries() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getItineraries().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useExpenses() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getExpenses().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useTravelReports() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getTravelReports().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}
