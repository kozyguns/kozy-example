"use client";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { FirearmsMaintenanceData, columns } from "./columns";
import { DataTable } from "./data-table";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import RoleBasedWrapper from "@/components/RoleBasedWrapper";
import { cycleFirearms } from "@/utils/cycleFirearms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentListId, setCurrentListId] = useState<string | null>(null);

  const [newFirearm, setNewFirearm] = useState({
    firearm_type: "handgun",
    firearm_name: "",
    last_maintenance_date: new Date().toISOString(),
    maintenance_frequency: 30,
    maintenance_notes: "",
    status: "New",
    assigned_to: null,
  });

  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 30; // Set a fixed page size

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

  const fetchFirearmsMaintenanceData = useCallback(
    async (role: string, forNewList: boolean = false) => {
      const { data, error } = await supabase
        .from("firearms_maintenance")
        .select("*")
        .order("last_maintenance_date", { ascending: true });

      if (error) {
        console.error("Error fetching initial data:", error.message);
        throw new Error(error.message);
      }

      if (forNewList || role === "gunsmith") {
        const handguns = data.filter(
          (item: FirearmsMaintenanceData) => item.firearm_type === "handgun"
        );
        const longGuns = data.filter(
          (item: FirearmsMaintenanceData) => item.firearm_type === "long gun"
        );

        // Sort firearms by maintenance_frequency and last_maintenance_date
        const sortFirearms = (firearms: FirearmsMaintenanceData[]) => {
          return firearms.sort((a, b) => {
            const aDueDate = new Date(a.last_maintenance_date);
            aDueDate.setDate(aDueDate.getDate() + a.maintenance_frequency);
            const bDueDate = new Date(b.last_maintenance_date);
            bDueDate.setDate(bDueDate.getDate() + b.maintenance_frequency);
            return aDueDate.getTime() - bDueDate.getTime();
          });
        };

        const sortedHandguns = sortFirearms(handguns);
        const sortedLongGuns = sortFirearms(longGuns);

        const cycledHandguns = cycleFirearms(sortedHandguns, 13);
        const cycledLongGuns = cycleFirearms(sortedLongGuns, 13);

        return [...cycledHandguns, ...cycledLongGuns];
      }

      return data;
    },
    []
  );

  const fetchPersistedData = useCallback(async () => {
    if (!userUuid) return null;

    const { data, error } = await supabase
      .from("persisted_firearms_list")
      .select("*")
      .eq("user_uuid", userUuid)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching persisted data:", error.message);
      return null;
    }

    return data?.firearms_list || null;
  }, [userUuid]);

  const persistData = useCallback(
    async (firearmsList: FirearmsMaintenanceData[]) => {
      if (!userUuid) {
        console.error("User UUID is not available");
        return;
      }

      const { error } = await supabase.from("persisted_firearms_list").upsert(
        {
          user_uuid: userUuid,
          firearms_list: firearmsList,
        },
        {
          onConflict: "user_uuid",
        }
      );

      if (error) {
        console.error("Error persisting data:", error.message);
      }
    },
    [userUuid]
  );

  const fetchData = useCallback(async () => {
    if (!userRole || !userUuid) return;

    setLoading(true);
    try {
      const persistedData: FirearmsMaintenanceData[] =
        await fetchPersistedData();
      let finalData: FirearmsMaintenanceData[];

      if (persistedData && persistedData.length > 0) {
        finalData = persistedData;
      } else {
        const fetchedData: FirearmsMaintenanceData[] =
          await fetchFirearmsMaintenanceData(userRole);
        finalData = fetchedData;
      }

      setData(finalData);
      await persistData(finalData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [
    fetchFirearmsMaintenanceData,
    fetchPersistedData,
    persistData,
    userRole,
    userUuid,
  ]);

  const fetchOrCreateCurrentList = useCallback(async () => {
    if (!userUuid) return;

    const { data: existingList, error: fetchError } = await supabase
      .from("maintenance_lists")
      .select("*")
      .eq("user_uuid", userUuid)
      .eq("is_completed", false)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching current list:", fetchError);
      return;
    }

    if (existingList) {
      // Fetch the most up-to-date data for each firearm in the list
      const updatedFirearms = await Promise.all(
        existingList.firearms.map(async (firearm: FirearmsMaintenanceData) => {
          const { data, error } = await supabase
            .from("firearms_maintenance")
            .select("*")
            .eq("id", firearm.id)
            .single();

          if (error) {
            console.error(`Error fetching firearm ${firearm.id}:`, error);
            return firearm;
          }

          return data || firearm;
        })
      );

      setData(updatedFirearms);
      setCurrentListId(existingList.id);
    } else {
      const newList = await generateNewMaintenanceList();
      if (newList) {
        const resetList = newList.map((firearm) => ({
          ...firearm,
          status: "No status",
        }));

        const { data: insertedList, error: insertError } = await supabase
          .from("maintenance_lists")
          .insert({
            user_uuid: userUuid,
            firearms: resetList,
            is_completed: false,
          })
          .select()
          .single();

        if (insertError) {
          console.error("Error creating new list:", insertError);
          return;
        }

        setData(resetList);
        setCurrentListId(insertedList.id);
      }
    }
    setLoading(false);
  }, [userUuid]);

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

  useEffect(() => {
    if (userUuid) {
      fetchOrCreateCurrentList();
    }
  }, [fetchOrCreateCurrentList, userUuid]);

  const persistCurrentList = useCallback(
    async (firearms: FirearmsMaintenanceData[]) => {
      if (!currentListId) return;

      const { error } = await supabase
        .from("maintenance_lists")
        .update({ firearms: firearms })
        .eq("id", currentListId);

      if (error) {
        console.error("Error persisting current list:", error);
        toast.error("Failed to save changes");
      }
    },
    [currentListId]
  );

  const handleStatusChange = useCallback(
    async (id: number, status: string | null) => {
      try {
        // Update the firearms_maintenance table
        const { error: updateError } = await supabase
          .from("firearms_maintenance")
          .update({ status: status || "" })
          .eq("id", id);

        if (updateError) throw updateError;

        // Update local state and maintenance_lists table
        setData((prevData) => {
          const updatedData = prevData.map((item) =>
            item.id === id ? { ...item, status: status || "" } : item
          );
          persistCurrentList(updatedData);
          return updatedData;
        });

        toast.success("Status updated successfully");
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Failed to update status");
      }
    },
    [persistCurrentList]
  );

  const handleNotesChange = useCallback(
    async (id: number, notes: string) => {
      const now = new Date();
      const currentDate = format(now, "yyyy-MM-dd'T'HH:mm:ss'Z'");

      try {
        const { error: updateError } = await supabase
          .from("firearms_maintenance")
          .update({
            maintenance_notes: notes,
            last_maintenance_date: currentDate,
          })
          .eq("id", id);

        if (updateError) throw updateError;

        setData((prevData) => {
          const updatedData = prevData.map((item) =>
            item.id === id
              ? {
                  ...item,
                  maintenance_notes: notes,
                  last_maintenance_date: currentDate,
                }
              : item
          );
          persistCurrentList(updatedData);
          return updatedData;
        });

        toast.success("Notes updated successfully");
      } catch (error) {
        console.error("Error updating notes:", error);
        toast.error("Failed to update notes");
      }
    },
    [persistCurrentList]
  );

  const handleUpdateFrequency = useCallback((id: number, frequency: number) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, maintenance_frequency: frequency } : item
      )
    );
  }, []);

  const handleDeleteFirearm = useCallback(async (id: number) => {
    try {
      const { error } = await supabase
        .from("firearms_maintenance")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setData((prevData) => prevData.filter((item) => item.id !== id));
      toast.success("Firearm deleted successfully");
    } catch (error) {
      console.error("Error deleting firearm:", error);
      toast.error("Failed to delete firearm");
    }
  }, []);

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
        await supabase
          .from("firearms_maintenance")
          .update({
            maintenance_notes: firearm.maintenance_notes,
            status: firearm.status,
            last_maintenance_date: firearm.last_maintenance_date,
          })
          .eq("id", firearm.id);
      }

      // Mark the current list as completed
      await supabase
        .from("maintenance_lists")
        .update({ is_completed: true })
        .eq("id", currentListId);

      // Generate a new list
      const newList = await generateNewMaintenanceList();
      if (newList) {
        const resetList = newList.map((firearm) => ({
          ...firearm,
          status: "No status",
        }));
        const { data: insertedList, error: insertError } = await supabase
          .from("maintenance_lists")
          .insert({
            user_uuid: userUuid,
            firearms: newList,
            is_completed: false,
          })
          .select()
          .single();

        if (insertError) {
          console.error("Error creating new list:", insertError);
          return;
        }

        setData(newList);
        setCurrentListId(insertedList.id);
      }

      toast.success("Maintenance list submitted successfully!");
    } catch (error) {
      console.error("Failed to submit maintenance list:", error);
      toast.error("Failed to submit maintenance list.");
    }
  }, [data, currentListId, userUuid]);

  useEffect(() => {
    fetchUserRoleAndUuid();
  }, [fetchUserRoleAndUuid]);

  useEffect(() => {
    if (userUuid) {
      fetchOrCreateCurrentList();
    }
  }, [fetchOrCreateCurrentList, userUuid]);

  useEffect(() => {
    const FirearmsMaintenanceTableSubscription = supabase
      .channel("custom-all-firearms-maintenance-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "firearms_maintenance" },
        (payload) => {
          setData((prevData) => {
            let updatedData = [...prevData];

            if (payload.eventType === "INSERT") {
              const exists = prevData.some(
                (item) => item.id === payload.new.id
              );
              if (!exists) {
                updatedData = [
                  payload.new as FirearmsMaintenanceData,
                  ...prevData,
                ];
              }
            } else if (payload.eventType === "UPDATE") {
              updatedData = prevData.map((item) =>
                item.id === payload.new.id
                  ? (payload.new as FirearmsMaintenanceData)
                  : item
              );
            } else if (payload.eventType === "DELETE") {
              updatedData = prevData.filter(
                (item) => item.id !== payload.old.id
              );
            }

            return updatedData;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(FirearmsMaintenanceTableSubscription);
    };
  }, []);

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
                          {["admin", "super admin"].includes(
                            userRole || ""
                          ) && (
                            <Button
                              variant="outline"
                              onClick={() => setIsDialogOpen(true)}
                            >
                              Add Firearm
                            </Button>
                          )}
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
                                pageIndex={pageIndex}
                                setPageIndex={setPageIndex}
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
