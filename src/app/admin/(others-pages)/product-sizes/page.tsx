"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Pagination from "@/components/tables/Pagination";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { ProductSize } from "@/api/productSize";
import { ProductSize as ProductSizeModel } from "@/api/productSize/types";
import { Badge } from "lucide-react";

export default function ProductSizesPage() {
  const [sizes, setSizes] = useState<ProductSizeModel[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  const filtered = sizes.filter((item) => {
    const query = search.trim().toLowerCase();
    return (
      item.label.toLowerCase().includes(query) ||
      item.size_code.toLowerCase().includes(query) ||
      item.product_type_name.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product size?")) {
      try {
        await new ProductSize().deleteSize(id);
        setSizes((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Error deleting size:", error);
        setError("Failed to delete product size");
      }
    }
  };

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await new ProductSize().getSizes();
        setSizes(response.data.sizes);
      } catch (err) {
        console.error("Error fetching sizes:", err);
        setError("Failed to load product sizes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSizes();
  }, []);


  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Sizes</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage product sizes and dimensions</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5">
          <div className="relative w-full sm:max-w-sm">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
            </svg>
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search sizes..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90 dark:placeholder:text-gray-500"
            />
          </div>

          <Link
            href="/admin/product-sizes/add"
            className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors whitespace-nowrap"
          >
            Add Size
          </Link>
        </div>

        {isLoading ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading product sizes...</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block max-w-full overflow-x-auto">
              <div className="min-w-[600px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/5">
                    <TableRow>
                      {["Product Type", "Size Code", "Label", "Min Items", "Max Items", "Status", "Actions"].map((header) => (
                        <TableCell key={header} isHeader className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                    {paginated.length === 0 ? (
                      <TableRow>
                        <TableCell className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500" colSpan={7}>
                          No product sizes found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginated.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50/60 dark:hover:bg-white/2">
                          <TableCell className="px-5 py-4">
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">{item.product_type_name}</p>
                          </TableCell>
                          <TableCell className="px-5 py-4 text-sm font-mono text-gray-600 dark:text-gray-400">{item.size_code}</TableCell>
                          <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{item.label}</TableCell>
                          <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{item.min_items}</TableCell>
                          <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{item.max_items}</TableCell>
                          <TableCell className="px-5 py-4">
                            <Badge className={item.is_active ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400" : "bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400"}>
                              {item.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/admin/product-sizes/${item.id}`}
                                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
                              >
                                View
                              </Link>
                              <Link
                                href={`/admin/product-sizes/${item.id}/edit`}
                                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                              >
                                Delete
                              </button>
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
                <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400 dark:border-white/10">
                  No product sizes found.
                </div>
              ) : (
                paginated.map((item) => (
                  <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{item.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.product_type_name}</p>
                      </div>
                      <Badge className={item.is_active ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400" : "bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400"}>
                        {item.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="my-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 dark:border-white/5">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Code</p>
                        <p className="font-mono text-sm font-medium text-gray-700 dark:text-white/90">{item.size_code}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Items</p>
                        <p className="text-sm font-medium text-gray-700 dark:text-white/90">{item.min_items}-{item.max_items}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/admin/product-sizes/${item.id}`}
                        className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-center text-xs font-medium text-gray-700 dark:border-white/10 dark:text-gray-300"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/product-sizes/${item.id}/edit`}
                        className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-center text-xs font-medium text-gray-700 dark:border-white/10 dark:text-gray-300"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 rounded-lg border border-red-200 px-3 py-1.5 text-center text-xs font-medium text-red-600 dark:border-red-900/50 dark:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-gray-100 px-4 py-4 dark:border-white/5 sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing <span className="font-medium text-gray-700 dark:text-white/90">{filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-gray-700 dark:text-white/90">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of <span className="font-medium text-gray-700 dark:text-white/90">{filtered.length}</span> items
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