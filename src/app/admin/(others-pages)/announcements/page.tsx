"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Pagination from "@/components/tables/Pagination";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { announcementStatusColors, announcements, Announcement, AnnouncementStatus } from "./data";

const filters: Array<AnnouncementStatus | "All"> = ["All", "Draft", "Scheduled", "Active", "Expired"];

export default function AnnouncementsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<AnnouncementStatus | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return announcements.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.target.toLowerCase().includes(q) ||
        item.createdBy.toLowerCase().includes(q);
      const matchesFilter = filter === "All" || item.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Publish updates, reminders, and notices for your users and team.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((item) => {
          const active = filter === item;
          return (
            <button
              key={item}
              onClick={() => {
                setFilter(item);
                setCurrentPage(1);
              }}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${active ? "border-brand-500 bg-brand-500 text-white" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-400"}`}
            >
              {item}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.05]">
          <div className="relative w-full sm:max-w-sm">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
            </svg>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search announcements"
              className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-gray-500"
            />
          </div>

          <Link href="/admin/announcements/create" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
            Create Announcement
          </Link>
        </div>

        <div className="hidden md:block max-w-full overflow-x-auto">
          <div className="min-w-[980px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {['Title', 'Target', 'Status', 'Publish Date', 'Created By', 'Actions'].map((header) => (
                    <TableCell key={header} isHeader className="px-5 py-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500">No announcements match your search or filter.</TableCell>
                  </TableRow>
                ) : (
                  paginated.map((item: Announcement) => (
                    <TableRow key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                      <TableCell className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-white/90">{item.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{item.summary}</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{item.target}</TableCell>
                      <TableCell className="px-5 py-4"><Badge size="sm" color={announcementStatusColors[item.status]}>{item.status}</Badge></TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(item.publishAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{item.createdBy}</TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/announcements/${item.id}/edit`} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/[0.06]">
                            Edit
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
            <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400 dark:border-white/10">No announcements match your search or filter.</div>
          ) : (
            paginated.map((item) => (
              <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.target}</p>
                  </div>
                  <Badge size="sm" color={announcementStatusColors[item.status]}>{item.status}</Badge>
                </div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{item.summary}</p>
                <div className="mt-4 flex items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>{item.createdBy}</span>
                  <span>{new Date(item.publishAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/admin/announcements/${item.id}/edit`} className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-center text-sm font-medium text-gray-700 dark:border-white/10 dark:text-gray-300">
                    Edit
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-100 px-4 py-4 dark:border-white/[0.05] sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-medium text-gray-700 dark:text-white/90">{filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-gray-700 dark:text-white/90">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of <span className="font-medium text-gray-700 dark:text-white/90">{filtered.length}</span> announcements
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