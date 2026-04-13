export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";
export type PaymentStatus = "Paid" | "Unpaid" | "Refunded" | "Partial";
export type PaymentMethod = "Credit Card" | "PayPal" | "Bank Transfer" | "Cash on Delivery";

export interface OrderItem {
  id: number;
  name: string;
  sku: string;
  qty: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  date: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  shipping: {
    address: string;
    city: string;
    country: string;
    zip: string;
    method: string;
    trackingNumber?: string;
  };
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  notes?: string;
}

export const ordersData: Order[] = [
  {
    id: "ORD-10041",
    customer: { name: "Alice Johnson", email: "alice@example.com", avatar: "AJ" },
    date: "2026-04-05",
    status: "Delivered",
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
    items: [
      { id: 1, name: "Wireless Headphones", sku: "WH-1024", qty: 1, unitPrice: 129 },
      { id: 4, name: "Gaming Mouse", sku: "GM-4455", qty: 2, unitPrice: 59 },
    ],
    shipping: { address: "42 Maple Street", city: "New York", country: "USA", zip: "10001", method: "Standard", trackingNumber: "TRK-9982341" },
    subtotal: 247, shippingCost: 0, tax: 24.7, total: 271.70, notes: "Please leave at door.",
  },
  {
    id: "ORD-10042",
    customer: { name: "Bob Martinez", email: "bob@example.com", avatar: "BM" },
    date: "2026-04-04",
    status: "Shipped",
    paymentStatus: "Paid",
    paymentMethod: "PayPal",
    items: [
      { id: 6, name: "4K Monitor", sku: "MN-9001", qty: 1, unitPrice: 399 },
    ],
    shipping: { address: "88 Oak Ave", city: "Los Angeles", country: "USA", zip: "90001", method: "Express", trackingNumber: "TRK-7761209" },
    subtotal: 399, shippingCost: 15, tax: 39.9, total: 453.90,
  },
  {
    id: "ORD-10043",
    customer: { name: "Carol White", email: "carol@example.com", avatar: "CW" },
    date: "2026-04-03",
    status: "Processing",
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
    items: [
      { id: 2, name: "Smart Watch Pro", sku: "SW-2048", qty: 1, unitPrice: 249 },
      { id: 5, name: "Mechanical Keyboard", sku: "MK-7788", qty: 1, unitPrice: 139 },
    ],
    shipping: { address: "17 Pine Road", city: "Chicago", country: "USA", zip: "60601", method: "Standard" },
    subtotal: 388, shippingCost: 0, tax: 38.8, total: 426.80,
  },
  {
    id: "ORD-10044",
    customer: { name: "David Lee", email: "david@example.com", avatar: "DL" },
    date: "2026-04-02",
    status: "Pending",
    paymentStatus: "Unpaid",
    paymentMethod: "Bank Transfer",
    items: [
      { id: 8, name: "Portable SSD", sku: "PS-6543", qty: 2, unitPrice: 179 },
    ],
    shipping: { address: "5 Birch Lane", city: "Houston", country: "USA", zip: "77001", method: "Standard" },
    subtotal: 358, shippingCost: 8, tax: 35.8, total: 401.80,
  },
  {
    id: "ORD-10045",
    customer: { name: "Eva Green", email: "eva@example.com", avatar: "EG" },
    date: "2026-04-01",
    status: "Cancelled",
    paymentStatus: "Refunded",
    paymentMethod: "Credit Card",
    items: [
      { id: 3, name: "Bluetooth Speaker", sku: "BS-3091", qty: 1, unitPrice: 89 },
    ],
    shipping: { address: "99 Cedar Blvd", city: "Phoenix", country: "USA", zip: "85001", method: "Standard" },
    subtotal: 89, shippingCost: 0, tax: 8.9, total: 97.90, notes: "Customer requested cancellation.",
  },
  {
    id: "ORD-10046",
    customer: { name: "Frank Kim", email: "frank@example.com", avatar: "FK" },
    date: "2026-03-31",
    status: "Delivered",
    paymentStatus: "Paid",
    paymentMethod: "Cash on Delivery",
    items: [
      { id: 7, name: "USB-C Hub", sku: "UH-2210", qty: 3, unitPrice: 45 },
      { id: 1, name: "Wireless Headphones", sku: "WH-1024", qty: 1, unitPrice: 129 },
    ],
    shipping: { address: "21 Elm Court", city: "San Antonio", country: "USA", zip: "78201", method: "Economy", trackingNumber: "TRK-4490812" },
    subtotal: 264, shippingCost: 5, tax: 26.4, total: 295.40,
  },
  {
    id: "ORD-10047",
    customer: { name: "Grace Park", email: "grace@example.com", avatar: "GP" },
    date: "2026-03-30",
    status: "Refunded",
    paymentStatus: "Refunded",
    paymentMethod: "PayPal",
    items: [
      { id: 5, name: "Mechanical Keyboard", sku: "MK-7788", qty: 1, unitPrice: 139 },
    ],
    shipping: { address: "33 Willow Way", city: "Philadelphia", country: "USA", zip: "19101", method: "Standard", trackingNumber: "TRK-3309871" },
    subtotal: 139, shippingCost: 0, tax: 13.9, total: 152.90, notes: "Item arrived damaged.",
  },
  {
    id: "ORD-10048",
    customer: { name: "Henry Scott", email: "henry@example.com", avatar: "HS" },
    date: "2026-03-29",
    status: "Processing",
    paymentStatus: "Partial",
    paymentMethod: "Bank Transfer",
    items: [
      { id: 6, name: "4K Monitor", sku: "MN-9001", qty: 2, unitPrice: 399 },
      { id: 8, name: "Portable SSD", sku: "PS-6543", qty: 1, unitPrice: 179 },
    ],
    shipping: { address: "77 Spruce Ave", city: "San Diego", country: "USA", zip: "92101", method: "Express" },
    subtotal: 977, shippingCost: 20, tax: 97.7, total: 1094.70,
  },
  {
    id: "ORD-10049",
    customer: { name: "Irene Walsh", email: "irene@example.com", avatar: "IW" },
    date: "2026-03-28",
    status: "Shipped",
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
    items: [
      { id: 2, name: "Smart Watch Pro", sku: "SW-2048", qty: 1, unitPrice: 249 },
    ],
    shipping: { address: "8 Poplar Drive", city: "Dallas", country: "USA", zip: "75201", method: "Express", trackingNumber: "TRK-5561023" },
    subtotal: 249, shippingCost: 10, tax: 24.9, total: 283.90,
  },
  {
    id: "ORD-10050",
    customer: { name: "James Nguyen", email: "james@example.com", avatar: "JN" },
    date: "2026-03-27",
    status: "Pending",
    paymentStatus: "Unpaid",
    paymentMethod: "Credit Card",
    items: [
      { id: 4, name: "Gaming Mouse", sku: "GM-4455", qty: 1, unitPrice: 59 },
      { id: 7, name: "USB-C Hub", sku: "UH-2210", qty: 2, unitPrice: 45 },
    ],
    shipping: { address: "14 Chestnut St", city: "San Jose", country: "USA", zip: "95101", method: "Standard" },
    subtotal: 149, shippingCost: 0, tax: 14.9, total: 163.90,
  },
  {
    id: "ORD-10051",
    customer: { name: "Karen Mills", email: "karen@example.com", avatar: "KM" },
    date: "2026-03-26",
    status: "Delivered",
    paymentStatus: "Paid",
    paymentMethod: "PayPal",
    items: [
      { id: 1, name: "Wireless Headphones", sku: "WH-1024", qty: 2, unitPrice: 129 },
      { id: 6, name: "4K Monitor", sku: "MN-9001", qty: 1, unitPrice: 399 },
    ],
    shipping: { address: "55 Magnolia Ct", city: "Austin", country: "USA", zip: "73301", method: "Standard", trackingNumber: "TRK-6671234" },
    subtotal: 657, shippingCost: 0, tax: 65.7, total: 722.70,
  },
];

export const statusColors: Record<string, "success" | "warning" | "error" | "info" | "primary"> = {
  Delivered: "success",
  Shipped: "info",
  Processing: "warning",
  Pending: "warning",
  Cancelled: "error",
  Refunded: "error",
};

export const paymentColors: Record<string, "success" | "warning" | "error" | "info"> = {
  Paid: "success",
  Unpaid: "error",
  Refunded: "warning",
  Partial: "warning",
};