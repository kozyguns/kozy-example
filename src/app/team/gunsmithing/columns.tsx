import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export interface FirearmsMaintenanceData {
  id: number;
  firearm_type: string;
  firearm_name: string;
  last_maintenance_date: string;
  maintenance_frequency: number;
  maintenance_notes: string;
  status: string;
  assigned_to: string;
}

export const columns: ColumnDef<FirearmsMaintenanceData>[] = [
  {
    accessorKey: "firearm_name",
    header: "Firearm Name",
    cell: ({ row }) => {
      const firearmName = row.getValue("firearm_name");
      return firearmName ? firearmName : "N/A";
    },
  },
  {
    accessorKey: "last_maintenance_date",
    header: "Last Maintenance Date",
    cell: ({ row }) => {
      const date = row.getValue("last_maintenance_date");
      if (date) {
        // Format the date as "MMM dd, yyyy" (e.g., "Sep 15, 2024")
        return format(new Date(date as string), "MMM dd, yyyy");
      }
      return "N/A";
    },
  },
  {
    accessorKey: "maintenance_frequency",
    header: "Maintenance Frequency",
  },
  {
    accessorKey: "maintenance_notes",
    header: "Maintenance Notes",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return status ? status : "No status";
    },
  }
];

export const maintenanceFrequencies = [
  { label: "Weekly", value: 7 },
  { label: "Bi-weekly", value: 14 },
  { label: "Monthly", value: 30 },
  { label: "Every other month", value: 60 },
  { label: "Every quarter", value: 90 },
];

export type { ColumnDef };
