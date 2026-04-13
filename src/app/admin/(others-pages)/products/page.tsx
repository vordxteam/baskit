"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import Badge from "../../../../components/ui/badge/Badge";
import Pagination from "@/components/tables/Pagination";
import ConfirmationModal from "@/components/example/ModalExample/ConfirmationModal";

interface Product {
  id: number;
  product: {
    name: string;
    category: string;
  };
  sku: string;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  price: string;
}

const tableData: Product[] = [
  { id: 1, product: { name: "Wireless Headphones", category: "Electronics" }, sku: "WH-1024", stock: 48, status: "In Stock", price: "$129.00" },
  { id: 2, product: { name: "Smart Watch Pro", category: "Wearables" }, sku: "SW-2048", stock: 12, status: "Low Stock", price: "$249.00" },
  { id: 3, product: { name: "Bluetooth Speaker", category: "Audio" }, sku: "BS-3091", stock: 0, status: "Out of Stock", price: "$89.00" },
  { id: 4, product: { name: "Gaming Mouse", category: "Accessories" }, sku: "GM-4455", stock: 27, status: "In Stock", price: "$59.00" },
  { id: 5, product: { name: "Mechanical Keyboard", category: "Accessories" }, sku: "MK-7788", stock: 9, status: "Low Stock", price: "$139.00" },
  { id: 6, product: { name: "4K Monitor", category: "Displays" }, sku: "MN-9001", stock: 16, status: "In Stock", price: "$399.00" },
  { id: 7, product: { name: "USB-C Hub", category: "Gadgets" }, sku: "UH-2210", stock: 0, status: "Out of Stock", price: "$45.00" },
  { id: 8, product: { name: "Portable SSD", category: "Storage" }, sku: "PS-6543", stock: 33, status: "In Stock", price: "$179.00" },
  { id: 9, product: { name: "Portable SSD", category: "Storage" }, sku: "PS-6543", stock: 33, status: "In Stock", price: "$179.00" },
  { id: 10, product: { name: "Portable SSD", category: "Storage" }, sku: "PS-6543", stock: 33, status: "In Stock", price: "$179.00" },
  { id: 11, product: { name: "Portable SSD", category: "Storage" }, sku: "PS-6543", stock: 33, status: "In Stock", price: "$179.00" },
];

export default function ProductsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>(tableData);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return products.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, products]);

  const handleDeleteConfirm = () => {
    if (deleteModal.id !== null) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteModal.id));
    }
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.05]">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Products</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your product inventory, stock, and pricing</p>
          </div>

          {/* Add Product Button */}
          <Link
            href="/admin/products/add"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Product
          </Link>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block max-w-full overflow-x-auto">
          <div className="min-w-[860px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Product</TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">SKU</TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Stock</TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Status</TableCell>
                  <TableCell isHeader className="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Price</TableCell>
                  <TableCell isHeader className="px-5 py-3 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400">Actions</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="min-w-0">
                        <span className="block truncate text-theme-sm font-medium text-gray-800 dark:text-white/90">{item.product.name}</span>
                        <span className="block text-theme-xs text-gray-500 dark:text-gray-400">{item.product.category}</span>
                      </div>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">{item.sku}</TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">{item.stock}</TableCell>

                    <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                      <Badge size="sm" color={item.status === "In Stock" ? "success" : item.status === "Low Stock" ? "warning" : "error"}>
                        {item.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-theme-sm font-medium text-gray-700 dark:text-gray-300">{item.price}</TableCell>

                    {/* Action Icons */}
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* View */}
                        <Link
                          href={`/admin/products/${item.id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-colors"
                          title="View product"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </Link>

                        {/* Edit */}
                        <Link
                          href={`/admin/products/${item.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400 transition-colors"
                          title="Edit product"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteModal({ open: true, id: item.id })}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
                          title="Delete product"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="grid gap-4 p-4 md:hidden">
          {paginatedData.map((item) => (
            <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">{item.product.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.product.category}</p>
                </div>
                {/* Mobile Actions */}
                <div className="flex items-center gap-1">
                  <Link href={`/admin/products/${item.id}`} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </Link>
                  <Link href={`/admin/products/${item.id}/edit`} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                    </svg>
                  </Link>
                  <button onClick={() => setDeleteModal({ open: true, id: item.id })} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">SKU</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{item.sku}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Stock</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{item.stock}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{item.price}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                  <div className="mt-1">
                    <Badge size="sm" color={item.status === "In Stock" ? "success" : item.status === "Low Stock" ? "warning" : "error"}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-100 px-4 py-4 sm:px-5 dark:border-white/[0.05]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium text-gray-700 dark:text-white/90">{(currentPage - 1) * itemsPerPage + 1}</span>{" "}
              to{" "}
              <span className="font-medium text-gray-700 dark:text-white/90">{Math.min(currentPage * itemsPerPage, products.length)}</span>{" "}
              of{" "}
              <span className="font-medium text-gray-700 dark:text-white/90">{products.length}</span>{" "}
              products
            </p>
            <div className="overflow-x-auto">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  if (page >= 1 && page <= totalPages) setCurrentPage(page);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action is permanent and cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
      />
    </>
  );
}