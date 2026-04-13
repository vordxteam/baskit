export type AnnouncementStatus = "Draft" | "Scheduled" | "Active" | "Expired";

export interface Announcement {
  id: number;
  title: string;
  summary: string;
  content: string;
  status: AnnouncementStatus;
  target: string;
  publishAt: string;
  createdBy: string;
  createdAt: string;
}

export const announcements: Announcement[] = [
  {
    id: 1,
    title: "Weekend Maintenance Notice",
    summary: "Checkout and analytics will be briefly unavailable.",
    content: "We will perform scheduled maintenance on Saturday from 1:00 AM to 3:00 AM UTC.",
    status: "Scheduled",
    target: "All Users",
    publishAt: "2026-04-10T01:00:00Z",
    createdBy: "Admin Team",
    createdAt: "2026-04-05T09:10:00Z",
  },
  {
    id: 2,
    title: "New Loyalty Rewards",
    summary: "Launch of updated loyalty tiers and member bonuses.",
    content: "We have updated our loyalty program with new tiers and more flexible bonus points.",
    status: "Active",
    target: "Customers",
    publishAt: "2026-04-03T08:00:00Z",
    createdBy: "Marketing",
    createdAt: "2026-04-02T15:20:00Z",
  },
  {
    id: 3,
    title: "Supplier Portal Update",
    summary: "Suppliers should review the revised stock intake workflow.",
    content: "The supplier portal now includes revised intake fields and SKU verification steps.",
    status: "Draft",
    target: "Suppliers",
    publishAt: "2026-04-12T10:00:00Z",
    createdBy: "Operations",
    createdAt: "2026-04-05T16:45:00Z",
  },
  {
    id: 4,
    title: "Spring Sale Reminder",
    summary: "Expired campaign notification kept for records.",
    content: "The spring sale campaign has ended and should remain archived for review.",
    status: "Expired",
    target: "All Users",
    publishAt: "2026-03-28T00:00:00Z",
    createdBy: "Marketing",
    createdAt: "2026-03-20T12:15:00Z",
  },
];

export const announcementStatusColors: Record<AnnouncementStatus, "success" | "warning" | "error" | "info"> = {
  Draft: "warning",
  Scheduled: "info",
  Active: "success",
  Expired: "error",
};