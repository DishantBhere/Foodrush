"use client"

import { ShoppingCart, Clock, Phone, Search } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import Link from "next/link"

export function Header({ transparent = false }: { transparent?: boolean }) {
  const { items, toggleCart } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header
      className="sticky top-0 z-40 transition-all duration-300"
      style={{
        background: transparent
          ? "rgba(255,247,211,0.04)"
          : "rgba(120,10,20,0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: transparent
          ? "1px solid rgba(255,247,211,0.08)"
          : "1px solid rgba(255,247,211,0.12)",
      }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">

          {/* Left — Logo + Info */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-3">
              <img
                src="/logoo.png"
                alt="Food Rush Logo"
                className="h-19 w-19 object-contain"
              />
              <span
                className="text-2xl font-bold tracking-wide"
                style={{ color: "#fff7d3" }}
              >
                FOOD RUSH.IO
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-5 text-sm" style={{ color: "rgba(255,247,211,0.6)" }}>
              <div className="flex items-center space-x-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Open 8AM - 8PM</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Phone className="h-3.5 w-3.5" />
                <span>(+91) 88569-12189</span>
              </div>
            </div>
          </div>

          {/* Right — Track + Cart */}
          <div className="flex items-center space-x-3">

            {/* Track Order */}
            <Link href="/track">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  color: "#fff7d3",
                  background: "rgba(255,247,211,0.08)",
                  border: "1px solid rgba(255,247,211,0.15)",
                }}
              >
                <Search className="h-3.5 w-3.5" />
                Track Order
              </button>
            </Link>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105"
              style={{
                background: "#fff7d3",
                color: "#9f242f",
                border: "1px solid rgba(255,247,211,0.3)",
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              {itemCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                  style={{ background: "#1a0000", color: "#fff7d3" }}
                >
                  {itemCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>
    </header>
  )
}