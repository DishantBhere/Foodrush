"use client"

import { useState, useEffect } from "react"
import type { FoodItem } from "@/lib/db"
import { FoodCard } from "@/components/food-card"
import { CategoryFilter } from "@/components/category-filter"

export function MenuSection() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)

  // 🔥 NEW STATE FOR CATEGORY
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  useEffect(() => {
    fetchFoodItems()
  }, [])

  const fetchFoodItems = async () => {
    try {
      const response = await fetch("/api/food-items")
      const data = await response.json()
      setFoodItems(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching food items:", error)
    } finally {
      setLoading(false)
    }
  }

  // 🔥 FILTER LOGIC
  const filteredItems =
    selectedCategory === null
      ? foodItems
      : foodItems.filter(
          (item) => item.category_id === selectedCategory
        )

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-4 animate-pulse">
            <div className="h-48 bg-muted rounded-md mb-4" />
            <div className="h-4 bg-muted rounded mb-2" />
            <div className="h-3 bg-muted rounded mb-4" />
            <div className="h-8 bg-muted rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      {/* 🔥 CATEGORY BUTTONS */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* 🔥 FOOD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <FoodCard key={item.id} item={item} />
        ))}
      </div>
    </>
  )
}