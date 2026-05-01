import { NextResponse } from "next/server"
import otpStore from "@/lib/otp-store"

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json()

    const record = otpStore.get(email)

    console.log("VERIFY OTP:", otp)
    console.log("STORED OTP:", record?.otp)

    if (!record) {
      return NextResponse.json({ error: "OTP not found" }, { status: 400 })
    }

    if (Date.now() > record.expires) {
      otpStore.delete(email)
      return NextResponse.json({ error: "OTP expired" }, { status: 400 })
    }

    if (record.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    otpStore.delete(email)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}