import { NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    // Find admin user by username or email
    const rows: any = await executeQuery(
      "SELECT * FROM admin_users WHERE (username = ? OR email = ?) AND is_active = 1 LIMIT 1",
      [username, username]
    )

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const admin = rows[0]
const isValid = 
  password === admin.password_hash || 
  await bcrypt.compare(password, admin.password_hash)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Set a simple cookie to mark admin as logged in
    const response = NextResponse.json({ success: true })
    response.cookies.set("admin_auth", admin.username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE() {
  // Logout
  const response = NextResponse.json({ success: true })
  response.cookies.delete("admin_auth")
  return response
}