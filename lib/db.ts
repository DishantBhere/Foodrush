// Database connection utility for MySQL
import mysql from "mysql2/promise"

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "food_ordering_system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

let pool: mysql.Pool

export function getDbConnection() {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
  }
  return pool
}

export async function executeQuery(query: string, params: any[] = []) {
  const connection = getDbConnection()
  try {
    const [results] = await connection.execute(query, params)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Types for our database entities
export interface Category {
  id: number
  name: string
  description: string
  image_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface FoodItem {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  category_id: number
  is_available: boolean
  preparation_time: number
  created_at: string
  updated_at: string
}

export interface Order {
  id: number
  customer_id?: number
  customer_name: string
  customer_phone: string
  total_amount: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
  order_type: "dine_in" | "takeaway"
  table_number?: string
  special_instructions?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  food_item_id: number
  quantity: number
  unit_price: number
  total_price: number
  special_requests?: string
  created_at: string
}
