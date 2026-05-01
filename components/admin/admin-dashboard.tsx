"use client"

import { useEffect, useState } from "react"
import { OrdersManagement } from "@/components/admin/orders-management"
import { DashboardStats } from "@/components/admin/dashboard-stats"

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export function AdminDashboard() {
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [statusData, setStatusData] = useState<any[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("/api/admin/orders")
      const orders = await res.json()

      const monthly = Array(12).fill(0)
      const weekly = Array(7).fill(0)
      let completed = 0, cancelled = 0, pending = 0

      orders.forEach((order: any) => {
        const date = new Date(order.created_at)
        monthly[date.getMonth()] += Number(order.total_amount)
        weekly[date.getDay()] += Number(order.total_amount)
        if (order.status === "completed") completed++
        else if (order.status === "cancelled") cancelled++
        else pending++
      })

      const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
      const weekNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

      setMonthlyData(monthly.map((value, i) => ({ month: monthNames[i], sales: value })))
      setWeeklyData(weekly.map((value, i) => ({ day: weekNames[i], sales: value })))
      setStatusData([
        { name: "Completed", value: completed },
        { name: "Pending", value: pending },
        { name: "Cancelled", value: cancelled },
      ])
    }
    fetchOrders()
  }, [])

  const COLORS = ["#4ade80", "#fbbf24", "#f87171"]
  const totalOrders = statusData.reduce((a, b) => a + b.value, 0)

  const sectionTitle = (title: string, subtitle?: string) => (
    <div className="mb-6">
      <p className="text-xs uppercase tracking-[0.3em] font-semibold mb-1" style={{ color: "rgba(255,247,211,0.4)" }}>
        Admin
      </p>
      <h2 className="font-extrabold text-[#fff7d3] text-2xl">{title}</h2>
      {subtitle && <p className="text-sm mt-1" style={{ color: "rgba(255,247,211,0.5)" }}>{subtitle}</p>}
      <div className="mt-3 rounded-full" style={{ width: "2.5rem", height: "2px", background: "rgba(255,247,211,0.2)" }} />
    </div>
  )

  return (
    <div className="space-y-14 text-[#fff7d3]">

      {/* PAGE HEADER */}
      <div>
        <p className="text-xs uppercase tracking-[0.3em] font-semibold mb-2" style={{ color: "rgba(255,247,211,0.4)" }}>
          Campus Canteen
        </p>
        <h1 className="font-extrabold text-[#fff7d3] mb-1" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
          Dashboard Overview
        </h1>
        <p style={{ color: "rgba(255,247,211,0.5)", fontSize: "0.9rem" }}>
          Manage your canteen operations from this central dashboard
        </p>
      </div>

      {/* STATS */}
      <DashboardStats />

      <div style={{ borderTop: "1px solid rgba(255,247,211,0.08)" }} />

      {/* ANALYTICS */}
      <div>
        {sectionTitle("Analytics", "Revenue trends and order breakdown")}

        <div className="grid md:grid-cols-2 gap-5">

          {/* Monthly Revenue */}
          <div style={{
            background: "linear-gradient(135deg, rgba(96,165,250,0.15), rgba(96,165,250,0.04))",
            border: "1px solid rgba(96,165,250,0.3)",
            borderRadius: "20px",
            padding: "1.6rem",
            boxShadow: "0 0 30px rgba(96,165,250,0.08)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
              <div>
                <p style={{ fontSize: "0.68rem", color: "rgba(96,165,250,0.7)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>
                  📅 Monthly Revenue
                </p>
                <p style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff7d3", fontFamily: "monospace", marginTop: "4px", textShadow: "0 0 20px rgba(96,165,250,0.5)" }}>
                  ₹{monthlyData.reduce((a, b) => a + b.sales, 0).toLocaleString("en-IN")}
                </p>
              </div>
              <span style={{
                fontSize: "0.68rem", fontWeight: 700, padding: "5px 12px", borderRadius: "9999px",
                background: "rgba(96,165,250,0.15)", color: "#60a5fa",
                border: "1px solid rgba(96,165,250,0.3)",
              }}>
                This Year
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(96,165,250,0.1)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,247,211,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,247,211,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />

                
<Tooltip
  contentStyle={{
    background: "rgba(193, 20, 55, 0.95)",
    border: "1px solid rgba(255,247,211,0.2)",
    borderRadius: "12px",
    color: "#fff7d3",
    fontSize: "12px",
    fontWeight: 600,
    backdropFilter: "blur(12px)",
  }}
  itemStyle={{ color: "#fff7d3" }}
  labelStyle={{ color: "rgba(255,247,211,0.5)", fontSize: "11px" }}
/>                <Area type="monotone" dataKey="sales" stroke="#60a5fa" strokeWidth={2.5} fill="url(#mg)" dot={false} activeDot={{ r: 5, fill: "#60a5fa", stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Revenue */}
          <div style={{
            background: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(251,191,36,0.04))",
            border: "1px solid rgba(251,191,36,0.3)",
            borderRadius: "20px",
            padding: "1.6rem",
            boxShadow: "0 0 30px rgba(251,191,36,0.08)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
              <div>
                <p style={{ fontSize: "0.68rem", color: "rgba(251,191,36,0.7)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>
                  📆 Weekly Revenue
                </p>
                <p style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff7d3", fontFamily: "monospace", marginTop: "4px", textShadow: "0 0 20px rgba(251,191,36,0.5)" }}>
                  ₹{weeklyData.reduce((a, b) => a + b.sales, 0).toLocaleString("en-IN")}
                </p>
              </div>
              <span style={{
                fontSize: "0.68rem", fontWeight: 700, padding: "5px 12px", borderRadius: "9999px",
                background: "rgba(251,191,36,0.15)", color: "#fbbf24",
                border: "1px solid rgba(251,191,36,0.3)",
              }}>
                This Week
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(251,191,36,0.1)" />
                <XAxis dataKey="day" tick={{ fill: "rgba(255,247,211,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,247,211,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1f1500", border: "1px solid rgba(251,191,36,0.3)", borderRadius: "10px", color: "#fff7d3", fontSize: "12px" }} />
                <Area type="monotone" dataKey="sales" stroke="#fbbf24" strokeWidth={2.5} fill="url(#wg)" dot={false} activeDot={{ r: 5, fill: "#fbbf24", stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Donut — Orders Breakdown */}
          <div style={{
            background: "linear-gradient(135deg, rgba(167,139,250,0.15), rgba(167,139,250,0.04))",
            border: "1px solid rgba(167,139,250,0.3)",
            borderRadius: "20px",
            padding: "1.6rem",
            boxShadow: "0 0 30px rgba(167,139,250,0.08)",
          }}>
            <p style={{ fontSize: "0.68rem", color: "rgba(167,139,250,0.7)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: "4px" }}>
              🍩 Orders Breakdown
            </p>
            <p style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff7d3", fontFamily: "monospace", marginBottom: "1rem", textShadow: "0 0 20px rgba(167,139,250,0.5)" }}>
              {totalOrders} Total
            </p>
            <div style={{ position: "relative" }}>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" strokeWidth={0}>
                    {statusData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} style={{ filter: `drop-shadow(0 0 8px ${COLORS[index]})` }} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10,5,15,0.95)",
                      border: "1px solid rgba(255,247,211,0.15)",
                      borderRadius: "12px",
                      fontSize: "13px",
                      fontWeight: 700,
                      backdropFilter: "blur(12px)",
                    }}
                    itemStyle={{ color: "#fff7d3" }}
                    labelStyle={{ color: "rgba(255,247,211,0.4)", fontSize: "11px" }}
                    formatter={(value: any, name: any, props: any) => {
                      const color = COLORS[statusData.findIndex(d => d.name === name)]
                      return [<span style={{ color }}>{value}</span>, <span style={{ color }}>{name}</span>]
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff7d3", textShadow: "0 0 16px rgba(167,139,250,0.6)" }}>{totalOrders}</p>
                <p style={{ fontSize: "0.65rem", color: "rgba(255,247,211,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Orders</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
              {statusData.map((item, i) => {
                const pct = totalOrders ? ((item.value / totalOrders) * 100).toFixed(0) : 0
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: COLORS[i], boxShadow: `0 0 8px ${COLORS[i]}` }} />
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff7d3" }}>{item.name}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 800, color: COLORS[i], textShadow: `0 0 8px ${COLORS[i]}` }}>{item.value}</span>
                      <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,247,211,0.5)" }}>{pct}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Export CSV */}
          <div style={{
            background: "linear-gradient(135deg, rgba(74,222,128,0.15), rgba(74,222,128,0.04))",
            border: "1px solid rgba(74,222,128,0.3)",
            borderRadius: "20px",
            padding: "1.6rem",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center",
            boxShadow: "0 0 30px rgba(74,222,128,0.08)",
          }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "18px",
              background: "rgba(74,222,128,0.15)",
              border: "1.5px solid rgba(74,222,128,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.8rem", marginBottom: "1.2rem",
              boxShadow: "0 0 24px rgba(74,222,128,0.25)",
            }}>
              📥
            </div>
            <p style={{ fontWeight: 800, color: "#fff7d3", fontSize: "1.1rem", marginBottom: "6px", textShadow: "0 0 16px rgba(74,222,128,0.4)" }}>
              Export Orders
            </p>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,247,211,0.45)", marginBottom: "1.6rem", lineHeight: 1.5 }}>
              Download all order data in CSV format
            </p>
            <button
              onClick={() => {
                const link = document.createElement("a")
                link.href = "/api/admin/export"
                link.setAttribute("download", "orders.csv")
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }}
              style={{
                background: "linear-gradient(135deg, #4ade80, #22c55e)",
                color: "#052e16",
                fontWeight: 800, borderRadius: "9999px",
                padding: "12px 32px", fontSize: "0.88rem",
                border: "none", cursor: "pointer", transition: "all 0.2s",
                boxShadow: "0 0 20px rgba(74,222,128,0.4)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "scale(1.06)"
                e.currentTarget.style.boxShadow = "0 0 30px rgba(74,222,128,0.6)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)"
                e.currentTarget.style.boxShadow = "0 0 20px rgba(74,222,128,0.4)"
              }}
            >
              Download CSV
            </button>
          </div>

        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,247,211,0.08)" }} />

      {/* ORDERS */}
      <div>
        {sectionTitle("Orders Management", "View and update all incoming orders")}
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,247,211,0.03)", border: "1px solid rgba(255,247,211,0.08)" }}>
          <OrdersManagement />
        </div>
      </div>

    </div>
  )
}