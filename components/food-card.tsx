"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Minus, Clock } from "lucide-react"
import type { FoodItem } from "@/lib/db"
import { useCart } from "@/hooks/use-cart"
import GlareHover from "@/components/GlareHover"

interface FoodCardProps {
  item: FoodItem
}

export function FoodCard({ item }: FoodCardProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      image_url: item.image_url,
      quantity: quantity,
    })
    setQuantity(1)
  }

  return (
    <GlareHover
      width="100%"
      height="100%"
      background="rgba(255,247,211,0.06)"
      borderRadius="20px"
      borderColor="rgba(255,247,211,0.12)"
      glareColor="#ffffff"
      glareOpacity={0.08}
      glareSize={275}
      transitionDuration={650}
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: "180px", flexShrink: 0, width: "100%" }}>
        <Image
          src={item.image_url || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover"
          style={{ borderRadius: "20px 20px 0 0" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(90,8,14,0.6) 0%, transparent 50%)",
          borderRadius: "20px 20px 0 0",
        }} />
        {!item.is_available && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "20px 20px 0 0",
          }}>
            <span style={{
              background: "rgba(248,113,113,0.2)",
              border: "1px solid rgba(248,113,113,0.4)",
              color: "#f87171",
              fontSize: "0.75rem", fontWeight: 700,
              padding: "4px 12px", borderRadius: "9999px",
            }}>
              Out of Stock
            </span>
          </div>
        )}
        <div style={{
          position: "absolute", top: "10px", right: "10px",
          display: "flex", alignItems: "center", gap: "4px",
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,247,211,0.15)",
          borderRadius: "9999px",
          padding: "3px 8px",
        }}>
          <Clock style={{ width: "10px", height: "10px", color: "#fff7d3" }} />
          <span style={{ fontSize: "0.65rem", color: "#fff7d3", fontWeight: 600 }}>
            {item.preparation_time}min
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
        <h3 style={{ fontWeight: 700, color: "#fff7d3", fontSize: "0.95rem", lineHeight: 1.3, margin: 0 }}>
          {item.name}
        </h3>
        <p style={{ fontSize: "0.75rem", color: "rgba(255,247,211,0.5)", lineHeight: 1.5, margin: 0, flex: 1 }}>
          {item.description}
        </p>
        <p style={{ fontWeight: 800, color: "#ffd700", fontSize: "1.2rem", fontFamily: "monospace", margin: 0 }}>
          {isNaN(Number(item.price)) ? "N/A" : `₹${Number(item.price).toFixed(2)}`}
        </p>
      </div>

      {/* Footer */}
      <div style={{
        padding: "0.75rem 1rem 1rem",
        borderTop: "1px solid rgba(255,247,211,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
        width: "100%",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={!item.is_available}
            style={{
              width: "30px", height: "30px", borderRadius: "8px",
              background: "rgba(255,247,211,0.1)",
              border: "1px solid rgba(255,247,211,0.2)",
              color: "#fff7d3", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,247,211,0.2)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,247,211,0.1)")}
          >
            <Minus style={{ width: "12px", height: "12px" }} />
          </button>
          <span style={{ color: "#fff7d3", fontWeight: 700, fontSize: "0.9rem", minWidth: "20px", textAlign: "center" }}>
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            disabled={!item.is_available}
            style={{
              width: "30px", height: "30px", borderRadius: "8px",
              background: "rgba(255,247,211,0.1)",
              border: "1px solid rgba(255,247,211,0.2)",
              color: "#fff7d3", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,247,211,0.2)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,247,211,0.1)")}
          >
            <Plus style={{ width: "12px", height: "12px" }} />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!item.is_available}
          style={{
            background: item.is_available ? "#fff7d3" : "rgba(255,247,211,0.2)",
            color: item.is_available ? "#9f242f" : "rgba(255,247,211,0.4)",
            border: "none", borderRadius: "10px",
            padding: "7px 14px",
            fontSize: "0.78rem", fontWeight: 700,
            cursor: item.is_available ? "pointer" : "not-allowed",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            if (item.is_available)(e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)"
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"
          }}
        >
          Add to Cart
        </button>
      </div>
    </GlareHover>
  )
}