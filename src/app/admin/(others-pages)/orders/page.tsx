"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Pagination from "@/components/tables/Pagination";
import { ordersData, statusColors, paymentColors, OrderStatus } from "./data";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";

const ALL_STATUSES: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"];

function AvatarCircle({ initials, index }: { initials: string; index: number }) {
  const palettes = [
    "bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    "bg-pink-100 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400",
    "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400",
  ];
  return (
    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${palettes[index % palettes.length]}`}>
      {initials}
    </div>
  );
}

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filtered = useMemo(() => {
    return ordersData.filter((o) => {
      const matchSearch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const handleFilterChange = (status: OrderStatus | "All") => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  // Summary counts
  const counts = useMemo(() => {
    return ALL_STATUSES.reduce<Record<string, number>>(
      (acc, s) => ({ ...acc, [s]: ordersData.filter((o) => o.status === s).length }),
      {}
    );
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="px-4 py-8 sm:px-6">
      {/* Page heading */}
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Track and manage all customer orders</p>
      </div>

      {/* Stat Pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(["All", ...ALL_STATUSES] as const).map((s) => {
          const count = s === "All" ? ordersData.length : counts[s] ?? 0;
          const active = statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => handleFilterChange(s as OrderStatus | "All")}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all border ${
                active
                  ? "bg-brand-500 border-brand-500 text-white shadow-sm"
                  : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20"
              }`}
            >
              {s}
              <span
                className={`inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-semibold ${
                  active ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table Card */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {/* Table header with search */}
        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.05]">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search orders, customers…"
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] pl-9 pr-4 py-2 text-sm text-gray-800 dark:text-white/90 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 shrink-0">
            <span className="font-medium text-gray-700 dark:text-white/90">{filtered.length}</span> orders found
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {["Order", "Customer", "Date", "Items", "Total", "Payment", "Status", ""].map((h) => (
                    <TableCell
                      key={h}
                      isHeader
                      className="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                      No orders match your search or filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((order, i) => (
                    <TableRow key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                      {/* Order ID */}
                      <TableCell className="px-5 py-4">
                        <span className="font-mono text-sm font-semibold text-brand-500">{order.id}</span>
                      </TableCell>

                      {/* Customer */}
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <AvatarCircle initials={order.customer.avatar} index={i} />
                          <div className="min-w-0">
                            <p className="truncate text-theme-sm font-medium text-gray-800 dark:text-white/90">{order.customer.name}</p>
                            <p className="truncate text-theme-xs text-gray-400 dark:text-gray-500">{order.customer.email}</p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                        {formatDate(order.date)}
                      </TableCell>

                      {/* Items */}
                      <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                        {order.items.reduce((sum, it) => sum + it.qty, 0)} items
                      </TableCell>

                      {/* Total */}
                      <TableCell className="px-5 py-4 text-theme-sm font-semibold text-gray-700 dark:text-gray-200">
                        ${order.total.toFixed(2)}
                      </TableCell>

                      {/* Payment */}
                      <TableCell className="px-5 py-4">
                        <Badge size="sm" color={paymentColors[order.paymentStatus]}>
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="px-5 py-4">
                        <Badge size="sm" color={statusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-5 py-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-white/10 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.06] hover:text-gray-800 dark:hover:text-white/90 transition-colors"
                        >
                          View
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="grid gap-3 p-4 md:hidden">
          {paginated.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">No orders match your search or filter.</p>
          ) : (
            paginated.map((order, i) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] p-4 hover:border-brand-200 dark:hover:border-brand-500/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <AvatarCircle initials={order.customer.avatar} index={i} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">{order.customer.name}</p>
                      <p className="font-mono text-xs text-brand-500">{order.id}</p>
                    </div>
                  </div>
                  <Badge size="sm" color={statusColors[order.status]}>{order.status}</Badge>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-gray-50 dark:bg-white/[0.03] px-2 py-2">
                    <p className="text-xs text-gray-400 dark:text-gray-500">Total</p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-800 dark:text-white/90">${order.total.toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-white/[0.03] px-2 py-2">
                    <p className="text-xs text-gray-400 dark:text-gray-500">Items</p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-800 dark:text-white/90">{order.items.reduce((s, it) => s + it.qty, 0)}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-white/[0.03] px-2 py-2">
                    <p className="text-xs text-gray-400 dark:text-gray-500">Payment</p>
                    <p className="mt-0.5 text-xs font-medium text-gray-800 dark:text-white/90">{order.paymentStatus}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(order.date)}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-500">
                    View details
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-100 px-4 py-4 sm:px-5 dark:border-white/[0.05]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium text-gray-700 dark:text-white/90">
                {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-gray-700 dark:text-white/90">
                {Math.min(currentPage * itemsPerPage, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700 dark:text-white/90">{filtered.length}</span> orders
            </p>
            {totalPages > 1 && (
              <div className="overflow-x-auto">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(p) => {
                    if (p >= 1 && p <= totalPages) setCurrentPage(p);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}