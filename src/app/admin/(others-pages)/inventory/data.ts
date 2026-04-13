export type InventoryStatus = "Healthy" | "Low" | "Critical";
export type MovementType = "Stock In" | "Stock Out" | "Adjustment" | "Transfer";

export interface InventoryMovement {
  id: number;
  type: MovementType;
  quantity: number;
  location: string;
  note: string;
  reference: string;
  actor: string;
  date: string;
}

export interface InventoryItem {
  id: number;
  sku: string;
  product: {
    name: string;
    category: string;
  };
  location: string;
  onHand: number;
  reserved: number;
  available: number;
  reorderPoint: number;
  status: InventoryStatus;
  cost: string;
  updatedAt: string;
  movements: InventoryMovement[];
}

export const inventoryItems: InventoryItem[] = [
  {
    id: 1,
    sku: "WH-1024",
    product: { name: "Wireless Headphones", category: "Electronics" },
    location: "Main Warehouse",
    onHand: 48,
    reserved: 6,
    available: 42,
    reorderPoint: 20,
    status: "Healthy",
    cost: "$72.00",
    updatedAt: "2026-04-05T10:12:00Z",
    movements: [
      { id: 1, type: "Stock In", quantity: 24, location: "Main Warehouse", note: "PO-2041 received", reference: "PO-2041", actor: "M. Carter", date: "2026-04-05T10:12:00Z" },
      { id: 2, type: "Stock Out", quantity: 8, location: "Main Warehouse", note: "Order allocation", reference: "SO-8831", actor: "A. Khan", date: "2026-04-04T14:25:00Z" },
      { id: 3, type: "Adjustment", quantity: 2, location: "Main Warehouse", note: "Cycle count correction", reference: "ADJ-117", actor: "S. Lee", date: "2026-04-03T08:40:00Z" },
    ],
  },
  {
    id: 2,
    sku: "SW-2048",
    product: { name: "Smart Watch Pro", category: "Wearables" },
    location: "West Fulfillment",
    onHand: 12,
    reserved: 4,
    available: 8,
    reorderPoint: 15,
    status: "Low",
    cost: "$138.00",
    updatedAt: "2026-04-04T15:35:00Z",
    movements: [
      { id: 1, type: "Stock Out", quantity: 3, location: "West Fulfillment", note: "Express orders", reference: "SO-8872", actor: "A. Khan", date: "2026-04-04T15:35:00Z" },
      { id: 2, type: "Transfer", quantity: 6, location: "West Fulfillment", note: "Moved from Central", reference: "TR-221", actor: "M. Carter", date: "2026-04-03T11:10:00Z" },
    ],
  },
  {
    id: 3,
    sku: "BS-3091",
    product: { name: "Bluetooth Speaker", category: "Audio" },
    location: "Central Warehouse",
    onHand: 0,
    reserved: 0,
    available: 0,
    reorderPoint: 10,
    status: "Critical",
    cost: "$41.00",
    updatedAt: "2026-04-02T09:05:00Z",
    movements: [
      { id: 1, type: "Stock Out", quantity: 5, location: "Central Warehouse", note: "Promotional campaign", reference: "SO-8791", actor: "J. Park", date: "2026-04-02T09:05:00Z" },
      { id: 2, type: "Stock In", quantity: 5, location: "Central Warehouse", note: "Partial supplier receipt", reference: "PO-2038", actor: "M. Carter", date: "2026-03-30T13:20:00Z" },
    ],
  },
  {
    id: 4,
    sku: "MK-7788",
    product: { name: "Mechanical Keyboard", category: "Accessories" },
    location: "Main Warehouse",
    onHand: 9,
    reserved: 2,
    available: 7,
    reorderPoint: 8,
    status: "Low",
    cost: "$86.00",
    updatedAt: "2026-04-05T08:18:00Z",
    movements: [
      { id: 1, type: "Adjustment", quantity: 1, location: "Main Warehouse", note: "Damage write-off", reference: "ADJ-120", actor: "S. Lee", date: "2026-04-05T08:18:00Z" },
      { id: 2, type: "Stock In", quantity: 12, location: "Main Warehouse", note: "PO-2050 received", reference: "PO-2050", actor: "M. Carter", date: "2026-04-01T12:40:00Z" },
    ],
  },
  {
    id: 5,
    sku: "PS-6543",
    product: { name: "Portable SSD", category: "Storage" },
    location: "East Hub",
    onHand: 33,
    reserved: 5,
    available: 28,
    reorderPoint: 12,
    status: "Healthy",
    cost: "$104.00",
    updatedAt: "2026-04-05T16:45:00Z",
    movements: [
      { id: 1, type: "Transfer", quantity: 10, location: "East Hub", note: "Rebalanced to East Hub", reference: "TR-226", actor: "J. Park", date: "2026-04-05T16:45:00Z" },
      { id: 2, type: "Stock Out", quantity: 7, location: "East Hub", note: "B2B order batch", reference: "SO-8880", actor: "A. Khan", date: "2026-04-04T09:20:00Z" },
    ],
  },
];

export const movementColors: Record<MovementType, "success" | "error" | "warning" | "info"> = {
  "Stock In": "success",
  "Stock Out": "error",
  Adjustment: "warning",
  Transfer: "info",
};

export const inventoryColors: Record<InventoryStatus, "success" | "warning" | "error"> = {
  Healthy: "success",
  Low: "warning",
  Critical: "error",
};