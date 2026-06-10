# Database Architecture Plan — New Module Tables

> This document defines all new Prisma models needed for modules that do not yet have tables in the schema.
> Existing tables (Department, Designation, Employee, Leave, Attendance, Performance, Compliance, Engagement, etc.) are referenced but not redefined.
> PostgreSQL types are assumed throughout.

---

## 1. Recruitment

### Enums

```prisma
enum JobOpeningStatus {
  DRAFT
  OPEN
  ON_HOLD
  FILLED
  CANCELLED
}

enum CandidateStatus {
  APPLIED
  SCREENING
  SHORTLISTED
  INTERVIEW_SCHEDULED
  INTERVIEWED
  OFFERED
  HIRED
  REJECTED
  WITHDRAWN
}

enum InterviewStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  RESCHEDULED
}

enum InterviewType {
  PHONE
  VIDEO
  FACE_TO_FACE
  TECHNICAL
  HR
  PANEL
  FINAL
}

enum OfferStatus {
  DRAFT
  APPROVED
  SENT
  ACCEPTED
  DECLINED
  WITHDRAWN
  EXPIRED
}
```

### Models

```prisma
model JobOpening {
  id              String            @id @default(cuid())
  tenantId        String
  organizationId  String
  title           String
  departmentId    String?
  locationId      String?
  employmentType  String?
  openPositions   Int               @default(1)
  status          JobOpeningStatus  @default(DRAFT)
  description     String?
  requirements    String?
  responsibilities String?
  salaryMin       Float?
  salaryMax       Float?
  currency        String            @default("USD")
  postedDate      DateTime?
  closingDate     DateTime?
  assignedRecruiterId String?       // Employee ID
  createdBy       String?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  department      Department?       @relation(fields: [departmentId], references: [id], onDelete: SetNull)
  location        Location?         @relation(fields: [locationId], references: [id], onDelete: SetNull)
  assignedRecruiter Employee?       @relation(fields: [assignedRecruiterId], references: [id], onDelete: SetNull)
  organization    Organization      @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant          Tenant            @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  candidates      Candidate[]
  interviews      Interview[]
  offers          Offer[]

  @@index([tenantId])
  @@index([organizationId])
  @@index([departmentId])
  @@index([status])
  @@index([assignedRecruiterId])
  @@index([tenantId, status, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model Candidate {
  id              String           @id @default(cuid())
  jobOpeningId    String
  tenantId        String
  organizationId  String
  firstName       String
  lastName        String
  email           String
  phone           String?
  currentCompany  String?
  currentTitle    String?
  yearsOfExp      Int              @default(0)
  highestEducation String?
  source          String?          // e.g. LINKEDIN, REFERRAL, JOB_BOARD
  resumeUrl       String?
  coverLetterUrl  String?
  notes           String?
  status          CandidateStatus  @default(APPLIED)
  appliedDate     DateTime         @default(now())
  createdBy       String?
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  jobOpening   JobOpening   @relation(fields: [jobOpeningId], references: [id], onDelete: Cascade)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  interviews   Interview[]
  offers       Offer[]

  @@index([tenantId])
  @@index([organizationId])
  @@index([jobOpeningId])
  @@index([status])
  @@index([email])
  @@index([tenantId, status, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model Interview {
  id              String          @id @default(cuid())
  jobOpeningId    String
  candidateId     String
  tenantId        String
  organizationId  String
  interviewType   InterviewType
  scheduledDate   DateTime
  durationMinutes Int             @default(60)
  interviewers    Json?           // Array of Employee IDs
  location        String?         // physical or video link
  status          InterviewStatus @default(SCHEDULED)
  feedback        String?
  rating          Int?            // 1-5
  createdBy       String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  jobOpening JobOpening @relation(fields: [jobOpeningId], references: [id], onDelete: Cascade)
  candidate  Candidate  @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant      Tenant      @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([organizationId])
  @@index([jobOpeningId])
  @@index([candidateId])
  @@index([status])
  @@index([scheduledDate])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model Offer {
  id              String       @id @default(cuid())
  jobOpeningId    String
  candidateId     String
  tenantId        String
  organizationId  String
  offerDate       DateTime     @default(now())
  salaryAmount    Float?
  salaryCurrency  String       @default("USD")
  bonusAmount     Float?
  equityInfo      String?
  joiningDate     DateTime?
  contractUrl     String?
  status          OfferStatus  @default(DRAFT)
  notes           String?
  approvedById    String?
  approvedAt      DateTime?
  createdBy       String?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  jobOpening   JobOpening   @relation(fields: [jobOpeningId], references: [id], onDelete: Cascade)
  candidate    Candidate    @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  approvedBy   Employee?    @relation(fields: [approvedById], references: [id], onDelete: SetNull)

  @@index([tenantId])
  @@index([organizationId])
  @@index([jobOpeningId])
  @@index([candidateId])
  @@index([status])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}
```

---

## 2. Assets

### Enums

```prisma
enum AssetStatus {
  AVAILABLE
  ALLOCATED
  MAINTENANCE
  RETIRED
  LOST
}

enum AssetCategoryType {
  LAPTOP
  DESKTOP
  MONITOR
  KEYBOARD
  MOUSE
  HEADSET
  PHONE
  TABLET
  PRINTER
  FURNITURE
  VEHICLE
  SOFTWARE
  OTHER
}

enum AssetAllocationStatus {
  ACTIVE
  RETURNED
  DAMAGED
}

enum AssetMaintenanceStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

### Models

```prisma
model AssetCategory {
  id              String             @id @default(cuid())
  tenantId        String
  organizationId  String
  name            String
  categoryType    AssetCategoryType  @default(OTHER)
  description     String?
  isActive        Boolean            @default(true)
  createdBy       String?
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  assets       Asset[]

  @@unique([tenantId, organizationId, name])
  @@index([tenantId])
  @@index([organizationId])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model Asset {
  id              String       @id @default(cuid())
  tenantId        String
  organizationId  String
  assetCategoryId String
  assetTag        String       @unique // e.g. ZOIKO-LT-001
  name            String
  brand           String?
  model           String?
  serialNumber    String?
  purchaseDate    DateTime?
  purchaseCost    Float?
  warrantyExpiry  DateTime?
  status          AssetStatus  @default(AVAILABLE)
  location        String?
  notes           String?
  createdBy       String?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  category        AssetCategory            @relation(fields: [assetCategoryId], references: [id], onDelete: Cascade)
  organization    Organization             @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant          Tenant                   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  allocations     AssetAllocation[]
  maintenanceLogs AssetMaintenance[]

  @@index([tenantId])
  @@index([organizationId])
  @@index([assetCategoryId])
  @@index([assetTag])
  @@index([status])
  @@index([tenantId, status, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model AssetAllocation {
  id              String                 @id @default(cuid())
  assetId         String
  employeeId      String
  tenantId        String
  organizationId  String
  allocatedDate   DateTime               @default(now())
  expectedReturnDate DateTime?
  returnedDate    DateTime?
  conditionAtAllocation String?
  conditionAtReturn      String?
  status          AssetAllocationStatus  @default(ACTIVE)
  notes           String?
  createdBy       String?
  createdAt       DateTime               @default(now())
  updatedAt       DateTime               @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  asset        Asset        @relation(fields: [assetId], references: [id], onDelete: Cascade)
  employee     Employee     @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([organizationId])
  @@index([assetId])
  @@index([employeeId])
  @@index([status])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model AssetMaintenance {
  id              String                  @id @default(cuid())
  assetId         String
  tenantId        String
  organizationId  String
  maintenanceDate DateTime                @default(now())
  description     String
  cost            Float?
  vendor          String?
  status          AssetMaintenanceStatus  @default(PENDING)
  completedDate   DateTime?
  notes           String?
  createdBy       String?
  createdAt       DateTime                @default(now())
  updatedAt       DateTime                @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  asset        Asset        @relation(fields: [assetId], references: [id], onDelete: Cascade)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([organizationId])
  @@index([assetId])
  @@index([status])
  @@index([maintenanceDate])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}
```

---

## 3. Travel

### Enums

```prisma
enum TravelRequestStatus {
  DRAFT
  SUBMITTED
  APPROVED
  REJECTED
  CANCELLED
  COMPLETED
}

enum TravelMode {
  FLIGHT
  TRAIN
  BUS
  CAB
  CAR
  OTHER
}

enum ExpenseClaimStatus {
  DRAFT
  SUBMITTED
  APPROVED
  REJECTED
  REIMBURSED
}

enum ReimbursementStatus {
  PENDING
  PROCESSED
  COMPLETED
  FAILED
}

enum CorporateTripStatus {
  PLANNED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum TravelPolicyType {
  DOMESTIC
  INTERNATIONAL
  BOTH
}
```

### Models

```prisma
model TravelPolicy {
  id              String            @id @default(cuid())
  tenantId        String
  organizationId  String
  name            String
  policyType      TravelPolicyType  @default(BOTH)
  description     String?
  maxFlightClass  String?           // ECONOMY, BUSINESS, FIRST
  maxHotelRate    Float?
  maxDailyMealAllowance Float?
  currency        String            @default("USD")
  requiresApproval Boolean          @default(true)
  isActive        Boolean           @default(true)
  createdBy       String?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  travelRequests TravelRequest[]

  @@unique([tenantId, organizationId, name])
  @@index([tenantId])
  @@index([organizationId])
  @@index([isActive])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model TravelRequest {
  id              String               @id @default(cuid())
  employeeId      String
  tenantId        String
  organizationId  String
  travelPolicyId  String?
  title           String
  purpose         String?
  destination     String
  fromDate        DateTime
  toDate          DateTime
  travelMode      TravelMode           @default(FLIGHT)
  estimatedCost   Float?
  currency        String               @default("USD")
  status          TravelRequestStatus  @default(DRAFT)
  approvedById    String?
  approvedAt      DateTime?
  rejectionReason String?
  createdBy       String?
  createdAt       DateTime             @default(now())
  updatedAt       DateTime             @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  employee      Employee       @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  travelPolicy  TravelPolicy?  @relation(fields: [travelPolicyId], references: [id], onDelete: SetNull)
  approvedBy    Employee?      @relation(fields: [approvedById], references: [id], onDelete: SetNull)
  organization  Organization   @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant        Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  approvals     TravelApproval[]
  expenseClaims ExpenseClaim[]

  @@index([tenantId])
  @@index([organizationId])
  @@index([employeeId])
  @@index([status])
  @@index([fromDate, toDate])
  @@index([tenantId, status, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model TravelApproval {
  id              String       @id @default(cuid())
  travelRequestId String
  tenantId        String
  level           Int          @default(1)
  approverId      String?
  status          ApprovalStatus @default(PENDING)
  comment         String?
  approvedAt      DateTime?
  createdAt       DateTime     @default(now())

  travelRequest TravelRequest @relation(fields: [travelRequestId], references: [id], onDelete: Cascade)
  tenant        Tenant        @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  approver      Employee?     @relation(fields: [approverId], references: [id], onDelete: SetNull)

  @@index([tenantId])
  @@index([travelRequestId])
  @@index([approverId])
  @@index([status])
}

model ExpenseCategory {
  id              String   @id @default(cuid())
  tenantId        String
  organizationId  String
  name            String   // e.g. TRAVEL, MEALS, OFFICE_SUPPLIES
  description     String?
  isActive        Boolean  @default(true)
  createdBy       String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  organization Organization   @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  expenseClaims ExpenseClaim[]

  @@unique([tenantId, organizationId, name])
  @@index([tenantId])
  @@index([organizationId])
  @@index([isActive])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model ExpenseClaim {
  id                String               @id @default(cuid())
  employeeId        String
  tenantId          String
  organizationId    String
  travelRequestId   String?
  expenseCategoryId String
  receiptDate       DateTime
  description       String
  amount            Float
  currency          String               @default("USD")
  receiptUrl        String?
  status            ExpenseClaimStatus   @default(DRAFT)
  approvedById      String?
  approvedAt        DateTime?
  rejectionReason   String?
  createdBy         String?
  createdAt         DateTime             @default(now())
  updatedAt         DateTime             @updatedAt
  deletedAt         DateTime?
  deletedBy         String?
  deletionReason    String?

  employee        Employee         @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  travelRequest   TravelRequest?   @relation(fields: [travelRequestId], references: [id], onDelete: SetNull)
  expenseCategory ExpenseCategory  @relation(fields: [expenseCategoryId], references: [id], onDelete: Cascade)
  approvedBy      Employee?        @relation(fields: [approvedById], references: [id], onDelete: SetNull)
  organization    Organization     @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant          Tenant           @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  reimbursements  Reimbursement[]

  @@index([tenantId])
  @@index([organizationId])
  @@index([employeeId])
  @@index([travelRequestId])
  @@index([expenseCategoryId])
  @@index([status])
  @@index([tenantId, status, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model Reimbursement {
  id              String               @id @default(cuid())
  expenseClaimId  String
  tenantId        String
  organizationId  String
  amount          Float
  currency        String               @default("USD")
  status          ReimbursementStatus  @default(PENDING)
  processedDate   DateTime?
  transactionRef  String?
  notes           String?
  createdBy       String?
  createdAt       DateTime             @default(now())
  updatedAt       DateTime             @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  expenseClaim ExpenseClaim @relation(fields: [expenseClaimId], references: [id], onDelete: Cascade)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([organizationId])
  @@index([expenseClaimId])
  @@index([status])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model CorporateTrip {
  id              String               @id @default(cuid())
  tenantId        String
  organizationId  String
  name            String
  description     String?
  destination     String
  fromDate        DateTime
  toDate          DateTime
  totalBudget     Float?
  currency        String               @default("USD")
  status          CorporateTripStatus  @default(PLANNED)
  organizerId     String?              // Employee ID
  notes           String?
  createdBy       String?
  createdAt       DateTime             @default(now())
  updatedAt       DateTime             @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  organizer    Employee       @relation(fields: [organizerId], references: [id], onDelete: SetNull)
  organization Organization   @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([organizationId])
  @@index([status])
  @@index([fromDate, toDate])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}
```

---

## 4. Onboarding

### Enums

```prisma
enum DocumentVerificationStatus {
  PENDING
  VERIFIED
  REJECTED
  ACTION_REQUIRED
}

enum WelcomeKitStatus {
  NOT_STARTED
  PREPARING
  READY
  DELIVERED
}
```

### Models

```prisma
model OnboardingDocumentVerification {
  id                  String                       @id @default(cuid())
  employeeId          String
  tenantId            String
  organizationId      String
  documentType        String                       // e.g. ID_PROOF, QUALIFICATION, EXPERIENCE
  documentUrl         String?
  status              DocumentVerificationStatus   @default(PENDING)
  verifiedBy          String?                      // Employee ID of HR/verifier
  verifiedAt          DateTime?
  rejectionReason     String?
  submittedAt         DateTime                     @default(now())
  notes               String?
  createdAt           DateTime                     @default(now())
  updatedAt           DateTime                     @updatedAt
  deletedAt           DateTime?

  employee     Employee     @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  verifiedByRef Employee?   @relation("OnboardingVerifier", fields: [verifiedBy], references: [id], onDelete: SetNull)

  @@index([tenantId])
  @@index([organizationId])
  @@index([employeeId])
  @@index([status])
  @@index([documentType])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model OnboardingAssetAllocation {
  id              String   @id @default(cuid())
  employeeId      String
  tenantId        String
  organizationId  String
  assetName       String   // e.g. Laptop, Monitor, Headset
  assetIdentifier String?  // serial number if available before allocation
  isPrepared      Boolean  @default(false)
  isDelivered     Boolean  @default(false)
  deliveredDate   DateTime?
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?

  employee     Employee     @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([organizationId])
  @@index([employeeId])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model OnboardingWelcomeKit {
  id              String             @id @default(cuid())
  employeeId      String
  tenantId        String
  organizationId  String
  kitName         String             @default("Standard Welcome Kit")
  items           Json?              // array of items with quantity
  status          WelcomeKitStatus   @default(NOT_STARTED)
  preparedBy      String?
  preparedDate    DateTime?
  deliveredDate   DateTime?
  notes           String?
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt
  deletedAt       DateTime?

  employee     Employee     @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([organizationId])
  @@index([employeeId])
  @@index([status])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}
```

> **Note:** `NewJoiner` maps to the existing `Employee` model. `Probation` already exists as a model.

---

## 5. Learning

### Enums

```prisma
enum CourseStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum CourseDifficulty {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

enum EnrollmentStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
  DROPPED
  EXPIRED
}

enum AssessmentStatus {
  DRAFT
  PUBLISHED
  CLOSED
}

enum CertificationStatus {
  ACTIVE
  EXPIRED
  REVOKED
}
```

### Models

```prisma
model LearningCourse {
  id              String           @id @default(cuid())
  tenantId        String
  organizationId  String
  title           String
  description     String?
  provider        String?          // internal or external provider
  category        String?          // e.g. TECHNICAL, SOFT_SKILLS, COMPLIANCE
  difficulty      CourseDifficulty @default(BEGINNER)
  durationHours   Int              @default(0)
  status          CourseStatus     @default(DRAFT)
  thumbnailUrl    String?
  contentUrl      String?
  maxParticipants Int?
  createdBy       String?
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  enrollments  Enrollment[]

  @@unique([tenantId, organizationId, title])
  @@index([tenantId])
  @@index([organizationId])
  @@index([status])
  @@index([category])
  @@index([tenantId, status, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model LearningPath {
  id              String   @id @default(cuid())
  tenantId        String
  organizationId  String
  name            String
  description     String?
  courseIds       Json?    // ordered array of course IDs
  durationDays    Int?
  isActive        Boolean  @default(true)
  createdBy       String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([tenantId, organizationId, name])
  @@index([tenantId])
  @@index([organizationId])
  @@index([isActive])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model Certification {
  id              String              @id @default(cuid())
  tenantId        String
  organizationId  String
  employeeId      String
  name            String
  issuer          String?
  issueDate       DateTime
  expiryDate      DateTime?
  credentialUrl   String?
  status          CertificationStatus @default(ACTIVE)
  createdBy       String?
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  employee     Employee     @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([organizationId])
  @@index([employeeId])
  @@index([status])
  @@index([expiryDate])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model Assessment {
  id              String            @id @default(cuid())
  tenantId        String
  organizationId  String
  courseId        String?
  title           String
  description     String?
  passingScore    Int               @default(70)
  maxScore        Int               @default(100)
  durationMinutes Int?
  status          AssessmentStatus  @default(DRAFT)
  questions       Json?             // array of question objects
  createdBy       String?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  course       LearningCourse? @relation(fields: [courseId], references: [id], onDelete: SetNull)
  organization Organization    @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant          @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  enrollments  Enrollment[]

  @@index([tenantId])
  @@index([organizationId])
  @@index([courseId])
  @@index([status])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model Enrollment {
  id              String            @id @default(cuid())
  employeeId      String
  tenantId        String
  organizationId  String
  courseId        String?
  assessmentId    String?
  learningPathId  String?
  enrolledDate    DateTime          @default(now())
  startedAt       DateTime?
  completedAt     DateTime?
  progress        Int               @default(0) // 0-100
  score           Int?
  status          EnrollmentStatus  @default(NOT_STARTED)
  createdBy       String?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  employee     Employee       @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  course       LearningCourse? @relation(fields: [courseId], references: [id], onDelete: SetNull)
  assessment   Assessment?    @relation(fields: [assessmentId], references: [id], onDelete: SetNull)
  organization Organization   @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([organizationId])
  @@index([employeeId])
  @@index([courseId])
  @@index([assessmentId])
  @@index([learningPathId])
  @@index([status])
  @@index([tenantId, status, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}
```

---

## 6. Compensation

### Enums

```prisma
enum SalaryStructureStatus {
  ACTIVE
  INACTIVE
  ARCHIVED
}

enum PayGradeStatus {
  ACTIVE
  INACTIVE
}

enum AllowanceType {
  FIXED
  VARIABLE
  REIMBURSEMENT
}

enum DeductionType {
  TAX
  INSURANCE
  PENSION
  LOAN
  OTHER
}

enum BenefitPlanType {
  HEALTH
  DENTAL
  VISION
  LIFE_INSURANCE
  RETIREMENT
  STOCK
  OTHER
}

enum BonusType {
  PERFORMANCE
  ANNUAL
  SIGN_ON
  RETENTION
  REFERRAL
  SPOT
  OTHER
}

enum CompensationReviewStatus {
  DRAFT
  PENDING_APPROVAL
  APPROVED
  REJECTED
}

enum SalaryRevisionStatus {
  DRAFT
  PENDING_APPROVAL
  APPROVED
  REJECTED
}
```

### Models

```prisma
model PayGrade {
  id              String          @id @default(cuid())
  tenantId        String
  organizationId  String
  name            String
  code            String
  level           Int             @default(1)
  minSalary       Float
  midSalary       Float
  maxSalary       Float
  currency        String          @default("USD")
  status          PayGradeStatus  @default(ACTIVE)
  createdBy       String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  organization     Organization    @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant           Tenant          @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  salaryStructures SalaryStructure[]

  @@unique([tenantId, organizationId, name])
  @@unique([tenantId, organizationId, code])
  @@index([tenantId])
  @@index([organizationId])
  @@index([level])
  @@index([status])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model BenefitPlan {
  id              String          @id @default(cuid())
  tenantId        String
  organizationId  String
  name            String
  planType        BenefitPlanType
  description     String?
  coverageDetails Json?
  monthlyCost     Float?
  currency        String          @default("USD")
  isActive        Boolean         @default(true)
  createdBy       String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  salaryStructures SalaryStructure[]

  @@unique([tenantId, organizationId, name])
  @@index([tenantId])
  @@index([organizationId])
  @@index([planType])
  @@index([isActive])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model Allowance {
  id              String        @id @default(cuid())
  tenantId        String
  organizationId  String
  name            String
  allowanceType   AllowanceType @default(FIXED)
  amount          Float?
  percentageOfBase Float?       // if variable
  currency        String        @default("USD")
  isActive        Boolean       @default(true)
  createdBy       String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  salaryStructures SalaryStructure[]

  @@unique([tenantId, organizationId, name])
  @@index([tenantId])
  @@index([organizationId])
  @@index([allowanceType])
  @@index([isActive])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model Deduction {
  id              String        @id @default(cuid())
  tenantId        String
  organizationId  String
  name            String
  deductionType   DeductionType
  amount          Float?
  percentageOfBase Float?
  currency        String        @default("USD")
  isActive        Boolean       @default(true)
  createdBy       String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  salaryStructures SalaryStructure[]

  @@unique([tenantId, organizationId, name])
  @@index([tenantId])
  @@index([organizationId])
  @@index([deductionType])
  @@index([isActive])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model SalaryStructure {
  id                String                    @id @default(cuid())
  employeeId        String
  tenantId          String
  organizationId    String
  payGradeId        String?
  effectiveDate     DateTime
  baseSalary        Float
  currency          String                    @default("USD")
  payFrequency      PaymentFrequency          @default(MONTHLY)
  allowances        Json?                     // { "allowanceId": amount, ... }
  deductions        Json?                     // { "deductionId": amount, ... }
  benefitPlanIds    Json?                     // array of BenefitPlan IDs
  totalCtc          Float?
  status            SalaryStructureStatus     @default(ACTIVE)
  createdBy         String?
  createdAt         DateTime                  @default(now())
  updatedAt         DateTime                  @updatedAt
  deletedAt         DateTime?
  deletedBy         String?
  deletionReason    String?

  employee     Employee     @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  payGrade     PayGrade?    @relation(fields: [payGradeId], references: [id], onDelete: SetNull)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([employeeId, effectiveDate])
  @@index([tenantId])
  @@index([organizationId])
  @@index([employeeId])
  @@index([payGradeId])
  @@index([status])
  @@index([effectiveDate])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model Bonus {
  id              String       @id @default(cuid())
  employeeId      String
  tenantId        String
  organizationId  String
  bonusType       BonusType
  amount          Float
  currency        String       @default("USD")
  bonusDate       DateTime
  reason          String?
  approvedById    String?
  approvedAt      DateTime?
  createdBy       String?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  employee     Employee     @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  approvedBy   Employee?    @relation(fields: [approvedById], references: [id], onDelete: SetNull)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([organizationId])
  @@index([employeeId])
  @@index([bonusType])
  @@index([bonusDate])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model CompensationReview {
  id              String                    @id @default(cuid())
  employeeId      String
  tenantId        String
  organizationId  String
  reviewDate      DateTime
  currentSalary   Float
  recommendedSalary Float?
  increasePercent Float?
  increaseAmount  Float?
  currency        String                    @default("USD")
  reason          String?
  status          CompensationReviewStatus  @default(DRAFT)
  reviewedById    String?
  approvedById    String?
  approvedAt      DateTime?
  createdBy       String?
  createdAt       DateTime                  @default(now())
  updatedAt       DateTime                  @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  employee     Employee     @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  reviewedBy   Employee?    @relation("CompensationReviewer", fields: [reviewedById], references: [id], onDelete: SetNull)
  approvedBy   Employee?    @relation("CompensationApprover", fields: [approvedById], references: [id], onDelete: SetNull)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([organizationId])
  @@index([employeeId])
  @@index([status])
  @@index([reviewDate])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model SalaryRevision {
  id              String                 @id @default(cuid())
  employeeId      String
  tenantId        String
  organizationId  String
  revisionDate    DateTime
  previousSalary  Float
  newSalary       Float
  currency        String                 @default("USD")
  reason          String?
  revisionType    String?                // PROMOTION, MERIT, MARKET_ADJ, etc.
  status          SalaryRevisionStatus   @default(DRAFT)
  approvedById    String?
  approvedAt      DateTime?
  createdBy       String?
  createdAt       DateTime               @default(now())
  updatedAt       DateTime               @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  employee     Employee     @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  approvedBy   Employee?    @relation(fields: [approvedById], references: [id], onDelete: SetNull)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([organizationId])
  @@index([employeeId])
  @@index([status])
  @@index([revisionDate])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}
```

---

## 7. ESS (Employee Self Service)

No new tables needed. Maps to existing models:

| ESS Feature          | Existing Table        |
|----------------------|-----------------------|
| View attendance      | Attendance            |
| Apply leave          | LeaveRequest          |
| View leave balance   | LeaveBalance          |
| Update profile       | EmployeeProfile       |
| View payslips        | EmployeeDocumentReference |
| View goals           | Goal                  |
| Submit feedback      | Feedback              |
| View team            | ReportingRelationship |

---

## 8. Rewards

### Enums

```prisma
enum RewardsProgramStatus {
  ACTIVE
  PAUSED
  COMPLETED
  ARCHIVED
}

enum AwardType {
  SPOT_AWARD
  MVP
  MILESTONE
  PEER_RECOGNITION
  MANAGER_CHOICE
  CUSTOM
}

enum RewardTransactionType {
  EARNED
  REDEEMED
  EXPIRED
  ADJUSTED
}
```

### Models

```prisma
model RewardsProgram {
  id              String                 @id @default(cuid())
  tenantId        String
  organizationId  String
  name            String
  description     String?
  awardType       AwardType              @default(SPOT_AWARD)
  pointsPerAward  Int                    @default(100)
  budgetAmount    Float?
  currency        String                 @default("USD")
  startDate       DateTime?
  endDate         DateTime?
  status          RewardsProgramStatus   @default(ACTIVE)
  createdBy       String?
  createdAt       DateTime               @default(now())
  updatedAt       DateTime               @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  awards       EmployeeAward[]

  @@unique([tenantId, organizationId, name])
  @@index([tenantId])
  @@index([organizationId])
  @@index([status])
  @@index([awardType])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model EmployeeAward {
  id              String     @id @default(cuid())
  employeeId      String
  tenantId        String
  organizationId  String
  programId       String
  awardType       AwardType  @default(SPOT_AWARD)
  reason          String
  awardedById     String?
  awardedAt       DateTime   @default(now())
  pointsAwarded   Int        @default(0)
  certificateUrl  String?
  createdBy       String?
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
  deletedAt       DateTime?

  employee   Employee        @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  program    RewardsProgram  @relation(fields: [programId], references: [id], onDelete: Cascade)
  awardedBy  Employee?       @relation("AwardGiver", fields: [awardedById], references: [id], onDelete: SetNull)
  organization Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant     Tenant          @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([organizationId])
  @@index([employeeId])
  @@index([programId])
  @@index([awardType])
  @@index([awardedAt])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model RewardPointBalance {
  id              String   @id @default(cuid())
  employeeId      String
  tenantId        String
  organizationId  String
  totalPoints     Int      @default(0)
  redeemedPoints  Int      @default(0)
  availablePoints Int      @default(0)
  lastUpdated     DateTime @updatedAt
  createdAt       DateTime @default(now())

  employee     Employee     @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([tenantId, employeeId])
  @@index([tenantId])
  @@index([organizationId])
  @@index([employeeId])
  @@index([createdAt])
}

model RewardPointTransaction {
  id              String                @id @default(cuid())
  employeeId      String
  tenantId        String
  organizationId  String
  points          Int                   // positive = earn, negative = redeem/expire
  transactionType RewardTransactionType
  referenceId     String?               // e.g. award ID, redemption ID
  note            String?
  createdAt       DateTime              @default(now())

  employee     Employee     @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([organizationId])
  @@index([employeeId])
  @@index([transactionType])
  @@index([createdAt])
}

model Achievement {
  id              String   @id @default(cuid())
  employeeId      String
  tenantId        String
  organizationId  String
  title           String
  description     String?
  achievedDate    DateTime
  badgeUrl        String?
  createdBy       String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  employee     Employee     @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([organizationId])
  @@index([employeeId])
  @@index([achievedDate])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}
```

---

## 9. Workforce Planning

### Enums

```prisma
enum WFPlanStatus {
  DRAFT
  ACTIVE
  COMPLETED
  ARCHIVED
}

enum WFSkillProficiency {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
}

enum WFSuccessionStatus {
  READY_NOW
  READY_IN_1_2_YEARS
  READY_IN_3_5_YEARS
  DEVELOPMENTAL_NEED
  NOT_READY
}
```

### Models

```prisma
model WFHeadcountPlan {
  id              String        @id @default(cuid())
  tenantId        String
  organizationId  String
  fiscalYear      Int
  departmentId    String?
  plannedHeadcount Int           @default(0)
  currentHeadcount Int           @default(0)
  approvedHeadcount Int          @default(0)
  openPositions   Int            @default(0)
  budgetAllocated  Float?
  currency        String        @default("USD")
  status          WFPlanStatus  @default(DRAFT)
  notes           String?
  createdBy       String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  department   Department?  @relation(fields: [departmentId], references: [id], onDelete: SetNull)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([tenantId, organizationId, fiscalYear, departmentId])
  @@index([tenantId])
  @@index([organizationId])
  @@index([departmentId])
  @@index([fiscalYear])
  @@index([status])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model WFWorkforceForecast {
  id              String        @id @default(cuid())
  tenantId        String
  organizationId  String
  fiscalYear      Int
  departmentId    String?
  projectedHeadcount Int        @default(0)
  projectedAttrition Float?    // percentage
  projectedNewHires Int        @default(0)
  projectedTransfers Int       @default(0)
  confidenceLevel  String?     // HIGH, MEDIUM, LOW
  status          WFPlanStatus @default(DRAFT)
  notes           String?
  createdBy       String?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  department   Department?  @relation(fields: [departmentId], references: [id], onDelete: SetNull)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([tenantId, organizationId, fiscalYear, departmentId])
  @@index([tenantId])
  @@index([organizationId])
  @@index([departmentId])
  @@index([fiscalYear])
  @@index([status])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model WFHiringPlan {
  id              String        @id @default(cuid())
  tenantId        String
  organizationId  String
  fiscalYear      Int
  departmentId    String?
  designationId   String?
  plannedHires    Int           @default(0)
  approvedHires   Int           @default(0)
  filledHires     Int           @default(0)
  targetStartDate DateTime?
  budgetPerHire   Float?
  currency        String        @default("USD")
  status          WFPlanStatus  @default(DRAFT)
  notes           String?
  createdBy       String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  department   Department?  @relation(fields: [departmentId], references: [id], onDelete: SetNull)
  designation  Designation? @relation(fields: [designationId], references: [id], onDelete: SetNull)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([organizationId])
  @@index([departmentId])
  @@index([designationId])
  @@index([fiscalYear])
  @@index([status])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model WFCapacityPlan {
  id              String        @id @default(cuid())
  tenantId        String
  organizationId  String
  fiscalYear      Int
  departmentId    String?
  currentCapacity Int           @default(0) // person-hours or FTE
  requiredCapacity Int          @default(0)
  gap             Int           @default(0)
  status          WFPlanStatus  @default(DRAFT)
  notes           String?
  createdBy       String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  department   Department?  @relation(fields: [departmentId], references: [id], onDelete: SetNull)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([organizationId])
  @@index([departmentId])
  @@index([fiscalYear])
  @@index([status])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model WFSkillGap {
  id              String           @id @default(cuid())
  tenantId        String
  organizationId  String
  departmentId    String?
  skillName       String
  currentLevel    WFSkillProficiency
  requiredLevel   WFSkillProficiency
  gap             String?          // e.g. "LOW", "MEDIUM", "HIGH"
  employeeCount   Int              @default(0)
  fiscalYear      Int
  status          WFPlanStatus     @default(DRAFT)
  notes           String?
  createdBy       String?
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  department   Department?  @relation(fields: [departmentId], references: [id], onDelete: SetNull)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([tenantId, organizationId, departmentId, skillName, fiscalYear])
  @@index([tenantId])
  @@index([organizationId])
  @@index([departmentId])
  @@index([skillName])
  @@index([fiscalYear])
  @@index([status])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model WFSuccessionPlan {
  id              String               @id @default(cuid())
  tenantId        String
  organizationId  String
  positionTitle   String
  departmentId    String?
  currentHolderId String?               // Employee ID
  successorId     String?               // Employee ID
  readiness       WFSuccessionStatus    @default(DEVELOPMENTAL_NEED)
  notes           String?
  fiscalYear      Int
  status          WFPlanStatus          @default(DRAFT)
  createdBy       String?
  createdAt       DateTime              @default(now())
  updatedAt       DateTime              @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  department     Department?  @relation(fields: [departmentId], references: [id], onDelete: SetNull)
  currentHolder  Employee?    @relation("CurrentPositionHolder", fields: [currentHolderId], references: [id], onDelete: SetNull)
  successor      Employee?    @relation("PositionSuccessor", fields: [successorId], references: [id], onDelete: SetNull)
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant         Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([organizationId])
  @@index([departmentId])
  @@index([currentHolderId])
  @@index([successorId])
  @@index([readiness])
  @@index([fiscalYear])
  @@index([status])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model WFBudgetPlan {
  id              String        @id @default(cuid())
  tenantId        String
  organizationId  String
  fiscalYear      Int
  departmentId    String?
  totalBudget     Float
  allocatedBudget Float
  spentBudget     Float         @default(0)
  currency        String        @default("USD")
  category        String?       // SALARY, RECRUITMENT, TRAINING, etc.
  status          WFPlanStatus  @default(DRAFT)
  notes           String?
  createdBy       String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  department   Department?  @relation(fields: [departmentId], references: [id], onDelete: SetNull)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([tenantId, organizationId, fiscalYear, departmentId, category])
  @@index([tenantId])
  @@index([organizationId])
  @@index([departmentId])
  @@index([fiscalYear])
  @@index([category])
  @@index([status])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model WFScenarioPlan {
  id              String        @id @default(cuid())
  tenantId        String
  organizationId  String
  name            String
  description     String?
  fiscalYear      Int
  scenarioData    Json?         // flexible JSON with what-if parameters
  projectedOutcome Json?        // result of scenario modeling
  status          WFPlanStatus  @default(DRAFT)
  createdBy       String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([tenantId, organizationId, name])
  @@index([tenantId])
  @@index([organizationId])
  @@index([fiscalYear])
  @@index([status])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}
```

---

## 10. Employee Lifecycle

No new tables needed. Maps to existing models:

| Lifecycle Event       | Existing Table        |
|-----------------------|-----------------------|
| Hire / Onboarding     | Employee, EmploymentRecord, Probation |
| Transfer / Promotion  | EmploymentRecord (new version) |
| Status Change         | EmployeeStatusRecord  |
| Termination           | Employee (terminationDate), EmployeeStatusRecord |
| Re-hire               | Employee (new record, linked) |

---

## 11. Helpdesk

### Enums

```prisma
enum HelpdeskTicketStatus {
  OPEN
  ASSIGNED
  IN_PROGRESS
  RESOLVED
  CLOSED
  REOPENED
}

enum HelpdeskPriority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum HelpdeskCaseStatus {
  NEW
  OPEN
  PENDING
  RESOLVED
  CLOSED
}

enum SLAPriority {
  P1
  P2
  P3
  P4
}

enum EmployeeRequestStatus {
  SUBMITTED
  IN_REVIEW
  APPROVED
  REJECTED
  CANCELLED
}
```

### Models

```prisma
model HelpdeskTicket {
  id              String               @id @default(cuid())
  employeeId      String
  tenantId        String
  organizationId  String
  subject         String
  description     String?
  category        String?              // IT, HR, ADMIN, FACILITIES, etc.
  priority        HelpdeskPriority     @default(MEDIUM)
  status          HelpdeskTicketStatus @default(OPEN)
  assignedToId    String?              // Employee ID of support agent
  slaId           String?
  resolvedAt      DateTime?
  closedAt        DateTime?
  createdBy       String?
  createdAt       DateTime             @default(now())
  updatedAt       DateTime             @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  employee     Employee       @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  assignedTo   Employee?      @relation("TicketAssignee", fields: [assignedToId], references: [id], onDelete: SetNull)
  sla          HelpdeskSLA?   @relation(fields: [slaId], references: [id], onDelete: SetNull)
  organization Organization   @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([organizationId])
  @@index([employeeId])
  @@index([assignedToId])
  @@index([status])
  @@index([priority])
  @@index([category])
  @@index([tenantId, status, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model HelpdeskCase {
  id              String              @id @default(cuid())
  employeeId      String
  tenantId        String
  organizationId  String
  ticketId        String?
  subject         String
  description     String?
  category        String?
  priority        HelpdeskPriority    @default(MEDIUM)
  status          HelpdeskCaseStatus  @default(NEW)
  assignedToId    String?
  resolution      String?
  resolvedAt      DateTime?
  closedAt        DateTime?
  createdBy       String?
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  employee     Employee       @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  ticket       HelpdeskTicket? @relation(fields: [ticketId], references: [id], onDelete: SetNull)
  assignedTo   Employee?      @relation("CaseAssignee", fields: [assignedToId], references: [id], onDelete: SetNull)
  organization Organization   @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([organizationId])
  @@index([employeeId])
  @@index([ticketId])
  @@index([assignedToId])
  @@index([status])
  @@index([priority])
  @@index([tenantId, status, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model HelpdeskSLA {
  id                  String      @id @default(cuid())
  tenantId            String
  organizationId      String
  name                String
  priority            SLAPriority
  responseTimeHours   Int         // hours within which first response is due
  resolutionTimeHours Int         // hours within which resolution is due
  escalationAfterHours Int?       // auto-escalate if breached
  isActive            Boolean     @default(true)
  createdBy           String?
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
  deletedAt           DateTime?
  deletedBy           String?
  deletionReason      String?

  organization Organization   @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  tickets      HelpdeskTicket[]

  @@unique([tenantId, organizationId, name])
  @@index([tenantId])
  @@index([organizationId])
  @@index([priority])
  @@index([isActive])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model KnowledgeArticle {
  id              String   @id @default(cuid())
  tenantId        String
  organizationId  String
  title           String
  content         String?
  category        String?  // IT, HR, ADMIN, etc.
  tags            Json?    // array of tag strings
  isPublished     Boolean  @default(false)
  viewCount       Int      @default(0)
  helpfulCount    Int      @default(0)
  createdBy       String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([tenantId, organizationId, title])
  @@index([tenantId])
  @@index([organizationId])
  @@index([category])
  @@index([isPublished])
  @@index([viewCount])
  @@index([tenantId, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}

model EmployeeRequest {
  id              String                 @id @default(cuid())
  employeeId      String
  tenantId        String
  organizationId  String
  requestType     String                 // e.g. WORK_FROM_HOME, EQUIPMENT, TRAINING, POLICY_CHANGE
  subject         String
  description     String?
  status          EmployeeRequestStatus  @default(SUBMITTED)
  approvedById    String?
  approvedAt      DateTime?
  rejectionReason String?
  createdBy       String?
  createdAt       DateTime               @default(now())
  updatedAt       DateTime               @updatedAt
  deletedAt       DateTime?
  deletedBy       String?
  deletionReason  String?

  employee     Employee     @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  approvedBy   Employee?    @relation("RequestApprover", fields: [approvedById], references: [id], onDelete: SetNull)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  tenant       Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@index([tenantId])
  @@index([organizationId])
  @@index([employeeId])
  @@index([requestType])
  @@index([status])
  @@index([tenantId, status, deletedAt])
  @@index([createdAt])
  @@index([deletedAt])
}
```

---

## Summary of New Tables

| Module | New Tables |
|--------|-----------|
| Recruitment | JobOpening, Candidate, Interview, Offer |
| Assets | Asset, AssetCategory, AssetAllocation, AssetMaintenance |
| Travel | TravelRequest, ExpenseClaim, ExpenseCategory, TravelApproval, Reimbursement, CorporateTrip, TravelPolicy |
| Onboarding | OnboardingDocumentVerification, OnboardingAssetAllocation, OnboardingWelcomeKit |
| Learning | LearningCourse, LearningPath, Certification, Assessment, Enrollment |
| Compensation | SalaryStructure, PayGrade, Allowance, Deduction, BenefitPlan, Bonus, CompensationReview, SalaryRevision |
| ESS | *(none — maps to existing tables)* |
| Rewards | EmployeeAward, RewardsProgram, RewardPointBalance, RewardPointTransaction, Achievement |
| Workforce Planning | WFHeadcountPlan, WFWorkforceForecast, WFHiringPlan, WFCapacityPlan, WFSkillGap, WFSuccessionPlan, WFBudgetPlan, WFScenarioPlan |
| Employee Lifecycle | *(none — maps to existing tables)* |
| Helpdesk | HelpdeskTicket, HelpdeskCase, HelpdeskSLA, KnowledgeArticle, EmployeeRequest |
| **Total** | **43 new models** |
