"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import type { Category } from "@/lib/db"

export function CategoryFilter({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: number | null
  setSelectedCategory: (id: number | null) => void
}) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching categories:", error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex space-x-2 mb-8">
        {[...Array(5)].map((_, i) => (
<div key={i} className="h-9 w-28 animate-pulse rounded-full" style={{background: "rgba(255,247,211,0.15)"}} />        ))}
      </div>
    )
  }

  return (
<div className="flex flex-wrap gap-3 mb-8">      
  <button
  onClick={() => setSelectedCategory(null)}
  style={{
    padding: "0.5rem 1.2rem",
    borderRadius: "9999px",
    fontSize: "0.8rem",
    fontWeight: 600,
    border: "1px solid rgba(255,247,211,0.4)",
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: selectedCategory === null ? "#fff7d3" : "rgba(255,247,211,0.08)",
    color: selectedCategory === null ? "#9f242f" : "#fff7d3",
  }}
>
  All Items
</button>

      {categories.map((category) => (
        <button
  key={category.id}
  onClick={() => setSelectedCategory(category.id)}
  style={{
    padding: "0.5rem 1.2rem",
    borderRadius: "9999px",
    fontSize: "0.8rem",
    fontWeight: 600,
    border: "1px solid rgba(255,247,211,0.4)",
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: selectedCategory === category.id ? "#fff7d3" : "rgba(255,247,211,0.08)",
    color: selectedCategory === category.id ? "#9f242f" : "#fff7d3",
  }}
>
  {category.name}
</button>
      ))}
    </div>
  )
}