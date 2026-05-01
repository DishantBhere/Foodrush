import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    // Get order details
    const orderResult = await executeQuery("SELECT * FROM orders WHERE id = ?", [orderId])
    const order = (orderResult as any[])[0]

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Get order items with food item details
    const orderItems = await executeQuery(
      `SELECT oi.*, fi.name, fi.image_url 
       FROM order_items oi 
       JOIN food_items fi ON oi.food_item_id = fi.id 
       WHERE oi.order_id = ?`,
      [orderId],
    )

    return NextResponse.json({ order, items: orderItems })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}
