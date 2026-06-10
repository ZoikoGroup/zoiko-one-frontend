# Assets API Blueprint

**Module:** Assets  
**Base Path:** `/api/zoiko-hr/assets`  
**Models:** Asset, AssetCategory, AssetAllocation, AssetReturn, AssetMaintenance  
**Pages:** dashboard, allocation, categories, inventory, maintenance, reports, returns

---

## Required Endpoints

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Aggregated asset dashboard metrics |

**GET /dashboard**  
- **Query Params:** `none`
- **Response (200):**
```json
{
  "totalAssets": 150,
  "allocatedAssets": 98,
  "underMaintenance": 12,
  "availableAssets": 40,
  "recentAllocations": 5,
  "pendingReturns": 3,
  "lowUtilizationAssets": 8,
  "overdueMaintenance": 2
}
```

---

### Asset

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/assets` | List all assets (paginated, searchable) |
| GET | `/assets/{id}` | Get single asset details |
| POST | `/assets` | Create a new asset |
| PUT | `/assets/{id}` | Update an asset |
| PATCH | `/assets/{id}/status` | Update asset status |

**GET /assets**  
- **Query Params:**
  - `search` (string, optional) — search by name, assetId, brand, model
  - `status` (enum: available | allocated | under-maintenance | retired, optional)
  - `categoryId` (number, optional)
  - `assignedToId` (number, optional) — filter by employee
  - `purchaseDateFrom` (date, optional)
  - `purchaseDateTo` (date, optional)
  - `page` (int, default: 1)
  - `pageSize` (int, default: 20, max: 100)
  - `sortBy` (string, default: `createdAt`)
  - `sortOrder` (asc | desc, default: `desc`)
- **Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "assetId": "AST-001",
      "name": "Dell Latitude 5420",
      "categoryId": 1,
      "category": { "id": 1, "name": "Laptop" },
      "brand": "Dell",
      "model": "Latitude 5420",
      "purchaseDate": "2024-01-15",
      "status": "allocated",
      "assignedToId": 101,
      "assignedTo": { "id": 101, "name": "John Doe" },
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-06-01T08:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 150,
    "totalPages": 8
  }
}
```

**POST /assets**  
- **Request Body:**
```json
{
  "name": "Dell Latitude 5420",
  "categoryId": 1,
  "brand": "Dell",
  "model": "Latitude 5420",
  "purchaseDate": "2024-01-15",
  "status": "available",
  "assignedToId": null,
  "serialNumber": "SN-XXX-001",
  "cost": 1200.00
}
```
- **Validation Rules:**
  - `name`: required, string, max 255 chars
  - `categoryId`: required, must exist in AssetCategory
  - `brand`: required, string, max 100 chars
  - `model`: required, string, max 100 chars
  - `purchaseDate`: required, valid date, not in future
  - `status`: required, enum (available | allocated | under-maintenance | retired)
  - `assignedToId`: optional, must exist in Employee if provided
  - `serialNumber`: optional, unique if provided
  - `cost`: optional, decimal >= 0

**PATCH /assets/{id}/status**  
- **Request Body:**
```json
{
  "status": "under-maintenance"
}
```

**Relationships:**  
- Asset belongs to AssetCategory (via `categoryId`)  
- Asset belongs to Employee (via `assignedToId`)  
- Asset has many AssetAllocations  
- Asset has many AssetReturns  
- Asset has many AssetMaintenance records  

---

### AssetCategory

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | List all categories |
| GET | `/categories/{id}` | Get single category |
| POST | `/categories` | Create a category |
| PUT | `/categories/{id}` | Update a category |

**GET /categories**  
- **Query Params:** `search` (string, optional), `page`, `pageSize` (default: 20)
- **Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "Portable computing devices",
      "assetCount": 45,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { "page": 1, "pageSize": 20, "totalItems": 5, "totalPages": 1 }
}
```

**Validation Rules:**  
- `name`: required, unique, string, max 100 chars  
- `description`: optional, string, max 500 chars  

---

### AssetAllocation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/allocations` | List allocation records |
| GET | `/allocations/{id}` | Get single allocation |
| POST | `/allocations` | Create allocation |
| PUT | `/allocations/{id}` | Update allocation |

**GET /allocations**  
- **Query Params:** `search`, `status` (active | returned), `department`, `employeeId`, `assetId`, `dateFrom`, `dateTo`, `page` (default: 1), `pageSize` (default: 20), `sortBy`, `sortOrder`

**POST /allocations**  
- **Request Body:**
```json
{
  "assetId": 1,
  "employeeId": 101,
  "department": "Engineering",
  "allocatedDate": "2024-06-01",
  "expectedReturnDate": "2025-06-01",
  "remarks": "Primary work laptop"
}
```
- **Validation Rules:**
  - `assetId`: required, asset must exist and status must be `available`
  - `employeeId`: required, must exist in Employee
  - `allocatedDate`: required, valid date
  - `expectedReturnDate`: optional, must be after allocatedDate

---

### AssetReturn

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/returns` | List return records |
| GET | `/returns/{id}` | Get single return |
| POST | `/returns` | Record asset return |

**GET /returns**  
- **Query Params:** `search`, `employeeId`, `assetId`, `condition`, `dateFrom`, `dateTo`, `page` (default: 20), `sortBy`, `sortOrder`

**POST /returns**  
- **Request Body:**
```json
{
  "assetId": 1,
  "employeeId": 101,
  "returnedDate": "2024-12-01",
  "condition": "good",
  "remarks": "Works fine, minor scratches"
}
```
- **Validation Rules:**
  - `assetId`: required, asset must have active allocation
  - `employeeId`: required, must match allocated employee
  - `returnedDate`: required, valid date, not in future
  - `condition`: required, enum (excellent | good | fair | damaged | lost)
  - On success, marks Allocation.status = `returned` and Asset.status = `available`

---

### AssetMaintenance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/maintenance` | List maintenance records |
| GET | `/maintenance/{id}` | Get single record |
| POST | `/maintenance` | Create maintenance record |
| PUT | `/maintenance/{id}` | Update record |
| PATCH | `/maintenance/{id}/status` | Update maintenance status |

**GET /maintenance**  
- **Query Params:** `search`, `status` (pending | in-progress | completed | cancelled), `assetId`, `assignedVendor`, `dateFrom`, `dateTo`, `page` (default: 20), `sortBy`, `sortOrder`

**POST /maintenance**  
- **Request Body:**
```json
{
  "assetId": 1,
  "issueReported": "Keyboard not working",
  "assignedVendor": "Dell Service Center",
  "estimatedCost": 150.00,
  "reportedDate": "2024-12-01",
  "priority": "high"
}
```
- **Validation Rules:**
  - `assetId`: required, asset must exist
  - `issueReported`: required, string, max 1000 chars
  - `assignedVendor`: required, string, max 200 chars
  - `estimatedCost`: optional, decimal >= 0
  - `priority`: optional, enum (low | medium | high | critical), default: medium
  - On create, sets Asset.status = `under-maintenance`

**PATCH /maintenance/{id}/status**  
- **Request Body:**
```json
{
  "status": "completed",
  "actualCost": 140.00,
  "completedDate": "2024-12-05",
  "resolutionNotes": "Replaced keyboard assembly"
}
```
- Status transition rules: pending → in-progress → completed | cancelled

---

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/utilization` | Asset utilization report |
| GET | `/reports/dept-allocation` | Department-wise allocation report |
| GET | `/reports/maintenance-cost` | Maintenance cost report |
| GET | `/reports/lifecycle` | Asset lifecycle report |

**GET /reports/utilization**  
- **Query Params:** `department` (optional), `dateFrom`, `dateTo`
- **Response (200):**
```json
{
  "data": [
    {
      "assetId": 1,
      "name": "Dell Latitude 5420",
      "utilizationRate": 0.85,
      "totalDays": 365,
      "allocatedDays": 310,
      "idleDays": 55
    }
  ]
}
```

**GET /reports/dept-allocation**  
- **Query Params:** `department`, `page`, `pageSize`
- **Response (200):**
```json
{
  "data": [
    {
      "department": "Engineering",
      "totalAssets": 50,
      "allocated": 45,
      "available": 3,
      "underMaintenance": 2,
      "utilizationRate": 0.90
    }
  ]
}
```

**GET /reports/maintenance-cost**  
- **Query Params:** `year` (required), `month` (optional), `department` (optional)
- **Response (200):**
```json
{
  "totalCost": 12500.00,
  "byCategory": [
    { "category": "Laptop", "cost": 8000.00, "count": 12 },
    { "category": "Monitor", "cost": 4500.00, "count": 8 }
  ],
  "byMonth": [
    { "month": "2024-01", "cost": 1200.00, "count": 3 }
  ]
}
```

**GET /reports/lifecycle**  
- **Query Params:** `categoryId`, `status`
- **Response (200):**
```json
{
  "data": [
    {
      "assetId": 1,
      "name": "Dell Latitude 5420",
      "purchaseDate": "2020-01-15",
      "age": 4.5,
      "status": "allocated",
      "maintenanceCount": 3,
      "totalMaintenanceCost": 450.00,
      "expectedLifeYears": 5
    }
  ]
}
```

---

## Validation Rules Summary

| Field | Required | Type | Constraints |
|-------|----------|------|-------------|
| name | Yes | string | max 255 chars |
| categoryId | Yes | integer | must exist in AssetCategory |
| brand | Yes | string | max 100 chars |
| status | Yes | enum | available, allocated, under-maintenance, retired |
| assetId (identifier) | On create | string | auto-generated (AST-XXX) |
| serialNumber | No | string | unique if provided |

## Pagination Strategy

- **Type:** Server-side cursor/page-based
- **Default pageSize:** 20 (all list endpoints)
- **Max pageSize:** 100
- **Response wrapper:** `{ data: [], pagination: { page, pageSize, totalItems, totalPages } }`
- **Parameters:** `page` (1-indexed), `pageSize`

## Search Strategy

- **Scope:** Text search across `name`, `assetId`, `brand`, `model` fields
- **Method:** `WHERE` clause with `ILIKE` / `LIKE` on concatenated searchable fields
- **Combinable with:** Status, category, date range filters (AND logic)

## Filters

| Filter | Type | Endpoints |
|--------|------|-----------|
| status | enum | /assets, /allocations, /maintenance |
| categoryId | integer | /assets |
| department | string | /allocations, /reports/* |
| employeeId | integer | /allocations, /returns |
| assetId | integer | /allocations, /returns, /maintenance |
| dateFrom/dateTo | date | /allocations, /returns, /maintenance, /reports/* |
| assignedVendor | string | /maintenance |
| condition | enum | /returns |
| priority | enum | /maintenance |

## Sorting

- **Default sort:** `createdAt` desc
- **Configurable via:** `sortBy` and `sortOrder` query params
- **Allowed sort fields:** `createdAt`, `updatedAt`, `name`, `status`, `purchaseDate`, `allocatedDate`, `returnedDate`, `reportedDate`, `cost`

## Upload Requirements

- **No file upload endpoints required** for this module
- Asset images (if needed later) via separate media service

## Export Requirements

- **No export endpoints required** for current phase
- Future: CSV export via `/assets/export` with same query params as GET /assets, returning `text/csv`
