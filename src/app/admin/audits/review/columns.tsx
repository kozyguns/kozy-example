"use client";
import { ColumnDef as BaseColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { labels } from "./data";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-actions";
import { UUID } from "crypto";

// Extend the ColumnDef type to include a meta property with a style field
export type ColumnDef<TData, TValue = unknown> = BaseColumnDef<
  TData,
  TValue
> & {
  meta?: {
    style?: React.CSSProperties;
  };
};

export type AuditData = {
  audits_id: string;
  dros_number: string;
  salesreps: string;
  audit_type: string;
  trans_date: string;
  audit_date: string;
  error_location: string;
  error_details: string;
  error_notes?: string | null;
  dros_cancel: string | null;
  label?: string;
};

export const createColumns = (
  refreshData: () => void
): ColumnDef<AuditData>[] => [
  {
    accessorKey: "dros_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice Number" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("dros_number")}
          </span>
        </div>
      );
    },
    meta: {
      style: { width: "200px" },
    },
  },
  {
    accessorKey: "salesreps",
    header: "Sales Staff",
    meta: {
      style: { width: "100px" },
    },
  },
  // {
  //   accessorKey: "audit_type",
  //   header: "Audit Type",
  //   meta: {
  //     style: { width: "100px" },
  //   },
  // },
  {
    accessorKey: "trans_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transaction Date" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("trans_date")}
          </span>
        </div>
      );
    },
    meta: {
      style: { width: "60px" },
    },
  },
  // {
  //   accessorKey: "audit_date",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Audit Date" />
  //   ),
  //   cell: ({ row }) => {
  //     const label = labels.find((label) => label.value === row.original.label);

  //     return (
  //       <div className="flex space-x-2">
  //         {label && <Badge variant="outline">{label.label}</Badge>}
  //         <span className="max-w-[500px] truncate font-medium">
  //           {row.getValue("audit_date")}
  //         </span>
  //       </div>
  //     );
  //   },
  //   meta: {
  //     style: { width: "60px" },
  //   },
  // },
  {
    accessorKey: "error_location",
    header: "Audit Section",
    meta: {
      style: { width: "200px" },
    },
  },
  {
    accessorKey: "error_details",
    header: "Audit Category",
    meta: {
      style: { width: "400px" },
    },
  },
  {
    accessorKey: "error_notes",
    header: "Audit Details",
    meta: {
      style: { width: "450px" },
    },
  },
  {
    accessorKey: "dros_cancel",
    header: "Item Excluded",
    meta: {
      style: { width: "150px" },
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row} onAuditUpdated={refreshData} />
    ),
  },
];
export default createColumns;
