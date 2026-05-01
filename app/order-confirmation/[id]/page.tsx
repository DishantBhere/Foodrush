import { OrderConfirmation } from "@/components/order-confirmation"
import { Header } from "@/components/header"

interface OrderConfirmationPageProps {
  params: {
    id: string
  }
}

export default function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <OrderConfirmation orderId={params.id} />
        </div>
      </main>
    </div>
  )
}
