import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// GET single report by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { id } = await params
    
    const result = await pool.query(
      `SELECT * FROM voice_reports WHERE id = $1`,
      [id]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }
    
    return NextResponse.json({ report: result.rows[0] })
  } catch (error) {
    console.error("Error fetching report:", error)
    return NextResponse.json({ error: "Failed to fetch report" }, { status: 500 })
  }
}

// DELETE report
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { id } = await params
    
    await pool.query(`DELETE FROM voice_reports WHERE id = $1`, [id])
    
    return NextResponse.json({ status: "deleted" })
  } catch (error) {
    console.error("Error deleting report:", error)
    return NextResponse.json({ error: "Failed to delete report" }, { status: 500 })
  }
}
