-- CreateEnum
CREATE TYPE "ZoikoProduct" AS ENUM ('ZOIKO_HR', 'ZOIKO_TIME', 'ZOIKO_PAYROLL', 'ZOIKO_BILLING', 'ZOIKO_COMPLY', 'ZOIKO_INSIGHTS');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'TRIALING', 'PAST_DUE', 'SUSPENDED', 'CANCELED');

-- CreateEnum
CREATE TYPE "ComplianceStatus" AS ENUM ('COMPLIANT', 'WATCHLIST', 'VIOLATION', 'REMEDIATION');

-- CreateEnum
CREATE TYPE "PayrollRunStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CORRECTION_REQUIRED');

-- CreateEnum
CREATE TYPE "ZoikoPayTransactionStatus" AS ENUM ('PENDING', 'SUCCESSFUL', 'FAILED', 'REVERSED');

-- CreateEnum
CREATE TYPE "SettlementStatus" AS ENUM ('PENDING', 'SETTLED', 'DELAYED', 'FAILED');

-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('HEALTHY', 'DEGRADED', 'FAILED', 'PAUSED');

-- CreateEnum
CREATE TYPE "GovernanceDomain" AS ENUM ('RBAC', 'PAYROLL', 'COMPLIANCE', 'BILLING', 'SECURITY', 'DATA_RETENTION');

-- CreateEnum
CREATE TYPE "EnforcementMode" AS ENUM ('MONITOR', 'WARN', 'BLOCK');

-- CreateEnum
CREATE TYPE "GovernanceStatus" AS ENUM ('ENABLED', 'DISABLED', 'REVIEW_REQUIRED');

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "product" "ZoikoProduct" NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'ENTERPRISE',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "seats" INTEGER NOT NULL DEFAULT 0,
    "monthlyAmount" INTEGER NOT NULL DEFAULT 0,
    "renewalDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplianceReport" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "packName" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "alerts" INTEGER NOT NULL DEFAULT 0,
    "violations" INTEGER NOT NULL DEFAULT 0,
    "status" "ComplianceStatus" NOT NULL DEFAULT 'COMPLIANT',
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComplianceReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollRun" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "runCode" TEXT NOT NULL,
    "scheduleName" TEXT NOT NULL,
    "payPeriod" TEXT NOT NULL,
    "grossAmount" INTEGER NOT NULL DEFAULT 0,
    "employeeCount" INTEGER NOT NULL DEFAULT 0,
    "approvalsPending" INTEGER NOT NULL DEFAULT 0,
    "status" "PayrollRunStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
    "failureReason" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayrollRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZoikoPayTransaction" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "ZoikoPayTransactionStatus" NOT NULL DEFAULT 'PENDING',
    "settlementStatus" "SettlementStatus" NOT NULL DEFAULT 'PENDING',
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZoikoPayTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZoikoCoreXWorkflow" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "workflowKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "integrationName" TEXT NOT NULL,
    "executions" INTEGER NOT NULL DEFAULT 0,
    "failures" INTEGER NOT NULL DEFAULT 0,
    "status" "WorkflowStatus" NOT NULL DEFAULT 'HEALTHY',
    "lastRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZoikoCoreXWorkflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovernancePolicy" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" "GovernanceDomain" NOT NULL,
    "enforcement" "EnforcementMode" NOT NULL DEFAULT 'MONITOR',
    "status" "GovernanceStatus" NOT NULL DEFAULT 'ENABLED',
    "exceptions" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GovernancePolicy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Subscription_tenantId_idx" ON "Subscription"("tenantId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_tenantId_product_key" ON "Subscription"("tenantId", "product");

-- CreateIndex
CREATE INDEX "ComplianceReport_tenantId_idx" ON "ComplianceReport"("tenantId");

-- CreateIndex
CREATE INDEX "ComplianceReport_status_idx" ON "ComplianceReport"("status");

-- CreateIndex
CREATE INDEX "PayrollRun_tenantId_idx" ON "PayrollRun"("tenantId");

-- CreateIndex
CREATE INDEX "PayrollRun_status_idx" ON "PayrollRun"("status");

-- CreateIndex
CREATE UNIQUE INDEX "PayrollRun_tenantId_runCode_key" ON "PayrollRun"("tenantId", "runCode");

-- CreateIndex
CREATE INDEX "ZoikoPayTransaction_tenantId_idx" ON "ZoikoPayTransaction"("tenantId");

-- CreateIndex
CREATE INDEX "ZoikoPayTransaction_status_idx" ON "ZoikoPayTransaction"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ZoikoPayTransaction_tenantId_reference_key" ON "ZoikoPayTransaction"("tenantId", "reference");

-- CreateIndex
CREATE INDEX "ZoikoCoreXWorkflow_tenantId_idx" ON "ZoikoCoreXWorkflow"("tenantId");

-- CreateIndex
CREATE INDEX "ZoikoCoreXWorkflow_status_idx" ON "ZoikoCoreXWorkflow"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ZoikoCoreXWorkflow_tenantId_workflowKey_key" ON "ZoikoCoreXWorkflow"("tenantId", "workflowKey");

-- CreateIndex
CREATE INDEX "GovernancePolicy_tenantId_idx" ON "GovernancePolicy"("tenantId");

-- CreateIndex
CREATE INDEX "GovernancePolicy_domain_idx" ON "GovernancePolicy"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "GovernancePolicy_tenantId_name_key" ON "GovernancePolicy"("tenantId", "name");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplianceReport" ADD CONSTRAINT "ComplianceReport_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollRun" ADD CONSTRAINT "PayrollRun_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoikoPayTransaction" ADD CONSTRAINT "ZoikoPayTransaction_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoikoCoreXWorkflow" ADD CONSTRAINT "ZoikoCoreXWorkflow_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GovernancePolicy" ADD CONSTRAINT "GovernancePolicy_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
