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

  try {
    // Check if the challenges table exists
    const { error: tableCheckError } = await supabase.from("challenges").select("count").limit(1)

    if (tableCheckError) {
      console.error("Challenges table check error:", tableCheckError)

      // If table doesn't exist, return a fallback challenge
      if (tableCheckError.message.includes("relation") && tableCheckError.message.includes("does not exist")) {
        return NextResponse.json({
          data: {
            id: "fallback-1",
            title: "JavaScript Array Methods",
            description:
              "Implement a function that takes an array of numbers and returns a new array with only the even numbers.",
            difficulty: "medium",
            type: "JavaScript",
            link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
            completed: false,
          },
        })
      }

      return NextResponse.json({ error: tableCheckError.message }, { status: 500 })
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
      console.error("Profile fetch error:", profileError)
      // Return a fallback challenge if we can't get the user's technologies
      return NextResponse.json({
        data: {
          id: "fallback-2",
          title: "JavaScript Array Methods",
          description:
            "Implement a function that takes an array of numbers and returns a new array with only the even numbers.",
          difficulty: "medium",
          type: "JavaScript",
          link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
          completed: false,
        },
      })
    }

    // Generate a new challenge
    const technologies = profile?.technologies || ["JavaScript"]
    const challenge = await generateDailyChallenge(technologies)

    try {
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
        console.error("Challenge insert error:", error)
        return NextResponse.json({
          data: {
            id: "temp-" + Date.now(),
            ...challenge,
            completed: false,
          },
        })
      }

      return NextResponse.json({ data: data[0] })
    } catch (insertError) {
      console.error("Challenge insert exception:", insertError)
      // Return the generated challenge even if we couldn't save it
      return NextResponse.json({
        data: {
          id: "temp-" + Date.now(),
          ...challenge,
          completed: false,
        },
      })
    }
  } catch (error) {
    console.error("General error in challenges API:", error)
    return NextResponse.json({
      data: {
        id: "error-fallback",
        title: "JavaScript Array Methods",
        description:
          "Implement a function that takes an array of numbers and returns a new array with only the even numbers.",
        difficulty: "medium",
        type: "JavaScript",
        link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
        completed: false,
      },
    })
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
    // Get the challenge data from the request
    const { id, completed } = await request.json()

    // Check if the challenges table exists
    const { error: tableCheckError } = await supabase.from("challenges").select("count").limit(1)

    if (tableCheckError) {
      return NextResponse.json({ error: "Challenges table does not exist" }, { status: 500 })
    }

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
  } catch (error: any) {
    console.error("Error in POST /api/challenges:", error)
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 })
  }
}
