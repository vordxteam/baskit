export type ReportPeriod = "Monthly" | "Quarterly" | "Annually";

export interface RevenueRow {
  id: number;
  month: string;
  income: number;
  revenue: number;
  orders: number;
  refunds: number;
}

export const revenueRows: RevenueRow[] = [
  { id: 1, month: "Jan", income: 18200, revenue: 24800, orders: 124, refunds: 9 },
  { id: 2, month: "Feb", income: 19250, revenue: 27100, orders: 136, refunds: 11 },
  { id: 3, month: "Mar", income: 21400, revenue: 28950, orders: 149, refunds: 8 },
  { id: 4, month: "Apr", income: 22350, revenue: 31240, orders: 157, refunds: 10 },
  { id: 5, month: "May", income: 23560, revenue: 32900, orders: 162, refunds: 7 },
  { id: 6, month: "Jun", income: 24880, revenue: 34120, orders: 171, refunds: 6 },
  { id: 7, month: "Jul", income: 25940, revenue: 35280, orders: 176, refunds: 9 },
  { id: 8, month: "Aug", income: 26780, revenue: 36610, orders: 182, refunds: 12 },
  { id: 9, month: "Sep", income: 27890, revenue: 38190, orders: 188, refunds: 8 },
  { id: 10, month: "Oct", income: 29150, revenue: 39550, orders: 194, refunds: 10 },
  { id: 11, month: "Nov", income: 30510, revenue: 41240, orders: 203, refunds: 11 },
  { id: 12, month: "Dec", income: 31980, revenue: 43800, orders: 216, refunds: 13 },
];

export const revenueSummary = {
  totalIncome: 315440,
  totalRevenue: 388780,
  growth: 12.4,
  averageOrderValue: 214.6,
  refunds: 114,
};