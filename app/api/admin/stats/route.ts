import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    // Get today's date
    const today = new Date().toISOString().split("T")[0]

    // Total orders today
    const totalOrdersResult = (await executeQuery("SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = ?", [
      today,
    ])) as any[]

    // Total revenue today
    const totalRevenueResult = (await executeQuery(
      'SELECT COALESCE(SUM(total_amount), 0) as revenue FROM orders WHERE DATE(created_at) = ? AND status != "cancelled"',
      [today],
    )) as any[]

    // Pending orders
    const pendingOrdersResult = (await executeQuery(
      'SELECT COUNT(*) as count FROM orders WHERE status IN ("pending", "confirmed", "preparing")',
    )) as any[]

    // Average order value today
    const avgOrderValueResult = (await executeQuery(
      'SELECT COALESCE(AVG(total_amount), 0) as avg_value FROM orders WHERE DATE(created_at) = ? AND status != "cancelled"',
      [today],
    )) as any[]

    const stats = {
      totalOrders: totalOrdersResult[0]?.count || 0,
      totalRevenue: totalRevenueResult[0]?.revenue || 0,
      pendingOrders: pendingOrdersResult[0]?.count || 0,
      avgOrderValue: avgOrderValueResult[0]?.avg_value || 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
