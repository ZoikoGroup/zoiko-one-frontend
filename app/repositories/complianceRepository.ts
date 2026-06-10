import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type PolicyWhere = Prisma.PolicyWhereInput;
type PolicyCategoryWhere = Prisma.PolicyCategoryWhereInput;
type ComplianceRequirementWhere = Prisma.ComplianceRequirementWhereInput;
type ComplianceAuditWhere = Prisma.ComplianceAuditWhereInput;
type PolicyViolationWhere = Prisma.PolicyViolationWhereInput;
type CorrectiveActionWhere = Prisma.CorrectiveActionWhereInput;
type PolicyAcknowledgementWhere = Prisma.PolicyAcknowledgementWhereInput;
type TrainingComplianceWhere = Prisma.TrainingComplianceWhereInput;

export class ComplianceRepository {
  // ── Policies ──

  async countPolicies(tenantId: string, filters?: { search?: string; category?: string; status?: string }) {
    const where: PolicyWhere = { tenantId, deletedAt: null };
    if (filters?.search) {
      where.OR = [
        { policyName: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    if (filters?.category) where.category = filters.category;
    if (filters?.status) where.status = filters.status as any;
    return prisma.policy.count({ where });
  }

  async findPolicies(
    tenantId: string,
    options: {
      filters?: { search?: string; category?: string; status?: string };
      skip?: number; take?: number; orderBy?: string; orderDir?: "asc" | "desc";
    }
  ) {
    const where: PolicyWhere = { tenantId, deletedAt: null };
    if (options.filters?.search) {
      where.OR = [
        { policyName: { contains: options.filters.search, mode: "insensitive" } },
        { description: { contains: options.filters.search, mode: "insensitive" } },
      ];
    }
    if (options.filters?.category) where.category = options.filters.category;
    if (options.filters?.status) where.status = options.filters.status as any;
    return prisma.policy.findMany({
      where,
      skip: options.skip ?? 0,
      take: options.take ?? 25,
      orderBy: { [options.orderBy ?? "createdAt"]: options.orderDir ?? "desc" },
    });
  }

  async findPolicyById(id: string, tenantId: string) {
    return prisma.policy.findFirst({ where: { id, tenantId, deletedAt: null } });
  }

  async createPolicy(data: Prisma.PolicyCreateInput) {
    return prisma.policy.create({ data });
  }

  async updatePolicy(id: string, tenantId: string, data: Prisma.PolicyUpdateInput) {
    return prisma.policy.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
  }

  async softDeletePolicy(id: string, tenantId: string, deletedBy?: string, deletionReason?: string) {
    return prisma.policy.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy, deletionReason },
    });
  }

  // ── Policy Categories ──

  async countPolicyCategories(tenantId: string, search?: string) {
    const where: PolicyCategoryWhere = { tenantId, deletedAt: null };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    return prisma.policyCategory.count({ where });
  }

  async findPolicyCategories(tenantId: string, options: { search?: string; skip?: number; take?: number }) {
    const where: PolicyCategoryWhere = { tenantId, deletedAt: null };
    if (options.search) {
      where.OR = [
        { name: { contains: options.search, mode: "insensitive" } },
        { description: { contains: options.search, mode: "insensitive" } },
      ];
    }
    return prisma.policyCategory.findMany({
      where,
      skip: options.skip ?? 0,
      take: options.take ?? 25,
      orderBy: { createdAt: "desc" },
    });
  }

  async findPolicyCategoryById(id: string, tenantId: string) {
    return prisma.policyCategory.findFirst({ where: { id, tenantId, deletedAt: null } });
  }

  async createPolicyCategory(data: Prisma.PolicyCategoryCreateInput) {
    return prisma.policyCategory.create({ data });
  }

  async updatePolicyCategory(id: string, data: Prisma.PolicyCategoryUpdateInput) {
    return prisma.policyCategory.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
  }

  // ── Compliance Requirements ──

  async countRequirements(tenantId: string, filters?: { search?: string; status?: string; priority?: string }) {
    const where: ComplianceRequirementWhere = { tenantId, deletedAt: null };
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    if (filters?.status) where.status = filters.status as any;
    if (filters?.priority) where.priority = filters.priority as any;
    return prisma.complianceRequirement.count({ where });
  }

  async findRequirements(
    tenantId: string,
    options: {
      filters?: { search?: string; status?: string; priority?: string };
      skip?: number; take?: number; orderBy?: string; orderDir?: "asc" | "desc";
    }
  ) {
    const where: ComplianceRequirementWhere = { tenantId, deletedAt: null };
    if (options.filters?.search) {
      where.OR = [
        { title: { contains: options.filters.search, mode: "insensitive" } },
        { description: { contains: options.filters.search, mode: "insensitive" } },
      ];
    }
    if (options.filters?.status) where.status = options.filters.status as any;
    if (options.filters?.priority) where.priority = options.filters.priority as any;
    return prisma.complianceRequirement.findMany({
      where,
      skip: options.skip ?? 0,
      take: options.take ?? 25,
      orderBy: { [options.orderBy ?? "createdAt"]: options.orderDir ?? "desc" },
    });
  }

  async findRequirementById(id: string, tenantId: string) {
    return prisma.complianceRequirement.findFirst({ where: { id, tenantId, deletedAt: null } });
  }

  async createRequirement(data: Prisma.ComplianceRequirementCreateInput) {
    return prisma.complianceRequirement.create({ data });
  }

  async updateRequirement(id: string, data: Prisma.ComplianceRequirementUpdateInput) {
    return prisma.complianceRequirement.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
  }

  // ── Audits ──

  async countAudits(tenantId: string, filters?: { search?: string; auditType?: string; status?: string }) {
    const where: ComplianceAuditWhere = { tenantId, deletedAt: null };
    if (filters?.search) where.auditName = { contains: filters.search, mode: "insensitive" };
    if (filters?.auditType) where.auditType = filters.auditType;
    if (filters?.status) where.status = filters.status as any;
    return prisma.complianceAudit.count({ where });
  }

  async findAudits(
    tenantId: string,
    options: {
      filters?: { search?: string; auditType?: string; status?: string };
      skip?: number; take?: number; orderBy?: string; orderDir?: "asc" | "desc";
    }
  ) {
    const where: ComplianceAuditWhere = { tenantId, deletedAt: null };
    if (options.filters?.search) where.auditName = { contains: options.filters.search, mode: "insensitive" };
    if (options.filters?.auditType) where.auditType = options.filters.auditType;
    if (options.filters?.status) where.status = options.filters.status as any;
    return prisma.complianceAudit.findMany({
      where,
      skip: options.skip ?? 0,
      take: options.take ?? 25,
      orderBy: { [options.orderBy ?? "scheduledDate"]: options.orderDir ?? "desc" },
    });
  }

  async findAuditById(id: string, tenantId: string) {
    return prisma.complianceAudit.findFirst({ where: { id, tenantId, deletedAt: null } });
  }

  async createAudit(data: Prisma.ComplianceAuditCreateInput) {
    return prisma.complianceAudit.create({ data });
  }

  async updateAudit(id: string, data: Prisma.ComplianceAuditUpdateInput) {
    return prisma.complianceAudit.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
  }

  // ── Violations ──

  async countViolations(tenantId: string, filters?: { search?: string; severity?: string; status?: string }) {
    const where: PolicyViolationWhere = { tenantId, deletedAt: null };
    if (filters?.search) {
      where.OR = [
        { description: { contains: filters.search, mode: "insensitive" } },
        { policy: { policyName: { contains: filters.search, mode: "insensitive" } } },
        { employee: { firstName: { contains: filters.search, mode: "insensitive" } } },
      ];
    }
    if (filters?.severity) where.severity = filters.severity as any;
    if (filters?.status) where.status = filters.status as any;
    return prisma.policyViolation.count({ where });
  }

  async findViolations(
    tenantId: string,
    options: {
      filters?: { search?: string; severity?: string; status?: string };
      skip?: number; take?: number; orderBy?: string; orderDir?: "asc" | "desc";
    }
  ) {
    const where: PolicyViolationWhere = { tenantId, deletedAt: null };
    if (options.filters?.search) {
      where.OR = [
        { description: { contains: options.filters.search, mode: "insensitive" } },
        { policy: { policyName: { contains: options.filters.search, mode: "insensitive" } } },
        { employee: { firstName: { contains: options.filters.search, mode: "insensitive" } } },
      ];
    }
    if (options.filters?.severity) where.severity = options.filters.severity as any;
    if (options.filters?.status) where.status = options.filters.status as any;
    return prisma.policyViolation.findMany({
      where,
      skip: options.skip ?? 0,
      take: options.take ?? 25,
      orderBy: { [options.orderBy ?? "createdAt"]: options.orderDir ?? "desc" },
      include: {
        policy: { select: { id: true, policyName: true, category: true } },
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
      },
    });
  }

  async findViolationById(id: string, tenantId: string) {
    return prisma.policyViolation.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        policy: { select: { id: true, policyName: true, category: true } },
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
      },
    });
  }

  async updateViolation(id: string, data: Prisma.PolicyViolationUpdateInput) {
    return prisma.policyViolation.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
  }

  // ── Corrective Actions ──

  async countCorrectiveActions(tenantId: string, filters?: { search?: string; status?: string; priority?: string }) {
    const where: CorrectiveActionWhere = { tenantId, deletedAt: null };
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    if (filters?.status) where.status = filters.status as any;
    if (filters?.priority) where.priority = filters.priority as any;
    return prisma.correctiveAction.count({ where });
  }

  async findCorrectiveActions(
    tenantId: string,
    options: {
      filters?: { search?: string; status?: string; priority?: string };
      skip?: number; take?: number; orderBy?: string; orderDir?: "asc" | "desc";
    }
  ) {
    const where: CorrectiveActionWhere = { tenantId, deletedAt: null };
    if (options.filters?.search) {
      where.OR = [
        { title: { contains: options.filters.search, mode: "insensitive" } },
        { description: { contains: options.filters.search, mode: "insensitive" } },
      ];
    }
    if (options.filters?.status) where.status = options.filters.status as any;
    if (options.filters?.priority) where.priority = options.filters.priority as any;
    return prisma.correctiveAction.findMany({
      where,
      skip: options.skip ?? 0,
      take: options.take ?? 25,
      orderBy: { [options.orderBy ?? "createdAt"]: options.orderDir ?? "desc" },
    });
  }

  async findCorrectiveActionById(id: string, tenantId: string) {
    return prisma.correctiveAction.findFirst({ where: { id, tenantId, deletedAt: null } });
  }

  async createCorrectiveAction(data: Prisma.CorrectiveActionCreateInput) {
    return prisma.correctiveAction.create({ data });
  }

  async updateCorrectiveAction(id: string, data: Prisma.CorrectiveActionUpdateInput) {
    return prisma.correctiveAction.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
  }

  // ── Acknowledgements ──

  async countAcknowledgements(tenantId: string, filters?: { search?: string; status?: string }) {
    const where: PolicyAcknowledgementWhere = { tenantId, deletedAt: null };
    if (filters?.search) {
      where.OR = [
        { employee: { firstName: { contains: filters.search, mode: "insensitive" } } },
        { policy: { policyName: { contains: filters.search, mode: "insensitive" } } },
      ];
    }
    if (filters?.status) where.status = filters.status as any;
    return prisma.policyAcknowledgement.count({ where });
  }

  async findAcknowledgements(
    tenantId: string,
    options: {
      filters?: { search?: string; status?: string };
      skip?: number; take?: number; orderBy?: string; orderDir?: "asc" | "desc";
    }
  ) {
    const where: PolicyAcknowledgementWhere = { tenantId, deletedAt: null };
    if (options.filters?.search) {
      where.OR = [
        { employee: { firstName: { contains: options.filters.search, mode: "insensitive" } } },
        { policy: { policyName: { contains: options.filters.search, mode: "insensitive" } } },
      ];
    }
    if (options.filters?.status) where.status = options.filters.status as any;
    return prisma.policyAcknowledgement.findMany({
      where,
      skip: options.skip ?? 0,
      take: options.take ?? 25,
      orderBy: { [options.orderBy ?? "createdAt"]: options.orderDir ?? "desc" },
      include: {
        policy: { select: { id: true, policyName: true } },
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
      },
    });
  }

  // ── Training Compliance ──

  async countTrainingCompliance(tenantId: string, filters?: { search?: string; status?: string }) {
    const where: TrainingComplianceWhere = { tenantId, deletedAt: null };
    if (filters?.search) {
      where.OR = [
        { trainingModule: { contains: filters.search, mode: "insensitive" } },
        { employee: { firstName: { contains: filters.search, mode: "insensitive" } } },
      ];
    }
    if (filters?.status) where.status = filters.status as any;
    return prisma.trainingCompliance.count({ where });
  }

  async findTrainingCompliance(
    tenantId: string,
    options: {
      filters?: { search?: string; status?: string };
      skip?: number; take?: number; orderBy?: string; orderDir?: "asc" | "desc";
    }
  ) {
    const where: TrainingComplianceWhere = { tenantId, deletedAt: null };
    if (options.filters?.search) {
      where.OR = [
        { trainingModule: { contains: options.filters.search, mode: "insensitive" } },
        { employee: { firstName: { contains: options.filters.search, mode: "insensitive" } } },
      ];
    }
    if (options.filters?.status) where.status = options.filters.status as any;
    return prisma.trainingCompliance.findMany({
      where,
      skip: options.skip ?? 0,
      take: options.take ?? 25,
      orderBy: { [options.orderBy ?? "assignedDate"]: options.orderDir ?? "desc" },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
      },
    });
  }

  // ── Dashboard Aggregates ──

  async getDashboardStats(tenantId: string) {
    const where = { tenantId, deletedAt: null };
    const [activePolicies, pendingAcknowledgements, openViolations, upcomingAudits, overdueRequirements, trainingCompliance] = await Promise.all([
      prisma.policy.count({ where: { ...where, status: "ACTIVE" as any } }),
      prisma.policyAcknowledgement.count({ where: { ...where, status: "PENDING" as any } }),
      prisma.policyViolation.count({ where: { ...where, status: { in: ["OPEN" as any, "INVESTIGATING" as any] } } }),
      prisma.complianceAudit.count({ where: { ...where, status: { in: ["SCHEDULED" as any] }, scheduledDate: { gte: new Date() } } }),
      prisma.complianceRequirement.count({ where: { ...where, status: "OVERDUE" as any } }),
      prisma.trainingCompliance.findMany({ where: { ...where }, select: { status: true } }),
    ]);
    const totalTraining = trainingCompliance.length;
    const completedTraining = trainingCompliance.filter((t) => t.status === "COMPLETED").length;
    const trainingComplianceRate = totalTraining > 0 ? Math.round((completedTraining / totalTraining) * 100) : 100;
    return {
      activePolicies,
      pendingAcknowledgements,
      openViolations,
      upcomingAudits,
      overdueRequirements,
      trainingComplianceRate,
    };
  }

  // ── Report Aggregates ──

  async getTrends(tenantId: string) {
    const violations = await prisma.policyViolation.groupBy({
      by: ["createdAt"],
      where: { tenantId, deletedAt: null },
      _count: { id: true },
    });
    const monthMap = new Map<string, { complianceScore: number; violationCount: number }>();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (const m of months) monthMap.set(m, { complianceScore: 95, violationCount: 0 });
    for (const v of violations) {
      const m = months[v.createdAt.getMonth()];
      const entry = monthMap.get(m);
      if (entry) entry.violationCount += v._count.id;
    }
    return Array.from(monthMap.entries()).map(([month, data]) => ({
      month,
      complianceScore: Math.max(0, data.complianceScore - data.violationCount * 2),
      violationCount: data.violationCount,
    }));
  }

  async getViolationsByCategory(tenantId: string) {
    const violations = await prisma.policyViolation.findMany({
      where: { tenantId, deletedAt: null },
      include: { policy: { select: { category: true } } },
    });
    const catMap = new Map<string, number>();
    for (const v of violations) {
      const cat = v.policy?.category ?? "Uncategorized";
      catMap.set(cat, (catMap.get(cat) ?? 0) + 1);
    }
    return Array.from(catMap.entries()).map(([category, count]) => ({ category, count }));
  }

  async getAuditCompletionData(tenantId: string) {
    const audits = await prisma.complianceAudit.findMany({
      where: { tenantId, deletedAt: null },
      select: { status: true, scheduledDate: true, completedDate: true },
    });
    const quarters = ["Q1", "Q2", "Q3", "Q4"];
    const data = quarters.map((quarter) => {
      const qIdx = quarters.indexOf(quarter);
      const qAudits = audits.filter((a) => {
        const m = a.scheduledDate.getMonth();
        return m >= qIdx * 3 && m < (qIdx + 1) * 3;
      });
      return {
        quarter,
        total: qAudits.length,
        completed: qAudits.filter((a) => a.status === "COMPLETED").length,
        failed: qAudits.filter((a) => a.status === "FAILED").length,
      };
    });
    return data;
  }

  async getDepartmentCompliance(tenantId: string) {
    const violations = await prisma.policyViolation.findMany({
      where: { tenantId, deletedAt: null },
      include: { employee: { include: { department: { select: { name: true } } } } },
    });
    const deptMap = new Map<string, number>();
    const totalMap = new Map<string, number>();
    for (const v of violations) {
      const dept = v.employee?.department?.name ?? "Unknown";
      deptMap.set(dept, (deptMap.get(dept) ?? 0) + 1);
    }
    const allDepts = await prisma.department.findMany({ where: { tenantId }, select: { name: true, _count: { select: { employees: true } } } });
    for (const d of allDepts) {
      totalMap.set(d.name, d._count.employees);
    }
    return Array.from(totalMap.entries()).map(([department, total]) => {
      const vCount = deptMap.get(department) ?? 0;
      const complianceRate = total > 0 ? Math.round(((total - vCount) / total) * 100) : 100;
      return { department, complianceRate };
    });
  }

  async getPolicyAdherenceTrends(tenantId: string) {
    const acknowledgements = await prisma.policyAcknowledgement.findMany({
      where: { tenantId, deletedAt: null },
      select: { status: true, createdAt: true },
    });
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthMap = new Map<string, { total: number; ack: number }>();
    for (const m of months) monthMap.set(m, { total: 0, ack: 0 });
    for (const a of acknowledgements) {
      const m = months[a.createdAt.getMonth()];
      const entry = monthMap.get(m);
      if (entry) {
        entry.total++;
        if (a.status === "ACKNOWLEDGED") entry.ack++;
      }
    }
    return Array.from(monthMap.entries()).map(([month, { total, ack }]) => ({
      month,
      adherenceRate: total > 0 ? Math.round((ack / total) * 100) : 100,
      acknowledgementRate: total > 0 ? Math.round((ack / total) * 100) : 100,
    }));
  }
}

export const complianceRepository = new ComplianceRepository();
