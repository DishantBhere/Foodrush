import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminHeader } from "@/components/admin/admin-header"
import DarkVeil from "@/components/admin/dark-veil"
import ClickSpark from "@/components/ClickSpark"

export default async function AdminPage() {
  // Check auth cookie — if not present, redirect to login
  const cookieStore = await cookies()
  const auth = cookieStore.get("admin_auth")

  if (!auth?.value) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen relative" style={{ background: "#1a0305" }}>
      {/* Animated background */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, opacity: 0.55 }}>
        <DarkVeil
          hueShift={239}
          speed={1.5}
          scanlineFrequency={4}
          scanlineIntensity={0.3}
          warpAmount={1.2}
          noiseIntensity={0.03}
          resolutionScale={0.8}
        />
      </div>
      <ClickSpark
        sparkColor="#ffd700"
        sparkSize={14}
        sparkRadius={25}
        sparkCount={12}
        duration={600}
        easing="ease-out"
        extraScale={1.5}
      />
      {/* Content on top */}
      <div className="relative z-10">
        <AdminHeader />
        <main className="container mx-auto px-6 py-8">
          <AdminDashboard />
        </main>
      </div>
    </div>
  )
}