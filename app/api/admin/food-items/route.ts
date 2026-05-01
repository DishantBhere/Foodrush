import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const foodItems = await executeQuery(`
      SELECT fi.*, c.name as category_name 
      FROM food_items fi 
      LEFT JOIN categories c ON fi.category_id = c.id 
      ORDER BY c.name, fi.name
    `)

    return NextResponse.json(foodItems)
  } catch (error) {
    console.error("Error fetching food items:", error)
    return NextResponse.json({ error: "Failed to fetch food items" }, { status: 500 })
  }
}
