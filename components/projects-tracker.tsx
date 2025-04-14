"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, CheckCircle, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ProjectsTracker() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Personal Portfolio",
      description: "A portfolio website to showcase my projects and skills.",
      progress: 75,
      status: "in-progress",
      dueDate: "2025-05-15",
      tasks: [
        { id: 1, name: "Design homepage", completed: true },
        { id: 2, name: "Implement responsive layout", completed: true },
        { id: 3, name: "Add projects section", completed: true },
        { id: 4, name: "Create contact form", completed: false },
      ],
    },
    {
      id: 2,
      name: "Task Management App",
      description: "A React app for managing daily tasks and to-dos.",
      progress: 30,
      status: "in-progress",
      dueDate: "2025-06-20",
      tasks: [
        { id: 1, name: "Set up project structure", completed: true },
        { id: 2, name: "Create task component", completed: true },
        { id: 3, name: "Implement task creation", completed: false },
        { id: 4, name: "Add task filtering", completed: false },
        { id: 5, name: "Implement local storage", completed: false },
      ],
    },
    {
      id: 3,
      name: "Weather Dashboard",
      description: "A dashboard to display weather information using a public API.",
      progress: 0,
      status: "planned",
      dueDate: "2025-07-10",
      tasks: [
        { id: 1, name: "Research weather APIs", completed: false },
        { id: 2, name: "Design UI mockups", completed: false },
        { id: 3, name: "Set up project", completed: false },
        { id: 4, name: "Implement API integration", completed: false },
      ],
    },
  ])

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    dueDate: "",
    status: "planned",
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null)

  const handleAddProject = () => {
    if (newProject.name.trim() === "") return

    const project = {
      id: Date.now(),
      name: newProject.name,
      description: newProject.description,
      progress: 0,
      status: newProject.status,
      dueDate: newProject.dueDate,
      tasks: [],
    }

    setProjects([...projects, project])
    setNewProject({
      name: "",
      description: "",
      dueDate: "",
      status: "planned",
    })
    setIsDialogOpen(false)
  }

  const handleEditProject = () => {
    if (!editingProjectId) return

    setProjects(
      projects.map((project) =>
        project.id === editingProjectId
          ? {
              ...project,
              name: newProject.name,
              description: newProject.description,
              dueDate: newProject.dueDate,
              status: newProject.status,
            }
          : project,
      ),
    )

    setEditingProjectId(null)
    setNewProject({
      name: "",
      description: "",
      dueDate: "",
      status: "planned",
    })
    setIsDialogOpen(false)
  }

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter((project) => project.id !== id))
  }

  const openEditDialog = (project: any) => {
    setEditingProjectId(project.id)
    setNewProject({
      name: project.name,
      description: project.description,
      dueDate: project.dueDate,
      status: project.status,
    })
    setIsDialogOpen(true)
  }

  const toggleTask = (projectId: number, taskId: number) => {
    setProjects(
      projects.map((project) => {
        if (project.id === projectId) {
          const updatedTasks = project.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task,
          )

          const completedTasks = updatedTasks.filter((task) => task.completed).length
          const progress = Math.round((completedTasks / updatedTasks.length) * 100)

          return {
            ...project,
            tasks: updatedTasks,
            progress,
          }
        }
        return project
      }),
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "planned":
        return <Badge className="bg-gray-100 text-gray-800">Planned</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Projects</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProjectId ? "Edit Project" : "Add New Project"}</DialogTitle>
              <DialogDescription>
                {editingProjectId ? "Update your project details below." : "Fill in the details for your new project."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Enter project name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Enter project description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-status">Status</Label>
                  <Select
                    value={newProject.status}
                    onValueChange={(value) => setNewProject({ ...newProject, status: value })}
                  >
                    <SelectTrigger id="project-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-due-date">Due Date</Label>
                  <Input
                    id="project-due-date"
                    type="date"
                    value={newProject.dueDate}
                    onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={editingProjectId ? handleEditProject : handleAddProject}>
                {editingProjectId ? "Save Changes" : "Add Project"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-medium">{project.name}</CardTitle>
                  <CardDescription className="mt-1">{project.description}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(project)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(project.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">{getStatusBadge(project.status)}</div>
                {project.dueDate && (
                  <div className="text-xs text-gray-500">Due: {new Date(project.dueDate).toLocaleDateString()}</div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Tasks</h4>
                {project.tasks.length > 0 ? (
                  <ul className="space-y-1">
                    {project.tasks.map((task) => (
                      <li key={task.id} className="flex items-center gap-2 text-sm">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 p-0"
                          onClick={() => toggleTask(project.id, task.id)}
                        >
                          {task.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                        </Button>
                        <span className={task.completed ? "line-through text-gray-500" : ""}>{task.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No tasks added yet.</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="mr-1 h-3 w-3" /> Add Task
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
