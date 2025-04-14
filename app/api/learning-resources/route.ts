import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { generateLearningResources } from "@/lib/ai-service"

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

  // Get the user's technologies
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("technologies")
    .eq("id", user.id)
    .single()

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 })
  }

  // Get saved resources for the user
  const { data: savedResources, error: savedError } = await supabase
    .from("saved_resources")
    .select("resource_id")
    .eq("user_id", user.id)

  if (savedError) {
    return NextResponse.json({ error: savedError.message }, { status: 400 })
  }

  const savedIds = savedResources?.map((item) => item.resource_id) || []

  // Get resources from the database
  const { data: dbResources, error: resourcesError } = await supabase.from("learning_resources").select("*")

  if (resourcesError) {
    return NextResponse.json({ error: resourcesError.message }, { status: 400 })
  }

  // If we have less than 5 resources in the database, generate more
  let resources = dbResources || []
  if (resources.length < 5) {
    const technologies = profile?.technologies || ["JavaScript"]
    const generatedResources = await generateLearningResources(technologies)

    // Add the generated resources to the database
    const { data: newResources, error: insertError } = await supabase
      .from("learning_resources")
      .insert(
        generatedResources.map((resource) => ({
          title: resource.title,
          description: resource.description,
          type: resource.type,
          source: resource.source,
          url: resource.url,
          tags: resource.tags,
        })),
      )
      .select()

    if (!insertError && newResources) {
      resources = [...resources, ...newResources]
    }
  }

  // Mark resources as saved
  const resourcesWithSaved = resources.map((resource) => ({
    ...resource,
    saved: savedIds.includes(resource.id),
  }))

  return NextResponse.json({ data: resourcesWithSaved })
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

  // Get the resource data from the request
  const { resourceId, saved } = await request.json()

  if (saved) {
    // Save the resource
    const { data, error } = await supabase
      .from("saved_resources")
      .insert({
        user_id: user.id,
        resource_id: resourceId,
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })
  } else {
    // Unsave the resource
    const { data, error } = await supabase
      .from("saved_resources")
      .delete()
      .eq("user_id", user.id)
      .eq("resource_id", resourceId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  }
}
