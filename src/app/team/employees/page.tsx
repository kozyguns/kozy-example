"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { Employee } from "./types";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { EmployeeTableRowActions } from "./employee-table-row-actions";
import { toast } from "sonner";
import { Row } from "@tanstack/react-table";
import RoleBasedWrapper from "@/components/RoleBasedWrapper";
import { EditEmployeeDialog } from "./PopoverForm";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";

interface WeeklySchedule {
  [day: string]: { start_time: string | null; end_time: string | null };
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showTerminated, setShowTerminated] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("employees")
        .select("*")
        .order("name");
      
      if (!showTerminated) {
        // Only fetch active employees if showTerminated is false
        query = query.neq('status', 'terminated');
      }
  
      const { data, error } = await query;
  
      if (error) {
        throw error;
      }
  
      if (data) {
        setEmployees(data as Employee[]);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update the useEffect to depend on showTerminated
  useEffect(() => {
    fetchEmployees();
  }, [showTerminated]);

  const handleAddEmployee = async (
    newEmployee: Omit<Employee, "employee_id">
  ) => {
    try {
      const { data, error } = await supabase
        .from("employees")
        .insert([newEmployee])
        .select();

      if (error) throw error;

      setEmployees((prevEmployees) => [...prevEmployees, data[0] as Employee]);
      toast.success("Employee added successfully");
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Failed to add employee");
    } finally {
      setIsDialogOpen(false);
      setSelectedEmployee(null);
    }
  };

  const handleEditEmployee = useCallback(async (updatedEmployee: Employee) => {
    const { error } = await supabase
      .from("employees")
      .update(updatedEmployee)
      .eq("employee_id", updatedEmployee.employee_id);

    if (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee");
    } else {
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.employee_id === updatedEmployee.employee_id
            ? updatedEmployee
            : emp
        )
      );
      toast.success("Employee updated successfully");
      setIsDialogOpen(false);  // Close the dialog
      setSelectedEmployee(null);  // Reset selected employee
    }
  }, []);

  const handleTermEmployee = async (employeeId: number, termDate: string) => {
    try {
      // Update the employee record
      const { error: updateError } = await supabase
        .from("employees")
        .update({ term_date: termDate, status: "terminated" })
        .eq("employee_id", employeeId);

      if (updateError) throw updateError;

      // Delete records from reference_schedules
      const { error: deleteRefError } = await supabase
        .from("reference_schedules")
        .delete()
        .eq("employee_id", employeeId);

      if (deleteRefError) throw deleteRefError;

      // Delete future schedules
      const { error: deleteSchedError } = await supabase
        .from("schedules")
        .delete()
        .eq("employee_id", employeeId)
        .gte("schedule_date", termDate);

      if (deleteSchedError) throw deleteSchedError;

      toast.success("Employee terminated successfully");
      await fetchEmployees(); // Refresh the employee list
    } catch (error) {
      console.error("Error terminating employee:", error);
      toast.error("Failed to terminate employee");
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

  const handleUpdateSchedule = useCallback(
    async (employeeId: number, schedules: WeeklySchedule) => {
      const employee = employees.find((emp) => emp.employee_id === employeeId);
      if (!employee) {
        console.error("Employee not found");
        return;
      }

      const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      for (const day of daysOfWeek) {
        const times = schedules[day] || { start_time: null, end_time: null };

        const { data: existingRecord, error: selectError } = await supabase
          .from("reference_schedules")
          .select("*")
          .eq("employee_id", employeeId)
          .eq("day_of_week", day)
          .single();

        if (selectError && selectError.code !== "PGRST116") {
          console.error(
            `Error checking existing record for ${day}:`,
            selectError
          );
          toast.error(
            `Failed to check existing record for ${day}: ${selectError.message}`
          );
          return;
        }

        let error;
        if (existingRecord) {
          const { error: updateError } = await supabase
            .from("reference_schedules")
            .update({
              start_time: times.start_time,
              end_time: times.end_time,
              name: employee.name,
            })
            .eq("id", existingRecord.id);
          error = updateError;
        } else {
          const { error: insertError } = await supabase
            .from("reference_schedules")
            .insert({
              employee_id: employeeId,
              day_of_week: day,
              start_time: times.start_time,
              end_time: times.end_time,
              name: employee.name,
            });
          error = insertError;
        }

        if (error) {
          console.error(`Error updating/inserting schedule for ${day}:`, error);
          toast.error(`Failed to update schedule for ${day}: ${error.message}`);
          return;
        }
      }

      toast.success(`Updated schedule for ${employee.name}`);
    },
    [employees]
  );

  const handleOpenDialog = useCallback((employee: Employee | null) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedEmployee(null);
  }, []);

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
                onTerm={handleTermEmployee}
              />
            ),
          };
        }
        return col;
      }),
    [
      handleEditEmployee,
      handleDeleteEmployee,
      handleUpdateSchedule,
      handleTermEmployee,
    ]
  );

  return (
    <RoleBasedWrapper allowedRoles={["super admin"]}>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold">Employees</h1>
          <Button variant="linkHover2" onClick={() => handleOpenDialog(null)}>
            <PlusCircledIcon className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
          <Label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showTerminated}
                onChange={(e) => setShowTerminated(e.target.checked)}
              />
              <span>Show Terminated Employees</span>
            </Label>
        </div>
        {isLoading ? (
          <p>Loading employees...</p>
        ) : (
          <DataTable columns={tableColumns} data={employees} />
        )}
      <EditEmployeeDialog
        employee={selectedEmployee || ({} as Employee)}
        onSave={selectedEmployee ? handleEditEmployee : handleAddEmployee}
        isOpen={isDialogOpen}  // Use isDialogOpen instead of !!selectedEmployee
        onClose={handleCloseDialog}
      />
      </div>
    </RoleBasedWrapper>
  );
}
