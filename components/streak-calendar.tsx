"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function StreakCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Mock data for coding activity
  const activityData = {
    // Format: "YYYY-MM-DD": intensity (0-3)
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
          Current streak: 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}
