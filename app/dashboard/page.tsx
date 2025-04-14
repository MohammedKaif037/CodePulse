"use client"

import { useState, useEffect } from "react"
import { RefreshCw, Trophy, Brain, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DailyChallenge } from "@/components/daily-challenge"
import { StreakCalendar } from "@/components/streak-calendar"
import { CodingChart } from "@/components/coding-chart"
import { ProjectsTracker } from "@/components/projects-tracker"
import { TaskManager } from "@/components/task-manager"
import { LearningFeed } from "@/components/learning-feed"
import { AiChat } from "@/components/ai-chat"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/user-profile")
        if (response.ok) {
          const { data } = await response.json()
          setUserProfile(data)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="grid gap-4 md:gap-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {loading ? "Loading..." : `Welcome, ${userProfile?.name || "Developer"}`}
                </h1>
                <p className="text-gray-500">Track your coding habits and progress</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
                  <Flame className="mr-1 h-3 w-3" /> 7 Day Streak
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
                  <Trophy className="mr-1 h-3 w-3" /> Level 5
                </Badge>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks">Tasks & Goals</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="learning">Learning Feed</TabsTrigger>
              <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <DailyChallenge />

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Coding Time</span>
                          <span className="font-medium">8h 45m / 10h</span>
                        </div>
                        <Progress value={87.5} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Problems Solved</span>
                          <span className="font-medium">12 / 15</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">GitHub Commits</span>
                          <span className="font-medium">23 / 20</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">XP & Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center py-4">
                      <div className="relative flex items-center justify-center">
                        <svg className="w-32 h-32">
                          <circle
                            className="text-gray-200"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="56"
                            cx="64"
                            cy="64"
                          />
                          <circle
                            className="text-purple-600"
                            strokeWidth="8"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="56"
                            cx="64"
                            cy="64"
                            strokeDasharray="352"
                            strokeDashoffset="88"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center text-center">
                          <span className="text-3xl font-bold">5</span>
                          <span className="text-sm text-gray-500">Level</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">XP Progress</span>
                        <span className="font-medium">750 / 1000</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <StreakCalendar />
                <CodingChart />
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <TaskManager />
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <ProjectsTracker />
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-5 w-5 text-purple-600" />
                    AI Insights
                  </CardTitle>
                  <CardDescription>Personalized recommendations based on your progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Progress Analysis</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Based on your recent activity, you've been consistent with JavaScript practice but could benefit
                      from more focus on data structures and algorithms.
                    </p>
                    <div className="bg-purple-50 rounded-lg p-3 text-sm">
                      <p className="font-medium text-purple-800 mb-1">Recommendation:</p>
                      <p className="text-purple-700">
                        Try dedicating 20 minutes daily to solve array and string manipulation problems to strengthen
                        your algorithmic thinking.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Skill Gap Analysis</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      You've made great progress with React fundamentals, but your state management skills could use
                      improvement.
                    </p>
                    <div className="bg-purple-50 rounded-lg p-3 text-sm">
                      <p className="font-medium text-purple-800 mb-1">Recommendation:</p>
                      <p className="text-purple-700">
                        Consider building a small project using React Context API or Redux to practice state management
                        patterns.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Learning Path Adjustment</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Your goal of becoming a full-stack developer is progressing well, but your backend skills need
                      attention.
                    </p>
                    <div className="bg-purple-50 rounded-lg p-3 text-sm">
                      <p className="font-medium text-purple-800 mb-1">Recommendation:</p>
                      <p className="text-purple-700">
                        Start exploring Node.js and Express to build simple APIs. This will complement your frontend
                        skills and help you become a more well-rounded developer.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" /> Generate New Insights
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="learning" className="space-y-4">
              <LearningFeed />
            </TabsContent>

            <TabsContent value="assistant" className="space-y-4">
              <AiChat />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
