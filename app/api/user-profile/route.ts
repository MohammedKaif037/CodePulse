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

  try {
    // Get the profile data from the request
    const profileData = await request.json()

    // Log for debugging
    console.log("Received profile data:", profileData)

    // Check if profiles table exists
    const { error: tableCheckError } = await supabase.from("profiles").select("count").limit(1).single()

    if (tableCheckError) {
      console.error("Table check error:", tableCheckError)
      if (tableCheckError.message.includes("relation") && tableCheckError.message.includes("does not exist")) {
        // Create profiles table if it doesn't exist
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            name TEXT,
            experience_level TEXT,
            technologies TEXT[],
            goal TEXT,
            learning_style TEXT,
            time_commitment TEXT,
            tracking_metrics TEXT[],
            motivation TEXT,
            preferences TEXT[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `

        // Note: This is a simplified approach - in production, you should use migrations
        // This approach won't work with standard Supabase since it doesn't allow raw SQL execution via API
        // Consider creating the table in Supabase Studio first

        // Instead, let's try to create a profile with minimal fields
        const { error: createProfileError } = await supabase.from("profiles").insert({
          id: user.id,
          name: profileData.name || "User",
          updated_at: new Date().toISOString(),
        })

        if (createProfileError) {
          console.error("Error creating profile with minimal fields:", createProfileError)
          return NextResponse.json({ error: "Failed to create profile table or entry" }, { status: 500 })
        }
      } else {
        return NextResponse.json({ error: "Database error checking profiles table" }, { status: 500 })
      }
    }

    // Insert or update the user profile in the profiles table
    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        name: profileData.name,
        experience_level: profileData.experience,
        technologies: profileData.technologies || [],
        goal: profileData.goal,
        learning_style: profileData.learningStyle,
        time_commitment: profileData.timeCommitment,
        tracking_metrics: profileData.trackingMetrics || [],
        motivation: profileData.motivation,
        preferences: profileData.preferences || [],
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("Supabase upsert error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error("Server error in user-profile API:", error)
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 })
  }
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
