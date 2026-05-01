import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("category")

    let query = `
      SELECT fi.*, c.name as category_name 
      FROM food_items fi 
      LEFT JOIN categories c ON fi.category_id = c.id 
      WHERE fi.is_available = TRUE
    `
    const params: any[] = []

    if (categoryId) {
      query += " AND fi.category_id = ?"
      params.push(categoryId)
    }

    query += " ORDER BY c.name, fi.name"

    const foodItems = await executeQuery(query, params)

    return NextResponse.json(foodItems)
  } catch (error) {
    console.error("Error fetching food items:", error)
    return NextResponse.json({ error: "Failed to fetch food items" }, { status: 500 })
  }
}
