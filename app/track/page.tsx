"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { CartSidebar } from "@/components/cart-sidebar"
import { Button } from "@/components/ui/button"
import ClickSpark from "@/components/ClickSpark"
import Shuffle from "@/components/Shuffle"

export default function TrackPage() {
const [trackingId, setTrackingId] = useState("")

  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
if (!trackingId.trim()) {
  setError("Please enter tracking ID")
  return
}

    try {
      setLoading(true)
const res = await fetch(`/api/orders?tracking_id=${trackingId}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      setOrders(data)
    } catch (err: any) {
      setOrders([])
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const steps = ["pending", "confirmed", "preparing", "ready", "completed"]

  const stepColors: Record<string, string> = {
    pending: "bg-yellow-400",
    confirmed: "bg-blue-400",
    preparing: "bg-orange-400",
    ready: "bg-purple-400",
    completed: "bg-green-500",
  }

  const stepTextColors: Record<string, string> = {
    pending: "text-yellow-400",
    confirmed: "text-blue-400",
    preparing: "text-orange-400",
    ready: "text-purple-400",
    completed: "text-green-400",
  }

  const getProgressColor = (status: string) => {
    if (status === "cancelled") return "bg-red-500"
    return stepColors[status] || "bg-green-500"
  }

  const getProgressWidth = (status: string) => {
    if (status === "cancelled") return "100%"
    const index = steps.indexOf(status)
    if (index === -1) return "0%"
    return `${((index + 1) / steps.length) * 100}%`
  }

  return (
    <div className="min-h-screen text-[#fff7d3]" style={{ background: "transparent", position: "relative", zIndex: 1 }}>

      <ClickSpark
        sparkColor="#fff7d3"
        sparkSize={14}
        sparkRadius={25}
        sparkCount={12}
        duration={600}
        easing="ease-out"
        extraScale={1.5}
      ></ClickSpark>

      <Header transparent />

      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.35em] font-semibold mb-3" style={{ color: "rgba(255,247,211,0.4)" }}>
            Order Status
          </p>
        <h1 className="font-extrabold text-[#fff7d3] tracking-tight mb-4" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}>
  <span style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 800 }}>
    <Shuffle
      text="Track Your Order"
      ease="power2.out"
      shuffleDirection="down"
      shuffleTimes={6}
      stagger={0.07}
      loop={true}
      loopDelay={0.9}
    />
  </span>
</h1>
          <div className="mx-auto mb-4 rounded-full" style={{ width: "3rem", height: "3px", background: "rgba(255,247,211,0.2)" }} />
          <p style={{ color: "rgba(255,247,211,0.6)", fontSize: "1rem" }}>
            Enter your Track number to see the status of your recent orders
          </p>
        </div>

        <div
          className="max-w-3xl mx-auto rounded-3xl p-10"
          style={{
            background: "rgba(255,247,211,0.06)",
            border: "1px solid rgba(255,247,211,0.12)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              value={trackingId}
  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
  placeholder="Enter your Tracking ID  e.g. FR-2026-A7X9K2"
              className="flex-1 px-4 py-3 rounded-full placeholder-[#fff7d3]/40 text-[#fff7d3] focus:outline-none"
              style={{ background: "rgba(255,247,211,0.1)", border: "1px solid rgba(255,247,211,0.2)" }}
            />
            <Button
              type="submit"
              disabled={loading}
              className="font-bold rounded-full px-8 hover:scale-105 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
              style={{ background: "#fff7d3", color: "#9f242f" }}
            >
              {loading ? "Checking..." : "Track Orders"}
            </Button>
          </form>

          {error && <p className="text-red-300">{error}</p>}

          {orders.length > 0 && (
            <div className="space-y-8 mt-6">
              {orders.map((order) => {
                const currentIndex = steps.indexOf(order.status)

                return (
                  <div
                    key={order.id}
                    className="p-6 rounded-2xl"
                    style={{
                      background: "rgba(255,247,211,0.06)",
                      border: "1px solid rgba(255,247,211,0.12)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                    }}
                  >
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <p className="text-lg font-bold">Order #{order.id}</p>
                        <p className="text-sm text-[#fff7d3]/60">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          ₹{Number(order.total_amount || 0).toFixed(2)}
                        </p>
                        <span
                          className={`capitalize text-sm font-semibold px-3 py-1 rounded-full mt-1 inline-block ${
                            order.status === "cancelled"
                              ? "bg-red-900 text-red-300 border border-red-500"
                              : order.status === "completed"
                              ? "bg-green-900 text-green-300 border border-green-500"
                              : order.status === "preparing"
                              ? "bg-orange-900 text-orange-300 border border-orange-500"
                              : order.status === "confirmed"
                              ? "bg-blue-900 text-blue-300 border border-blue-500"
                              : order.status === "ready"
                              ? "bg-purple-900 text-purple-300 border border-purple-500"
                              : "bg-yellow-900 text-yellow-300 border border-yellow-500"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="relative w-full h-3 bg-[#fff7d3]/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${getProgressColor(order.status)}`}
                        style={{ width: getProgressWidth(order.status) }}
                      />
                    </div>

                    <div className="flex justify-between text-xs mt-3 font-medium">
                      {steps.map((step, index) => {
                        const isActive = order.status !== "cancelled" && currentIndex >= index
                        return (
                          <span
                            key={step}
                            className={`transition-colors duration-300 ${
                              order.status === "cancelled"
                                ? "text-[#fff7d3]/30"
                                : isActive
                                ? stepTextColors[step]
                                : "text-[#fff7d3]/30"
                            }`}
                          >
                            {step.charAt(0).toUpperCase() + step.slice(1)}
                          </span>
                        )
                      })}
                    </div>

                    <div className="mb-5" style={{ borderTop: "1px solid rgba(255,247,211,0.08)", paddingTop: "1rem" }}>
                      <p className="text-sm font-semibold text-[#fff7d3] mb-3 mt-4">
                        👤 {order.customer_name}
                      </p>
                      {order.items && order.items.length > 0 && (
                        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                          {order.items.map((item: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 rounded-xl px-3 py-2 shrink-0"
                              style={{ background: "rgba(255,247,211,0.08)", border: "1px solid rgba(255,247,211,0.1)" }}
                            >
                              {item.image_url && (
                                <img src={item.image_url} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                              )}
                              <div>
                                <p className="text-xs font-semibold text-[#fff7d3]">{item.name}</p>
                                <p className="text-xs" style={{ color: "rgba(255,247,211,0.5)" }}>
                                  x{item.quantity} · ₹{item.unit_price}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {order.status === "cancelled" && (
                      <div className="mt-4 bg-red-900/40 border border-red-500/50 rounded-lg px-4 py-2">
                        <p className="text-red-300 text-sm font-semibold">❌ Order Cancelled</p>
                        <p className="text-red-300/70 text-xs mt-1">
                          This order has been cancelled. Please contact support if needed.
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <CartSidebar />
    </div>
  )
}