import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()
    const orderId = params.id

    await executeQuery("UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [status, orderId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
