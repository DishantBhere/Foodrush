"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, CheckCircle, Package, Utensils } from "lucide-react"
import type { Order } from "@/lib/db"

export function OrderTracking() {
  const [phone, setPhone] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  const trackOrders = async () => {
    if (!phone.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/orders?phone=${encodeURIComponent(phone)}`)
      const data = await response.json()
      // Convert total_amount to number
      const formattedOrders = data.map((order: Order) => ({
        ...order,
        total_amount: Number(order.total_amount),
      }))
      setOrders(formattedOrders)
    } catch (error) {
      console.error("Error tracking orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "preparing":
        return <Utensils className="h-4 w-4" />
      case "ready":
        return <Package className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "confirmed":
        return "default"
      case "preparing":
        return "default"
      case "ready":
        return "default"
      case "completed":
        return "default"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Track Your Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && trackOrders()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={trackOrders} disabled={loading}>
                {loading ? "Tracking..." : "Track Orders"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {orders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Orders</h3>
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">Order #{order.id}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()} at{" "}
                      {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      {isNaN(Number(order.total_amount)) ? "N/A" : `₹${Number(order.total_amount).toFixed(2)}`}
                    </p>
                    <Badge variant={getStatusColor(order.status) as any} className="mt-1">
                      <span className="mr-1">{getStatusIcon(order.status)}</span>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>
                    {order.order_type === "dine_in" ? "Dine In" : "Takeaway"}
                    {order.table_number && ` • Table ${order.table_number}`}
                  </p>
                  {order.special_instructions && (
                    <p className="mt-2">
                      <strong>Special Instructions:</strong> {order.special_instructions}
                    </p>
                  )}
                </div>

                {/* Order Status Timeline */}
                <div className="mt-4 flex items-center space-x-4 text-sm">
                  <div className={`flex items-center space-x-1 ${order.status !== "pending" ? "text-green-600" : ""}`}>
                    <CheckCircle className="h-4 w-4" />
                    <span>Ordered</span>
                  </div>
                  <div className="h-px bg-border flex-1" />
                  <div
                    className={`flex items-center space-x-1 ${
                      ["confirmed", "preparing", "ready", "completed"].includes(order.status) ? "text-green-600" : ""
                    }`}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Confirmed</span>
                  </div>
                  <div className="h-px bg-border flex-1" />
                  <div
                    className={`flex items-center space-x-1 ${
                      ["preparing", "ready", "completed"].includes(order.status) ? "text-green-600" : ""
                    }`}
                  >
                    <Utensils className="h-4 w-4" />
                    <span>Preparing</span>
                  </div>
                  <div className="h-px bg-border flex-1" />
                  <div
                    className={`flex items-center space-x-1 ${
                      ["ready", "completed"].includes(order.status) ? "text-green-600" : ""
                    }`}
                  >
                    <Package className="h-4 w-4" />
                    <span>Ready</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}