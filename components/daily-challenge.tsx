"use client"

import { useState, useEffect } from "react"
import { RefreshCw, CheckCircle, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DailyChallenge() {
  const [challenge, setChallenge] = useState({
    id: "",
    title: "Loading challenge...",
    description: "Please wait while we fetch your daily challenge.",
    difficulty: "medium",
    type: "Loading",
    link: "#",
    completed: false,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChallenge()
  }, [])

  const fetchChallenge = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/challenges")
      if (!response.ok) {
        throw new Error("Failed to fetch challenge")
      }
      const { data } = await response.json()
      setChallenge(data)
    } catch (error) {
      console.error("Error fetching challenge:", error)
    } finally {
      setLoading(false)
    }
  }

  const refreshChallenge = () => {
    fetchChallenge()
  }

  const markAsCompleted = async () => {
    try {
      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: challenge.id,
          completed: true,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update challenge")
      }

      const { data } = await response.json()
      setChallenge(data)
    } catch (error) {
      console.error("Error updating challenge:", error)
    }
  }

  return (
    <Card className="col-span-2 md:col-span-1">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Today's Challenge</CardTitle>
          <Button variant="ghost" size="icon" onClick={refreshChallenge} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <CardDescription>
          {challenge.type} • {challenge.difficulty}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium mb-2">{challenge.title}</h3>
        <p className="text-sm text-gray-500 mb-4">{challenge.description}</p>

        {challenge.completed ? (
          <div className="flex items-center text-green-600 text-sm font-medium">
            <CheckCircle className="mr-1 h-4 w-4" />
            Completed
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" asChild>
              <a href={challenge.link} target="_blank" rel="noopener noreferrer">
                <Code className="mr-1 h-4 w-4" />
                View Challenge
              </a>
            </Button>
            <Button size="sm" onClick={markAsCompleted}>
              <CheckCircle className="mr-1 h-4 w-4" />
              Mark Complete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
