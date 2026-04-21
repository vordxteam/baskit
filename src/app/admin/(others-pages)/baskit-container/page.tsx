"use client";

import React, { useEffect, useState } from "react";
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
import { ProductContainer, ProductContainerData } from "@/api/productContainer";

interface Container {
  id: string;
  name: string;
  description?: string;
  // price: string;
  is_active: boolean;
  product_type_name?: string;
}

export default function BaskitContainerTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [containers, setContainers] = useState<Container[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [pagination, setPagination] = useState({
    total: 0,
    perPage: 20,
    lastPage: 1,
  });

  const itemsPerPage = pagination.perPage;
  const totalPages = Math.max(1, pagination.lastPage);
  const showingFrom = pagination.total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const showingTo = pagination.total === 0 ? 0 : Math.min(currentPage * itemsPerPage, pagination.total);

  useEffect(() => {
    let isMounted = true;

    const fetchContainers = async () => {
      setIsLoading(true);
      setFetchError("");

      try {
        const productContainerApi = new ProductContainer();
        const data = await productContainerApi.getContainers();

        if (!isMounted) return;

        // For now, assume data has id and map to Container interface
        // In a real scenario, you might need to fetch product type names separately
        const mapped = data.map((item: ProductContainerData) => ({
          id: item.id || '',
          name: item.name,
          description: item.description,
          // price: item.price,
          is_active: item.is_active ?? true,
          product_type_name: 'Product Type', // Placeholder, would need to fetch actual name
        }));

        setContainers(mapped);
        setPagination({
          total: mapped.length,
          perPage: 20,
          lastPage: Math.max(1, Math.ceil(mapped.length / 20)),
        });
      } catch (error) {
        if (!isMounted) return;

        console.error("Error fetching containers:", error);
        setFetchError("Failed to load containers. Please refresh and try again.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchContainers();

    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  const handleDeleteConfirm = () => {
    const containerId = deleteModal.id;
    if (!containerId || isDeleting) return;

    const runDelete = async () => {
      try {
        setIsDeleting(true);
        setFetchError("");
        const productContainerApi = new ProductContainer();
        await productContainerApi.deleteContainers(containerId);

        setContainers((prev) => prev.filter((c) => c.id !== containerId));
        setPagination((prev) => {
          const nextTotal = Math.max(0, prev.total - 1);
          return {
            ...prev,
            total: nextTotal,
            lastPage: Math.max(1, Math.ceil(nextTotal / prev.perPage)),
          };
        });
      } catch (error) {
        console.error("Delete container failed:", error);
        setFetchError("Failed to delete container. Please try again.");
      } finally {
        setIsDeleting(false);
        setDeleteModal({ open: false, id: null });
      }
    };

    void runDelete();
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Baskit Containers</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your product containers</p>
          </div>

          {/* Add Container Button */}
          <Link
            href="/admin/baskit-container/add"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Container
          </Link>
        </div>

        {fetchError && (
          <div className="mx-5 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            {fetchError}
          </div>
        )}

        {isLoading && (
          <div className="p-10 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading containers...</p>
          </div>
        )}

        {!isLoading && containers.length === 0 && (
          <div className="p-10 text-center">
            <h4 className="text-base font-medium text-gray-800 dark:text-white/90">No containers found</h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create your first container to get started.</p>
          </div>
        )}

        {!isLoading && containers.length > 0 && (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block max-w-full overflow-x-auto">
              <div className="min-w-[860px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/5">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Name</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Description</TableCell>
                      {/* <TableCell isHeader className="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Price</TableCell> */}
                      <TableCell isHeader className="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">Status</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400">Actions</TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                    {containers.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="px-5 py-4 text-start">
                          <div className="min-w-0">
                            <span className="block truncate text-theme-sm font-medium text-gray-800 dark:text-white/90">{item.name}</span>
                          </div>
                        </TableCell>

                        <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                          {item.description || '-'}
                        </TableCell>

                        {/* <TableCell className="px-5 py-4 text-theme-sm font-medium text-gray-700 dark:text-gray-300">{item.price}</TableCell> */}

                        <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                          <Badge size="sm" color={item.is_active ? "success" : "error"}>
                            {item.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>

                        {/* Action Icons */}
                        <TableCell className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {/* View */}
                            <Link
                              href={`/admin/baskit-container/${item.id}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-colors"
                              title="View container"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </Link>

                            {/* Edit */}
                            <Link
                              href={`/admin/baskit-container/${item.id}/edit`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400 transition-colors"
                              title="Edit container"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                              </svg>
                            </Link>

                            {/* Delete */}
                            <button
                              onClick={() => setDeleteModal({ open: true, id: item.id })}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
                              title="Delete container"
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
              {containers.map((item) => (
                <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">{item.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.description || 'No description'}</p>
                    </div>
                    {/* Mobile Actions */}
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/baskit-container/${item.id}`} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </Link>
                      <Link href={`/admin/baskit-container/${item.id}/edit`} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-colors">
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
                    {/* <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">{item.price}</p>
                    </div> */}
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                      <div className="mt-1">
                        <Badge size="sm" color={item.is_active ? "success" : "error"}>
                          {item.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="border-t border-gray-100 px-4 py-4 sm:px-5 dark:border-white/5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing{" "}
                  <span className="font-medium text-gray-700 dark:text-white/90">{showingFrom}</span>{" "}
                  to{" "}
                  <span className="font-medium text-gray-700 dark:text-white/90">{showingTo}</span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-700 dark:text-white/90">{pagination.total}</span>{" "}
                  containers
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
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.open}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModal({ open: false, id: null });
          }
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Container"
        message="Are you sure you want to delete this container? This action is permanent and cannot be undone."
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        variant="danger"
      />
    </>
  );
}