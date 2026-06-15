import { useEffect, useState } from "react";
import * as hr from "../service/hrService";

export default function HRPage({ title, description, subtitle, resource, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Support both `description` and `subtitle` prop names
  const desc = description ?? subtitle;
  const hasChildren = !!children;

  useEffect(() => {
    // If children are provided, skip fetching — the parent controls the content
    if (hasChildren || !resource) {
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);
    hr
      .fetchList(resource)
      .then((d) => {
        if (mounted) setData(d);
      })
      .catch((e) => {
        if (mounted) setError(e.message || String(e));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [resource, hasChildren]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {desc && <p className="text-sm text-muted-foreground mb-4">{desc}</p>}
      {/* Render children if provided; otherwise show fetched data */}
      {children ? (
        children
      ) : loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">Error: {error}</div>
      ) : Array.isArray(data) ? (
        <ul className="list-disc pl-6">
          {data.map((item, idx) => (
            <li key={idx} className="mb-1">
              {typeof item === "object" ? JSON.stringify(item) : String(item)}
            </li>
          ))}
        </ul>
      ) : (
        <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
