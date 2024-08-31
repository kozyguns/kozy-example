"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/utils/supabase/client";
import { Employee } from "./types";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { EmployeeTableRowActions } from "./employee-table-row-actions";
import { toast } from "sonner";
import { Row } from "@tanstack/react-table";
import RoleBasedWrapper from "@/components/RoleBasedWrapper";
import AddEmployeeDialog from "./add-employee-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";

// Add this interface if not already defined
interface WeeklySchedule {
  [day: string]: { start_time: string | null; end_time: string | null };
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const fetchEmployees = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees");
    } else {
      setEmployees(data as Employee[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (
    newEmployee: Omit<Employee, "employee_id">
  ) => {
    const { data, error } = await supabase
      .from("employees")
      .insert([newEmployee])
      .select();

    if (error) {
      console.error("Error adding employee:", error);
      toast.error("Failed to add employee");
    } else {
      toast.success("Employee added successfully");
      await fetchEmployees(); // Refresh the employee list
    }
  };

  const handleEditEmployee = async (updatedEmployee: Employee) => {
    const { error } = await supabase
      .from("employees")
      .update(updatedEmployee)
      .eq("employee_id", updatedEmployee.employee_id);

    if (error) {
      console.error("Error updating employee:", error);
      throw error; // This will be caught in the EmployeeTableRowActions component
    } else {
      await fetchEmployees(); // Refresh the employee list
    }
  };

  const handleDeleteEmployee = async (employeeId: number) => {
    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("employee_id", employeeId);

    if (error) {
      console.error("Error deleting employee:", error);
      throw error; // This will be caught in the EmployeeTableRowActions component
    } else {
      await fetchEmployees(); // Refresh the employee list
    }
  };

  const handleUpdateSchedule = async (
    employeeId: number,
    schedules: WeeklySchedule
  ) => {
    const employee = employees.find((emp) => emp.employee_id === employeeId);
    if (!employee) {
      console.error("Employee not found");
      return;
    }

    for (const [day, times] of Object.entries(schedules)) {
      const { error } = await supabase.from("reference_schedules").upsert(
        {
          employee_id: employeeId,
          day_of_week: day,
          start_time: times.start_time,
          end_time: times.end_time,
        },
        {
          onConflict: "employee_id,day_of_week",
        }
      );

      if (error) {
        console.error(`Error updating schedule for ${day}:`, error);
        toast.error(`Failed to update schedule for ${day}`);
        return;
      }
    }

    toast.success(`Updated schedule for ${employee.name}`);
    await fetchEmployees();
  };

  const tableColumns = useMemo(
    () =>
      columns.map((col) => {
        if (col.id === "actions") {
          return {
            ...col,
            cell: ({ row }: { row: Row<Employee> }) => (
              <EmployeeTableRowActions
                row={row}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee}
                onUpdateSchedule={handleUpdateSchedule}
              />
            ),
          };
        }
        return col;
      }),
    [handleEditEmployee, handleDeleteEmployee, handleUpdateSchedule]
  );

  return (
    <RoleBasedWrapper allowedRoles={["super admin"]}>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold">Employees</h1>
          <Button variant="linkHover2" onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircledIcon className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
        {isLoading ? (
          <p>Loading employees...</p>
        ) : (
          <DataTable columns={tableColumns} data={employees} />
        )}
        <AddEmployeeDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={handleAddEmployee}
        />
      </div>
    </RoleBasedWrapper>
  );
}
