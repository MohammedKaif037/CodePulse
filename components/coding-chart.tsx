"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CodingChart() {
  const [activeTab, setActiveTab] = useState("languages")

  // Mock data for charts
  const languageData = [
    { name: "JavaScript", percentage: 45 },
    { name: "TypeScript", percentage: 25 },
    { name: "Python", percentage: 15 },
    { name: "HTML/CSS", percentage: 10 },
    { name: "Other", percentage: 5 },
  ]

  const topicData = [
    { name: "React", percentage: 35 },
    { name: "Algorithms", percentage: 20 },
    { name: "Node.js", percentage: 15 },
    { name: "CSS", percentage: 15 },
    { name: "Testing", percentage: 10 },
    { name: "Other", percentage: 5 },
  ]

  const timeData = [
    { day: "Mon", hours: 1.5 },
    { day: "Tue", hours: 2.0 },
    { day: "Wed", hours: 0.5 },
    { day: "Thu", hours: 1.0 },
    { day: "Fri", hours: 2.5 },
    { day: "Sat", hours: 3.0 },
    { day: "Sun", hours: 1.0 },
  ]

  const renderBarChart = (data: { name: string; percentage: number }[]) => {
    return (
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{item.name}</span>
              <span className="font-medium">{item.percentage}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div className="h-2 rounded-full bg-purple-600" style={{ width: `${item.percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderTimeChart = (data: { day: string; hours: number }[]) => {
    const maxHours = Math.max(...data.map((item) => item.hours))

    return (
      <div className="flex h-40 items-end justify-between">
        {data.map((item) => (
          <div key={item.day} className="flex flex-col items-center">
            <div className="w-8 rounded-t bg-purple-600" style={{ height: `${(item.hours / maxHours) * 100}%` }}></div>
            <div className="mt-2 text-xs">{item.day}</div>
            <div className="text-xs text-gray-500">{item.hours}h</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Coding Habits Overview</CardTitle>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="languages">Languages</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="time">Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <TabsContent value="languages" className="mt-0">
          {renderBarChart(languageData)}
        </TabsContent>
        <TabsContent value="topics" className="mt-0">
          {renderBarChart(topicData)}
        </TabsContent>
        <TabsContent value="time" className="mt-0">
          {renderTimeChart(timeData)}
        </TabsContent>
      </CardContent>
    </Card>
  )
}
