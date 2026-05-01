import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const customers = await executeQuery(`
      SELECT 
        customer_name,
        customer_phone,
        COUNT(*) as total_orders
      FROM orders
      GROUP BY customer_phone
      ORDER BY MAX(created_at) DESC
    `)

    return NextResponse.json(customers)

  } catch (error) {
    console.error("Customers API error:", error)
    return NextResponse.json([], { status: 200 })
  }
}