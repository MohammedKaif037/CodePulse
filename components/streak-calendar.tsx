"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function StreakCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [activityData, setActivityData] = useState<Record<string, number>>({})
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCodingActivity = async () => {
      try {
        const response = await fetch("/api/coding-activity")
        if (response.ok) {
          const { data } = await response.json()

          // Transform the data into the format we need
          const formattedData: Record<string, number> = {}
          data.forEach((activity: any) => {
            const date = activity.date
            // Convert minutes to intensity level (0-3)
            const minutes = activity.minutes || 0
            let intensity = 0
            if (minutes > 0 && minutes < 30) intensity = 1
            else if (minutes >= 30 && minutes < 120) intensity = 2
            else if (minutes >= 120) intensity = 3

            formattedData[date] = intensity
          })

          setActivityData(formattedData)

          // Calculate current streak
          const today = new Date().toISOString().split("T")[0]
          let currentStreak = 0
          const date = new Date()

          // Check backwards from today
          while (true) {
            const dateString = date.toISOString().split("T")[0]
            if (formattedData[dateString] && formattedData[dateString] > 0) {
              currentStreak++
              date.setDate(date.getDate() - 1)
            } else {
              break
            }
          }

          setStreak(currentStreak)
        } else {
          // If API doesn't exist yet or fails, use mock data
          setActivityData({
            "2025-04-01": 2,
            "2025-04-02": 3,
            "2025-04-03": 1,
            "2025-04-04": 0,
            "2025-04-05": 2,
            "2025-04-06": 1,
            "2025-04-07": 3,
            "2025-04-08": 3,
            "2025-04-09": 2,
            "2025-04-10": 1,
            "2025-04-11": 0,
            "2025-04-12": 0,
            "2025-04-13": 1,
            "2025-04-14": 3,
          })
          setStreak(7)
        }
      } catch (error) {
        console.error("Error fetching coding activity:", error)
        // Fallback to mock data
        setActivityData({
          "2025-04-01": 2,
          "2025-04-02": 3,
          "2025-04-03": 1,
          "2025-04-04": 0,
          "2025-04-05": 2,
          "2025-04-06": 1,
          "2025-04-07": 3,
          "2025-04-08": 3,
          "2025-04-09": 2,
          "2025-04-10": 1,
          "2025-04-11": 0,
          "2025-04-12": 0,
          "2025-04-13": 1,
          "2025-04-14": 3,
        })
        setStreak(7)
      } finally {
        setLoading(false)
      }
    }

    fetchCodingActivity()
  }, [])

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const renderCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // Get the first day of the month
    const firstDay = new Date(year, month, 1)
    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const startingDayOfWeek = firstDay.getDay()

    // Total days in the month
    const totalDays = lastDay.getDate()

    // Create array for all days in the month
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day)
      const dateString = date.toISOString().split("T")[0]
      const activity = activityData[dateString] || 0

      let bgColor = "bg-gray-100"
      if (activity === 1) bgColor = "bg-purple-200"
      if (activity === 2) bgColor = "bg-purple-400"
      if (activity === 3) bgColor = "bg-purple-600"

      const isToday = new Date().toDateString() === date.toDateString()

      days.push(
        <div
          key={day}
          className={`flex items-center justify-center h-8 w-8 rounded-full text-xs ${bgColor} ${activity > 1 ? "text-white" : ""} ${isToday ? "ring-2 ring-purple-600 ring-offset-2" : ""}`}
        >
          {day}
        </div>,
      )
    }

    return days
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Coding Streak Calendar</CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="flex items-center">
          <Flame className="mr-1 h-4 w-4 text-purple-600" />
          Current streak: {loading ? <Skeleton className="h-4 w-8 ml-1" /> : `${streak} days`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <>
            <div className="grid grid-cols-7 gap-1 text-center">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="text-xs font-medium text-gray-500">
                  {day}
                </div>
              ))}
              {renderCalendar()}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-sm bg-gray-100"></div>
                <span>None</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-sm bg-purple-200"></div>
                <span>Light</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-sm bg-purple-400"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-sm bg-purple-600"></div>
                <span>Heavy</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
