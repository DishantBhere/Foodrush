import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const rows: any = await executeQuery(`
      SELECT 
        id AS order_id,
        customer_name,
        customer_phone,
        customer_email,
        total_amount,
        status,
        order_type,
        table_number,
        special_instructions,
        created_at
      FROM orders
      ORDER BY created_at DESC
    `)

    // CSV headers
    const headers = [
      "Order ID",
      "Customer Name",
      "Phone",
      "Email",
      "Amount (Rs.)",
      "Status",
      "Order Type",
      "Table Number",
      "Special Instructions",
      "Date",
    ]

    // Format date nicely
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr)
      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    }

    // Format order type nicely
    const formatOrderType = (type: string) => {
      if (type === "dine_in") return "Dine In"
      if (type === "takeaway") return "Takeaway"
      return type || "-"
    }

    // CSV rows
    const csvRows = [
      headers.join(","),
      ...rows.map((row: any) =>
        [
          `#${row.order_id}`,
          `"${row.customer_name || ""}"`,
          `"${row.customer_phone || ""}"`,
          `"${row.customer_email || "-"}"`,
          `Rs.${Number(row.total_amount).toFixed(2)}`,
          row.status
            ? row.status.charAt(0).toUpperCase() + row.status.slice(1)
            : "-",
          formatOrderType(row.order_type),
          `"${row.table_number || "-"}"`,
          `"${row.special_instructions || "-"}"`,
          `"${formatDate(row.created_at)}"`,
        ].join(",")
      ),
    ]

    const csv = csvRows.join("\n")

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=FoodRush-Orders-${new Date()
          .toISOString()
          .slice(0, 10)}.csv`,
      },
    })
  } catch (error) {
    console.error("EXPORT ERROR:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}