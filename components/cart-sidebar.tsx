"use client"

import { useState } from "react"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "@/hooks/use-cart"
import Image from "next/image"

export function CartSidebar() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getTotalPrice } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = () => {
    setIsCheckingOut(true)
    window.location.href = "/checkout"
  }

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent
        className="w-full sm:max-w-lg border-0 flex flex-col"
        style={{

background: "rgba(160, 27, 27, 0.75)",          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderLeft: "1px solid rgba(255,247,211,0.12)",
          color: "#fff7d3",
        }}
      >
        {/* Header */}
        <SheetHeader className="pb-4" style={{ borderBottom: "1px solid rgba(255,247,211,0.1)" }}>
          <SheetTitle className="flex items-center gap-2" style={{ color: "#fff7d3" }}>
            <ShoppingBag className="h-5 w-5" style={{ color: "rgba(255,247,211,0.6)" }} />
            Your Order ({items.length} items)
          </SheetTitle>
        </SheetHeader>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4" style={{ scrollbarWidth: "none" }}>
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-14 w-14 mx-auto mb-4" style={{ color: "rgba(255,247,211,0.2)" }} />
              <p style={{ color: "rgba(255,247,211,0.4)" }}>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-2xl"
                  style={{
background: "rgba(255,247,211,0.12)",

                    border: "1px solid rgba(255,247,211,0.1)",
                  }}
                >
                  {/* Image */}
                  <div className="relative h-14 w-14 flex-shrink-0 rounded-xl overflow-hidden">
                    <Image
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Name + Price */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate" style={{ color: "#fff7d3" }}>
                      {item.name}
                    </h4>
                    <p className="text-sm font-bold mt-0.5" style={{ color: "rgba(255,247,211,0.7)" }}>
                      ₹{item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-7 w-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        background: "rgba(255,247,211,0.1)",
                        border: "1px solid rgba(255,247,211,0.2)",
                        color: "#fff7d3",
                      }}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold" style={{ color: "#fff7d3" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-7 w-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        background: "rgba(255,247,211,0.1)",
                        border: "1px solid rgba(255,247,211,0.2)",
                        color: "#fff7d3",
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="h-7 w-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{
  background: "rgba(180,0,0,0.5)",
  border: "1px solid rgba(255,80,80,0.4)",
  color: "#ff9999",
}}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="pt-4" style={{ borderTop: "1px solid rgba(255,247,211,0.1)" }}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold" style={{ color: "#fff7d3" }}>Total:</span>
              <span className="text-xl font-extrabold" style={{ color: "#fff7d3" }}>
                ₹{getTotalPrice().toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-4 rounded-full font-bold text-base transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
              style={{ background: "#fff7d3", color: "#9f242f" }}
            >
              {isCheckingOut ? "Processing..." : `Proceed to Checkout · ₹${getTotalPrice().toFixed(2)}`}
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}