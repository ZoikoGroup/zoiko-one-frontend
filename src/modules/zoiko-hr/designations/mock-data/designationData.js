export function getDesignationDashboard() {
  return {
    stats: {
      total: 15,
      active: 11,
      inactive: 3,
      archived: 1,
      withEmployees: 13,
      avgEmployees: 8,
    },
    levelDistribution: [
      { level: "L1", count: 2, minSalary: 30000, maxSalary: 50000 },
      { level: "L2", count: 2, minSalary: 45000, maxSalary: 70000 },
      { level: "L3", count: 2, minSalary: 60000, maxSalary: 90000 },
      { level: "L4", count: 2, minSalary: 80000, maxSalary: 120000 },
      { level: "L5", count: 2, minSalary: 100000, maxSalary: 150000 },
      { level: "L6", count: 1, minSalary: 120000, maxSalary: 180000 },
      { level: "L7", count: 1, minSalary: 140000, maxSalary: 210000 },
      { level: "L8", count: 1, minSalary: 170000, maxSalary: 250000 },
      { level: "L9", count: 1, minSalary: 200000, maxSalary: 300000 },
      { level: "L10", count: 1, minSalary: 250000, maxSalary: 400000 },
    ],
    departmentDistribution: [
      { dept: "Engineering", count: 4 },
      { dept: "Product", count: 3 },
      { dept: "Marketing", count: 2 },
      { dept: "Sales", count: 2 },
      { dept: "HR", count: 2 },
      { dept: "Finance", count: 2 },
    ],
    recentDesignations: [
      { id: 14, title: "Finance Analyst", department: "Finance", level: "L3", status: "active", created_at: "2026-06-10T09:00:00Z" },
      { id: 15, title: "HR Manager", department: "HR", level: "L6", status: "active", created_at: "2026-06-08T14:30:00Z" },
      { id: 12, title: "Sales Manager", department: "Sales", level: "L6", status: "active", created_at: "2026-06-05T11:00:00Z" },
      { id: 10, title: "Marketing Manager", department: "Marketing", level: "L5", status: "inactive", created_at: "2026-06-03T16:00:00Z" },
      { id: 13, title: "HR Associate", department: "HR", level: "L2", status: "active", created_at: "2026-06-01T10:00:00Z" },
    ],
  };
}

const designations = [
  { id: 1, title: "Software Engineer", department_id: 1, department_name: "Engineering", level: "L3", description: "Develops and maintains software applications across the stack.", min_salary: 65000, max_salary: 95000, employees_count: 12, status: "active", created_at: "2026-01-15T08:00:00Z", updated_at: "2026-05-10T12:00:00Z" },
  { id: 2, title: "Senior Engineer", department_id: 1, department_name: "Engineering", level: "L5", description: "Leads technical initiatives and mentors junior engineers.", min_salary: 105000, max_salary: 155000, employees_count: 6, status: "active", created_at: "2026-01-20T09:00:00Z", updated_at: "2026-05-12T10:00:00Z" },
  { id: 3, title: "Lead Engineer", department_id: 1, department_name: "Engineering", level: "L7", description: "Architects complex systems and drives engineering strategy.", min_salary: 150000, max_salary: 220000, employees_count: 3, status: "active", created_at: "2026-02-01T10:00:00Z", updated_at: "2026-04-20T14:00:00Z" },
  { id: 4, title: "Principal Engineer", department_id: 1, department_name: "Engineering", level: "L9", description: "Sets technical vision and standards across the organization.", min_salary: 210000, max_salary: 310000, employees_count: 1, status: "active", created_at: "2026-02-10T11:00:00Z", updated_at: "2026-03-15T09:00:00Z" },
  { id: 5, title: "Engineering Manager", department_id: 1, department_name: "Engineering", level: "L8", description: "Manages engineering teams and delivery roadmaps.", min_salary: 180000, max_salary: 260000, employees_count: 2, status: "active", created_at: "2026-02-15T08:30:00Z", updated_at: "2026-05-01T16:00:00Z" },
  { id: 6, title: "Product Manager", department_id: 2, department_name: "Product", level: "L4", description: "Defines product vision, strategy, and roadmap.", min_salary: 85000, max_salary: 125000, employees_count: 5, status: "active", created_at: "2026-03-01T09:00:00Z", updated_at: "2026-05-18T11:00:00Z" },
  { id: 7, title: "Senior PM", department_id: 2, department_name: "Product", level: "L6", description: "Leads complex product initiatives and mentors product managers.", min_salary: 125000, max_salary: 185000, employees_count: 3, status: "active", created_at: "2026-03-05T10:00:00Z", updated_at: "2026-04-25T13:00:00Z" },
  { id: 8, title: "Director of Product", department_id: 2, department_name: "Product", level: "L10", description: "Oversees product organization and strategic direction.", min_salary: 260000, max_salary: 410000, employees_count: 1, status: "active", created_at: "2026-03-10T11:00:00Z", updated_at: "2026-04-10T15:00:00Z" },
  { id: 9, title: "Marketing Specialist", department_id: 3, department_name: "Marketing", level: "L2", description: "Executes marketing campaigns and content strategies.", min_salary: 48000, max_salary: 72000, employees_count: 8, status: "active", created_at: "2026-03-15T08:00:00Z", updated_at: "2026-05-20T09:00:00Z" },
  { id: 10, title: "Marketing Manager", department_id: 3, department_name: "Marketing", level: "L5", description: "Leads marketing team and drives brand strategy.", min_salary: 100000, max_salary: 150000, employees_count: 2, status: "inactive", created_at: "2026-03-20T09:30:00Z", updated_at: "2026-05-22T10:00:00Z" },
  { id: 11, title: "Sales Rep", department_id: 4, department_name: "Sales", level: "L1", description: "Generates leads and closes sales opportunities.", min_salary: 32000, max_salary: 52000, employees_count: 15, status: "active", created_at: "2026-04-01T10:00:00Z", updated_at: "2026-05-25T11:00:00Z" },
  { id: 12, title: "Sales Manager", department_id: 4, department_name: "Sales", level: "L6", description: "Manages sales team and revenue targets.", min_salary: 130000, max_salary: 190000, employees_count: 3, status: "active", created_at: "2026-04-05T11:00:00Z", updated_at: "2026-05-28T14:00:00Z" },
  { id: 13, title: "HR Associate", department_id: 5, department_name: "HR", level: "L2", description: "Supports recruitment, onboarding, and employee relations.", min_salary: 45000, max_salary: 68000, employees_count: 6, status: "active", created_at: "2026-04-10T08:00:00Z", updated_at: "2026-06-01T09:00:00Z" },
  { id: 14, title: "HR Manager", department_id: 5, department_name: "HR", level: "L6", description: "Oversees HR operations, policies, and talent management.", min_salary: 120000, max_salary: 180000, employees_count: 2, status: "active", created_at: "2026-04-15T09:00:00Z", updated_at: "2026-06-05T10:00:00Z" },
  { id: 15, title: "Finance Analyst", department_id: 6, department_name: "Finance", level: "L3", description: "Analyzes financial data and prepares reports.", min_salary: 60000, max_salary: 88000, employees_count: 5, status: "active", created_at: "2026-04-20T10:00:00Z", updated_at: "2026-06-08T11:00:00Z" },
];

export function getDesignations() {
  return [...designations];
}

export function getDesignationById(id) {
  return designations.find((d) => d.id === id) || null;
}

export function getDesignationLevels() {
  return [
    { level: "L1", name: "Entry Level", min_salary: 30000, max_salary: 50000, mid_salary: 40000, typical_roles: ["Junior Developer", "Intern", "Sales Rep"], requirements: "High school diploma or equivalent; 0-1 year experience", departments: ["Sales", "Support"] },
    { level: "L2", name: "Associate", min_salary: 45000, max_salary: 70000, mid_salary: 57500, typical_roles: ["Marketing Specialist", "HR Associate", "Junior Analyst"], requirements: "Bachelor's degree; 1-3 years experience", departments: ["Marketing", "HR", "Finance"] },
    { level: "L3", name: "Mid-Level", min_salary: 60000, max_salary: 95000, mid_salary: 77500, typical_roles: ["Software Engineer", "Finance Analyst", "Designer"], requirements: "Bachelor's degree; 3-5 years experience", departments: ["Engineering", "Finance", "Product"] },
    { level: "L4", name: "Senior Individual Contributor", min_salary: 80000, max_salary: 125000, mid_salary: 102500, typical_roles: ["Product Manager", "Senior Analyst", "Tech Lead"], requirements: "Bachelor's degree; 5-7 years experience", departments: ["Product", "Engineering", "Marketing"] },
    { level: "L5", name: "Lead / Manager I", min_salary: 100000, max_salary: 155000, mid_salary: 127500, typical_roles: ["Senior Engineer", "Marketing Manager", "Team Lead"], requirements: "Bachelor's degree; 7-10 years experience", departments: ["Engineering", "Marketing", "Sales"] },
    { level: "L6", name: "Senior Manager II", min_salary: 120000, max_salary: 190000, mid_salary: 155000, typical_roles: ["Senior PM", "Sales Manager", "HR Manager"], requirements: "Bachelor's degree; 10-12 years experience", departments: ["Product", "Sales", "HR"] },
    { level: "L7", name: "Director I", min_salary: 140000, max_salary: 220000, mid_salary: 180000, typical_roles: ["Lead Engineer", "Director of Marketing"], requirements: "Bachelor's/master's degree; 12-15 years experience", departments: ["Engineering", "Marketing"] },
    { level: "L8", name: "Senior Director II", min_salary: 170000, max_salary: 260000, mid_salary: 215000, typical_roles: ["Engineering Manager", "Senior Director"], requirements: "Master's degree preferred; 15+ years experience", departments: ["Engineering", "Product"] },
    { level: "L9", name: "VP / Principal", min_salary: 200000, max_salary: 310000, mid_salary: 255000, typical_roles: ["Principal Engineer", "VP of Sales"], requirements: "Master's degree preferred; 15+ years experience", departments: ["Engineering", "Sales"] },
    { level: "L10", name: "C-Level / EVP", min_salary: 250000, max_salary: 410000, mid_salary: 330000, typical_roles: ["Director of Product", "CTO", "CFO"], requirements: "Advanced degree; 18+ years experience", departments: ["Product", "Executive"] },
  ];
}

export function getDesignationReports() {
  return {
    level_distribution: [
      { level: "L1", count: 2 }, { level: "L2", count: 2 }, { level: "L3", count: 2 },
      { level: "L4", count: 1 }, { level: "L5", count: 2 }, { level: "L6", count: 3 },
      { level: "L7", count: 1 }, { level: "L8", count: 1 }, { level: "L9", count: 1 }, { level: "L10", count: 1 },
    ],
    dept_distribution: [
      { dept: "Engineering", count: 5 }, { dept: "Product", count: 3 },
      { dept: "Marketing", count: 2 }, { dept: "Sales", count: 2 },
      { dept: "HR", count: 2 }, { dept: "Finance", count: 1 },
    ],
    salary_analysis: [
      { level: "L1", avg_salary: 42000, min: 30000, max: 52000 },
      { level: "L2", avg_salary: 58000, min: 45000, max: 72000 },
      { level: "L3", avg_salary: 77000, min: 60000, max: 95000 },
      { level: "L4", avg_salary: 102000, min: 80000, max: 125000 },
      { level: "L5", avg_salary: 127000, min: 100000, max: 155000 },
      { level: "L6", avg_salary: 158000, min: 120000, max: 190000 },
      { level: "L7", avg_salary: 185000, min: 140000, max: 220000 },
      { level: "L8", avg_salary: 220000, min: 170000, max: 260000 },
      { level: "L9", avg_salary: 260000, min: 200000, max: 310000 },
      { level: "L10", avg_salary: 330000, min: 250000, max: 410000 },
    ],
    trend: [
      { quarter: "Q1 2025", new_designations: 3, total: 8 },
      { quarter: "Q2 2025", new_designations: 2, total: 10 },
      { quarter: "Q3 2025", new_designations: 1, total: 11 },
      { quarter: "Q4 2025", new_designations: 2, total: 12 },
      { quarter: "Q1 2026", new_designations: 2, total: 14 },
      { quarter: "Q2 2026", new_designations: 1, total: 15 },
    ],
  };
}
