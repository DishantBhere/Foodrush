"use client"

import { useState, useEffect } from "react"
import GlareHover from "@/components/GlareHover"

interface DashboardStatsData {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  avgOrderValue: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStatsData>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    avgOrderValue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats")
        const data = await res.json()
        setStats({
          totalOrders: Number(data.totalOrders || 0),
          totalRevenue: Number(data.totalRevenue || 0),
          pendingOrders: Number(data.pendingOrders || 0),
          avgOrderValue: Number(data.avgOrderValue || 0),
        })
      } catch (err) {
        console.error("Stats error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const cards = [
    { title: "Total Orders",    value: stats.totalOrders.toString(),                       sub: "Orders today",      icon: "🛒", accent: "#60a5fa", grad: "linear-gradient(135deg, rgba(96,165,250,0.25), rgba(96,165,250,0.08))" },
    { title: "Revenue",         value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,  sub: "Today's earnings",  icon: "💰", accent: "#4ade80", grad: "linear-gradient(135deg, rgba(74,222,128,0.25), rgba(74,222,128,0.08))" },
    { title: "Pending Orders",  value: stats.pendingOrders.toString(),                     sub: "Awaiting prep",     icon: "⏳", accent: "#fbbf24", grad: "linear-gradient(135deg, rgba(251,191,36,0.25), rgba(251,191,36,0.08))"  },
    { title: "Avg Order Value", value: `₹${stats.avgOrderValue.toFixed(2)}`,               sub: "Per order average", icon: "📈", accent: "#a78bfa", grad: "linear-gradient(135deg, rgba(167,139,250,0.25), rgba(167,139,250,0.08))" },
  ]

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
      {cards.map((card, i) => (
        <GlareHover
          key={i}
          width="100%"
          height="100%"
          background={card.grad}
          borderRadius="16px"
          borderColor={`${card.accent}40`}
          glareColor="#ffffff"
          glareOpacity={0.1}
          glareSize={275}
          transitionDuration={650}
          style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
        >
          <div style={{
            width: "100%",
            padding: "1.4rem",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}>
            {/* Icon */}
            <div style={{
              width: "52px", height: "52px", borderRadius: "14px", flexShrink: 0,
              background: `${card.accent}25`,
              border: `1.5px solid ${card.accent}60`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.5rem",
              boxShadow: `0 0 18px ${card.accent}30`,
            }}>
              {card.icon}
            </div>

            {/* Text */}
            <div>
              <p style={{ fontSize: "0.68rem", color: "rgba(255,247,211,0.55)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
                {card.title}
              </p>
              <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff7d3", lineHeight: 1, marginBottom: "4px", fontFamily: "monospace", textShadow: `0 0 20px ${card.accent}60` }}>
                {loading ? "—" : card.value}
              </p>
              <p style={{ fontSize: "0.7rem", color: "rgba(255,247,211,0.4)" }}>
                {card.sub}
              </p>
            </div>
          </div>
        </GlareHover>
      ))}
    </div>
  )
}