import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, phone, address, dateOfBirth, gender } = await req.json()

    // Update user name
    await db.user.update({
      where: { id: session.user.id },
      data: { name },
    })

    // Update patient profile
    await db.patient.update({
      where: { userId: session.user.id },
      data: {
        phone,
        address,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender: gender || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}


