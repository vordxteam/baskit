/**
 * Orders API Types
 */

export type OrderStatus = 
  | "PENDING" 
  | "REJECTED" 
  | "CONFIRMED" 
  | "IN_PREPARATION" 
  | "OUT_FOR_DELIVERY" 
  | "FAILED" 
  | "DELIVERED" 
  | "CANCELLED";

export type PaymentStatus = "Paid" | "Unpaid" | "Refunded" | "Partial";
export type PaymentMethod = "Online Payment" | "Credit Card" | "PayPal" | "Bank Transfer" | "Cash on Delivery";

export interface GreetingCard {
  greeting_type: string;
  greeting_to: string;
  greeting_from: string;
  custom_text: string;
}

export interface OrderItem {
  id: string;
  name: string;
  sku: string | null;
  qty: number;
  unitPrice: number;
  greeting_card?: GreetingCard | null;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface OrderShipping {
  address: string;
  city: string;
  country: string;
  zip: string;
  method: string | null;
  delivery_type?: string | null;
  preferred_delivery_date?: string | null;
  preferred_delivery_time?: string | null;
  trackingNumber?: string | null;
}

export interface Order {
  id: string;
  uuid: string;
  customer: OrderCustomer;
  date: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  total: number;
}

export interface OrderDetail {
  id: string;
  uuid: string;
  order_number: string;
  statusValue: OrderStatus;
  status: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  date: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  notes: string | null;
  customer: OrderCustomer;
  shipping: OrderShipping;
  items: OrderItem[];
}

export interface PaginationInfo {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface OrdersResponse {
  success: boolean;
  data: {
    data: Order[];
    pagination: PaginationInfo;
  };
}

export interface OrderDetailResponse {
  success: boolean;
  data: OrderDetail;
}

export interface GetOrdersQuery {
  page?: number;
  per_page?: number;
  status?: OrderStatus;
  search?: string;
}
