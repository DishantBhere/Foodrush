"use client"

import { usePathname } from "next/navigation"
import Iridescence from "@/components/Iridescence"

export default function IridescenceWrapper() {
  const pathname = usePathname()

  // Sirf track page pe
  if (pathname !== "/track") return null

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none" }}>
      <Iridescence
        color={[0.9, 0, 0]}
        speed={2}
        amplitude={0.1}
        mouseReactive={true}
      />
    </div>
  )
}