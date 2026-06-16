import { useState, useEffect } from "react";
import {
  getDashboard, getObligations, getObligationsDashboard, getControls, getControlById, getControlsSummary,
  getRisks, getRisksSummary, getAudits, getAuditFindings, getAuditsSummary,
  getEvidence, getEvidenceSummary, getPolicies, getPoliciesSummary,
  getCalendarEvents, getCalendarSummary, getIncidents, getIncidentsSummary,
  getReports, getReportsSummary,
} from "../services/complyService";

export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getDashboard().then(setData).catch(() => {}).finally(() => setLoading(false)); }, []);
  return { data, loading };
}

export function useObligations() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([getObligations(), getObligationsDashboard()])
      .then(([obl, summ]) => { setData(obl); setSummary(summ); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return { data, summary, loading };
}

export function useControls() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([getControls(), getControlsSummary()])
      .then(([ctl, summ]) => { setData(ctl); setSummary(summ); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return { data, summary, loading };
}

export function useControlDetail(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) { setLoading(false); return; }
    getControlById(id).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [id]);
  return { data, loading };
}

export function useRisks() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([getRisks(), getRisksSummary()])
      .then(([r, s]) => { setData(r); setSummary(s); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return { data, summary, loading };
}

export function useAudits(auditId) {
  const [audits, setAudits] = useState([]);
  const [findings, setFindings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (auditId) {
      getAuditFindings(auditId).then(setFindings).catch(() => {}).finally(() => setLoading(false));
    } else {
      Promise.all([getAudits(), getAuditsSummary()])
        .then(([a, s]) => { setAudits(a); setSummary(s); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [auditId]);
  return { audits, findings, summary, loading };
}

export function useEvidence() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([getEvidence(), getEvidenceSummary()])
      .then(([e, s]) => { setData(e); setSummary(s); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return { data, summary, loading };
}

export function usePolicies() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([getPolicies(), getPoliciesSummary()])
      .then(([p, s]) => { setData(p); setSummary(s); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return { data, summary, loading };
}

export function useCalendar() {
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([getCalendarEvents(), getCalendarSummary()])
      .then(([e, s]) => { setEvents(e); setSummary(s); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return { events, summary, loading };
}

export function useIncidents() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([getIncidents(), getIncidentsSummary()])
      .then(([i, s]) => { setData(i); setSummary(s); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return { data, summary, loading };
}

export function useReports() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([getReports(), getReportsSummary()])
      .then(([r, s]) => { setData(r); setSummary(s); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return { data, summary, loading };
}
