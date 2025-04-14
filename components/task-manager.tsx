"use client"

import { useState } from "react"
import { Plus, CheckCircle, Circle, Calendar, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export function TaskManager() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Complete React tutorial",
      completed: false,
      priority: "high",
      dueDate: "2025-04-20",
      category: "learning",
    },
    {
      id: 2,
      title: "Solve 3 LeetCode problems",
      completed: false,
      priority: "medium",
      dueDate: "2025-04-15",
      category: "practice",
    },
    {
      id: 3,
      title: "Refactor portfolio project",
      completed: true,
      priority: "low",
      dueDate: "2025-04-10",
      category: "project",
    },
    {
      id: 4,
      title: "Read article on TypeScript generics",
      completed: false,
      priority: "medium",
      dueDate: "2025-04-18",
      category: "learning",
    },
    {
      id: 5,
      title: "Fix navigation bug in dashboard",
      completed: false,
      priority: "high",
      dueDate: "2025-04-16",
      category: "project",
    },
  ])

  const [newTask, setNewTask] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState("medium")
  const [newTaskCategory, setNewTaskCategory] = useState("learning")
  const [activeTab, setActiveTab] = useState("all")

  const addTask = () => {
    if (newTask.trim() === "") return

    const task = {
      id: Date.now(),
      title: newTask,
      completed: false,
      priority: newTaskPriority,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      category: newTaskCategory,
    }

    setTasks([...tasks, task])
    setNewTask("")
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true
    if (activeTab === "completed") return task.completed
    if (activeTab === "pending") return !task.completed
    if (activeTab === "high") return task.priority === "high" && !task.completed
    if (activeTab === "learning") return task.category === "learning"
    if (activeTab === "project") return task.category === "project"
    if (activeTab === "practice") return task.category === "practice"
    return true
  })

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return null
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "learning":
        return <Badge className="bg-blue-100 text-blue-800">Learning</Badge>
      case "project":
        return <Badge className="bg-purple-100 text-purple-800">Project</Badge>
      case "practice":
        return <Badge className="bg-indigo-100 text-indigo-800">Practice</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks & Goals</CardTitle>
        <CardDescription>Manage your coding tasks and track your goals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-6">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="learning">Learning</SelectItem>
              <SelectItem value="project">Project</SelectItem>
              <SelectItem value="practice">Practice</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={addTask}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-7 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="high">High Priority</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="project">Projects</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="space-y-2">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={() => toggleTask(task.id)}>
                        {task.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </Button>
                      <span className={`text-sm ${task.completed ? "line-through text-gray-500" : ""}`}>
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getPriorityBadge(task.priority)}
                      {getCategoryBadge(task.category)}
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={() => deleteTask(task.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                  <p className="text-sm text-gray-500">No tasks found</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">{tasks.filter((task) => !task.completed).length} tasks remaining</div>
        <div className="text-sm text-gray-500">{tasks.filter((task) => task.completed).length} tasks completed</div>
      </CardFooter>
    </Card>
  )
}
