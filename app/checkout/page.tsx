"use client"

import { Header } from "@/components/header"
import { CartSidebar } from "@/components/cart-sidebar"
import { CheckoutForm } from "@/components/checkout-form"
import ClickSpark from "@/components/ClickSpark"
import Shuffle from "@/components/Shuffle"
import Plasma from "@/components/Plasma"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen text-[#fff7d3]" style={{ position: "relative", zIndex: 1 }}>

      {/* Plasma Background — fixed, behind everything */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none" }}>

        <Plasma
  color="#8b0000"
  speed={3}
  scale={1.1}
  direction="pingpong"
  opacity={0.92}
/>
      </div>

      <ClickSpark
        sparkColor="#fff7d3"
        sparkSize={14}
        sparkRadius={25}
        sparkCount={12}
        duration={600}
        easing="ease-out"
        extraScale={1.5}
      />

      <Header transparent />

      <main className="container mx-auto px-4 py-12" style={{ position: "relative", zIndex: 1 }}>
        <div className="max-w-5xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.35em] font-semibold mb-3" style={{ color: "rgba(255,247,211,0.4)" }}>
              Order Details
            </p>
            <h1 className="font-extrabold text-[#fff7d3] tracking-tight mb-4" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}>
              <Shuffle
                text="Checkout"
                ease="power2.out"
                shuffleDirection="down"
                shuffleTimes={6}
                stagger={0.07}
                loop={true}
                loopDelay={0.9}
              />
            </h1>
            <div className="mx-auto mb-4 rounded-full" style={{ width: "3rem", height: "3px", background: "rgba(255,247,211,0.2)" }} />
            <p style={{ color: "rgba(255,247,211,0.6)", fontSize: "1rem" }}>
              Complete your order details below
            </p>
          </div>

          <CheckoutForm />

        </div>
      </main>

      <CartSidebar />
    </div>
  )
}