"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { TextGenerateColor } from "./ui/text-generate-color";
import { TracingBeam } from "./ui/tracing-beam";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DotsVerticalIcon } from "@radix-ui/react-icons"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"

type Project = {
  id: number;
  name: string;
  status: string;
};

const title = "Abel HR & Staff Management";
const sub = "We've Got You Covered For All Of Your HR & Staff Management Needs";

// Project status options
const statusOptions = [
  "To Bid",
  "Bid Sent To Customer",
  "Customer Approved",
  "Job Complete"
]

const LandingPagePublic: React.FC = React.memo(() => {
  const [projects, setProjects] = useState([
    { id: 1, name: "Project A", status: "To Bid" },
    { id: 2, name: "Project B", status: "Bid Sent To Customer" },
    { id: 3, name: "Project C", status: "Customer Approved" },
    { id: 4, name: "Project D", status: "Job Complete" },
  ])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [archivedProjects, setArchivedProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("")

  // Mock data for project details
  const projectDetails = {
    estimatedStartDate: "2023-07-01",
    actualStartDate: "2023-07-05",
    estimatedHours: 100,
    actualHours: 95,
  }

  // Mock data for team members
  const teamMembers = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Bob Johnson" },
  ]

  const updateProjectStatus = (projectId: number, newStatus: string) => {
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, status: newStatus } : project
    ))
  }

  const addProject = () => {
    if (newProjectName.trim() !== "") {
      const newProject = {
        id: projects.length + 1,
        name: newProjectName,
        status: "To Bid"
      }
      setProjects([...projects, newProject])
      setNewProjectName("")
    }
  }

  const deleteProject = (projectId: number) => {
    setProjects(projects.filter(project => project.id !== projectId))
  }

  const renameProject = (projectId: number, newName: string) => {
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, name: newName } : project
    ))
  }

  const archiveProject = (project: any) => {
    setArchivedProjects([...archivedProjects, project])
    setProjects(projects.filter(p => p.id !== project.id))
  }





  return (
    <div className="flex flex-col min-h-[100vh]">
      <main className="flex-1">
        <TracingBeam className="w-full py-12 md:py-24 lg:py-32 border-y">
          <div className="flex items-start justify-start">
            <div className="w-full mx-auto max-w-xl mb-4">
              <Image
                src="/AHRBannerbg.png"
                alt="Banner"
                layout="responsive"
                width={1000}
                height={365}
                quality={100}
                objectFit="contain"
              />
            </div>
          </div>
          <section className="w-full  ">
            <h1 className="lg:leading-tighter text-center text-xl font-bold tracking-tighter sm:text-2xl md:text-3xl xl:text-[3rem] 2xl:text-[2.75rem]">
              <TextGenerateEffect words={sub} />
            </h1>
          </section>
          {/* <div className="items-center justify-start text-start mt-12 ">
            <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.6rem] 2xl:text-[4rem] text-red-500">
              <TextGenerateColor words={title} /></h1>
              </div>
      <div className="flex flex-col items-center justify-center text-end mt-12 ">
            <h1 className="lg:leading-tighter text-xl font-bold tracking-tighter sm:text-2xl md:text-3xl xl:text-[3rem] 2xl:text-[2.75rem] mb-4">
              <TextGenerateEffect words={sub} /></h1>
              </div> */}
                    <section className="w-full py-12 md:py-24 lg:py-32 border-y">

{/* Projects Section */}
{!selectedProject && (
<section className="mb-12">
<div className="flex justify-between items-center mb-4">
<h2 className="text-2xl font-semibold">Projects</h2>
<Dialog>
<DialogTrigger asChild>
<Button>Add A Project</Button>
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
{projects.map((project) => (
<Card key={project.id} className="border border-gray-500 rounded-md">
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
          <Button variant="ghost" onClick={() => {
            const newName = prompt("Enter new project name", project.name)
            if (newName) renameProject(project.id, newName)
          }}>
            Rename
          </Button>
          <Button variant="ghost" onClick={() => deleteProject(project.id)}>
            Delete
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  </div>
  <CardDescription>
    <Select
      value={project.status}
      onValueChange={(value) => updateProjectStatus(project.id, value)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </CardDescription>
</CardHeader>
<CardFooter className="flex justify-between">
  <Button onClick={() => setSelectedProject(project)}>Details</Button>
  {project.status === "Job Complete" && (
    <Button variant="outline" onClick={() => archiveProject(project)}>
      Archive This Project
    </Button>
  )}
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
<h2 className="text-2xl font-semibold">Project Details: {selectedProject.name}</h2>
<Button onClick={() => setSelectedProject(null)}>View All Projects</Button>
</div>
<Tabs defaultValue="jobDetails">
<TabsList>
<TabsTrigger value="jobDetails">Job Details</TabsTrigger>
<TabsTrigger value="team">Assigned Team & Roles</TabsTrigger>
</TabsList>
<TabsContent value="jobDetails">
<Card>
<CardContent className="space-y-4 pt-4">
  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-2">
      <Label htmlFor="estimatedStartDate">Estimated Start Date</Label>
      <Input id="estimatedStartDate" type="date" defaultValue={projectDetails.estimatedStartDate} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="actualStartDate">Actual Start Date</Label>
      <Input id="actualStartDate" type="date" defaultValue={projectDetails.actualStartDate} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="estimatedHours">Estimated Hours</Label>
      <Input id="estimatedHours" type="number" defaultValue={projectDetails.estimatedHours} />
    </div>
    <div className="space-y-2">
      <Label htmlFor="actualHours">Actual Hours</Label>
      <Input id="actualHours" type="number" defaultValue={projectDetails.actualHours} />
    </div>
  </div>
</CardContent>
<CardFooter>
  <Button>Save Changes</Button>
</CardFooter>
</Card>
</TabsContent>
<TabsContent value="team">
<Card>
<CardContent>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Role</TableHead>
        <TableHead>Pay Rate</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {teamMembers.map((member) => (
        <TableRow key={member.id}>
          <TableCell>{member.name}</TableCell>
          <TableCell>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="foreman">Foreman</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell>
            <Input type="number" placeholder="Pay rate" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</CardContent>
<CardFooter>
  <Button>Save Team Assignments</Button>
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
                  <Link href="/public/waiver">
                    <Button>Sign The Waiver</Button>
                  </Link>
                </div>
                <div>
                  <div className="inline-block rounded-md bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                    AHR Info
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    We Can Guide You Through The Process
                  </h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 mt-4">
                    Our team of experts can guide you through the difficult process of managing your staff and HR needs.
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
    </div>
  );
});

LandingPagePublic.displayName = "LandingPagePublic";

export default LandingPagePublic;
