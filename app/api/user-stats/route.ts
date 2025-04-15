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
    // Get user stats from the database
    const { data: userStats, error: statsError } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (statsError && statsError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" error, which is fine - we'll create default stats
      console.error("Error fetching user stats:", statsError)
      return NextResponse.json({ error: statsError.message }, { status: 400 })
    }

    // If no stats exist yet, create default stats
    if (!userStats) {
      const defaultStats = {
        user_id: user.id,
        level: 1,
        xp: 0,
        max_xp: 1000,
        streak: 0,
        weekly_coding_time: 0,
        weekly_problems_solved: 0,
        weekly_commits: 0,
        target_coding_time: 10,
        target_problems_solved: 15,
        target_commits: 20,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Insert default stats
      const { data: newStats, error: insertError } = await supabase
        .from("user_stats")
        .insert(defaultStats)
        .select()
        .single()

      if (insertError) {
        console.error("Error creating default user stats:", insertError)
        return NextResponse.json({ error: insertError.message }, { status: 400 })
      }

      // Format the response
      return NextResponse.json({
        data: {
          level: newStats.level,
          xp: newStats.xp,
          maxXp: newStats.max_xp,
          streak: newStats.streak,
          weeklyProgress: {
            codingTime: { current: newStats.weekly_coding_time, target: newStats.target_coding_time },
            problemsSolved: { current: newStats.weekly_problems_solved, target: newStats.target_problems_solved },
            commits: { current: newStats.weekly_commits, target: newStats.target_commits },
          },
        },
      })
    }

    // Format the response for existing stats
    return NextResponse.json({
      data: {
        level: userStats.level,
        xp: userStats.xp,
        maxXp: userStats.max_xp,
        streak: userStats.streak,
        weeklyProgress: {
          codingTime: { current: userStats.weekly_coding_time, target: userStats.target_coding_time },
          problemsSolved: { current: userStats.weekly_problems_solved, target: userStats.target_problems_solved },
          commits: { current: userStats.weekly_commits, target: userStats.target_commits },
        },
      },
    })
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
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
    // Get the stats data from the request
    const statsData = await request.json()

    // Update user stats
    const { data, error } = await supabase
      .from("user_stats")
      .upsert({
        user_id: user.id,
        level: statsData.level,
        xp: statsData.xp,
        max_xp: statsData.maxXp,
        streak: statsData.streak,
        weekly_coding_time: statsData.weeklyProgress?.codingTime?.current || 0,
        weekly_problems_solved: statsData.weeklyProgress?.problemsSolved?.current || 0,
        weekly_commits: statsData.weeklyProgress?.commits?.current || 0,
        target_coding_time: statsData.weeklyProgress?.codingTime?.target || 10,
        target_problems_solved: statsData.weeklyProgress?.problemsSolved?.target || 15,
        target_commits: statsData.weeklyProgress?.commits?.target || 20,
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("Error updating user stats:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 })
  }
}
