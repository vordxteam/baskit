"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { announcements, Announcement, AnnouncementStatus } from "../../data";

type FormState = {
  title: string;
  summary: string;
  content: string;
  target: string;
  status: AnnouncementStatus;
  publishAt: string;
};

const targets = ["All Users", "Customers", "Suppliers", "Staff"];
const statuses: AnnouncementStatus[] = ["Draft", "Scheduled", "Active", "Expired"];

const emptyForm: FormState = {
  title: "",
  summary: "",
  content: "",
  target: targets[0],
  status: statuses[0],
  publishAt: "",
};

export default function EditAnnouncementPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [item, setItem] = useState<Announcement | null | undefined>(undefined);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const found = announcements.find((entry) => entry.id === id) ?? null;
    setItem(found);
    if (found) {
      setForm({
        title: found.title,
        summary: found.summary,
        content: found.content,
        target: found.target,
        status: found.status,
        publishAt: found.publishAt.slice(0, 16),
      });
    }
  }, [id]);

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim()) nextErrors.title = "Title is required";
    if (!form.summary.trim()) nextErrors.summary = "Summary is required";
    if (!form.content.trim()) nextErrors.content = "Content is required";
    if (!form.publishAt.trim()) nextErrors.publishAt = "Publish date is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsSubmitting(false);
    router.push("/admin/announcements");
  };

  if (item === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading announcement...
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Announcement not found</h2>
        <Link href="/admin/announcements" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
          Back to Announcements
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/admin/announcements" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Announcements</Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <span className="font-medium text-gray-800 dark:text-white/90">Edit</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Announcement</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update the announcement content and schedule.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
          <div className="border-b border-gray-100 px-6 py-4 dark:border-white/5"><h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Announcement Details</h2></div>
          <div className="grid gap-5 px-6 py-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <input value={form.title}  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:bg-white/3 dark:text-white/90 ${errors.title ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-white/10"}`} />
              {errors.title && <p className="mt-1.5 text-xs text-red-500">{errors.title}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Summary</label>
              <input value={form.summary} onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))} className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:bg-white/3 dark:text-white/90 ${errors.summary ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-white/10"}`} />
              {errors.summary && <p className="mt-1.5 text-xs text-red-500">{errors.summary}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
              <textarea value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} rows={6} className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:bg-white/3 dark:text-white/90 ${errors.content ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-white/10"}`} />
              {errors.content && <p className="mt-1.5 text-xs text-red-500">{errors.content}</p>}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
          <div className="border-b border-gray-100 px-6 py-4 dark:border-white/5"><h2 className="text-base font-semibold text-gray-800 dark:text-white/90">Targeting</h2></div>
          <div className="grid gap-5 px-6 py-5 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Audience</label>
              <select value={form.target} onChange={(e) => setForm((prev) => ({ ...prev, target: e.target.value }))} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90">
                {targets.map((target) => <option key={target} value={target}>{target}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as AnnouncementStatus }))} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-white/3 dark:text-white/90">
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Publish Date</label>
              <input type="datetime-local" value={form.publishAt} onChange={(e) => setForm((prev) => ({ ...prev, publishAt: e.target.value }))} className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-800 outline-none transition-all focus:ring-2 focus:ring-brand-500 dark:bg-white/3 dark:text-white/90 ${errors.publishAt ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-white/10"}`} />
              {errors.publishAt && <p className="mt-1.5 text-xs text-red-500">{errors.publishAt}</p>}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link href="/admin/announcements" className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:bg-white/3 dark:text-gray-300 dark:hover:bg-white/6">
            Cancel
          </Link>
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}