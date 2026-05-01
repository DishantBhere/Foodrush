import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import crypto from "crypto"

// ── Tracking ID generator ──────────────────────────────────────────────────
function generateTrackingId(): string {
  const year = new Date().getFullYear()
  const random = crypto.randomBytes(3).toString("hex").toUpperCase()
  return `FR-${year}-${random}`
}

export async function POST(request: Request) {
  try {
    const { customer_name, customer_phone, customer_email, items, order_type, table_number, special_instructions } =
      await request.json()

    const total_amount = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    // ── Generate unique tracking ID ────────────────────────────────────────
    let tracking_id = ""
    let isUnique = false
    while (!isUnique) {
      tracking_id = generateTrackingId()
      const existing = await executeQuery(
        "SELECT id FROM orders WHERE tracking_id = ?",
        [tracking_id]
      ) as any[]
      if (existing.length === 0) isUnique = true
    }

    // ── Insert order with tracking_id ──────────────────────────────────────
    const orderResult = (await executeQuery(
      `INSERT INTO orders (tracking_id, customer_name, customer_phone, customer_email, total_amount, order_type, table_number, special_instructions, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [tracking_id, customer_name, customer_phone, customer_email, total_amount, order_type, table_number, special_instructions],
    )) as any

    const orderId = orderResult.insertId

    for (const item of items) {
      await executeQuery(
        `INSERT INTO order_items (order_id, food_item_id, quantity, unit_price, total_price) 
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.id, item.quantity, item.price, item.price * item.quantity],
      )
    }

    // ── Return tracking_id to frontend ─────────────────────────────────────
    return NextResponse.json({ success: true, orderId, tracking_id })

  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tracking_id = searchParams.get("tracking_id") // ← phone ki jagah tracking_id

    let query = "SELECT * FROM orders"
    const params: any[] = []

    if (tracking_id) {
      query += " WHERE tracking_id = ?"
      params.push(tracking_id)
    }

    query += " ORDER BY created_at DESC"

    const orders = await executeQuery(query, params) as any[]

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