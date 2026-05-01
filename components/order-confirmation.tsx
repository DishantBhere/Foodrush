"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Phone, MapPin, MessageSquare } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface OrderConfirmationProps {
  orderId: string
}

interface OrderDetails {
  order: {
    id: number
    customer_name: string
    customer_phone: string
    total_amount: number
    status: string
    order_type: string
    table_number?: string
    special_instructions?: string
    created_at: string
  }
  items: Array<{
    id: number
    name: string
    quantity: number
    unit_price: number
    total_price: number
    image_url: string
  }>
}

export function OrderConfirmation({ orderId }: OrderConfirmationProps) {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrderDetails()
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      const data = await response.json()
      // Convert string prices to numbers
      const formattedData = {
        ...data,
        order: {
          ...data.order,
          total_amount: Number(data.order.total_amount),
        },
        items: data.items.map((item: any) => ({
          ...item,
          unit_price: Number(item.unit_price),
          total_price: Number(item.total_price),
        })),
      }
      setOrderDetails(formattedData)
    } catch (error) {
      console.error("Error fetching order details:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </CardContent>
      </Card>
    )
  }

  if (!orderDetails) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground mb-4">Order not found</p>
          <Link href="/">
            <Button>Back to Menu</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const { order, items } = orderDetails

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-800 mb-2">Order Confirmed!</h1>
          <p className="text-green-700 mb-4">
            Thank you {order.customer_name}! Your order has been received and is being processed.
          </p>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Order #{order.id}
          </Badge>
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>Phone: {order.customer_phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Ordered: {new Date(order.created_at).toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>
                {order.order_type === "dine_in" ? "Dine In" : "Takeaway"}
                {order.table_number && ` • Table ${order.table_number}`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Badge>
            </div>
          </div>

          {order.special_instructions && (
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Special Instructions:</p>
                  <p className="text-sm text-muted-foreground">{order.special_instructions}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items Ordered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <div className="relative h-12 w-12 flex-shrink-0">
                  <Image
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    ${isNaN(Number(item.unit_price)) ? "N/A" : Number(item.unit_price).toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <div className="font-semibold">
                  ${isNaN(Number(item.total_price)) ? "N/A" : Number(item.total_price).toFixed(2)}
                </div>
              </div>
            ))}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-primary">
                  ${isNaN(Number(order.total_amount)) ? "N/A" : Number(order.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardContent className="text-center py-6">
          <h3 className="font-semibold mb-2">What's Next?</h3>
          <p className="text-muted-foreground mb-4">
            We'll start preparing your order shortly. You can track its progress using your phone number.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/track">
              <Button variant="outline">Track Order</Button>
            </Link>
            <Link href="/">
              <Button>Order More</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}