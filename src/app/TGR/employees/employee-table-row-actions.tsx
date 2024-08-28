"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Pen, Trash, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Employee } from "./types";
import { toast } from "sonner";
import { EditScheduleDialog } from "./EditScheduleDialog";
import { supabase } from "@/utils/supabase/client";

interface EmployeeTableRowActionsProps<TData> {
  row: Row<TData>;
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: number) => void;
  onUpdateSchedule: (
    employeeId: number,
    schedules: WeeklySchedule
  ) => Promise<void>;
}

interface WeeklySchedule {
  [day: string]: { start_time: string | null; end_time: string | null };
}

export function EmployeeTableRowActions<TData>({
  row,
  onEdit,
  onDelete,
  onUpdateSchedule,
}: EmployeeTableRowActionsProps<TData>) {
  const employee = row.original as Employee;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  const handleUpdateSchedule = async (schedules: WeeklySchedule) => {
    try {
      await onUpdateSchedule(employee.employee_id, schedules);
      setIsScheduleDialogOpen(false);
      toast.success("Schedule updated successfully");
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("Failed to update schedule");
    }
  };

  const fetchWeeklySchedule = async (
    employeeId: number
  ): Promise<WeeklySchedule> => {
    const { data, error } = await supabase
      .from("reference_schedules")
      .select("day_of_week, start_time, end_time")
      .eq("employee_id", employeeId);

    if (error) {
      console.error("Error fetching weekly schedule:", error);
      return {};
    }

    const weeklySchedule: WeeklySchedule = {
      Monday: { start_time: null, end_time: null },
      Tuesday: { start_time: null, end_time: null },
      Wednesday: { start_time: null, end_time: null },
      Thursday: { start_time: null, end_time: null },
      Friday: { start_time: null, end_time: null },
      Saturday: { start_time: null, end_time: null },
      Sunday: { start_time: null, end_time: null },
    };

    data.forEach((schedule) => {
      weeklySchedule[schedule.day_of_week] = {
        start_time: schedule.start_time,
        end_time: schedule.end_time,
      };
    });

    return weeklySchedule;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <Pen className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsScheduleDialogOpen(true)}>
            <Calendar className="mr-2 h-4 w-4" />
            Edit Schedule
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onDelete(employee.employee_id)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Existing Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {/* ... existing dialog content ... */}
      </Dialog>

      {/* New Schedule Dialog */}
      <EditScheduleDialog
        isOpen={isScheduleDialogOpen}
        onClose={() => setIsScheduleDialogOpen(false)}
        employeeId={employee.employee_id}
        employeeName={employee.name}
        fetchWeeklySchedule={fetchWeeklySchedule}
        onUpdateSchedule={handleUpdateSchedule}
      />
    </>
  );
}
