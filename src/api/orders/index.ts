/**
 * Orders API
 */

import { apiClient } from "../core/apiClient";
import { Order, OrderDetail, OrdersResponse, OrderDetailResponse, GetOrdersQuery } from "./types";

export class OrdersApi {
  private adminBaseEndpoint = "/api/admin";

  /**
   * Get all orders with pagination and filtering
   */
  async getOrders(params?: GetOrdersQuery): Promise<OrdersResponse> {
    // Filter out undefined values from params
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(([, value]) => value !== undefined && value !== null && value !== "")
    );

    return apiClient.get<OrdersResponse>(
      `${this.adminBaseEndpoint}/orders`,
      cleanParams as Record<string, any>
    );
  }

  /**
   * Get single order by ID
   */
  async getOrderById(id: string): Promise<OrderDetailResponse> {
    return apiClient.get<OrderDetailResponse>(`${this.adminBaseEndpoint}/orders/${id}`);
  }

  /**
   * Update order status
   */
  async updateOrderStatus(
    id: string,
    status: string,
    reason?: string
  ): Promise<{ success: boolean; message: string; data?: OrderDetail }> {
    const payload: any = { status };
    if (reason) {
      payload.reason = reason;
    }
    return apiClient.patch(`${this.adminBaseEndpoint}/orders/${id}/status`, payload);
  }

  /**
   * Approve order
   */
  async approveOrder(id: string): Promise<{ success: boolean; message: string; data?: OrderDetail }> {
    return apiClient.post(`${this.adminBaseEndpoint}/orders/${id}/approve`, {});
  }

  /**
   * Reject order
   */
  async rejectOrder(id: string): Promise<{ success: boolean; message: string; data?: OrderDetail }> {
    return apiClient.post(`${this.adminBaseEndpoint}/orders/${id}/reject`, {});
  }
}

export const ordersApi = new OrdersApi();

// Re-export types
export * from "./types";
