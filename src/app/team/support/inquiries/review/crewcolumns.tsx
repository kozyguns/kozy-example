// src/app/team/support/inquiries/crewcolumns.tsx

"use client";
import { ColumnDef as BaseColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../../../admin/audits/review/data-table-column-header";
import { statuses, priorities, categories } from "./data";
import { includesArrayString } from "./custom-filter";

export type SupportRequest = {
  id: string;
  name: string;
  employee_email: string;
  category: string;
  inquiry_type: string;
  email: string;
  phone: string;
  details: string;
  created_at: string;
  updated_at: string;
  status: string;
  priority: string;
};

export type ColumnDef<TData, TValue = unknown> = BaseColumnDef<
  TData,
  TValue
> & {
  meta?: {
    style?: React.CSSProperties;
  };
};

export const createColumns = (): ColumnDef<SupportRequest>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Submitted By" />
    ),
    meta: {
      style: { width: "150px" },
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = categories.find((c) => c.value === row.original.category);
      return category ? category.label : row.original.category;
    },
    meta: {
      style: { width: "150px" },
    },
  },
  {
    accessorKey: "inquiry_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inquiry Type" />
    ),
    meta: {
      style: { width: "150px" },
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    meta: {
      style: { width: "200px" },
    },
    filterFn: includesArrayString,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    meta: {
      style: { width: "150px" },
    },
  },
  {
    accessorKey: "details",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Details" />
    ),
    meta: {
      style: { width: "250px" },
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Submitted" />
    ),
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    meta: {
      style: { width: "150px" },
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find((s) => s.value === row.original.status);
      return status ? status.label : row.original.status;
    },
    meta: {
      style: { width: "150px" },
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find((p) => p.value === row.original.priority);
      return priority ? priority.label : row.original.priority;
    },
    meta: {
      style: { width: "150px" },
    },
  },
];