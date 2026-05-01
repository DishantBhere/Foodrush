import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { is_available } = await request.json()
    const itemId = params.id

    await executeQuery("UPDATE food_items SET is_available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [
      is_available,
      itemId,
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating food item:", error)
    return NextResponse.json({ error: "Failed to update food item" }, { status: 500 })
  }
}
