export async function getDashboardData() {
  const response = await fetch(
    "http://localhost:3000/api/dashboard"
  );

  return response.json();
}