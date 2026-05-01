"use client"

import { useEffect, useState } from "react"

interface Customer {
  customer_name: string
  customer_phone: string
  customer_email?: string
  foods: string
  total_orders: number
}

export function CustomersManagement() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchCustomers() }, [])

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/admin/customers")
      const data = await res.json()
      setCustomers(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="p-8 space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: "rgba(255,247,211,0.06)" }} />
      ))}
    </div>
  )

  if (customers.length === 0) return (
    <div className="p-12 text-center" style={{ color: "rgba(255,247,211,0.4)" }}>
      <p className="text-4xl mb-3">👥</p>
      <p className="font-semibold text-[#fff7d3]">No customers yet</p>
    </div>
  )

  return (
    <div className="p-6 space-y-3">
      {customers.map((c, i) => (
        <div
          key={i}
          className="rounded-2xl p-5 transition-all duration-200"
          style={{ background: "rgba(255,247,211,0.05)", border: "1px solid rgba(255,247,211,0.1)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,247,211,0.09)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,247,211,0.05)")}
        >
          <div className="flex items-start justify-between gap-4">

            {/* LEFT */}
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div
                className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-sm"
                style={{ background: "rgba(255,247,211,0.1)", color: "#fff7d3" }}
              >
                {c.customer_name?.charAt(0).toUpperCase() || "?"}
              </div>

              {/* Info */}
              <div className="space-y-1">
                <p className="font-bold text-[#fff7d3] text-base leading-tight">
                  {c.customer_name || "Unknown"}
                </p>

                <div className="space-y-0.5">
                  {c.customer_phone && (
                    <p className="text-xs" style={{ color: "rgba(255,247,211,0.55)" }}>
                      <span style={{ color: "rgba(255,247,211,0.35)" }}>Phone: </span>
                      {c.customer_phone}
                    </p>
                  )}
                  {c.customer_email && (
                    <p className="text-xs" style={{ color: "rgba(255,247,211,0.55)" }}>
                      <span style={{ color: "rgba(255,247,211,0.35)" }}>Email: </span>
                      {c.customer_email}
                    </p>
                  )}
                  {c.foods && (
                    <p className="text-xs" style={{ color: "rgba(255,247,211,0.55)" }}>
                      <span style={{ color: "rgba(255,247,211,0.35)" }}>Ordered: </span>
                      {c.foods}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT — total orders badge */}
            <div
              className="shrink-0 flex flex-col items-center justify-center rounded-xl px-4 py-2 text-center"
              style={{ background: "rgba(255,247,211,0.08)", border: "1px solid rgba(255,247,211,0.12)" }}
            >
              <p className="font-extrabold text-[#fff7d3] text-xl leading-none">{c.total_orders}</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,247,211,0.4)" }}>Orders</p>
            </div>

          </div>
        </div>
      ))}
    </div>
  )
}