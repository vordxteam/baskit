"use client";

import Button from "@/components/ui/button/Button";
import { OrderApi } from "@/api/order";
import type {
  GetUserOrderDetailResponse,
  TrackOrderStatusHistoryItem,
  TrackableOrderStatus,
  UserOrderDetailData,
  UserOrderDetailItem,
} from "@/api/order/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const orderApi = new OrderApi();

const terminalStatuses: TrackableOrderStatus[] = ["CANCELLED", "REJECTED", "FAILED"];

const statusLabels: Record<TrackableOrderStatus, string> = {
  PENDING: "Order pending",
  CONFIRMED: "Order confirmed",
  IN_PREPARATION: "Being processed",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REJECTED: "Rejected",
  FAILED: "Failed",
};

const baseSteps: TrackableOrderStatus[] = ["CONFIRMED", "IN_PREPARATION", "OUT_FOR_DELIVERY", "DELIVERED"];

const formatDate = (value?: string) => {
  if (!value) return "";

  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const parsed = new Date(normalized);

  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const getReasonFromHistory = (historyItem?: TrackOrderStatusHistoryItem) => {
  return historyItem?.reason || historyItem?.status_reason || historyItem?.message || "";
};

type RenderStep = {
  key: string;
  label: string;
  date: string;
  complete: boolean;
  isTerminal?: boolean;
  reason?: string;
};

const normalizeStatus = (value?: string): TrackableOrderStatus => {
  const upper = (value || "PENDING").toUpperCase() as TrackableOrderStatus;
  const allowed: TrackableOrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "IN_PREPARATION",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
    "REJECTED",
    "FAILED",
  ];
  return allowed.includes(upper) ? upper : "PENDING";
};

const buildRenderSteps = (data: UserOrderDetailData): RenderStep[] => {
  const history = Array.isArray(data.status_history) ? data.status_history : [];
  const normalizedHistory = history.filter((item) => item?.status) as TrackOrderStatusHistoryItem[];

  const byStatus = new Map<TrackableOrderStatus, TrackOrderStatusHistoryItem>();
  normalizedHistory.forEach((item) => {
    const normalized = normalizeStatus(item.status);
    if (!byStatus.has(normalized)) {
      byStatus.set(normalized, { ...item, status: normalized });
    }
  });

  const currentStatus = normalizeStatus(data.status);
  const includePending =
    currentStatus === "PENDING" ||
    byStatus.has("PENDING") ||
    normalizedHistory.some((item) => normalizeStatus(item.status) === "PENDING");

  const linearFlow = includePending ? (["PENDING", ...baseSteps] as TrackableOrderStatus[]) : baseSteps;

  const highestReachedLinearIndex = linearFlow.reduce((maxIndex, status, index) => {
    if (currentStatus === status || byStatus.has(status)) return index;
    return maxIndex;
  }, -1);

  const isTerminal = terminalStatuses.includes(currentStatus);

  if (!isTerminal) {
    const currentIndex = highestReachedLinearIndex;
    return linearFlow.map((status, index) => {
      const historyItem = byStatus.get(status);
      return {
        key: status,
        label: statusLabels[status],
        date: formatDate(historyItem?.status_date),
        complete: index <= currentIndex,
      };
    });
  }

  const completedSteps = linearFlow
    .map((status, index) => {
      const historyItem = byStatus.get(status);
      return {
        key: status,
        label: statusLabels[status],
        date: formatDate(historyItem?.status_date),
        complete: index <= highestReachedLinearIndex,
      };
    })
    .filter((step) => step.complete);

  const terminalHistory =
    byStatus.get(currentStatus) ||
    [...normalizedHistory].reverse().find((item) => normalizeStatus(item.status) === currentStatus);

  const terminalStep: RenderStep = {
    key: currentStatus,
    label: statusLabels[currentStatus],
    date: formatDate(terminalHistory?.status_date),
    complete: true,
    isTerminal: true,
    reason: getReasonFromHistory(terminalHistory),
  };

  return [...completedSteps, terminalStep];
};

const formatAddress = (data: UserOrderDetailData) => {
  const primaryAddress = Array.isArray(data.addresses) && data.addresses.length > 0 ? data.addresses[0] : undefined;
  const parts = [
    primaryAddress?.address_line_1,
    primaryAddress?.city,
    primaryAddress?.postal_code,
    primaryAddress?.country,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "-";
};

const resolveDetailData = (
  payload?: GetUserOrderDetailResponse["data"]
): UserOrderDetailData | undefined => {
  if (!payload) return undefined;
  if ("id" in payload) return payload;
  return payload.data;
};

const StepMarker = ({ complete, isTerminal }: { complete: boolean; isTerminal?: boolean }) => (
  <span
    className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border ${
      complete
        ? isTerminal
          ? "border-[#B91C1C] bg-[#B91C1C]"
          : "border-[#252525] bg-[#252525]"
        : "border-[#252525]"
    }`}
  >
    {complete && (
      <svg width="9" height="7" viewBox="0 0 9 7" fill="none" aria-hidden="true">
        <path d="M1 3.5L3.4 6L8 1" stroke="#FFFEF2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </span>
);

const ItemImage = ({ imageUrl, name }: { imageUrl?: string | null; name: string }) => {
  const [imageError, setImageError] = useState(false);
  const hasImage = Boolean(imageUrl) && !imageError;

  return (
    <div className="mx-auto h-[94px] w-28 overflow-hidden bg-[#F5F5F5]">
      {hasImage ? (
        <img
          src={imageUrl || ""}
          alt={name}
          className="h-full w-full object-contain"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-center px-2 text-[12px] leading-4 text-[#25252580]">
          Image preview not available
        </div>
      )}
    </div>
  );
};

const resolveItemImage = (item: UserOrderDetailItem): string | null => {
  // Check direct image_url first
  if (item.image_url) return item.image_url;
  // Then check snapshot
  const snapshotImage = item.snapshot?.product?.image_url;
  return snapshotImage || null;
};

const normalizeAmount = (value?: string) => {
  if (!value) return "-";
  return value;
};

export default function MyOrderDetailPage() {
  const params = useParams();
  const orderId = (params.id as string) || "";

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["myOrderDetail", orderId],
    queryFn: () => orderApi.getUserOrderdetail<GetUserOrderDetailResponse>(orderId),
    enabled: Boolean(orderId),
  });

  const orderData = useMemo(() => resolveDetailData(data?.data), [data?.data]);

  const renderSteps = useMemo(() => {
    if (!orderData) return [];
    return buildRenderSteps(orderData);
  }, [orderData]);

  if (!orderId) {
    return (
      <main className="bg-gray-50 px-6 pb-16 pt-3 text-[#252525] sm:px-10 lg:px-20">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="mt-12 border border-[#25252526] p-8 text-center">
            <p className="text-[16px] text-[#252525]">Missing order ID.</p>
            <Link href="/my-orders" className="mt-6 inline-block text-[14px] text-[#252525] underline">
              Back to My Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (isPending) {
    return (
      <main className="bg-gray-50 px-6 pb-16 pt-3 text-[#252525] sm:px-10 lg:px-20">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="mt-12 border border-[#25252526] p-8 text-center">
            <p className="text-[16px] text-[#252525]">Loading order details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !data?.success || !orderData) {
    const message =
      (error as Error | undefined)?.message || data?.message || "Unable to load this order right now.";

    return (
      <main className="bg-gray-50 px-6 pb-16 pt-3 text-[#252525] sm:px-10 lg:px-20">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="mt-12 border border-[#25252526] p-8 text-center">
            <p className="text-[16px] text-[#B91C1C]">{message}</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button onClick={() => refetch()} variant="primary">
                Retry
              </Button>
              <Link href="/my-orders" className="text-[14px] text-[#252525] underline">
                Back
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const receiverName =
    (Array.isArray(orderData.addresses) && orderData.addresses[0]?.full_name) || orderData.buyer_first_name || "-";
  const trackingId = orderData.id || "-";
  const orderDetails = [
    { label: "Receiver", value: receiverName },
    { label: "Address", value: formatAddress(orderData) },
    { label: "Tracking ID", value: trackingId },
    { label: "Total payment", value: orderData.total_amount ? `PKR ${orderData.total_amount}` : "-" },
  ];

  const items = Array.isArray(orderData.items) ? orderData.items : [];

  return (
    <main className="bg-gray-50 px-6 pb-16 pt-3 text-[#252525] sm:px-10 lg:px-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <nav className="flex items-center gap-3 text-[12px] leading-4 text-[#25252580]">
          <Link href="/" className="transition-colors hover:text-[#252525]">
            Home
          </Link>
          <svg width="5" height="9" viewBox="0 0 5 9" fill="none" aria-hidden="true">
            <path d="M1 1L4 4.5L1 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Link href="/my-orders" className="transition-colors hover:text-[#252525]">
            My orders
          </Link>
          <svg width="5" height="9" viewBox="0 0 5 9" fill="none" aria-hidden="true">
            <path d="M1 1L4 4.5L1 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[#252525]">Order detail</span>
        </nav>

        <h1 className="tobia-normal mt-12 text-[28px] leading-8 text-[#252525]">Order {orderData.order_number}</h1>

        <section className="mt-12 border border-[#25252526] px-8 py-6 sm:px-9">
          {orderDetails.map((detail, index) => (
            <div
              key={detail.label}
              className={`flex flex-col gap-2 py-3 text-[14px] leading-5 sm:flex-row sm:items-center sm:justify-between ${
                index !== orderDetails.length - 1 ? "border-b border-[#2525251A]" : ""
              }`}
            >
              <span className="tobia-normal text-[#252525B8]">{detail.label}</span>
              <span className="tobia-normal text-left text-[#252525] sm:text-right">{detail.value}</span>
            </div>
          ))}
        </section>

        <section className="mt-14 border border-[#25252526] px-8 pb-9 pt-9 sm:px-9">
          <div>
            <p className="tobia-normal text-[14px] leading-5 text-[#25252599]">Tracking ID</p>
            <p className="mt-1 text-[16px] leading-5 text-[#252525]">{trackingId}</p>
          </div>

          <div className="mt-16 flex flex-col gap-7 lg:flex-row lg:items-start lg:gap-4">
            {renderSteps.map((step, index) => (
              <div key={step.key} className="flex min-w-0 flex-1 items-start gap-4">
                <StepMarker complete={step.complete} isTerminal={step.isTerminal} />
                <div className="min-w-[132px]">
                  <p className={`text-[14px] leading-5 ${step.isTerminal ? "text-[#B91C1C]" : "text-[#252525]"}`}>
                    {step.label}
                  </p>
                  {step.date && <p className="mt-1 text-[14px] leading-5 text-[#252525B8]">{step.date}</p>}
                  {step.isTerminal && step.reason && (
                    <p className="mt-1 text-[13px] leading-5 text-[#B91C1C]">Reason: {step.reason}</p>
                  )}
                </div>
                {index < renderSteps.length - 1 && <div className="hidden h-px flex-1 bg-[#252525] lg:block" />}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-[22px] leading-7 text-[#252525]">Items</h2>

          <div className="mt-9 grid grid-cols-2 gap-x-10 gap-y-9 sm:grid-cols-4 lg:gap-x-20">
            {items.map((item) => {
              const name = item.product_name || item.snapshot?.product?.name || "Product";
              const quantity = item.quantity ?? 0;
              const amount = normalizeAmount(item.total_price);
              const imageUrl = resolveItemImage(item);

              return (
                <article key={item.id || item.product_id || name} className="text-center">
                  <ItemImage imageUrl={imageUrl} name={name} />
                  <h3 className="mt-4 text-[18px] leading-6 text-[#252525]">{name}</h3>
                  <p className="mt-1 text-[14px] leading-5 text-[#252525B8]">Qty: {quantity}</p>
                  <p className="tobia-normal mt-1 text-[14px] leading-5 text-[#252525]">PKR {amount}</p>
                </article>
              );
            })}
          </div>

          {items.length === 0 && (
            <div className="mt-8 border border-[#2525251A] p-6 text-center text-[14px] text-[#25252580]">
              No items found for this order.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
