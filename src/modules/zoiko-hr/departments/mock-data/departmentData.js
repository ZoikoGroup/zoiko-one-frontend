const departments = [
  { id: 1, name: "Engineering", code: "ENG", description: "Software engineering and development", head: "Dr. Alan Turing", head_title: "VP of Engineering", budget: 2500000, employee_count: 45, status: "active", parent_id: null, created_at: "2023-01-15T08:00:00Z", updated_at: "2025-05-01T10:00:00Z" },
  { id: 2, name: "Marketing", code: "MKT", description: "Brand marketing and communications", head: "David Ogilvy", head_title: "CMO", budget: 1800000, employee_count: 28, status: "active", parent_id: null, created_at: "2023-01-15T08:00:00Z", updated_at: "2025-04-28T09:00:00Z" },
  { id: 3, name: "Sales", code: "SAL", description: "Revenue generation and client acquisition", head: "John Patterson", head_title: "VP of Sales", budget: 3200000, employee_count: 35, status: "active", parent_id: null, created_at: "2023-01-15T08:00:00Z", updated_at: "2025-05-02T11:00:00Z" },
  { id: 4, name: "Human Resources", code: "HR", description: "Talent acquisition and employee relations", head: "Sarah Johnson", head_title: "HR Director", budget: 800000, employee_count: 12, status: "active", parent_id: null, created_at: "2023-02-01T08:00:00Z", updated_at: "2025-04-25T14:00:00Z" },
  { id: 5, name: "Finance", code: "FIN", description: "Financial planning and accounting", head: "Robert Kiyosaki", head_title: "CFO", budget: 1200000, employee_count: 15, status: "active", parent_id: null, created_at: "2023-01-15T08:00:00Z", updated_at: "2025-04-30T08:00:00Z" },
  { id: 6, name: "Operations", code: "OPS", description: "Business operations and logistics", head: "Tim Cook", head_title: "COO", budget: 1500000, employee_count: 22, status: "active", parent_id: null, created_at: "2023-03-01T08:00:00Z", updated_at: "2025-04-29T12:00:00Z" },
  { id: 7, name: "Legal", code: "LEG", description: "Legal compliance and corporate law", head: "Ruth Bader Ginsburg", head_title: "General Counsel", budget: 600000, employee_count: 8, status: "active", parent_id: null, created_at: "2023-04-01T08:00:00Z", updated_at: "2025-04-20T09:00:00Z" },
  { id: 8, name: "Research & Development", code: "RND", description: "Innovation and product research", head: "Nikola Tesla", head_title: "Director of R&D", budget: 2200000, employee_count: 30, status: "active", parent_id: 1, created_at: "2023-05-01T08:00:00Z", updated_at: "2025-05-03T10:00:00Z" },
  { id: 9, name: "Customer Support", code: "CSP", description: "Customer service and technical support", head: "Zappos Guyon", head_title: "Support Manager", budget: 700000, employee_count: 25, status: "active", parent_id: null, created_at: "2023-06-01T08:00:00Z", updated_at: "2025-04-22T11:00:00Z" },
  { id: 10, name: "Information Technology", code: "IT", description: "Internal IT infrastructure and systems", head: "Grace Hopper", head_title: "IT Director", budget: 1600000, employee_count: 18, status: "active", parent_id: 1, created_at: "2023-01-15T08:00:00Z", updated_at: "2025-05-01T13:00:00Z" },
  { id: 11, name: "Administration", code: "ADM", description: "Administrative and facilities management", head: null, head_title: null, budget: 400000, employee_count: 6, status: "active", parent_id: null, created_at: "2023-02-15T08:00:00Z", updated_at: "2025-03-15T10:00:00Z" },
  { id: 12, name: "Product Management", code: "PRD", description: "Product strategy and roadmap", head: "Marty Cagan", head_title: "VP of Product", budget: 1400000, employee_count: 14, status: "active", parent_id: null, created_at: "2023-07-01T08:00:00Z", updated_at: "2025-05-02T08:00:00Z" },
  { id: 13, name: "Design", code: "DSN", description: "UI/UX and visual design", head: "Don Norman", head_title: "Design Director", budget: 900000, employee_count: 16, status: "active", parent_id: null, created_at: "2023-08-01T08:00:00Z", updated_at: "2025-04-28T15:00:00Z" },
  { id: 14, name: "Data Science", code: "DSC", description: "Data analytics and machine learning", head: "Claudia Perlich", head_title: "Chief Data Scientist", budget: 1100000, employee_count: 11, status: "active", parent_id: 1, created_at: "2023-09-01T08:00:00Z", updated_at: "2025-05-03T09:00:00Z" },
  { id: 15, name: "Security", code: "SEC", description: "Information security and compliance", head: null, head_title: null, budget: 750000, employee_count: 9, status: "inactive", parent_id: 1, created_at: "2024-01-01T08:00:00Z", updated_at: "2025-02-01T10:00:00Z" },
];

export function getDepartmentDashboard() {
  const total = departments.length;
  const active = departments.filter((d) => d.status === "active").length;
  const totalBudget = departments.reduce((s, d) => s + (d.budget || 0), 0);
  const totalEmployees = departments.reduce((s, d) => s + (d.employee_count || 0), 0);
  const withoutHeads = departments.filter((d) => !d.head).length;
  const avgEmployees = Math.round(totalEmployees / total);

  const recentDepartments = [...departments].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5).map((d) => ({
    id: d.id, name: d.name, code: d.code, head: d.head, employee_count: d.employee_count, budget: d.budget, status: d.status,
  }));

  const allocated = 20000000;
  const utilized = 15450000;

  const departmentDistribution = departments.slice(0, 8).map((d) => ({ dept: d.name, employees: d.employee_count, budget: d.budget }));

  return {
    stats: { total, active, totalBudget, totalEmployees, withoutHeads, avgEmployees },
    recentDepartments,
    budgetOverview: { total: allocated, allocated, utilized, remaining: allocated - utilized },
    departmentDistribution,
  };
}

export function getDepartments() {
  return departments;
}

export function getDepartmentById(id) {
  return departments.find((d) => d.id === Number(id)) || null;
}

export function getDepartmentReports() {
  return {
    headcount_trend: [
      { month: "Jan", count: 210 }, { month: "Feb", count: 218 }, { month: "Mar", count: 225 },
      { month: "Apr", count: 230 }, { month: "May", count: 240 }, { month: "Jun", count: 248 },
      { month: "Jul", count: 255 }, { month: "Aug", count: 260 }, { month: "Sep", count: 268 },
      { month: "Oct", count: 275 }, { month: "Nov", count: 282 }, { month: "Dec", count: 294 },
    ],
    budget_by_dept: departments.slice(0, 8).map((d) => ({
      dept: d.name,
      budget: d.budget,
      utilized: Math.round(d.budget * (0.7 + Math.random() * 0.25)),
    })),
    department_growth: [
      { quarter: "Q1 2024", new_depts: 2, total: 12 },
      { quarter: "Q2 2024", new_depts: 1, total: 13 },
      { quarter: "Q3 2024", new_depts: 1, total: 14 },
      { quarter: "Q4 2024", new_depts: 0, total: 14 },
      { quarter: "Q1 2025", new_depts: 1, total: 15 },
      { quarter: "Q2 2025", new_depts: 0, total: 15 },
    ],
  };
}
