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
import { Skeleton } from "@/components/ui/skeleton"
import { SidebarProvider } from "@/components/ui/sidebar"


export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userStats, setUserStats] = useState({
    level: 0,
    xp: 0,
    maxXp: 1000,
    streak: 0,
    weeklyProgress: {
      codingTime: { current: 0, target: 10 },
      problemsSolved: { current: 0, target: 15 },
      commits: { current: 0, target: 20 },
    },
  })

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
      }
    }

    // Fetch user stats
    const fetchUserStats = async () => {
      try {
        const response = await fetch("/api/user-stats")
        if (response.ok) {
          const { data } = await response.json()
          setUserStats(data)
        } else {
          // If API doesn't exist yet or fails, use mock data
          setUserStats({
            level: 5,
            xp: 750,
            maxXp: 1000,
            streak: 7,
            weeklyProgress: {
              codingTime: { current: 8.75, target: 10 },
              problemsSolved: { current: 12, target: 15 },
              commits: { current: 23, target: 20 },
            },
          })
        }
      } catch (error) {
        console.error("Error fetching user stats:", error)
        // Fallback to mock data
        setUserStats({
          level: 5,
          xp: 750,
          maxXp: 1000,
          streak: 7,
          weeklyProgress: {
            codingTime: { current: 8.75, target: 10 },
            problemsSolved: { current: 12, target: 15 },
            commits: { current: 23, target: 20 },
          },
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
    fetchUserStats()
  }, [])

  return (
    <SidebarProvider>
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="grid gap-4 md:gap-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                {loading ? (
                  <Skeleton className="h-8 w-48 mb-2" />
                ) : (
                  <h1 className="text-2xl font-bold tracking-tight">Welcome, {userProfile?.name || "Developer"}</h1>
                )}
                <p className="text-gray-500">Track your coding habits and progress</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
                  <Flame className="mr-1 h-3 w-3" /> {loading ? "..." : `${userStats.streak} Day Streak`}
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
                  <Trophy className="mr-1 h-3 w-3" /> {loading ? "..." : `Level ${userStats.level}`}
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
                      {loading ? (
                        <>
                          <Skeleton className="h-6 w-full mb-2" />
                          <Skeleton className="h-2 w-full mb-4" />
                          <Skeleton className="h-6 w-full mb-2" />
                          <Skeleton className="h-2 w-full mb-4" />
                          <Skeleton className="h-6 w-full mb-2" />
                          <Skeleton className="h-2 w-full" />
                        </>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Coding Time</span>
                              <span className="font-medium">
                                {userStats.weeklyProgress.codingTime.current}h /{" "}
                                {userStats.weeklyProgress.codingTime.target}h
                              </span>
                            </div>
                            <Progress
                              value={
                                (userStats.weeklyProgress.codingTime.current /
                                  userStats.weeklyProgress.codingTime.target) *
                                100
                              }
                              className="h-2"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Problems Solved</span>
                              <span className="font-medium">
                                {userStats.weeklyProgress.problemsSolved.current} /{" "}
                                {userStats.weeklyProgress.problemsSolved.target}
                              </span>
                            </div>
                            <Progress
                              value={
                                (userStats.weeklyProgress.problemsSolved.current /
                                  userStats.weeklyProgress.problemsSolved.target) *
                                100
                              }
                              className="h-2"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">GitHub Commits</span>
                              <span className="font-medium">
                                {userStats.weeklyProgress.commits.current} / {userStats.weeklyProgress.commits.target}
                              </span>
                            </div>
                            <Progress
                              value={Math.min(
                                (userStats.weeklyProgress.commits.current / userStats.weeklyProgress.commits.target) *
                                  100,
                                100,
                              )}
                              className="h-2"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">XP & Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex flex-col items-center space-y-4">
                        <Skeleton className="h-32 w-32 rounded-full" />
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-2 w-full" />
                      </div>
                    ) : (
                      <>
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
                                strokeDashoffset={352 - (352 * userStats.xp) / userStats.maxXp}
                              />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center text-center">
                              <span className="text-3xl font-bold">{userStats.level}</span>
                              <span className="text-sm text-gray-500">Level</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">XP Progress</span>
                            <span className="font-medium">
                              {userStats.xp} / {userStats.maxXp}
                            </span>
                          </div>
                          <Progress value={(userStats.xp / userStats.maxXp) * 100} className="h-2" />
                        </div>
                      </>
                    )}
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
                  {loading ? (
                    <>
                      <Skeleton className="h-32 w-full mb-4" />
                      <Skeleton className="h-32 w-full mb-4" />
                      <Skeleton className="h-32 w-full" />
                    </>
                  ) : (
                    <>
                      <div className="rounded-lg border p-4">
                        <h3 className="font-medium mb-2">Progress Analysis</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Based on your recent activity, you've been consistent with JavaScript practice but could
                          benefit from more focus on data structures and algorithms.
                        </p>
                        <div className="bg-purple-50 rounded-lg p-3 text-sm">
                          <p className="font-medium text-purple-800 mb-1">Recommendation:</p>
                          <p className="text-purple-700">
                            Try dedicating 20 minutes daily to solve array and string manipulation problems to
                            strengthen your algorithmic thinking.
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
                            Consider building a small project using React Context API or Redux to practice state
                            management patterns.
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
                    </>
                  )}
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
    </SidebarProvider>
  )
}
