import { NextResponse } from "next/server"
import { getChatAnywhereResponse } from "@/lib/ai-service"

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const aiResponse = await getChatAnywhereResponse(message)

    return NextResponse.json({ message: aiResponse })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
