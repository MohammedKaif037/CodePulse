import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

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

  // Get the profile data from the request
  const profileData = await request.json()

  // Insert or update the user profile in the profiles table
  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      name: profileData.name,
      experience_level: profileData.experience,
      technologies: profileData.technologies,
      goal: profileData.goal,
      learning_style: profileData.learningStyle,
      time_commitment: profileData.timeCommitment,
      tracking_metrics: profileData.trackingMetrics,
      motivation: profileData.motivation,
      preferences: profileData.preferences,
      updated_at: new Date().toISOString(),
    })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ data })
}

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

  // Get the user profile from the profiles table
  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ data })
}
