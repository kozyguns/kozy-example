"use client";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { FirearmsMaintenanceData, columns } from "./columns";
import { DataTable } from "./data-table";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import RoleBasedWrapper from "@/components/RoleBasedWrapper";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import AllFirearmsList from "./AllFirearmsList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import styles from "./profiles.module.css";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import classNames from "classnames";
import { format } from "date-fns-tz";

const words = "Gunsmithing Maintenance";

export default function GunsmithingMaintenance() {
  const [data, setData] = useState<FirearmsMaintenanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const [currentListId, setCurrentListId] = useState<string | null>(null);
  const [originalList, setOriginalList] = useState<FirearmsMaintenanceData[]>([]);


  const fetchUserRoleAndUuid = useCallback(async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Error fetching user:", userError.message);
      return;
    }

    const user = userData.user;
    setUserUuid(user?.id || "");

    try {
      const { data: roleData, error: roleError } = await supabase
        .from("employees")
        .select("role")
        .eq("user_uuid", user?.id)
        .single();

      if (roleError || !roleData) {
        console.error(
          "Error fetching role:",
          roleError?.message || "No role found"
        );
        return;
      }

      setUserRole(roleData.role);
    } catch (error) {
      console.error("Unexpected error fetching role:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserRoleAndUuid();
  }, [fetchUserRoleAndUuid]);

  const generateNewMaintenanceList = async () => {
    const { data: firearms, error } = await supabase
      .from("firearms_maintenance")
      .select("*")
      .order("last_maintenance_date", { ascending: true });

    if (error) {
      console.error("Error fetching firearms:", error);
      return null;
    }

    const handguns = firearms
      .filter((f) => f.firearm_type === "handgun")
      .slice(0, 13);
    const longGuns = firearms
      .filter((f) => f.firearm_type === "long gun")
      .slice(0, 13);
    return [...handguns, ...longGuns];
  };

  const fetchOrCreateCurrentList = useCallback(async () => {
    if (!userUuid) return;
  
    try {
      const { data: existingList, error: fetchError } = await supabase
        .from("maintenance_lists")
        .select("*")
        .eq("user_uuid", userUuid)
        .eq("is_completed", false)
        .single();
  
      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }
  
      if (existingList) {
        setData(existingList.firearms);
        setCurrentListId(existingList.id);
      } else {
        const newList = await generateNewMaintenanceList();
        if (newList) {
          const { data: insertedList, error: insertError } = await supabase
            .from("maintenance_lists")
            .insert({
              user_uuid: userUuid,
              firearms: newList,
              is_completed: false,
            })
            .select()
            .single();
  
          if (insertError) throw insertError;
  
          setData(newList);
          setCurrentListId(insertedList.id);
        }
      }
    } catch (error) {
      console.error("Error fetching or creating current list:", error);
      toast.error("Failed to load the maintenance list");
    } finally {
      setLoading(false);
    }
  }, [userUuid]);

  useEffect(() => {
    if (userUuid) {
      fetchOrCreateCurrentList();
    }
  }, [fetchOrCreateCurrentList, userUuid]);

  const persistCurrentList = useCallback(
    async (firearms: FirearmsMaintenanceData[]) => {
      if (!currentListId) return;
  
      try {
        const { error } = await supabase
          .from("maintenance_lists")
          .update({ firearms: firearms })
          .eq("id", currentListId);
  
        if (error) throw error;
      } catch (error) {
        console.error("Error persisting current list:", error);
        toast.error("Failed to save changes to the current list");
      }
    },
    [currentListId]
  );

  const handleStatusChange = useCallback(
    async (id: number, status: string | null) => {
      try {
        // Update local state
        const updatedData = data.map((item) =>
          item.id === id ? { ...item, status: status || "" } : item
        );
        setData(updatedData);
  
        // Update firearms_maintenance table
        const { error: updateError } = await supabase
          .from("firearms_maintenance")
          .update({ status: status || "" })
          .eq("id", id);
  
        if (updateError) throw updateError;
  
        // Update maintenance_lists table
        await persistCurrentList(updatedData);
  
        toast.success("Status updated successfully");
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Failed to update status");
      }
    },
    [data, persistCurrentList]
  );
  
  const handleNotesChange = useCallback(
    async (id: number, notes: string) => {
      const now = new Date();
      const currentDate = format(now, "yyyy-MM-dd'T'HH:mm:ss'Z'");
  
      try {
        // Update local state
        const updatedData = data.map((item) =>
          item.id === id
            ? {
                ...item,
                maintenance_notes: notes,
                last_maintenance_date: currentDate,
              }
            : item
        );
        setData(updatedData);
  
        // Update firearms_maintenance table
        const { error: updateError } = await supabase
          .from("firearms_maintenance")
          .update({
            maintenance_notes: notes,
            last_maintenance_date: currentDate,
          })
          .eq("id", id);
  
        if (updateError) throw updateError;
  
        // Update maintenance_lists table
        await persistCurrentList(updatedData);
  
        toast.success("Notes updated successfully");
      } catch (error) {
        console.error("Error updating notes:", error);
        toast.error("Failed to update notes");
      }
    },
    [data, persistCurrentList]
  );

  const handleUpdateFrequency = useCallback(
    async (id: number, frequency: number) => {
      try {
        // Update local state
        setData((prevData) => {
          const updatedData = prevData.map((item) =>
            item.id === id ? { ...item, maintenance_frequency: frequency } : item
          );
          return updatedData;
        });
  
        // Update maintenance_lists table
        await persistCurrentList(data);
  
        // Update firearms_maintenance table
        const { error } = await supabase
          .from("firearms_maintenance")
          .update({ maintenance_frequency: frequency })
          .eq("id", id);
  
        if (error) throw error;
  
        toast.success("Frequency updated successfully");
      } catch (error) {
        console.error("Error updating frequency:", error);
        toast.error("Failed to update frequency");
      }
    },
    [data, persistCurrentList]
  );

  const handleDeleteFirearm = useCallback(
    async (id: number) => {
      try {
        const { error } = await supabase
          .from("firearms_maintenance")
          .delete()
          .eq("id", id);

        if (error) throw error;

        setData((prevData) => {
          const updatedData = prevData.filter((item) => item.id !== id);
          persistCurrentList(updatedData);
          return updatedData;
        });

        toast.success("Firearm deleted successfully");
      } catch (error) {
        console.error("Error deleting firearm:", error);
        toast.error("Failed to delete firearm");
      }
    },
    [persistCurrentList]
  );

  const regenerateFirearmsList = useCallback(async () => {
    try {
      const newList = await generateNewMaintenanceList();
      if (newList) {
        setData(newList);
        await supabase
          .from("maintenance_lists")
          .update({ firearms: newList })
          .eq("id", currentListId);
        toast.success("Firearms list regenerated successfully!");
      }
    } catch (error) {
      console.error("Failed to regenerate firearms list:", error);
      toast.error("Failed to regenerate firearms list.");
    }
  }, [currentListId]);

  const handleSubmit = useCallback(async () => {
    const incompleteFirearms = data.filter(
      (firearm) => !firearm.maintenance_notes || !firearm.status
    );
  
    if (incompleteFirearms.length > 0) {
      toast.error(
        "Please ensure all firearms have detailed notes and a status before submitting."
      );
      return;
    }
  
    try {
      // Update the firearms_maintenance table
      for (const firearm of data) {
        const { error } = await supabase
          .from("firearms_maintenance")
          .update({
            maintenance_notes: firearm.maintenance_notes,
            status: firearm.status,
            last_maintenance_date: firearm.last_maintenance_date,
          })
          .eq("id", firearm.id);
  
        if (error) throw error;
      }
  
      // Mark the current list as completed
      await supabase
        .from("maintenance_lists")
        .update({ is_completed: true })
        .eq("id", currentListId);
  
      // Generate a new list
      const newList = await generateNewMaintenanceList();
      if (newList) {
        const { data: insertedList, error: insertError } = await supabase
          .from("maintenance_lists")
          .insert({
            user_uuid: userUuid,
            firearms: newList,
            is_completed: false,
          })
          .select()
          .single();
  
        if (insertError) throw insertError;
  
        setOriginalList(newList);
        setData(newList);
        setCurrentListId(insertedList.id);
      }
  
      toast.success("Maintenance list submitted successfully!");
    } catch (error) {
      console.error("Failed to submit maintenance list:", error);
      toast.error("Failed to submit maintenance list.");
    }
  }, [data, currentListId, userUuid]);

  return (
    <RoleBasedWrapper allowedRoles={["gunsmith", "admin", "super admin"]}>
      <Toaster position="top-right" />
      <div className="flex flex-col h-screen my-8">
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs defaultValue="maintenance" className="flex-1 flex flex-col">
            <div className="container justify-start px-4 mt-4">
              <TabsList>
                <TabsTrigger value="maintenance">
                  Weekly Maintenance
                </TabsTrigger>
                <TabsTrigger value="repairs">Firearms Repairs</TabsTrigger>
              </TabsList>
            </div>

            <div
              className={classNames(
                "grid flex-1 items-start mt-4 max-w-8xl gap-4 p-2 sm:px-6 sm:py-0 md:gap-8 body",
                styles.noScroll
              )}
            >
              <ScrollArea className="h-[calc(100vh-300px)] overflow-auto">
                <div className="container px-4 mt-4">
                  <TabsContent value="maintenance" className="mt-0">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                          <TextGenerateEffect words={words} />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between p-4">
                          <Button
                            variant="outline"
                            onClick={regenerateFirearmsList}
                          >
                            Regenerate Firearms List
                          </Button>
                        </div>
                        <div className="border rounded-md">
                          {loading ? (
                            <p>Loading...</p>
                          ) : (
                            userRole &&
                            userUuid && (
                              <DataTable
                                columns={columns}
                                data={data}
                                userRole={userRole}
                                userUuid={userUuid}
                                onStatusChange={handleStatusChange}
                                onNotesChange={handleNotesChange}
                                onUpdateFrequency={handleUpdateFrequency}
                                onDeleteFirearm={handleDeleteFirearm}
                                pageIndex={0}
                                setPageIndex={() => {}}
                              />
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="repairs" className="mt-0">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-2xl font-bold">
                            <TextGenerateEffect words="Repairs" />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <AllFirearmsList userRole={userRole} />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </div>
                <ScrollBar orientation="vertical" />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <div className="container justify-start p-2">
                <Button
                  variant="ringHover"
                  onClick={handleSubmit}
                  className="max-w-lg"
                >
                  Submit Maintenance List
                </Button>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </RoleBasedWrapper>
  );
}