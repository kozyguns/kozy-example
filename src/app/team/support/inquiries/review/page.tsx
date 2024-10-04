"use client";
import { Suspense, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { SupportRequest, columns } from "./columns";
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
import { toast } from "sonner";
import { useRole } from "@/context/RoleContext";
import { statuses } from "./data";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const title = "Review Support Inquiries";

export default function SupportInquiriesReviewPage() {
  const { user } = useRole();
  const queryClient = useQueryClient();

  const { data: supportRequests, isLoading } = useQuery({
    queryKey: ["supportRequests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SupportRequest[];
    },
  });

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
        const errorData = await response.text();
        throw new Error(
          `Failed to send email: ${response.status} ${response.statusText}. ${errorData}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  };

  const setStatus = async (requestId: string, status: string) => {
    const request = supportRequests?.find((r) => r.id === requestId);
    if (request) {
      try {
        const { error } = await supabase
          .from("support_requests")
          .update({ status })
          .eq("id", requestId);

        if (error) throw error;

        // Invalidate and refetch the query
        queryClient.invalidateQueries({ queryKey: ["supportRequests"] });

        const statusLabel =
          statuses.find((s) => s.value === status)?.label || status;

        // Send email to the employee
        try {
          await sendEmail("SupportRequestStatusUpdate", {
            recipientEmail: request.employee_email,
            subject: `Support Request Status Updated`,
            id: request.id,
            name: request.name,
            newStatus: statusLabel,
            category: request.category,
            inquiryType: request.inquiry_type,
            updatedBy: user?.name,
          });
          toast.success(
            "Support request status updated and email sent to employee."
          );
        } catch (emailError) {
          console.error("Failed to send email:", emailError);
          toast.error(
            "Support request status updated, but failed to send email notification."
          );
        }
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Failed to update status.");
      }
    } else {
      console.error("Request not found:", requestId);
      toast.error("Failed to update status: Request not found.");
    }
  };

  const table = useReactTable({
    data: supportRequests || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      setStatus,
    },
  });

  useEffect(() => {
    const SupportRequestsTableSubscription = supabase
      .channel("custom-all-support-requests-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "support_requests" },
        () => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: ["supportRequests"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(SupportRequestsTableSubscription);
    };
  }, [queryClient]);

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
            <div className="rounded-md border flex-1 flex flex-col">
              <div className="relative w-full h-full overflow-auto flex-1">
                <div className="flex p-2">
                  <SupportRequestTableToolbar table={table} />
                </div>
                <div className="flex-1 flex flex-col">
                  <Suspense fallback={<p>Loading...</p>}>
                    {isLoading ? (
                      <p>Loading...</p>
                    ) : (
                      <DataTable table={table} />
                    )}
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
