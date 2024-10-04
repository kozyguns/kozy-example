"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { Cross2Icon } from "@radix-ui/react-icons";
import { TracingBeam } from "./ui/tracing-beam";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase/client";
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Project = {
  project_id: number;
  name: string;
  last_name: string;
  status: string;
  user_uuid: string;
  estimated_start_date: string;
  actual_start_date: string;
  estimated_hours: number;
  actual_hours: number;
};

type TeamMember = {
  assignment_id?: number;
  project_id: number;
  employee_id: number | null;
  role: string;
  pay_rate: string | null;
  employee_name: string | null;
  isNew?: boolean;
  isDeleted?: boolean;
};

const sub = "View & Manage All Of Your Projects";

const LandingPageCustomer: React.FC = React.memo(() => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editedProject, setEditedProject] = useState<Partial<Project> | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const queryClient = useQueryClient();
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [localTeamMembers, setLocalTeamMembers] = useState<TeamMember[]>([]);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
  const [projectToRename, setProjectToRename] = useState<Project | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      //console.log("Current user:", user);
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      setEditedProject(selectedProject);
    }
  }, [selectedProject]);

  // Fetch projects
  const { data: projects, isLoading: isLoadingProjects } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  // Fetch status options
  const { data: statusOptions } = useQuery<string[]>({
    queryKey: ['statusOptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_status_options')
        .select('status_name');
      if (error) throw error;
      return data.map(option => option.status_name);
    },
  });

  // Fetch team members for a specific project
  const { data: teamMembers, isLoading: isLoadingTeamMembers } = useQuery<TeamMember[]>({
    queryKey: ['teamMembers', selectedProject?.project_id],
    queryFn: async () => {
      if (!selectedProject) return [];
      const { data, error } = await supabase
        .from('project_team_assignments')
        .select(`
          assignment_id,
          project_id,
          employee_id,
          role,
          pay_rate,
          employees (name, last_name)
        `)
        .eq('project_id', selectedProject.project_id);
      if (error) throw error;
      return data.map(item => ({
        ...item,
        employee_name: item.employees && item.employees[0] 
          ? `${item.employees[0].name || ''} ${item.employees[0].last_name || ''}`.trim()
          : '',
        pay_rate: item.pay_rate?.toString() || ''
      }));
    },
    enabled: !!selectedProject,
  });

  // Update localTeamMembers when teamMembers changes
  useEffect(() => {
    if (teamMembers) {
      setLocalTeamMembers(teamMembers);
    }
  }, [teamMembers]);

  // Fetch all active employees
  const { data: employees } = useQuery<{ employee_id: number; name: string; last_name: string }[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('employee_id, name, last_name')
        .eq('status', 'active');
      if (error) throw error;
      return data;
    },
  });

  // Fetch role options
  const { data: roleOptions } = useQuery<string[]>({
    queryKey: ['roleOptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_role_options')
        .select('role_name');
      if (error) throw error;
      //console.log('Fetched role options:', data);
      return data.map(option => option.role_name);
    },
  });

  // Add project mutation
  const addProjectMutation = useMutation({
    mutationFn: async (newProject: { name: string, status: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      //console.log("Attempting to insert project for user:", user.id);

      const { data, error } = await supabase
        .from('projects')
        .insert([{
          name: newProject.name,
          status: newProject.status,
          user_uuid: user.id
        }])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      //console.log("Inserted project:", data);
      return data[0];
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setNewProjectName("");
    },
  });

  // Update project status mutation
  const updateProjectStatusMutation = useMutation({
    mutationFn: async ({ projectId, newStatus }: { projectId: number, newStatus: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('project_id', projectId)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: number) => {
      // Start a transaction
      const { error: transactionError } = await supabase.rpc('delete_project_and_assignments', {
        p_project_id: projectId
      });

      if (transactionError) {
        console.error('Error in delete transaction:', transactionError);
        throw transactionError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    },
  });

  // Rename project mutation
  const renameProjectMutation = useMutation({
    mutationFn: async ({ projectId, newName }: { projectId: number, newName: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .update({ name: newName })
        .eq('project_id', projectId)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  // Update project details mutation
  const updateProjectDetailsMutation = useMutation({
    mutationFn: async (updatedProject: Partial<Project>) => {
      //console.log("Updating project:", updatedProject);
      const { data, error } = await supabase
        .from('projects')
        .update(updatedProject)
        .eq('project_id', updatedProject.project_id)
        .select();
      if (error) {
        console.error("Error updating project:", error);
        throw error;
      }
      //console.log("Update response:", data);
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project details updated successfully');
    },
    onError: (error) => {
      console.error('Error updating project:', error);
      toast.error('Failed to update project details');
    },
  });

  // Update team assignment mutation
  const updateTeamAssignmentMutation = useMutation({
    mutationFn: async (assignment: Partial<TeamMember>) => {
      if (assignment.assignment_id && assignment.assignment_id > 0) {
        // Update existing assignment
        const { data, error } = await supabase
          .from('project_team_assignments')
          .update(assignment)
          .eq('assignment_id', assignment.assignment_id)
          .select();
        if (error) throw error;
        return data[0];
      } else {
        // Insert new assignment
        const { assignment_id, ...newAssignment } = assignment;
        const { data, error } = await supabase
          .from('project_team_assignments')
          .insert(newAssignment)
          .select();
        if (error) throw error;
        return data[0];
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers', selectedProject?.project_id] });
      toast.success('Team assignment updated successfully');
    },
    onError: (error) => {
      console.error('Error updating team assignment:', error);
      toast.error('Failed to update team assignment');
    },
  });

  const addProject = () => {
    if (newProjectName.trim() !== "") {
      addProjectMutation.mutate({ name: newProjectName, status: "To Bid" });
      setNewProjectName(""); // Clear the input
      setIsAddProjectDialogOpen(false); // Close the dialog
    }
  };

  const updateProjectStatus = (projectId: number, newStatus: string) => {
    updateProjectStatusMutation.mutate({ projectId, newStatus });
  };

  const deleteProject = (projectId: number) => {
    setProjectToDelete(projectId);
  };

  const confirmDeleteProject = () => {
    if (projectToDelete !== null) {
      deleteProjectMutation.mutate(projectToDelete);
      setProjectToDelete(null);
    }
  };

  const renameProject = (projectId: number, newName: string) => {
    renameProjectMutation.mutate({ projectId, newName });
  };

  const saveProjectDetails = () => {
    if (editedProject) {
      //console.log("Saving project details:", editedProject);
      updateProjectDetailsMutation.mutate(editedProject);
    } else {
      // console.log("No changes to save");
    }
  };

  const handleEmployeeChange = (index: number, employeeId: number | null, fullName: string) => {
    setLocalTeamMembers(prev => prev.map((member, i) => 
      i === index ? { ...member, employee_id: employeeId, employee_name: fullName } : member
    ));
  };
  
  const handleRoleChange = (index: number, role: string) => {
    setLocalTeamMembers(prev => prev.map((member, i) => 
      i === index ? { ...member, role } : member
    ));
  };
  
  const handlePayRateChange = (index: number, payRate: string) => {
    setLocalTeamMembers(prev => prev.map((member, i) => 
      i === index ? { ...member, pay_rate: payRate } : member
    ));
  };
  
  const handleRemoveTeamMember = (index: number) => {
    const memberToRemove = localTeamMembers[index];
    if (memberToRemove.assignment_id) {
      // If the member has an assignment_id, mark it for deletion
      setLocalTeamMembers(prev => prev.map((member, i) => 
        i === index ? { ...member, isDeleted: true } : member
      ));
    } else {
      // If it's a new member (no assignment_id), just remove it from the local state
      setLocalTeamMembers(prev => prev.filter((_, i) => i !== index));
    }
  };

  const saveTeamAssignments = async () => {
    try {
      const deletions = localTeamMembers.filter(member => member.isDeleted && member.assignment_id);
      const updates = localTeamMembers.filter(member => !member.isDeleted && member.assignment_id);
      const additions = localTeamMembers.filter(member => !member.isDeleted && !member.assignment_id);
  
      // Delete members marked for deletion
      await Promise.all(deletions.map(async (member) => {
        const { error } = await supabase
          .from('project_team_assignments')
          .delete()
          .eq('assignment_id', member.assignment_id);
        if (error) throw error;
      }));
  
      // Update existing members
      await Promise.all(updates.map(async (member) => {
        const { error } = await supabase
          .from('project_team_assignments')
          .update({
            employee_id: member.employee_id,
            role: member.role,
            pay_rate: member.pay_rate ? parseFloat(member.pay_rate) : null,
            employee_name: member.employee_name || null
          })
          .eq('assignment_id', member.assignment_id);
        if (error) throw error;
      }));
  
      // Add new members
      if (additions.length > 0) {
        const { error } = await supabase
          .from('project_team_assignments')
          .insert(additions.map(member => ({
            project_id: member.project_id,
            employee_id: member.employee_id,
            role: member.role,
            pay_rate: member.pay_rate ? parseFloat(member.pay_rate) : null,
            employee_name: member.employee_name || null
          })));
        if (error) throw error;
      }
  
      toast.success('Team assignments saved successfully');
      queryClient.invalidateQueries({ queryKey: ['teamMembers', selectedProject?.project_id] });
      
      // Refresh local state to remove deleted members
      setLocalTeamMembers(prev => prev.filter(member => !member.isDeleted));
    } catch (error) {
      console.error('Error saving team assignments:', error);
      toast.error('Failed to save team assignments');
    }
  };

  useEffect(() => {
    //console.log('localTeamMembers updated:', localTeamMembers);
  }, [localTeamMembers]);

  const deleteTeamMemberMutation = useMutation({
    mutationFn: async (assignmentId: number) => {
      const { error } = await supabase
        .from('project_team_assignments')
        .delete()
        .eq('assignment_id', assignmentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers', selectedProject?.project_id] });
    },
    onError: (error) => {
      console.error('Error deleting team member:', error);
      toast.error('Failed to delete team member');
    },
  });

  const addTeamMemberMutation = useMutation({
    mutationFn: async (newMember: Omit<TeamMember, 'assignment_id'>) => {
      const { data, error } = await supabase
        .from('project_team_assignments')
        .insert(newMember)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers', selectedProject?.project_id] });
    },
    onError: (error) => {
      console.error('Error adding team member:', error);
      toast.error('Failed to add team member');
    },
  });

  if (isLoadingProjects) {
    return <div>Loading projects...</div>;
  }

  return (
    <div className="flex flex-col min-h-[100vh]">
      <main className="flex-1">
        <TracingBeam className="w-full py-12 md:py-24 lg:py-32 border-y">
          <div className="flex items-start justify-start">
            <div className="w-full mx-auto max-w-xl mb-4">
              <Image
                src="/AHReady.png"
                alt="Banner"
                layout="responsive"
                width={1000}
                height={365}
                quality={100}
                objectFit="contain"
              />
            </div>
          </div>
          <section className="w-full">
            <h1 className="lg:leading-tighter text-center text-xl font-bold tracking-tighter sm:text-2xl md:text-3xl xl:text-[3rem] 2xl:text-[2.75rem]">
              <TextGenerateEffect words={sub} />
            </h1>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 border-y">
            {/* Projects Section */}
            {!selectedProject && (
              <section className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Projects</h2>
                  <Dialog open={isAddProjectDialogOpen} onOpenChange={setIsAddProjectDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setIsAddProjectDialogOpen(true)}>Add A Project</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Project</DialogTitle>
                      </DialogHeader>
                      <Input
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="Enter project name"
                      />
                      <DialogFooter>
                        <Button onClick={addProject}>Add Project</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects?.map((project) => (
                    <Card
                      key={project.project_id}
                      className="border border-gray-500 rounded-md"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{project.name}</CardTitle>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <DotsVerticalIcon className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-40">
                              <div className="flex flex-col space-y-2">
                              <Button
                                  variant="ghost"
                                  onClick={() => {
                                    setProjectToRename(project);
                                    setNewProjectName(project.name);
                                  }}
                                >
                                  Rename
                                </Button>
                                <Button
                                  variant="ghost"
                                  onClick={() => deleteProject(project.project_id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <CardDescription>
                          <Select
                            value={project.status}
                            onValueChange={(value) =>
                              updateProjectStatus(project.project_id, value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions?.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between">
                        <Button onClick={() => setSelectedProject(project)}>
                          Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Project Details Section */}
            {selectedProject && (
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">
                    Project Details: {selectedProject.name}
                  </h2>
                  <Button onClick={() => setSelectedProject(null)}>
                    View All Projects
                  </Button>
                </div>
                <Tabs defaultValue="jobDetails">
                  <TabsList>
                    <TabsTrigger value="jobDetails">Job Details</TabsTrigger>
                    <TabsTrigger value="team">
                      Assigned Team & Roles
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="jobDetails">
                    <Card>
                      <CardContent className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="estimatedStartDate">Estimated Start Date</Label>
                            <Input
                              id="estimatedStartDate"
                              type="date"
                              value={editedProject?.estimated_start_date || ''}
                              onChange={(e) => setEditedProject(prev => ({ ...prev, estimated_start_date: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="actualStartDate">Actual Start Date</Label>
                            <Input
                              id="actualStartDate"
                              type="date"
                              value={editedProject?.actual_start_date || ''}
                              onChange={(e) => setEditedProject(prev => ({ ...prev, actual_start_date: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="estimatedHours">Estimated Hours</Label>
                            <Input
                              id="estimatedHours"
                              type="number"
                              value={editedProject?.estimated_hours || ''}
                              onChange={(e) => setEditedProject(prev => ({ ...prev, estimated_hours: parseInt(e.target.value) }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="actualHours">Actual Hours</Label>
                            <Input
                              id="actualHours"
                              type="number"
                              value={editedProject?.actual_hours || ''}
                              onChange={(e) => setEditedProject(prev => ({ ...prev, actual_hours: parseInt(e.target.value) }))}
                            />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={saveProjectDetails}>Save Changes</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  

{/* Team Assignments */}
<TabsContent value="team">
  <Card>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Pay Rate</TableHead>
            <TableHead></TableHead> {/* New column for remove button */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoadingTeamMembers ? (
            <TableRow>
              <TableCell colSpan={4}>Loading team members...</TableCell>
            </TableRow>
          ) : localTeamMembers.length > 0 ? (
            localTeamMembers.filter(member => !member.isDeleted).map((member, index) => (
              <TableRow key={member.assignment_id || `new-${index}`}>
                <TableCell>
                <Select
                  value={member.employee_id ? member.employee_id.toString() : undefined}
                  onValueChange={(value) => {
                    const employeeId = value ? parseInt(value, 10) : null;
                    const employee = employees?.find(e => e.employee_id === employeeId);
                    if (employee) {
                      const fullName = `${employee.name} ${employee.last_name || ''}`.trim();
                      handleEmployeeChange(index, employeeId, fullName);
                    } else {
                      handleEmployeeChange(index, null, '');
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees?.map((employee) => (
                      <SelectItem key={employee.employee_id} value={employee.employee_id.toString()}>
                        {`${employee.name} ${employee.last_name || ''}`.trim()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                </TableCell>
                <TableCell>
                <Select
        value={member.role}
        onValueChange={(value) => handleRoleChange(index, value)}
      >
  <SelectTrigger>
    <SelectValue placeholder="Select role" />
  </SelectTrigger>
  <SelectContent>
    {roleOptions?.map((role) => (
      <SelectItem key={role} value={role}>
        {role}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
                </TableCell>
                <TableCell>
      <Input
        type="text"
        value={member.pay_rate || ''}
        onChange={(e) => handlePayRateChange(index, e.target.value)}
        placeholder="Pay rate"
      />
    </TableCell>
                <TableCell>
                <Button
        variant="ghost"
        size="sm"
        onClick={() => handleRemoveTeamMember(index)}
      >
        <Cross2Icon className="h-4 w-4" />
      </Button>
                </TableCell>
              </TableRow>
            ))
          ) : null}
        </TableBody>
      </Table>
    </CardContent>
    <CardFooter className="flex justify-between">
    <Button 
      onClick={() => {
        const newMember: Omit<TeamMember, 'assignment_id'> = {
          project_id: selectedProject!.project_id,
          employee_id: null,
          employee_name: '',
          role: '',
          pay_rate: null,
          isNew: true
        };
        setLocalTeamMembers(prev => [...prev, newMember]);
      }} 
    >
      Add Team Member
    </Button>
      <Button onClick={saveTeamAssignments}>
        Save Team Assignments
      </Button>
    </CardFooter>
  </Card>
</TabsContent>
                </Tabs>
              </section>
            )}
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-2 xl:grid-cols-[1fr_550px]">
                <div className="flex justify-center max-w-full">
                  <Link href="/admin/onboarding">
                    <Button variant="gooeyLeft">Onboard New Staff</Button>
                  </Link>
                </div>
                <div>
                  <div className="inline-block rounded-md bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                    Onboarding
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    We Can Guide You Through The Process
                  </h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 mt-4">
                    Our team of experts can guide you through the difficult
                    process of managing your staff and HR needs, including onboarding new staff.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                    Join The List Of Champions!
                  </h2>
                  <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Join the thousands of other members that have come to call
                    us their home range.
                  </p>
                </div>
                <div className="mx-auto w-full max-w-sm space-y-2">
                  <form className="flex space-x-2">
                    <Input
                      className="max-w-lg flex-1"
                      placeholder="Enter your email"
                      type="email"
                    />
                    <Button type="submit">Join!</Button>
                  </form>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Sign up to get notified of our sales and events.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </TracingBeam>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 SL Inc. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
      <AlertDialog open={projectToDelete !== null} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProject}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={projectToRename !== null} onOpenChange={() => setProjectToRename(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rename Project</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a new name for the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Enter new project name"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProjectToRename(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (projectToRename && newProjectName.trim() !== "") {
                renameProject(projectToRename.project_id, newProjectName.trim());
                setProjectToRename(null);
              }
            }}>
              Rename
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});

LandingPageCustomer.displayName = "LandingPageCustomer";

export default LandingPageCustomer;