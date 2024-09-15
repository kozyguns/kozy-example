"use client";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { SupportRequest, createColumns } from "./columns";
import { DataTable } from "./data-table";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { SupportRequestTableToolbar } from "./support-request-table-toolbar";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import RoleBasedWrapper from "@/components/RoleBasedWrapper";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { toast } from "sonner";
import { useRole } from "@/context/RoleContext";
import { statuses } from "./data";

const title = "Review Support Inquiries";

export default function SupportInquiriesReviewPage() {
  const [data, setData] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string[]>(["pending", "in_progress", "resolved", "closed"]); // Default filter
  const { user } = useRole();

  const fetchSupportRequestData = useCallback(async () => {
    const { data, error } = await supabase
      .from("support_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching initial data:", error.message);
      throw new Error(error.message);
    }
    return data as SupportRequest[];
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedData = await fetchSupportRequestData();
      setData(fetchedData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setLoading(false);
    }
  }, [fetchSupportRequestData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = useMemo(() => {
    return data.filter((request) => statusFilter.includes(request.status));
  }, [data, statusFilter]);

  const sendEmail = async (templateName: string, templateData: any) => {
    try {
      const response = await fetch("/api/send_email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: templateData.recipientEmail,
          subject: templateData.subject,
          templateName: templateName,
          templateData: templateData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  };

  const setStatus = async (requestId: string, status: string) => {
    console.log('Attempting to update status:', requestId, status);
    const request = data.find((r) => r.id === requestId);
    if (request) {
      try {
        const { error } = await supabase
          .from("support_requests")
          .update({ status })
          .eq("id", requestId);
  
        if (error) throw error;
  
        console.log('Status updated successfully in database');
  
        setData((currentData) =>
          currentData.map((r) =>
            r.id === requestId ? { ...r, status } : r
          )
        );

        // Reset table state
  table.resetRowSelection();
  table.resetColumnFilters();
  table.resetGlobalFilter();
  
        console.log('Local data updated');
  
        const statusLabel =
          statuses.find((s) => s.value === status)?.label || status;
  
        // Send email to the employee
        await sendEmail("SupportRequestStatusUpdate", {
          recipientEmail: request.employee_email,
          subject: `Support Request Status Updated`,
          id: request.id,
          employeeName: request.name,
          newStatus: statusLabel,
          category: request.category,
          inquiryType: request.inquiry_type,
        });
  
        console.log('Email sent');
  
        toast.success("Support request status updated and email sent to employee.");
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Failed to update status and send email notification.");
      }
    } else {
      console.error('Request not found:', requestId);
    }
  };

  const columns = createColumns(setStatus);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      setStatus, // Add this line
    },
  });

  useEffect(() => {
    const SupportRequestsTableSubscription = supabase
      .channel("custom-all-support-requests-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "support_requests" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setData((currentData) => [payload.new as SupportRequest, ...currentData]);
          } else if (payload.eventType === "UPDATE") {
            setData((currentData) =>
              currentData.map((request) =>
                request.id === payload.new.id ? (payload.new as SupportRequest) : request
              )
            );
          } else if (payload.eventType === "DELETE") {
            setData((currentData) =>
              currentData.filter((request) => request.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(SupportRequestsTableSubscription);
    };
  }, [fetchData]);

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in_progress" },
    { label: "Resolved", value: "resolved" },
    { label: "Closed", value: "closed" },
  ];

  return (
    <RoleBasedWrapper allowedRoles={["admin", "super admin"]}>
      <div className="h-screen flex flex-col">
        <section className="flex-1 flex flex-col space-y-4 p-4">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold">
                <TextGenerateEffect words={title} />
              </h2>
            </div>
          </div>
          <div className="flex-1 flex flex-col space-y-4">
            {/* <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={statusOptions}
              table={table}
            /> */}
            <div className="rounded-md border flex-1 flex flex-col">
              <div className="relative w-full h-full overflow-auto flex-1">
                <div className="flex p-2">
              <SupportRequestTableToolbar table={table} />
              </div>
              <div className="flex-1 flex flex-col">
                <Suspense fallback={<p>Loading...</p>}>
                <DataTable table={table} />
                </Suspense>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </RoleBasedWrapper>
  );
}