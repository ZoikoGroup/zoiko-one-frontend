export async function getDashboardData() {
  const response = await fetch("/api/dashboard");

  return response.json();
}