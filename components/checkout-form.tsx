"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { ShoppingBag, User, MapPin, Mail, CheckCircle2, Loader2 } from "lucide-react"
import Image from "next/image"

// ─── Styles ───────────────────────────────────────────────────────────────────
const glassCard = {
  background: "rgba(255,247,211,0.06)",
  border: "1px solid rgba(255,247,211,0.12)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
}

const glassInput = {
  background: "rgba(255,247,211,0.1)",
  border: "1px solid rgba(255,247,211,0.2)",
  color: "#fff7d3",
  outline: "none",
  borderRadius: "0.75rem",
  padding: "0.65rem 1rem",
  width: "100%",
  fontSize: "0.95rem",
}

const labelStyle = {
  color: "rgba(255,247,211,0.7)",
  fontSize: "0.85rem",
  fontWeight: 600,
  marginBottom: "0.4rem",
  display: "block",
  letterSpacing: "0.02em",
}

const divider = {
  borderTop: "1px solid rgba(255,247,211,0.1)",
  margin: "1.5rem 0",
}
// ─────────────────────────────────────────────────────────────────────────────

type OtpStep = "idle" | "sending" | "sent" | "verifying" | "verified"

export function CheckoutForm() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    order_type: "dine_in",
    table_number: "",
    special_instructions: "",
  })

  // ── Phone validation ──────────────────────────────────────────────────────
  const [phoneError, setPhoneError] = useState("")

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10)
    handleInputChange("customer_phone", digits)
    if (digits.length > 0 && digits.length < 10) {
      setPhoneError("Phone number must be exactly 10 digits")
    } else {
      setPhoneError("")
    }
  }

  // ── Email OTP state ───────────────────────────────────────────────────────
  const [otpStep, setOtpStep] = useState<OtpStep>("idle")
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""])
  const [otpError, setOtpError] = useState("")
  const [resendTimer, setResendTimer] = useState(0)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      timerRef.current = setTimeout(() => setResendTimer((t) => t - 1), 1000)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [resendTimer])

  const handleEmailChange = (value: string) => {
    handleInputChange("customer_email", value)
    // Reset OTP if email changes after being sent
    if (otpStep !== "idle") {
      setOtpStep("idle")
      setOtpDigits(["", "", "", "", "", ""])
      setOtpError("")
    }
  }

  const handleSendOtp = async () => {
    if (!formData.customer_email || !formData.customer_email.includes("@")) {
      setOtpError("Please enter a valid email address first")
      return
    }

    setOtpStep("sending")
    setOtpError("")

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.customer_email }),
      })
      const data = await res.json()

      if (data.success) {
        setOtpStep("sent")
        setResendTimer(30)
        setOtpDigits(["", "", "", "", "", ""])
        setTimeout(() => otpRefs.current[0]?.focus(), 100)
      } else {
        setOtpError(data.error || "Failed to send OTP. Please try again.")
        setOtpStep("idle")
      }
    } catch {
      setOtpError("Network error. Please check your connection and try again.")
      setOtpStep("idle")
    }
  }

  const handleOtpDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1)
    const newDigits = [...otpDigits]
    newDigits[index] = digit
    setOtpDigits(newDigits)
    setOtpError("")

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all 6 digits filled
    if (index === 5 && digit) {
      const fullOtp = [...newDigits.slice(0, 5), digit].join("")
      if (fullOtp.length === 6) handleVerifyOtp(fullOtp)
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (!pasted) return
    const newDigits = Array(6).fill("")
    pasted.split("").forEach((ch, i) => { newDigits[i] = ch })
    setOtpDigits(newDigits)
    setOtpError("")
    const focusIdx = Math.min(pasted.length, 5)
    otpRefs.current[focusIdx]?.focus()
    if (pasted.length === 6) handleVerifyOtp(pasted)
  }

  const handleVerifyOtp = async (code?: string) => {
    const otp = code ?? otpDigits.join("")
    if (otp.length !== 6) {
      setOtpError("Please enter the full 6-digit OTP")
      return
    }

    setOtpStep("verifying")
    setOtpError("")

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.customer_email, otp }),
      })
      const data = await res.json()

      if (data.success) {
        setOtpStep("verified")
      } else {
        setOtpError(data.error || "Invalid OTP. Please try again.")
        setOtpStep("sent")
        setOtpDigits(["", "", "", "", "", ""])
        setTimeout(() => otpRefs.current[0]?.focus(), 100)
      }
    } catch {
      setOtpError("Network error. Please try again.")
      setOtpStep("sent")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return

    if (formData.customer_phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits")
      return
    }

    if (otpStep !== "verified") {
      setOtpError("Please verify your email address with OTP before placing the order.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, items }),
      })

      if (response.ok) {
const { orderId, tracking_id } = await response.json()

        const totalAmount = getTotalPrice().toFixed(0)

        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: formData.customer_name,
            customerEmail: formData.customer_email,
            orderId,
            items,
            total: getTotalPrice().toFixed(2),
          }),
        })

        const existingOrders = JSON.parse(localStorage.getItem("liveOrders") || "[]")
        const newOrder = {
          id: Date.now(),
          name: formData.customer_name,
          phone: formData.customer_phone,
          food: items.map((item) => item.name).join(", "),
        }
        localStorage.setItem("liveOrders", JSON.stringify([...existingOrders, newOrder]))

        clearCart()
router.push(`/payment?orderId=${orderId}&amount=${totalAmount}&tracking_id=${tracking_id}`)

      } else {
        throw new Error("Failed to create order")
      }
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Failed to create order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // ── Empty cart ─────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="rounded-3xl p-16 text-center max-w-lg mx-auto" style={glassCard}>
        <ShoppingBag className="h-14 w-14 mx-auto mb-5" style={{ color: "rgba(255,247,211,0.3)" }} />
        <h3 className="text-xl font-bold text-[#fff7d3] mb-2">Your cart is empty</h3>
        <p className="mb-6" style={{ color: "rgba(255,247,211,0.5)" }}>
          Add some delicious items to your cart first!
        </p>
        <Button
          onClick={() => router.push("/")}
          className="font-bold rounded-full px-8 hover:scale-105 transition-all duration-200"
          style={{ background: "#fff7d3", color: "#9f242f" }}
        >
          Browse Menu
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* ── Order Summary ── */}
      <div className="rounded-3xl p-8" style={glassCard}>
        <h2 className="flex items-center gap-2 text-lg font-bold text-[#fff7d3] mb-6">
          <ShoppingBag className="h-5 w-5" style={{ color: "rgba(255,247,211,0.6)" }} />
          Order Summary
        </h2>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden">
                <Image src={item.image_url || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#fff7d3] truncate">{item.name}</p>
                <p className="text-xs" style={{ color: "rgba(255,247,211,0.5)" }}>Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-bold text-[#fff7d3]">
                ₹{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div style={divider} />

        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-[#fff7d3]">Total:</span>
          <span className="text-xl font-extrabold text-[#fff7d3]">₹{getTotalPrice().toFixed(2)}</span>
        </div>
      </div>

      {/* ── Order Details Form ── */}
      <div className="rounded-3xl p-8" style={glassCard}>
        <h2 className="flex items-center gap-2 text-lg font-bold text-[#fff7d3] mb-6">
          <User className="h-5 w-5" style={{ color: "rgba(255,247,211,0.6)" }} />
          Order Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Full Name */}
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input
              type="text"
              required
              value={formData.customer_name}
              onChange={(e) => handleInputChange("customer_name", e.target.value)}
              placeholder="Enter your full name"
              style={glassInput}
              className="placeholder-[#fff7d3]/30 focus:ring-0"
            />
          </div>

          {/* ── Phone — plain input, no OTP ── */}
          <div>
            <label style={labelStyle}>Phone Number *</label>
            <div className="flex gap-2">
              {/* +91 prefix */}
              <div
                className="flex items-center px-3 rounded-xl text-sm font-semibold flex-shrink-0"
                style={{
                  background: "rgba(255,247,211,0.1)",
                  border: "1px solid rgba(255,247,211,0.2)",
                  color: "rgba(255,247,211,0.7)",
                  minWidth: "3.5rem",
                }}
              >
                +91
              </div>
              <input
                type="tel"
                required
                inputMode="numeric"
                maxLength={10}
                value={formData.customer_phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="10-digit number"
                style={{
                  ...glassInput,
                  borderColor: phoneError ? "rgba(239,68,68,0.6)" : "rgba(255,247,211,0.2)",
                }}
                className="placeholder-[#fff7d3]/30 focus:ring-0"
              />
            </div>
            {phoneError && (
              <p className="mt-1.5 text-xs" style={{ color: "rgba(239,68,68,0.85)" }}>
                {phoneError}
              </p>
            )}
          </div>

          {/* ── Email + OTP ── */}
          <div>
            <label style={labelStyle}>Email Address *</label>

            <div className="flex gap-2">
              <input
                type="email"
                required
                value={formData.customer_email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="Enter your email address"
                style={{
                  ...glassInput,
                  borderColor: otpError && otpStep === "idle" ? "rgba(239,68,68,0.6)" : "rgba(255,247,211,0.2)",
                }}
                className="placeholder-[#fff7d3]/30 focus:ring-0"
                disabled={otpStep === "verified"}
              />

              {/* Send / Resend OTP button */}
              {otpStep !== "verified" && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={
                    otpStep === "sending" ||
                    !formData.customer_email.includes("@") ||
                    resendTimer > 0
                  }
                  className="flex-shrink-0 rounded-xl px-4 text-sm font-bold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                  style={{
                    background: "rgba(255,247,211,0.15)",
                    border: "1px solid rgba(255,247,211,0.25)",
                    color: "#fff7d3",
                    minWidth: "6rem",
                  }}
                >
                  {otpStep === "sending" ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  ) : resendTimer > 0 ? (
                    `${resendTimer}s`
                  ) : otpStep === "sent" || otpStep === "verifying" ? (
                    "Resend"
                  ) : (
                    "Send OTP"
                  )}
                </button>
              )}

             {/* Verified badge */}
{otpStep === "verified" && (
  <div
    className="flex items-center gap-1.5 flex-shrink-0 rounded-xl px-3 text-sm font-semibold"
    style={{
      background: "rgba(34,197,94,0.12)",
      border: "1px solid rgba(34,197,94,0.3)",
      color: "#4ade80",
      boxShadow: "0 0 12px rgba(34,197,94,0.1)",
    }}
  >
    <CheckCircle2 className="h-4 w-4" />
    Verified
  </div>
)}
            </div>

{/* ── OTP Input Panel ── */}
{(otpStep === "sent" || otpStep === "verifying") && (
  <div
    className="mt-4 rounded-2xl overflow-hidden"
    style={{
      border: "1px solid rgba(255,247,211,0.14)",
      animation: "fadeSlideIn 0.35s cubic-bezier(0.16,1,0.3,1)",
    }}
  >
    {/* Header strip */}
    <div
      className="flex items-center gap-2 px-4 py-2.5"
      style={{
        background: "rgba(255,247,211,0.07)",
        borderBottom: "1px solid rgba(255,247,211,0.1)",
      }}
    >
      <div
        className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(255,247,211,0.12)", border: "1px solid rgba(255,247,211,0.2)" }}
      >
        <Mail className="h-3 w-3" style={{ color: "rgba(255,247,211,0.7)" }} />
      </div>
      <div>
        <p className="text-xs font-semibold" style={{ color: "rgba(255,247,211,0.8)", lineHeight: 1.3 }}>
          Check your inbox
        </p>
        <p className="text-xs" style={{ color: "rgba(255,247,211,0.4)", lineHeight: 1.3 }}>
          Sent to{" "}
          <span style={{ color: "rgba(255,247,211,0.65)", fontFamily: "monospace" }}>
            {formData.customer_email}
          </span>
        </p>
      </div>
    </div>

    {/* OTP boxes */}
    <div className="px-4 py-4" style={{ background: "rgba(255,247,211,0.03)" }}>
      <p className="text-center text-xs mb-3 font-medium" style={{ color: "rgba(255,247,211,0.45)", letterSpacing: "0.08em" }}>
        ENTER 6-DIGIT CODE
      </p>

      <div className="flex gap-2 justify-center mb-4">
        {otpDigits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { otpRefs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpDigitChange(i, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(i, e)}
            onPaste={i === 0 ? handleOtpPaste : undefined}
            disabled={otpStep === "verifying"}
            className="text-center font-bold transition-all duration-150"
            style={{
              width: "2.75rem",
              height: "3.1rem",
              borderRadius: "0.75rem",
              fontSize: i === 2 ? "1.25rem" : "1.15rem", // subtle size rhythm
              background: digit
                ? "rgba(255,247,211,0.16)"
                : "rgba(255,247,211,0.06)",
              border: digit
                ? "1.5px solid rgba(255,247,211,0.5)"
                : "1.5px solid rgba(255,247,211,0.15)",
              boxShadow: digit ? "0 0 0 3px rgba(255,247,211,0.06)" : "none",
              color: "#fff7d3",
              outline: "none",
              caretColor: "#fff7d3",
            }}
          />
        ))}
      </div>

      {/* Verify button */}
      {otpStep === "sent" && otpDigits.join("").length === 6 && (
        <button
          type="button"
          onClick={() => handleVerifyOtp()}
          className="w-full rounded-xl py-2.5 text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "rgba(255,247,211,0.14)",
            border: "1px solid rgba(255,247,211,0.3)",
            color: "#fff7d3",
            letterSpacing: "0.04em",
          }}
        >
          Verify OTP →
        </button>
      )}

      {/* Verifying spinner */}
      {otpStep === "verifying" && (
        <div className="flex items-center justify-center gap-2 py-1">
          <Loader2 className="h-4 w-4 animate-spin" style={{ color: "rgba(255,247,211,0.55)" }} />
          <span className="text-xs font-medium" style={{ color: "rgba(255,247,211,0.5)", letterSpacing: "0.05em" }}>
            Verifying…
          </span>
        </div>
      )}

      {/* Error */}
      {otpError && (
        <p
          className="mt-2.5 text-xs text-center rounded-lg py-2 px-3"
          style={{
            color: "rgba(239,68,68,0.9)",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          {otpError}
        </p>
      )}
    </div>
  </div>
)}

            {/* OTP required warning (shown below email when idle) */}
            {otpError && otpStep === "idle" && (
              <p className="mt-1.5 text-xs" style={{ color: "rgba(239,68,68,0.85)" }}>
                {otpError}
              </p>
            )}
          </div>

          <div style={divider} />

          {/* Order Type */}
          <div>
            <label style={labelStyle}>Order Type *</label>
            <div className="flex flex-col gap-3 mt-2">
              {[
                { value: "dine_in", label: "Dine In", icon: <MapPin className="h-4 w-4" /> },
                { value: "takeaway", label: "Takeaway", icon: <ShoppingBag className="h-4 w-4" /> },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer"
                  style={{
                    background: formData.order_type === option.value
                      ? "rgba(255,247,211,0.12)"
                      : "rgba(255,247,211,0.04)",
                    border: formData.order_type === option.value
                      ? "1px solid rgba(255,247,211,0.35)"
                      : "1px solid rgba(255,247,211,0.1)",
                    borderRadius: "0.75rem",
                    padding: "0.65rem 1rem",
                    transition: "all 0.2s",
                  }}
                >
                  <input
                    type="radio"
                    name="order_type"
                    value={option.value}
                    checked={formData.order_type === option.value}
                    onChange={(e) => handleInputChange("order_type", e.target.value)}
                    className="accent-[#fff7d3]"
                  />
                  <span
                    style={{ color: "rgba(255,247,211,0.85)" }}
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    {option.icon} {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Table Number */}
          {formData.order_type === "dine_in" && (
            <div>
              <label style={labelStyle}>Table Number</label>
              <input
                type="text"
                value={formData.table_number}
                onChange={(e) => handleInputChange("table_number", e.target.value)}
                placeholder="Enter your table number (optional)"
                style={glassInput}
                className="placeholder-[#fff7d3]/30 focus:ring-0"
              />
            </div>
          )}

          {/* Special Instructions */}
          <div>
            <label style={labelStyle}>Special Instructions</label>
            <textarea
              value={formData.special_instructions}
              onChange={(e) => handleInputChange("special_instructions", e.target.value)}
              placeholder="Any special requests or dietary requirements..."
              rows={3}
              style={{ ...glassInput, resize: "vertical" }}
              className="placeholder-[#fff7d3]/30 focus:ring-0"
            />
          </div>

          <div style={divider} />

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading || otpStep !== "verified"}
            className="w-full font-bold rounded-full py-6 text-base hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
            style={{ background: "#fff7d3", color: "#9f242f" }}
          >
            {loading ? "Placing Order..." : `Place Order · ₹${getTotalPrice().toFixed(2)}`}
          </Button>

          {otpStep !== "verified" && (
            <p className="text-center text-xs" style={{ color: "rgba(255,247,211,0.4)" }}>
              Verify your email address via OTP to place the order
            </p>
          )}

        </form>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}