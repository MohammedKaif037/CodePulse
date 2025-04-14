import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { generateDailyChallenge } from "@/lib/ai-service"

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

  // Check if the user already has a challenge for today
  const today = new Date().toISOString().split("T")[0]
  const { data: existingChallenge, error: challengeError } = await supabase
    .from("challenges")
    .select("*")
    .eq("user_id", user.id)
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`)
    .single()

  if (!challengeError && existingChallenge) {
    return NextResponse.json({ data: existingChallenge })
  }

  // Get the user's technologies
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("technologies")
    .eq("id", user.id)
    .single()

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 })
  }

  // Generate a new challenge
  const technologies = profile?.technologies || ["JavaScript"]
  const challenge = await generateDailyChallenge(technologies)

  // Insert the challenge into the challenges table
  const { data, error } = await supabase
    .from("challenges")
    .insert({
      user_id: user.id,
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty,
      type: challenge.type,
      link: challenge.link,
      completed: false,
    })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ data: data[0] })
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

  // Get the challenge data from the request
  const { id, completed } = await request.json()

  // Update the challenge in the challenges table
  const { data, error } = await supabase
    .from("challenges")
    .update({ completed })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ data: data[0] })
}
