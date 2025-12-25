import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    

    const response = await fetch(`${process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      throw new Error("Failed to submit to n8n")
    }

    const data = await response.json().catch(() => ({}))

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error("API Route Error:", error)
    return NextResponse.json({ success: false, error: "Failed to submit form" }, { status: 500 })
  }
}

