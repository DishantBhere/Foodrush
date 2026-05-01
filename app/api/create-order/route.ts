import { NextResponse } from "next/server"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
  try {
    const { amount, orderId } = await req.json()

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100), // paise
      currency: "INR",
      receipt: `foodrush_${orderId}`,
    })

    return NextResponse.json({ razorpayOrderId: order.id })
  } catch (error) {
    console.error("RAZORPAY ERROR:", error)
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 })
  }
}