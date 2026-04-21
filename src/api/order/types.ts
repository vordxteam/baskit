export type PaymentMethod = "EASYPAISA" | "JAZZCASH" | "CARD" | "COD" | "ONLINE_PAYMENT";

export interface OrderAddress {
  type: "RECIPIENT" | "BILLING";
  delivery_type?: "INSTANT" | "SCHEDULED";
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  area?: string;
  postal_code: string;
  country: string;
  delivery_instructions?: string;
  preferred_delivery_date?: string | null; // YYYY-MM-DD
  preferred_delivery_time?: string | null; // HH:mm
}

export interface SelectedColors {
  ribbon?: string;
  net?: string;
  product_color?: string;
  decorative?: string;
}

export interface AvailableColors {
  ribbon?: string[];
  net?: string[];
  product_color?: string[];
  decorative?: string[];
  default_ribbon?: string;
  default_net?: string;
  default_product_color?: string;
  default_decorative?: string;
}

export interface GreetingCard {
  greeting_type: string;
  greeting_to: string;
  greeting_from: string;
  custom_text?: string;
}

export interface SelectedCatalogItem {
  catalog_item_id: string;
  quantity: number;
}

export interface OrderItem {
  // Predefined product flow fields
  product_id?: string;
  product_size_id?: string;

  // Customized flow fields
  product_type_id?: string;
  product_style_id?: string;
  size_code?: string;
  selected_fillers?: string[];
  selected_catalog_items?: SelectedCatalogItem[];

  quantity: number;
  selected_colors?: SelectedColors;
  available_colors?: AvailableColors;
  greeting_card?: GreetingCard;
}

export interface PlaceOrderPayload {
  payment_method: PaymentMethod;
  currency: string;
  buyer_first_name: string;
  buyer_phone: string;
  buyer_email: string;
  discount_code?: string;
  discount_amount?: number;
  // terms_accepted?: boolean;
  addresses: OrderAddress[];
  items: OrderItem[];
}

export interface PlaceOrderProductSummary {
  product_id: string;
  product_name: string;
  quantity: number;
  total_amount: string;
  image_url?: string;
}

export interface PlaceOrderAddressSummary {
  full_name?: string;
  phone?: string;
  address_line_1?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  delivery_type?: "INSTANT" | "SCHEDULED";
  preferred_delivery_date?: string | null;
  preferred_delivery_time?: string | null;
}

export interface PlaceOrderStatusHistoryItem {
  status?: string;
  status_date?: string;
  reason?: string;
  message?: string;
  status_reason?: string;
}

export interface PlaceOrderData {
  id: string;
  order_number?: string;
  status?: string;
  payment_method?: PaymentMethod | string;
  total_amount?: string;
  buyer_first_name?: string;
  buyer_phone?: string;
  placed_at?: string;
  products?: PlaceOrderProductSummary[];
  address?: PlaceOrderAddressSummary;
  status_history?: PlaceOrderStatusHistoryItem[];
}

export interface PlaceOrderResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
}

export type TrackableOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PREPARATION"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "REJECTED"
  | "FAILED";

export interface TrackOrderProduct {
  product_id: string;
  product_name: string;
  quantity: number;
  total_amount: string;
  image_url?: string;
}

export interface TrackOrderAddress {
  full_name?: string;
  phone?: string;
  address_line_1?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  delivery_type?: "INSTANT" | "SCHEDULED";
  preferred_delivery_date?: string | null;
  preferred_delivery_time?: string | null;
}

export interface TrackOrderStatusHistoryItem {
  status: TrackableOrderStatus;
  status_date?: string;
  reason?: string;
  message?: string;
  status_reason?: string;
}

export interface TrackOrderData {
  id: string;
  order_number: string;
  status: TrackableOrderStatus;
  payment_method?: PaymentMethod | string;
  total_amount?: string;
  buyer_first_name?: string;
  buyer_phone?: string;
  placed_at?: string;
  products?: TrackOrderProduct[];
  address?: TrackOrderAddress;
  status_history?: TrackOrderStatusHistoryItem[];
}

export interface TrackOrderResponse {
  success: boolean;
  message?: string;
  data?: TrackOrderData;
}

// GET USER ORDERS TYPES

export interface UserOrder {
  order_id: string;
  order_number: string;
  total_products: number;
  total_amount: string;
  status: string;
  first_product_image: string | null;
  placed_at: string;
}

export interface GetUserOrdersResponse {
  success: boolean;
  data: {
    data: UserOrder[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
  };
}

export interface UserOrderDetailItem {
  id?: string;
  product_id?: string;
  product_name?: string;
  quantity?: number;
  total_price?: string;
  image_url?: string;
  snapshot?: {
    product?: {
      id?: string;
      name?: string;
      image_url?: string;
    };
  };
}

export interface UserOrderDetailAddress {
  full_name?: string;
  phone?: string;
  address_line_1?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}

export interface UserOrderDetailData {
  id: string;
  order_number: string;
  status: TrackableOrderStatus | string;
  total_amount?: string;
  buyer_first_name?: string;
  placed_at?: string;
  status_history?: TrackOrderStatusHistoryItem[];
  items?: UserOrderDetailItem[];
  addresses?: UserOrderDetailAddress[];
}

export interface GetUserOrderDetailResponse {
  success: boolean;
  message?: string;
  data?: UserOrderDetailData | { data?: UserOrderDetailData };
}