"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import type { FoodItem } from "@/lib/db"
import { Plus, Edit, ToggleLeft, ToggleRight } from "lucide-react"
import Image from "next/image"

export function MenuManagement() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFoodItems()
  }, [])

  const fetchFoodItems = async () => {
    try {
      const response = await fetch("/api/admin/food-items")
      const data = await response.json()

      if (Array.isArray(data)) {
        setFoodItems(data)
      } else if (Array.isArray(data?.items)) {
        setFoodItems(data.items)
      } else if (Array.isArray(data?.foodItems)) {
        setFoodItems(data.foodItems)
      } else {
        setFoodItems([])
      }
    } catch (error) {
      console.error("Error fetching food items:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAvailability = async (itemId: number, isAvailable: boolean) => {
    try {
      const response = await fetch(`/api/admin/food-items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: !isAvailable }),
      })

      if (response.ok) fetchFoodItems()
    } catch (error) {
      console.error("Error updating item availability:", error)
    }
  }

  if (loading) {
    return (
      <div className="bg-[#8c1f29]/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/10">
        <h3 className="text-2xl font-bold text-[#fff7d3] mb-6">Menu Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-white/10 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#8c1f29]/90 backdrop-blur-xl rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-white/10">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold text-[#fff7d3]">Menu Management</h3>
          <p className="text-[#fff7d3]/70">Manage your food items, prices, and availability</p>
        </div>

        <button className="bg-[#fff7d3] text-[#9f242f] font-semibold px-6 py-2 rounded-xl hover:bg-[#f0e6bd] transition">
          <Plus className="h-4 w-4 mr-2 inline" />
          Add Item
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {foodItems.map((item) => (
          <div
            key={item.id}
            className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:-translate-y-2 transition-all duration-300"
          >
            <div className="relative h-32">
              <Image
                src={item.image_url || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2">
                {item.is_available ? (
                  <Badge className="bg-[#fff7d3] text-[#9f242f]">Available</Badge>
                ) : (
                  <Badge className="bg-red-500 text-white">Unavailable</Badge>
                )}
              </div>
            </div>

            <div className="p-4 space-y-3 text-[#fff7d3]">
              <div>
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-[#fff7d3]/70">{item.description}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">₹{item.price.toFixed(2)}</span>
                <span className="text-sm text-[#fff7d3]/70">
                  {item.preparation_time} min
                </span>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-white/20 text-[#fff7d3] px-4 py-2 rounded-lg hover:bg-white/30 transition">
                  <Edit className="h-4 w-4 mr-1 inline" />
                  Edit
                </button>

                <button
                  onClick={() => toggleAvailability(item.id, item.is_available)}
                  className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition"
                >
                  {item.is_available ? (
                    <ToggleRight className="h-4 w-4 text-[#fff7d3]" />
                  ) : (
                    <ToggleLeft className="h-4 w-4 text-[#fff7d3]" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}