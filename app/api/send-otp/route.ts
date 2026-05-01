import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import crypto from "crypto"
import otpStore from "@/lib/otp-store"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const otp = crypto.randomInt(100000, 999999).toString()

    otpStore.set(email, {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
    })

    console.log("SEND OTP:", otp) // debug

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: `"FoodRush.io" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your OTP</title>
</head>
<body style="margin:0;padding:0;background:#1a0305;font-family:Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a0305;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">

          <!-- Logo / Brand -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <div style="display:inline-block;background:linear-gradient(135deg,#9f242f,#7a1c25);border-radius:16px;padding:14px 28px;">
                <span style="font-size:22px;font-weight:900;color:#fff7d3;letter-spacing:0.04em;">
                  🍽️ FoodRush.io
                </span>
              </div>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:linear-gradient(160deg,#2d0608,#1f0405);border:1px solid rgba(159,36,47,0.35);border-radius:24px;overflow:hidden;">

              <!-- Red top bar -->
              <div style="height:4px;background:linear-gradient(to right,#7a1c25,#dc2626,#7a1c25);"></div>

              <table width="100%" cellpadding="0" cellspacing="0">

                <!-- Heading -->
                <tr>
                  <td align="center" style="padding:36px 36px 8px;">
                    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.28em;color:rgba(255,247,211,0.45);text-transform:uppercase;font-weight:600;">
                      Email Verification
                    </p>
                    <h1 style="margin:0;font-size:28px;font-weight:900;color:#fff7d3;letter-spacing:0.02em;">
                      Your One-Time Password
                    </h1>
                  </td>
                </tr>

                <!-- Subtitle -->
                <tr>
                  <td align="center" style="padding:10px 36px 28px;">
                    <p style="margin:0;font-size:14px;color:rgba(255,247,211,0.5);line-height:1.6;">
                      Use the code below to verify your email and complete your order on FoodRush.io
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:0 36px;">
                    <div style="height:1px;background:linear-gradient(to right,transparent,rgba(255,247,211,0.12),transparent);"></div>
                  </td>
                </tr>

                <!-- OTP Box -->
                <tr>
                  <td align="center" style="padding:32px 36px;">
                    <div style="display:inline-block;background:linear-gradient(135deg,rgba(159,36,47,0.25),rgba(122,28,37,0.15));border:1.5px solid rgba(159,36,47,0.5);border-radius:16px;padding:24px 40px;">
                      <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.22em;color:rgba(255,247,211,0.45);text-transform:uppercase;">
                        Verification Code
                      </p>
                      <p style="margin:0;font-size:44px;font-weight:900;color:#fff7d3;letter-spacing:0.32em;font-family:'Courier New',monospace;">
                        ${otp}
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Expiry note -->
                <tr>
                  <td align="center" style="padding:0 36px 16px;">
                    <table cellpadding="0" cellspacing="0" style="display:inline-table;">
                      <tr>
                        <td style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);border-radius:8px;padding:8px 16px;">
                          <p style="margin:0;font-size:12px;color:rgba(239,68,68,0.85);font-weight:600;letter-spacing:0.04em;">
                            ⏱ Expires in 5 minutes
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:16px 36px 0;">
                    <div style="height:1px;background:linear-gradient(to right,transparent,rgba(255,247,211,0.1),transparent);"></div>
                  </td>
                </tr>

                <!-- Warning -->
                <tr>
                  <td align="center" style="padding:20px 36px 32px;">
                    <p style="margin:0;font-size:12px;color:rgba(255,247,211,0.3);line-height:1.7;text-align:center;">
                      If you didn't request this code, you can safely ignore this email.<br/>
                      Never share this OTP with anyone.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 0 0;">
              <p style="margin:0;font-size:11px;color:rgba(255,247,211,0.2);letter-spacing:0.06em;">
                © 2025 FoodRush.io · All rights reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}