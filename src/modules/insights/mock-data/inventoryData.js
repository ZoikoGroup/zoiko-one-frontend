export function getInventoryAnalytics() {
  const categories = ["Electronics", "Office Supplies", "Software Licenses", "Furniture", "Networking", "Security", "Peripherals", "Consumables"];
  const locations = ["HQ - Floor 1", "HQ - Floor 2", "HQ - Floor 3", "Warehouse A", "Warehouse B", "Remote"];

  const items = [];
  for (let i = 1; i <= 120; i++) {
    const unitCost = 10 + Math.floor(Math.random() * 5000);
    const quantity = 1 + Math.floor(Math.random() * 200);
    items.push({
      id: i,
      name: `Item ${i}`,
      category: categories[i % categories.length],
      location: locations[i % locations.length],
      quantity,
      unitCost,
      totalValue: unitCost * quantity,
      minStock: Math.floor(Math.random() * 20) + 5,
      status: quantity < 10 ? "low_stock" : quantity < 30 ? "moderate" : "sufficient",
      lastRestocked: new Date(2026, Math.floor(Math.random() * 5), Math.floor(Math.random() * 28) + 1).toISOString().split("T")[0],
      supplier: `Supplier ${(i % 15) + 1}`,
    });
  }

  return {
    summary: {
      totalItems: 28400,
      distinctItems: 1542,
      totalValue: 4850000,
      lowStockItems: 28,
      pendingOrders: 45,
      stockoutRisk: 12,
      avgTurnoverDays: 34,
      locations: 6,
    },
    items,
    valueByCategory: categories.map(c => ({
      name: c,
      value: 200000 + Math.floor(Math.random() * 800000),
      count: 50 + Math.floor(Math.random() * 300),
    })),
    stockTrend: [
      { month: "Jan", incoming: 4200, outgoing: 3800, damaged: 120 },
      { month: "Feb", incoming: 4500, outgoing: 4100, damaged: 95 },
      { month: "Mar", incoming: 4800, outgoing: 4300, damaged: 140 },
      { month: "Apr", incoming: 4400, outgoing: 4600, damaged: 110 },
      { month: "May", incoming: 5100, outgoing: 4800, damaged: 130 },
      { month: "Jun", incoming: 4900, outgoing: 5000, damaged: 105 },
      { month: "Jul", incoming: 5300, outgoing: 4700, damaged: 150 },
      { month: "Aug", incoming: 5000, outgoing: 5100, damaged: 120 },
      { month: "Sep", incoming: 5200, outgoing: 4900, damaged: 100 },
      { month: "Oct", incoming: 4800, outgoing: 5200, damaged: 115 },
    ],
    lowStockAlerts: items.filter(i => i.status === "low_stock").slice(0, 10).map(i => ({
      id: i.id, name: i.name, current: i.quantity, min: i.minStock, location: i.location,
    })),
  };
}
