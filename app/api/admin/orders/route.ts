import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const orders = await executeQuery(`
      SELECT id, customer_name, customer_phone, customer_email, 
             total_amount, status, order_type,tracking_id, 
             created_at 
      FROM orders 
      ORDER BY 
        CASE 
          WHEN status = 'pending' THEN 1
          WHEN status = 'confirmed' THEN 2
          WHEN status = 'preparing' THEN 3
          WHEN status = 'ready' THEN 4
          ELSE 5
        END,
        created_at DESC
    `) as any[]

    // Fetch items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order: any) => {
        const items = await executeQuery(
          `SELECT oi.quantity, oi.unit_price, fi.name, fi.image_url 
           FROM order_items oi 
           JOIN food_items fi ON oi.food_item_id = fi.id 
           WHERE oi.order_id = ?`,
          [order.id]
        ) as any[]
        return { ...order, items }
      })
    )

    return NextResponse.json(ordersWithItems)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}