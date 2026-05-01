import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { orderId, status } = await req.json()

    await executeQuery(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [status, orderId]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update status error:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}