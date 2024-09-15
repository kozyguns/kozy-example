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

const words = "Gunsmithing Maintenance";

export default function GunsmithingMaintenance() {
  const [data, setData] = useState<FirearmsMaintenanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const fetchFirearmsMaintenanceData = useCallback(async (role: string, forNewList: boolean = false) => {
    const { data, error } = await supabase
      .from("firearms_maintenance")
      .select("*")
      .order("last_maintenance_date", { ascending: true });
  
    if (error) {
      console.error("Error fetching initial data:", error.message);
      throw new Error(error.message);
    }
  
    if (forNewList || role === "gunsmith") {
      const handguns = data.filter((item: FirearmsMaintenanceData) => item.firearm_type === "handgun");
      const longGuns = data.filter((item: FirearmsMaintenanceData) => item.firearm_type === "long gun");
  
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
  }, []);

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

  const persistData = useCallback(async (firearmsList: FirearmsMaintenanceData[]) => {
    if (!userUuid) {
      console.error("User UUID is not available");
      return;
    }

    const { error } = await supabase
      .from("persisted_firearms_list")
      .upsert({ 
        user_uuid: userUuid,
        firearms_list: firearmsList
      });

    if (error) {
      console.error("Error persisting data:", error.message);
    }
  }, [userUuid]);

  const fetchData = useCallback(async () => {
    if (!userRole || !userUuid) return;

    setLoading(true);
    try {
      const persistedData: FirearmsMaintenanceData[] = await fetchPersistedData();
      const fetchedData: FirearmsMaintenanceData[] = await fetchFirearmsMaintenanceData(userRole);
    
      let finalData;
      if (persistedData && persistedData.length > 0) {
        // Use persisted data, preserving status and notes
        const persistedMap = new Map(persistedData.map(item => [item.id, item]));
        finalData = fetchedData.map(item => {
          const persistedItem = persistedMap.get(item.id);
          return persistedItem ? { ...item, ...persistedItem } : item;
        });
      } else {
        // If no persisted data, use fetched data as is
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
  }, [fetchFirearmsMaintenanceData, fetchPersistedData, persistData, userRole, userUuid]);


  const handleStatusChange = useCallback(async (id: number, status: string | null) => {
    setData((prevData) => {
      const updatedData = prevData.map((item) =>
        item.id === id ? { ...item, status: status || "" } : item
      );
      persistData(updatedData);
      return updatedData;
    });
  }, [persistData]);

const handleNotesChange = useCallback(async (id: number, notes: string) => {
  const currentDate = new Date().toISOString();
  setData((prevData) => {
    const updatedData = prevData.map((item) =>
      item.id === id 
        ? { 
            ...item, 
            maintenance_notes: notes,
            last_maintenance_date: currentDate 
          } 
        : item
    );
    persistData(updatedData);
    return updatedData;
  });

  // Update the database
  try {
    const { error } = await supabase
      .from("firearms_maintenance")
      .update({ 
        maintenance_notes: notes,
        last_maintenance_date: currentDate
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating notes and date in database:", error);
      toast.error("Failed to update notes and date in database");
    }
  } catch (error) {
    console.error("Error updating notes and date:", error);
    toast.error("Failed to update notes and date");
  }
}, [persistData]);

  useEffect(() => {
    fetchUserRoleAndUuid();
  }, [fetchUserRoleAndUuid]);

  useEffect(() => {
    if (userRole && userUuid) {
      fetchData();
    }
  }, [fetchData, userRole, userUuid]);
  


  const handleUpdateFrequency = (id: number, frequency: number) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, maintenance_frequency: frequency } : item
      )
    );
  };

  const handleAddFirearm = async () => {
    try {
      const { data: newFirearmData, error } = await supabase
        .from("firearms_maintenance")
        .insert([newFirearm])
        .select("*");

      if (error) {
        throw error;
      }

      if (newFirearmData && newFirearmData.length > 0) {
        setData((prevData) => {
          const updatedData = [...prevData, newFirearmData[0]];
          persistData(updatedData);

          // Calculate the new page index based on the total number of items
          const newPageIndex = Math.floor(updatedData.length / pageSize);

          // Update the pagination state
          setPageIndex(newPageIndex);

          return updatedData;
        });
      } else {
        throw new Error("No data returned from insert operation");
      }

      // Close the dialog after adding the firearm
      setIsDialogOpen(false);
      setNewFirearm({
        firearm_type: "handgun",
        firearm_name: "",
        last_maintenance_date: new Date().toISOString(),
        maintenance_frequency: 30,
        maintenance_notes: "",
        status: "New",
        assigned_to: null,
      });
    } catch (error) {
      console.error("Error adding firearm:", error);
    }
  };

  const handleFirearmInputChange = (e: {
    target: { name: any; value: any };
  }) => {
    const { name, value } = e.target;
    setNewFirearm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteFirearm = async (id: number) => {
    try {
      const { error } = await supabase
        .from("firearms_maintenance")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
      await persistData(updatedData);
    } catch (error) {
      console.error("Error deleting firearm:", error);
    }
  };

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

            persistData(updatedData);
            return updatedData;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(FirearmsMaintenanceTableSubscription);
    };
  }, [persistData, userUuid]);

  const handleSubmit = async () => {
    console.log("Starting submission process");
    console.log("Current data:", data);
  
    const incompleteFirearms = data.filter(
      (firearm) => !firearm.maintenance_notes || !firearm.status
    );
  
    if (incompleteFirearms.length > 0) {
      console.log("Incomplete firearms found:", incompleteFirearms);
      alert("Please ensure all firearms have detailed notes and a status before submitting.");
      return;
    }
  
    try {
      console.log("Updating firearms in the database");
      // Update the maintenance notes, status, and last maintenance date in the database
      for (const firearm of data) {
        await supabase
          .from("firearms_maintenance")
          .update({
            maintenance_notes: firearm.maintenance_notes,
            status: firearm.status,
            last_maintenance_date: new Date().toISOString(),
          })
          .eq("id", firearm.id);
      }
  
      console.log("Generating new list");
      // Generate the new list based on maintenance frequency
      const newData = await fetchFirearmsMaintenanceData(userRole || "", true);
      console.log("New data fetched:", newData);
  
      const resetData = newData.map((item: FirearmsMaintenanceData) => ({
        ...item,
        status: "",
        maintenance_notes: item.maintenance_notes || "",
      }));
      console.log("Reset data:", resetData);
  
      // Update the state and persist the new list
      setData(resetData);
      await persistData(resetData);
  
      console.log("Clearing persisted data");
      // Clear persisted data after successful submission
      await clearPersistedData();
  
      console.log("Submission process completed successfully");
      toast.success("Maintenance list submitted successfully!");
    } catch (error) {
      console.error("Failed to submit maintenance list:", error);
      toast.error("Failed to submit maintenance list.");
    }
  };

  const clearPersistedData = useCallback(async () => {
    if (!userUuid) return;
  
    const { error } = await supabase
      .from("persisted_firearms_list")
      .delete()
      .eq("user_uuid", userUuid);
  
    if (error) {
      console.error("Error clearing persisted data:", error.message);
    }
  }, [userUuid]);

  const regenerateFirearmsList = async () => {
    try {
      const response = await fetch("/api/firearms-maintenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "generateNewList", data: { userUuid } }),
      });

      if (!response.ok) {
        throw new Error("Failed to regenerate firearms list");
      }

      const { firearms } = await response.json();
      setData(firearms);

      // Persist the new list
      await persistData(firearms);

      toast.success("Firearms list regenerated successfully!");
    } catch (error) {
      console.error("Failed to regenerate firearms list:", error);
      toast.error("Failed to regenerate firearms list.");
    }
  };

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
