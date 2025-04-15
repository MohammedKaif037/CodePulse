import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get("email"))
  const password = String(formData.get("password"))
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Check if user has completed onboarding
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // If profile exists and has completed onboarding, redirect to dashboard
  // Otherwise, redirect to onboarding
  const redirectUrl = profile ? "/dashboard" : "/onboarding"

  // Return JSON with redirect URL instead of redirecting directly
  return NextResponse.json({
    success: true,
    redirectUrl: redirectUrl,
  })
}
