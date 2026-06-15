export function getAssetRequests() {
  return [
    { id: 1, employee: "Alice Johnson", assetType: "MacBook Pro 16\"", quantity: 1, priority: "high", reason: "Current laptop has performance issues", status: "approved", requestedOn: "2025-03-01", approvedOn: "2025-03-03", notes: "Urgent replacement needed" },
    { id: 2, employee: "Bob Smith", assetType: "Dell UltraSharp Monitor 27\"", quantity: 2, priority: "medium", reason: "Need dual monitor setup for development", status: "pending", requestedOn: "2025-03-10", approvedOn: null, notes: "" },
    { id: 3, employee: "Carol Davis", assetType: "iPad Pro 12.9\"", quantity: 1, priority: "low", reason: "For design reviews on-the-go", status: "pending", requestedOn: "2025-03-12", approvedOn: null, notes: "Prefer the latest model" },
    { id: 4, employee: "David Wilson", assetType: "ThinkPad X1 Carbon", quantity: 1, priority: "urgent", reason: "New hire joining next week", status: "approved", requestedOn: "2025-02-25", approvedOn: "2025-02-26", notes: "Need it configured with company image" },
    { id: 5, employee: "Eve Martinez", assetType: "Standing Desk", quantity: 1, priority: "medium", reason: "Ergonomic requirement due to back pain", status: "fulfilled", requestedOn: "2025-02-10", approvedOn: "2025-02-12", notes: "Delivered on 2025-02-15" },
    { id: 6, employee: "Frank Lee", assetType: "Sony WH-1000XM5 Headphones", quantity: 1, priority: "low", reason: "Open office noise distraction", status: "rejected", requestedOn: "2025-03-05", approvedOn: null, notes: "Budget constraints - try again next quarter" },
    { id: 7, employee: "Grace Chen", assetType: "Adobe Creative Cloud License", quantity: 1, priority: "high", reason: "Current license expiring soon", status: "approved", requestedOn: "2025-03-08", approvedOn: "2025-03-09", notes: "Renewal processed" },
    { id: 8, employee: "Henry Brown", assetType: "Logitech MX Master 3S", quantity: 1, priority: "low", reason: "Would like a better mouse for productivity", status: "cancelled", requestedOn: "2025-03-01", approvedOn: null, notes: "Cancelled by requester" },
    { id: 9, employee: "Iris Wang", assetType: "Jabra Evolve2 85 Headset", quantity: 1, priority: "medium", reason: "Current headset is malfunctioning", status: "pending", requestedOn: "2025-03-14", approvedOn: null, notes: "" },
    { id: 10, employee: "Jack Thompson", assetType: "MacBook Pro 16\"", quantity: 1, priority: "urgent", reason: "New VP of Marketing starting April 1", status: "pending", requestedOn: "2025-03-15", approvedOn: null, notes: "Top-spec configuration please" },
  ];
}
