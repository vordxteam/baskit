"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Pagination from "@/components/tables/Pagination";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { ProductInventory, type InventoryItem, type InventoryListResponse, type InventoryPagination } from "@/api/productInventory";

const inventoryApi = new ProductInventory();
const PAGE_SIZE = 20;

export default function InventoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [pagination, setPagination] = useState<InventoryPagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        setPageError("");

        const response = await inventoryApi.getInventory<InventoryListResponse>({
          page: currentPage,
          per_page: PAGE_SIZE,
        });

        setItems(response?.data || []);
        setPagination(response?.pagination || null);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setPageError("Failed to load inventory.");
        setItems([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, [currentPage]);

  const totalPages = Math.max(1, pagination?.last_page || Math.ceil((pagination?.total || items.length) / PAGE_SIZE) || 1);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this inventory item?")) {
      return;
    }

    try {
      setIsDeleting(id);
      setPageError("");
      await inventoryApi.deleteInventory(id);
      const response = await inventoryApi.getInventory<InventoryListResponse>({
        page: currentPage,
        per_page: PAGE_SIZE,
      });

      const nextItems = response?.data || [];
      const nextPagination = response?.pagination || null;

      if (nextItems.length === 0 && currentPage > 1) {
        setCurrentPage((value) => Math.max(1, value - 1));
        return;
      }

      setItems(nextItems);
      setPagination(nextPagination);
    } catch (error) {
      console.error("Error deleting inventory:", error);
      setPageError("Failed to delete inventory item.");
    } finally {
      setIsDeleting(null);
    }
  };

  const totalItems = pagination?.total ?? items.length;
  const firstItemIndex = totalItems === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastItemIndex = Math.min(currentPage * PAGE_SIZE, totalItems);

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Track catalog items from the API</p>
      </div>

      {pageError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {pageError}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-white/5">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Catalog Items</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Showing data from the inventory API</p>
          </div>
          <Link href="/admin/inventory/create" className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors">
            Add Item
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading inventory...
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex min-h-[40vh] items-center justify-center px-4">
            <div className="max-w-sm text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
                <svg className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75h4.5m-4.5 3h4.5m2.25-9H7.5A2.25 2.25 0 005.25 6v12a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25V9l-4.5-4.5z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">No inventory items found</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">There is no inventory data to display right now.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="hidden md:block max-w-full overflow-x-auto">
              <div className="min-w-[980px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/5">
                    <TableRow>
                      {['Name', 'Type', 'SKU', 'Price', 'Stock', 'Status', 'Actions'].map((header) => (
                        <TableCell key={header} isHeader className="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                    {items.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50/60 dark:hover:bg-white/2">
                        <TableCell className="px-5 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">{item.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">ID: {item.id}</p>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{item.type}</TableCell>
                        <TableCell className="px-5 py-4 text-sm font-mono text-gray-600 dark:text-gray-400">{item.sku || "-"}</TableCell>
                        <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{item.price}</TableCell>
                        <TableCell className="px-5 py-4 text-sm font-medium text-gray-700 dark:text-gray-200">{item.stock_quantity}</TableCell>
                        <TableCell className="px-5 py-4">
                          <Badge size="sm" color={item.is_active ? "success" : "warning"}>{item.is_active ? "Active" : "Inactive"}</Badge>
                        </TableCell>
                        <TableCell className="px-5 py-4">
                          <div className="flex items-start justify-start gap-2">
                            <Link href={`/admin/inventory/${item.id}`} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/6">
                              View
                            </Link>
                            <Link href={`/admin/inventory/${item.id}/edit`} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/6">
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(item.id)}
                              disabled={isDeleting === item.id}
                              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                            >
                              {isDeleting === item.id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="grid gap-4 p-4 md:hidden">
              {items.map((item) => (
                <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.type} · {item.sku || "-"}</p>
                    </div>
                    <Badge size="sm" color={item.is_active ? "success" : "warning"}>{item.is_active ? "Active" : "Inactive"}</Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                      <p className="font-medium text-gray-800 dark:text-white/90">{item.price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Stock</p>
                      <p className="font-medium text-gray-800 dark:text-white/90">{item.stock_quantity}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Description</p>
                      <p className="font-medium text-gray-800 dark:text-white/90 line-clamp-2">{item.description}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link href={`/admin/inventory/${item.id}`} className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-center text-sm font-medium text-gray-700 dark:border-white/10 dark:text-gray-300">
                      View
                    </Link>
                    <Link href={`/admin/inventory/${item.id}/edit`} className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-center text-sm font-medium text-gray-700 dark:border-white/10 dark:text-gray-300">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting === item.id}
                      className="flex-1 rounded-xl border border-red-200 px-3 py-2 text-center text-sm font-medium text-red-600 disabled:opacity-50 dark:border-red-500/30 dark:text-red-400"
                    >
                      {isDeleting === item.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 px-4 py-4 dark:border-white/5 sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing <span className="font-medium text-gray-700 dark:text-white/90">{firstItemIndex}</span> to <span className="font-medium text-gray-700 dark:text-white/90">{lastItemIndex}</span> of <span className="font-medium text-gray-700 dark:text-white/90">{totalItems}</span> items
                </p>
                <div className="overflow-x-auto">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => page >= 1 && page <= totalPages && setCurrentPage(page)} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}