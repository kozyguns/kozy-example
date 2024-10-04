"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../../../admin/audits/review/data-table-column-header";
import { SupportRequestTableRowActions } from "./support-request-table-row-actions";
import { statuses, priorities, categories } from "./data";

export type SupportRequest = {
  id: string;
  user_uuid: string;
  name: string;
  employee_email: string;
  category: string;
  inquiry_type: string;
  phone: string;
  details: string;
  created_at: string;
  updated_at: string;
  status: string;
  priority: string;
};

export type TableMeta = {
  setStatus: (id: string, status: string) => void;
};

export const columns: ColumnDef<SupportRequest>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
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
      const category = categories.find(
        (c) => c.value === row.getValue("category")
      );
      return category ? category.label : row.getValue("category");
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
    accessorKey: "employee_email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee Email" />
    ),
    cell: ({ row }) => <div>{row.getValue("employee_email")}</div>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    meta: {
      style: { width: "180px" },
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
    cell: ({ row }) =>
      new Date(row.getValue("created_at")).toLocaleDateString(),
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
      const status = statuses.find((s) => s.value === row.getValue("status"));
      return status ? (
        <div className="flex items-center">
          <span>{status.label}</span>
        </div>
      ) : (
        row.getValue("status")
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
      const priority = priorities.find(
        (p) => p.value === row.getValue("priority")
      );
      if (!priority) {
        return null;
      }
      return (
        <div className="flex items-center">
          <span>{priority.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row, table }) => (
      <SupportRequestTableRowActions
        row={row}
        setStatus={(table.options.meta as TableMeta).setStatus}
      />
    ),
    meta: {
      style: { width: "150px" },
    },
  },
];
