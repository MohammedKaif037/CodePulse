import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  // Get the current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get coding activity for the last 30 days
    const { data: activityData, error: activityError } = await supabase
      .from("coding_activity")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])

    if (activityError) {
      console.error("Error fetching coding activity:", activityError)
      return NextResponse.json({ error: activityError.message }, { status: 400 })
    }

    // Process the data to get language, topic, and time stats
    const languages: Record<string, number> = {}
    const topics: Record<string, number> = {}
    const timeByDay: Record<string, number> = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    }

    // If we have activity data, process it
    if (activityData && activityData.length > 0) {
      // Process languages
      activityData.forEach((activity) => {
        if (activity.language) {
          languages[activity.language] = (languages[activity.language] || 0) + activity.minutes
        }
        if (activity.topic) {
          topics[activity.topic] = (topics[activity.topic] || 0) + activity.minutes
        }

        // Process time by day
        const date = new Date(activity.date)
        const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]
        timeByDay[day] = (timeByDay[day] || 0) + activity.minutes / 60 // Convert to hours
      })
    }

    // Convert to percentage for languages
    const totalLanguageMinutes = Object.values(languages).reduce((sum, val) => sum + val, 0) || 1
    const languageData = Object.entries(languages)
      .map(([name, minutes]) => ({
        name,
        percentage: Math.round((minutes / totalLanguageMinutes) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 4) // Top 4 languages

    // Add "Other" category if needed
    const topLanguagesPercentage = languageData.reduce((sum, item) => sum + item.percentage, 0)
    if (topLanguagesPercentage < 100 && languageData.length > 0) {
      languageData.push({ name: "Other", percentage: 100 - topLanguagesPercentage })
    }

    // Convert to percentage for topics
    const totalTopicMinutes = Object.values(topics).reduce((sum, val) => sum + val, 0) || 1
    const topicData = Object.entries(topics)
      .map(([name, minutes]) => ({
        name,
        percentage: Math.round((minutes / totalTopicMinutes) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5) // Top 5 topics

    // Add "Other" category if needed
    const topTopicsPercentage = topicData.reduce((sum, item) => sum + item.percentage, 0)
    if (topTopicsPercentage < 100 && topicData.length > 0) {
      topicData.push({ name: "Other", percentage: 100 - topTopicsPercentage })
    }

    // Format time data
    const timeData = Object.entries(timeByDay).map(([day, hours]) => ({
      day,
      hours: Math.round(hours * 10) / 10, // Round to 1 decimal place
    }))

    // If no data, use default values
    const result = {
      languages:
        languageData.length > 0
          ? languageData
          : [
              { name: "JavaScript", percentage: 45 },
              { name: "TypeScript", percentage: 25 },
              { name: "Python", percentage: 15 },
              { name: "HTML/CSS", percentage: 10 },
              { name: "Other", percentage: 5 },
            ],
      topics:
        topicData.length > 0
          ? topicData
          : [
              { name: "React", percentage: 35 },
              { name: "Algorithms", percentage: 20 },
              { name: "Node.js", percentage: 15 },
              { name: "CSS", percentage: 15 },
              { name: "Testing", percentage: 10 },
              { name: "Other", percentage: 5 },
            ],
      time: timeData.some((item) => item.hours > 0)
        ? timeData
        : [
            { day: "Mon", hours: 1.5 },
            { day: "Tue", hours: 2.0 },
            { day: "Wed", hours: 0.5 },
            { day: "Thu", hours: 1.0 },
            { day: "Fri", hours: 2.5 },
            { day: "Sat", hours: 3.0 },
            { day: "Sun", hours: 1.0 },
          ],
    }

    return NextResponse.json({ data: result })
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 })
  }
}
