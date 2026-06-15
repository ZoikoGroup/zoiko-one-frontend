import { useState, useEffect } from "react";
import {
  getDashboardStats, getJobRequisitions, getCandidates,
  getCandidateById, getInterviews, getOffers, getHiringAnalytics,
} from "../services/recruitmentService";

export function useDashboardStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getDashboardStats().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useJobRequisitions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getJobRequisitions().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useCandidates(filters) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    getCandidates(filters).then(setData).finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);
  return { data, loading };
}

export function useCandidate(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (id) getCandidateById(id).then(setData).finally(() => setLoading(false)); }, [id]);
  return { data, loading };
}

export function useInterviews() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getInterviews().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useOffers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getOffers().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useHiringAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getHiringAnalytics().then(setData).finally(() => setLoading(false)); }, []);
  return { data, loading };
}
