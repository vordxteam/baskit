import apiClient from "../core/apiClient";
import {
  PlaceOrderPayload,
  PlaceOrderResponse,
  TrackOrderResponse,
} from "./types";


export class OrderApi {
  async placeOrder<TResponse = PlaceOrderResponse>(
    orderData: PlaceOrderPayload
  ): Promise<TResponse> {
    const response = await apiClient.post<TResponse>(
      "/api/orders",
      orderData,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    return response;
  }
  async trackOrder<TResponse = TrackOrderResponse>(
    orderNumber: string,
    email: string
  ): Promise<TResponse> {
    const encodedOrderNumber = encodeURIComponent(orderNumber.trim());
    const encodedEmail = encodeURIComponent(email.trim());

    const response = await apiClient.get<TResponse>(
      `/api/orders/track/${encodedOrderNumber}/${encodedEmail}`,
      undefined,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    return response;
  }


  // LOGIN USER ORDERS API

    async getUserOrders<TResponse = unknown>(): Promise<TResponse> {
      const token = localStorage.getItem('accessToken')

      const response = await apiClient.get<TResponse>(
        "/api/user/orders",
        undefined,
        {
          headers: {
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      )

      return response
    }

    async getUserOrderdetail<TResponse = unknown>(id:string): Promise<TResponse> {
      const token = localStorage.getItem('accessToken')

      const response = await apiClient.get<TResponse>(
        `/api/orders/${id}`,
        undefined,
        {
          headers: {
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      )

      return response
    }

    async reorder<TResponse = unknown>(id:string): Promise<TResponse> {
      const token = localStorage.getItem('accessToken')

      const response = await apiClient.post<TResponse>(
        `/api/orders/${id}/reorder`,
        undefined,
        {
          headers: {
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      )

      return response
    }

    async cancelOrder<TResponse = unknown>(id:string): Promise<TResponse> {
      const token = localStorage.getItem('accessToken')

      const response = await apiClient.post<TResponse>(
        `/api/orders/${id}/cancel`,
        undefined,
        {
          headers: {
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      )

      return response
    }
}