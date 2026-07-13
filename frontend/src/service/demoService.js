const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function submitDemoRequest(formData) {
  const res = await fetch(`${API_BASE_URL}/api/demo-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    let detail = "Something went wrong. Please try again.";
    try {
      const data = await res.json();
      detail = data?.detail || data?.message || detail;
    } catch {}
    throw new Error(detail);
  }

  return res.json();
}
