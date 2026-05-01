"use client"

import { useEffect, useState, useRef } from "react"
import { createPortal } from "react-dom"
import GlareHover from "@/components/GlareHover"

interface OrderItem {
  name: string
  image_url: string
  quantity: number
  unit_price: number
}

interface Order {
  id: number
  tracking_id: string         // ← ADDED
  customer_name: string
  customer_phone: string
  customer_email: string
  total_amount: number
  status: string
  order_type: string
  created_at: string
  items: OrderItem[]
}

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  pending:   { bg: "rgba(251,191,36,0.18)",  text: "#fbbf24", border: "rgba(251,191,36,0.5)",  glow: "rgba(251,191,36,0.2)"  },
  confirmed: { bg: "rgba(96,165,250,0.18)",  text: "#60a5fa", border: "rgba(96,165,250,0.5)",  glow: "rgba(96,165,250,0.2)"  },
  preparing: { bg: "rgba(251,146,60,0.18)",  text: "#fb923c", border: "rgba(251,146,60,0.5)",  glow: "rgba(251,146,60,0.2)"  },
  ready:     { bg: "rgba(167,139,250,0.18)", text: "#a78bfa", border: "rgba(167,139,250,0.5)", glow: "rgba(167,139,250,0.2)" },
  completed: { bg: "rgba(74,222,128,0.18)",  text: "#4ade80", border: "rgba(74,222,128,0.5)",  glow: "rgba(74,222,128,0.2)"  },
  cancelled: { bg: "rgba(248,113,113,0.18)", text: "#f87171", border: "rgba(248,113,113,0.5)", glow: "rgba(248,113,113,0.2)" },
}

const STATUS_OPTIONS = ["pending","confirmed","preparing","ready","completed","cancelled"]

function StatusDropdown({ orderId, currentStatus, onStatusChange }: {
  orderId: number
  currentStatus: string
  onStatusChange: (id: number, status: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, right: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)
  const ss = STATUS_STYLES[currentStatus] || STATUS_STYLES.pending

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setPos({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      })
    }
    setOpen(v => !v)
  }

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    setTimeout(() => document.addEventListener("mousedown", handleClick), 0)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  const dropdown = open ? (
    <div
      onMouseDown={e => e.stopPropagation()}
      style={{
        position: "fixed",
        top: pos.top,
        right: pos.right,
        background: "rgba(15,3,5,0.98)",
        border: "1px solid rgba(255,247,211,0.15)",
        borderRadius: "12px",
        zIndex: 999999,
        minWidth: "150px",
        boxShadow: "0 16px 40px rgba(0,0,0,0.9)",
        backdropFilter: "blur(20px)",
        overflow: "hidden",
      }}
    >
      {STATUS_OPTIONS.map(s => {
        const sc = STATUS_STYLES[s]
        const isActive = currentStatus === s
        return (
          <button
            key={s}
            onMouseDown={e => { e.stopPropagation(); onStatusChange(orderId, s); setOpen(false) }}
            style={{
              width: "100%", textAlign: "left",
              padding: "10px 14px", fontSize: "0.78rem", fontWeight: 600,
              display: "flex", alignItems: "center", gap: "8px",
              background: isActive ? sc.bg : "transparent",
              color: isActive ? sc.text : "rgba(255,247,211,0.7)",
              border: "none", cursor: "pointer", transition: "background 0.15s",
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,247,211,0.07)" }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent" }}
          >
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: sc.text, flexShrink: 0, display: "inline-block", boxShadow: `0 0 5px ${sc.text}` }} />
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        )
      })}
    </div>
  ) : null

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleOpen}
        style={{
          background: ss.bg,
          border: `1px solid ${ss.border}`,
          color: ss.text,
          borderRadius: "10px",
          padding: "6px 12px",
          fontSize: "0.75rem",
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          minWidth: "120px",
          backdropFilter: "blur(8px)",
          boxShadow: `0 0 12px ${ss.glow}`,
        }}
      >
        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: ss.text, display: "inline-block", boxShadow: `0 0 6px ${ss.text}` }} />
        {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
        <span style={{ marginLeft: "auto", opacity: 0.6, fontSize: "0.55rem" }}>{open ? "▲" : "▼"}</span>
      </button>
      {typeof document !== "undefined" && dropdown && createPortal(dropdown, document.body)}
    </>
  )
}

export function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders")
      const data = await res.json()
      setOrders(data.map((o: any) => ({ ...o, total_amount: Number(o.total_amount || 0), items: o.items || [] })))
    } catch (err) {
      console.error("Orders error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await fetch("/api/admin/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      })
      fetchOrders()
    } catch (error) {
      console.error("Status update failed:", error)
    }
  }

  if (loading) return (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "12px" }}>
      {[...Array(4)].map((_, i) => (
        <div key={i} style={{ height: "100px", borderRadius: "16px", background: "rgba(255,247,211,0.08)", animation: "pulse 1.5s infinite" }} />
      ))}
    </div>
  )

  if (orders.length === 0) return (
    <div style={{ padding: "3rem", textAlign: "center" }}>
      <p style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🍽️</p>
      <p style={{ fontWeight: 600, color: "#fff7d3" }}>No orders yet</p>
    </div>
  )

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "12px" }}>
      {orders.map((order) => {
        const ss = STATUS_STYLES[order.status] || STATUS_STYLES.pending
        return (
          <GlareHover
            key={order.id}
            width="100%"
            height="100%"
            background={`linear-gradient(135deg, ${ss.glow}, rgba(255,247,211,0.04))`}
            borderRadius="16px"
            borderColor={ss.border}
            glareColor="#ffffff"
            glareOpacity={0.07}
            glareSize={275}
            transitionDuration={650}
            style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          >
            <div style={{ width: "100%", padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "10px", flexShrink: 0,
                    background: ss.bg, border: `1px solid ${ss.border}`, color: ss.text,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: "0.7rem", fontFamily: "monospace",
                    boxShadow: `0 0 10px ${ss.glow}`,
                  }}>
                    #{order.id}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: "#fff7d3", fontSize: "0.95rem", marginBottom: "6px" }}>
                      {order.customer_name || "Unknown"}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      {order.customer_phone && (
                        <p style={{ fontSize: "0.75rem", color: "rgba(255,247,211,0.7)", fontFamily: "monospace" }}>
                          <span style={{ color: "rgba(255,247,211,0.35)", fontStyle: "italic" }}>Phone · </span>{order.customer_phone}
                        </p>
                      )}
                      {order.customer_email && (
                        <p style={{ fontSize: "0.75rem", color: "rgba(255,247,211,0.7)", fontFamily: "monospace" }}>
                          <span style={{ color: "rgba(255,247,211,0.35)", fontStyle: "italic" }}>Email · </span>{order.customer_email}
                        </p>
                      )}
                      {order.order_type && (
                        <p style={{ fontSize: "0.75rem", color: "rgba(255,247,211,0.7)", fontFamily: "monospace" }}>
                          <span style={{ color: "rgba(255,247,211,0.35)", fontStyle: "italic" }}>Type · </span>{order.order_type}
                        </p>
                      )}

                      {/* ✅ TRACKING ID — NAYA ADD KIYA */}
                      {order.tracking_id && (
                        <p style={{ fontSize: "0.75rem", color: "rgba(255,247,211,0.7)", fontFamily: "monospace", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ color: "rgba(255,247,211,0.35)", fontStyle: "italic" }}>Track · </span>
                          <span style={{
                            background: "rgba(255,247,211,0.12)",
border: "1px solid rgba(255,247,211,0.35)",
color: "#fff7d3",
boxShadow: "0 0 8px rgba(255,247,211,0.15)",
                            borderRadius: "5px",
                            padding: "1px 8px",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            boxShadow: "0 0 8px rgba(96,165,250,0.2)",
                          }}>
                            {order.tracking_id}
                          </span>
                        </p>
                      )}

                      <p style={{ fontSize: "0.68rem", color: "rgba(255,247,211,0.35)", marginTop: "2px" }}>
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                  <p style={{ fontWeight: 800, color: "#fff7d3", fontSize: "1.2rem", fontFamily: "monospace", textShadow: "0 0 12px rgba(255,247,211,0.3)" }}>
                    ₹{order.total_amount.toFixed(2)}
                  </p>
                  <span style={{
                    fontSize: "0.72rem", fontWeight: 700, padding: "5px 12px",
                    borderRadius: "9999px", textTransform: "capitalize",
                    background: ss.bg, color: ss.text, border: `1px solid ${ss.border}`,
                    boxShadow: `0 0 10px ${ss.glow}`,
                  }}>
                    {order.status}
                  </span>
                  <StatusDropdown orderId={order.id} currentStatus={order.status} onStatusChange={handleStatusChange} />
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div style={{
                  marginTop: "14px", paddingTop: "14px",
                  borderTop: "1px solid rgba(255,247,211,0.1)",
                  display: "flex", gap: "10px", overflowX: "auto",
                  paddingBottom: "4px", scrollbarWidth: "none",
                }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      background: "rgba(255,247,211,0.08)",
                      border: "1px solid rgba(255,247,211,0.15)",
                      borderRadius: "10px", padding: "6px 10px", flexShrink: 0,
                    }}>
                      {item.image_url && (
                        <img src={item.image_url} alt={item.name} style={{ width: "32px", height: "32px", borderRadius: "6px", objectFit: "cover" }} />
                      )}
                      <div>
                        <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "#fff7d3" }}>{item.name}</p>
                        <p style={{ fontSize: "0.65rem", color: "rgba(255,247,211,0.5)" }}>x{item.quantity} · ₹{item.unit_price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </GlareHover>
        )
      })}
    </div>
  )
}