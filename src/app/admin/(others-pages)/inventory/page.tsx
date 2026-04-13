"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Pagination from "@/components/tables/Pagination";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { inventoryColors, inventoryItems, InventoryItem, InventoryStatus } from "./data";

const STATUSES: Array<InventoryStatus | "All"> = ["All", "Healthy", "Low", "Critical"];

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InventoryStatus | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return inventoryItems.filter((item) => {
      const matchSearch =
        item.product.name.toLowerCase().includes(query) ||
        item.product.category.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query);
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const totals = useMemo(() => {
    return inventoryItems.reduce(
      (acc, item) => {
        acc.onHand += item.onHand;
        acc.available += item.available;
        acc.low += item.status === "Low" ? 1 : 0;
        acc.critical += item.status === "Critical" ? 1 : 0;
        return acc;
      },
      { onHand: 0, available: 0, low: 0, critical: 0 }
    );
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: InventoryStatus | "All") => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Track stock by product, location, and movement history</p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total On Hand", value: totals.onHand },
          { label: "Available", value: totals.available },
          { label: "Low Stock Items", value: totals.low },
          { label: "Critical Items", value: totals.critical },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-gray-200 bg-white px-4 py-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUSES.map((status) => {
          const active = statusFilter === status;
          const count = status === "All" ? inventoryItems.length : inventoryItems.filter((item) => item.status === status).length;
          return (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                active
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-400"
              }`}
            >
              {status}
              <span className={`inline-flex min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold ${active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.05]">
          <div className="relative w-full sm:max-w-sm">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
            </svg>
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search inventory, SKU, or location"
              className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-gray-500"
            />
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-700 dark:text-white/90">{filtered.length}</span> items found
          </p>
        </div>

        <div className="hidden md:block max-w-full overflow-x-auto">
          <div className="min-w-[980px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {['Item', 'SKU', 'Location', 'On Hand', 'Available', 'Reorder Point', 'Status', ''].map((header) => (
                    <TableCell key={header} isHeader className="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500">No inventory items match your search or filter.</TableCell>
                  </TableRow>
                ) : (
                  paginated.map((item: InventoryItem) => (
                    <TableRow key={item.id} className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02]">
                      <TableCell className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-white/90">{item.product.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{item.product.category}</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm font-mono text-gray-600 dark:text-gray-400">{item.sku}</TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{item.location}</TableCell>
                      <TableCell className="px-5 py-4 text-sm font-medium text-gray-700 dark:text-gray-200">{item.onHand}</TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{item.available}</TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{item.reorderPoint}</TableCell>
                      <TableCell className="px-5 py-4">
                        <Badge size="sm" color={inventoryColors[item.status]}>{item.status}</Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/inventory/${item.id}`} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/[0.06]">
                            View
                          </Link>
                          <Link href={`/admin/inventory/${item.id}/adjust`} className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600">
                            Adjust
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="grid gap-4 p-4 md:hidden">
          {paginated.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400 dark:border-white/10">No inventory items match your search or filter.</div>
          ) : (
            paginated.map((item) => (
              <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{item.product.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.product.category} · {item.sku}</p>
                  </div>
                  <Badge size="sm" color={inventoryColors[item.status]}>{item.status}</Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-800 dark:text-white/90">{item.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
                    <p className="font-medium text-gray-800 dark:text-white/90">{item.available}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">On Hand</p>
                    <p className="font-medium text-gray-800 dark:text-white/90">{item.onHand}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Reorder Point</p>
                    <p className="font-medium text-gray-800 dark:text-white/90">{item.reorderPoint}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link href={`/admin/inventory/${item.id}`} className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-center text-sm font-medium text-gray-700 dark:border-white/10 dark:text-gray-300">
                    View
                  </Link>
                  <Link href={`/admin/inventory/${item.id}/adjust`} className="flex-1 rounded-xl bg-brand-500 px-3 py-2 text-center text-sm font-medium text-white">
                    Adjust
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-100 px-4 py-4 dark:border-white/[0.05] sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-medium text-gray-700 dark:text-white/90">{filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-gray-700 dark:text-white/90">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of <span className="font-medium text-gray-700 dark:text-white/90">{filtered.length}</span> items
            </p>
            <div className="overflow-x-auto">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => page >= 1 && page <= totalPages && setCurrentPage(page)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}