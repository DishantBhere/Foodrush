"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const orderId = searchParams.get("orderId")
  const amount = searchParams.get("amount") || "0"
  const trackingId = searchParams.get("tracking_id")

  const [showTicket, setShowTicket] = useState(false)
  const [loading, setLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => setScriptLoaded(true)
    script.onerror = () => console.error("Razorpay script failed to load")
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handleCopyAndTrack = async () => {
    try {
      await navigator.clipboard.writeText(trackingId || "")
      setCopied(true)
      setTimeout(() => {
        router.push(`/track?tracking_id=${trackingId}`)
      }, 600)
    } catch {
      // Fallback if clipboard API fails
      router.push(`/track?tracking_id=${trackingId}`)
    }
  }

  const handlePayment = async () => {
    if (!scriptLoaded) {
      alert("Payment gateway is loading, please wait...")
      return
    }

    if (!trackingId) {
      alert("Tracking ID missing ❌ Fix checkout flow")
      return
    }

    if (!orderId) {
      alert("Order ID missing ❌")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, orderId }),
      })

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`)
      }

      const data = await res.json()

      if (!data.razorpayOrderId) {
        alert("Failed to create payment order.")
        setLoading(false)
        return
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(Number(amount) * 100),
        currency: "INR",
        name: "FoodRush.io",
        description: `Order #${orderId}`,
        order_id: data.razorpayOrderId,

        handler: function () {
          if (trackingId) {
            localStorage.setItem("lastTrackingId", trackingId)
          }
          setLoading(false)
          setShowTicket(true)
        },

        theme: { color: "#dc2626" },

        modal: {
          ondismiss: function () {
            setLoading(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)

      rzp.on("payment.failed", function () {
        alert("Payment failed ❌ Please try again.")
        setLoading(false)
      })

      rzp.open()
    } catch (error) {
      console.error("Payment error:", error)
      alert("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#9f242f] text-white px-4">

      {/* PAYMENT CARD */}
      <div className="bg-[#7f1d1d] rounded-3xl p-10 max-w-md w-full text-center shadow-2xl border border-white/10">

        <div className="text-6xl mb-4">🍽️</div>

        <h1 className="text-3xl font-bold mb-2">Complete Payment</h1>
        <p className="text-white/70 text-sm">Order #{orderId}</p>

        <div className="bg-white/10 rounded-2xl py-4 px-6 my-6">
          <p className="text-sm text-white/60">Total Amount</p>
          <p className="text-4xl font-extrabold">₹{amount}</p>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading || !scriptLoaded}
          className="w-full bg-white text-[#9f242f] font-bold py-4 rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
        >
          {loading
            ? "Opening..."
            : !scriptLoaded
            ? "Loading..."
            : `Pay ₹${amount}`}
        </button>
      </div>

      {/* 🎟️ TICKET */}
      {showTicket && (
        <div
          className="fixed bottom-6 right-6 z-50"
          style={{
            width: "230px",
            animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(40px) scale(0.95); }
              to   { opacity: 1; transform: translateY(0)   scale(1);    }
            }
          `}</style>

          {/* Subtle glow */}
          <div
            style={{
              position: "absolute",
              inset: "-3px",
              borderRadius: "10px",
              background: "linear-gradient(120deg,#9f242f,#ffcc70,#9f242f)",
              filter: "blur(8px)",
              opacity: 0.25,
              zIndex: -1,
            }}
          />

          {/* Perforated top */}
          <svg
            width="230"
            height="16"
            style={{ display: "block" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="230" height="16" fill="#7a1c25" />
            {[10, 30, 50, 70, 90, 110, 130, 150, 170, 190, 210].map((cx) => (
              <circle key={cx} cx={cx} cy="16" r="7" fill="#9f242f" />
            ))}
          </svg>

          {/* Cream body */}
          <div
            style={{
              background:
                "linear-gradient(155deg,#f5edd8 0%,#e8d9b8 35%,#f0e4c8 65%,#d4c49a 100%)",
              padding: "18px 18px 16px",
            }}
          >
            <div
              style={{
                border: "2px solid #9f242f",
                borderRadius: "6px",
                padding: "14px 12px 16px",
                textAlign: "center",
                position: "relative",
              }}
            >
              {/* Inner border */}
              <div
                style={{
                  border: "1px solid rgba(159,36,47,0.35)",
                  position: "absolute",
                  inset: "4px",
                  borderRadius: "3px",
                  pointerEvents: "none",
                }}
              />

              <p
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.28em",
                  color: "#7a1c25",
                  margin: "0 0 3px",
                  fontWeight: 600,
                  fontFamily: "Arial, sans-serif",
                  textTransform: "uppercase",
                }}
              >
                Keep This
              </p>

              <p
                style={{
                  fontSize: "32px",
                  fontWeight: 900,
                  color: "#7a1c25",
                  margin: "0 0 2px",
                  letterSpacing: "0.06em",
                  fontFamily: "Arial Black, Arial, sans-serif",
                  lineHeight: 1,
                }}
              >
                TICKET
              </p>

              <div
                style={{
                  height: "1px",
                  background:
                    "linear-gradient(to right,transparent,#9f242f,transparent)",
                  margin: "8px 0",
                  opacity: 0.4,
                }}
              />

              <p
                style={{
                  fontSize: "9px",
                  color: "#9f242f",
                  margin: "0 0 4px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  opacity: 0.7,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                Order Tracking ID
              </p>

              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#5a1018",
                  letterSpacing: "0.14em",
                  margin: 0,
                  fontFamily: "'Courier New', monospace",
                  wordBreak: "break-all",
                }}
              >
                {trackingId || "—"}
              </p>
            </div>
          </div>

          {/* Scalloped tear line */}
          <svg
            width="230"
            height="20"
            style={{ display: "block" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="230" height="20" fill="#5a1018" />
            <path
              d="M0,0 Q10,12 20,0 Q30,12 40,0 Q50,12 60,0 Q70,12 80,0 Q90,12 100,0 Q110,12 120,0 Q130,12 140,0 Q150,12 160,0 Q170,12 180,0 Q190,12 200,0 Q210,12 220,0 Q225,12 230,0 L230,20 L0,20 Z"
              fill="#f0e4c8"
            />
          </svg>

          {/* Dark stub */}
          <div
            style={{
              background: "#5a1018",
              padding: "12px 18px 16px",
              textAlign: "center",
            }}
          >
            {/* Barcode */}
            <svg
              width="188"
              height="40"
              viewBox="0 0 188 40"
              style={{ display: "block", margin: "0 auto 6px" }}
            >
              {[
                4, 9, 12, 16, 19, 24, 27, 31, 36, 39, 43, 46, 51, 55, 58, 62,
                65, 70, 73, 77, 82, 85, 89, 92, 97, 101, 104, 108, 113, 116,
                120, 123, 128, 132, 135, 139, 144, 147, 151, 154, 159, 163,
                166, 170, 175, 178, 182,
              ].map((x, i) => (
                <rect
                  key={x}
                  x={x}
                  y="0"
                  width={i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1}
                  height="32"
                  fill="#fff7d3"
                />
              ))}
              <text
                x="94"
                y="40"
                textAnchor="middle"
                fill="#fff7d3"
                fontSize="8"
                fontFamily="Courier New, monospace"
                letterSpacing="2.5"
                opacity="0.7"
              >
                {trackingId?.slice(0, 10) || "----------"}
              </text>
            </svg>

            <p
              style={{
                fontSize: "16px",
                fontWeight: 900,
                color: "#fff7d3",
                letterSpacing: "0.24em",
                margin: "0 0 12px",
                fontFamily: "Arial Black, Arial, sans-serif",
              }}
            >
              FOODRUSH.IO
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Copy + Redirect button */}
              <button
                onClick={handleCopyAndTrack}
                style={{
                  background: copied
                    ? "rgba(255,247,211,0.25)"
                    : "rgba(255,247,211,0.1)",
                  border: "0.5px solid rgba(255,247,211,0.3)",
                  borderRadius: "7px",
                  padding: "5px 14px",
                  fontSize: "10px",
                  color: "#fff7d3",
                  cursor: "pointer",
                  letterSpacing: "0.08em",
                  fontFamily: "Arial, sans-serif",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                }}
              >
                {copied ? "Copied ✓" : "Copy ID"}
              </button>

              <span
                style={{
                  fontSize: "9px",
                  color: "rgba(255,247,211,0.4)",
                  letterSpacing: "0.06em",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {copied ? "Going..." : "Tap to track →"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}