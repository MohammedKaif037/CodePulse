"use client"

import { useState } from "react"
import { ExternalLink, Bookmark, Share2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function LearningFeed() {
  const [activeTab, setActiveTab] = useState("recommended")

  // Mock data for learning resources
  const resources = [
    {
      id: 1,
      title: "Understanding React Hooks",
      description: "A comprehensive guide to React Hooks and how to use them effectively in your applications.",
      type: "article",
      source: "React Documentation",
      url: "https://reactjs.org/docs/hooks-intro.html",
      tags: ["React", "Hooks", "Frontend"],
      saved: false,
    },
    {
      id: 2,
      title: "Advanced TypeScript Patterns",
      description: "Learn advanced TypeScript patterns to improve your code quality and developer experience.",
      type: "video",
      source: "TypeScript Conference",
      url: "https://www.youtube.com/watch?v=example",
      tags: ["TypeScript", "Advanced", "Patterns"],
      saved: true,
    },
    {
      id: 3,
      title: "Building a Full-Stack App with Next.js",
      description: "Step-by-step tutorial on building a full-stack application with Next.js, Prisma, and PostgreSQL.",
      type: "tutorial",
      source: "Vercel Blog",
      url: "https://vercel.com/blog/example",
      tags: ["Next.js", "Full-Stack", "Prisma"],
      saved: false,
    },
    {
      id: 4,
      title: "Mastering CSS Grid Layout",
      description: "Everything you need to know about CSS Grid Layout to create complex web layouts with ease.",
      type: "article",
      source: "CSS-Tricks",
      url: "https://css-tricks.com/example",
      tags: ["CSS", "Grid", "Layout"],
      saved: false,
    },
    {
      id: 5,
      title: "Data Structures and Algorithms in JavaScript",
      description: "Learn the most important data structures and algorithms implemented in JavaScript.",
      type: "course",
      source: "Frontend Masters",
      url: "https://frontendmasters.com/example",
      tags: ["JavaScript", "DSA", "Algorithms"],
      saved: true,
    },
  ]

  const [learningResources, setLearningResources] = useState(resources)

  const toggleSaved = (id: number) => {
    setLearningResources(
      learningResources.map((resource) => (resource.id === id ? { ...resource, saved: !resource.saved } : resource)),
    )
  }

  const filteredResources = learningResources.filter((resource) => {
    if (activeTab === "recommended") return true
    if (activeTab === "saved") return resource.saved
    if (activeTab === "articles") return resource.type === "article"
    if (activeTab === "videos") return resource.type === "video"
    if (activeTab === "tutorials") return resource.type === "tutorial"
    if (activeTab === "courses") return resource.type === "course"
    return true
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return "📄"
      case "video":
        return "🎬"
      case "tutorial":
        return "📚"
      case "course":
        return "🎓"
      default:
        return "📄"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Feed</CardTitle>
        <CardDescription>Personalized learning resources based on your interests and goals</CardDescription>
        <Tabs defaultValue="recommended" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6">
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <div key={resource.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getTypeIcon(resource.type)}</span>
                      <h3 className="font-medium">{resource.title}</h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{resource.description}</p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-gray-500">Source: {resource.source}</div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => toggleSaved(resource.id)}>
                      <Bookmark className={`h-4 w-4 ${resource.saved ? "fill-purple-600 text-purple-600" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1 h-3 w-3" /> View
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-gray-500">No resources found</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Load More Resources
        </Button>
      </CardFooter>
    </Card>
  )
}
