"use client"

import { useState, memo } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import ClickSpark from "@/components/ClickSpark"

const Hyperspeed = dynamic(() => import("@/components/Hyperspeed"), {
  ssr: false,
});

// Memoize so it NEVER re-renders when parent state changes
const HyperspeedBg = memo(function HyperspeedBg() {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 0,
    }}>
      <Hyperspeed
        effectOptions={{
          distortion: "turbulentDistortion",
          length: 400,
          roadWidth: 10,
          islandWidth: 2,
          lanesPerRoad: 4,
          fov: 90,
          fovSpeedUp: 150,
          speedUp: 2,
          carLightsFade: 0.4,
          totalSideLightSticks: 50,
          lightPairsPerRoadWay: 50,
          shoulderLinesWidthPercentage: 0.05,
          brokenLinesWidthPercentage: 0.1,
          brokenLinesLengthPercentage: 0.5,
          lightStickWidth: [0.12, 0.5],
          lightStickHeight: [1.3, 1.7],
          movingAwaySpeed: [60, 80],
          movingCloserSpeed: [-120, -160],
          carLightsLength: [400 * 0.05, 400 * 0.15],
          carLightsRadius: [0.05, 0.14],
          carWidthPercentage: [0.3, 0.5],
          carShiftX: [-0.8, 0.8],
          carFloorSeparation: [0.05, 1],
          colors: {
            roadColor: 0x080808,
            islandColor: 0x0a0a0a,
            background: 0x000000,
            shoulderLines: 0x131318,
            brokenLines: 0x131318,
            leftCars: [0x9f242f, 0xcc0000, 0xff2200],
            rightCars: [0xffd700, 0xff8800, 0xfff7d3],
            sticks: 0x9f242f,
          },
        }}
      />
    </div>
  )
})

// Separate login form component so its state is isolated
function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push("/admin")
        router.refresh()
      } else {
        setError(data.error || "Invalid credentials")
      }
    } catch {
      setError("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10,
        width: "420px",
        maxWidth: "90vw",
        padding: "0 1.5rem",
        pointerEvents: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "64px",
          height: "64px",
          borderRadius: "9999px",
          background: "rgba(159,36,47,0.35)",
          border: "1px solid rgba(255,247,211,0.25)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          marginBottom: "1rem",
          fontSize: "1.75rem",
        }}>
          <img src="/logoo.png" alt="Logo" style={{ width: "90px", height: "90px", objectFit: "contain" }} />
        </div>
        <h1 style={{
          color: "#fff7d3",
          fontFamily: "Georgia, serif",
          fontSize: "2.25rem",
          fontWeight: "700",
          letterSpacing: "0.06em",
          margin: 0,
          textShadow: "0 0 40px rgba(159,36,47,0.9), 0 2px 12px rgba(0,0,0,0.9)",
        }}>
          Food Rush.IO
        </h1>
        <p style={{
          color: "rgba(255,247,211,0.45)",
          fontSize: "0.75rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          marginTop: "0.5rem",
          marginBottom: 0,
        }}>
          Admin Portal
        </p>
      </div>

      {/* Glass Card */}
      <div style={{
        background: "rgba(5,0,10,0.72)",
        backdropFilter: "blur(36px)",
        WebkitBackdropFilter: "blur(36px)",
        border: "1px solid rgba(255,247,211,0.1)",
        borderRadius: "1.5rem",
        padding: "3rem 2.5rem",
        width: "100%",
        boxShadow: "0 8px 60px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(159,36,47,0.12)",
      }}>
        <p style={{
          color: "rgba(255,247,211,0.5)",
          fontSize: "0.78rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginTop: 0,
          marginBottom: "2rem",
        }}>
          Sign in to continue
        </p>

        <form onSubmit={handleLogin}>
          {/* Username */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              color: "rgba(255,247,211,0.4)",
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "0.6rem",
            }}>
              Username or Email
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              style={{
                width: "100%",
                background: "rgba(255,247,211,0.06)",
                border: "1px solid rgba(255,247,211,0.12)",
                borderRadius: "0.75rem",
                padding: "0.95rem 1rem",
                color: "#fff7d3",
                fontSize: "0.95rem",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
                WebkitTapHighlightColor: "transparent",
                WebkitAppearance: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(159,36,47,0.7)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,247,211,0.12)")}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "2rem" }}>
            <label style={{
              display: "block",
              color: "rgba(255,247,211,0.4)",
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "0.6rem",
              outline: "none",
              WebkitTapHighlightColor: "transparent",
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                background: "rgba(255,247,211,0.06)",
                border: "1px solid rgba(255,247,211,0.12)",
                borderRadius: "0.75rem",
                padding: "0.95rem 1rem",
                color: "#fff7d3",
                fontSize: "0.95rem",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
                WebkitTapHighlightColor: "transparent",
                WebkitAppearance: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(159,36,47,0.7)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,247,211,0.12)")}
            />
          </div>

          {error && (
            <div style={{
              background: "rgba(159,36,47,0.2)",
              border: "1px solid rgba(159,36,47,0.5)",
              borderRadius: "0.65rem",
              padding: "0.65rem 1rem",
              color: "#ffaaaa",
              fontSize: "0.85rem",
              marginBottom: "1.25rem",
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "rgba(255,247,211,0.5)" : "#fff7d3",
              color: "#1a0000",
              fontWeight: "800",
              fontSize: "0.95rem",
              padding: "1rem",
              borderRadius: "9999px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.05em",
              transition: "opacity 0.2s, transform 0.1s, background 0.1s",
              WebkitAppearance: "none",
              WebkitTapHighlightColor: "transparent",
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.88" }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.opacity = "1" }}
            onMouseDown={(e) => { if (!loading) { e.currentTarget.style.transform = "scale(0.97)"; e.currentTarget.style.background = "#e6ddb5" } }}
            onMouseUp={(e) => { if (!loading) { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "#fff7d3" } }}
            onTouchStart={(e) => { if (!loading) { e.currentTarget.style.transform = "scale(0.97)"; e.currentTarget.style.background = "#e6ddb5" } }}
            onTouchEnd={(e) => { if (!loading) { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "#fff7d3" } }}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>
      </div>

      <p style={{
        textAlign: "center",
        marginTop: "1.5rem",
        color: "rgba(255,247,211,0.18)",
        fontSize: "0.72rem",
        letterSpacing: "0.1em",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
      }}>
        Campus Canteen Management System
      </p>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div style={{
      height: "100vh",
      width: "100%",
      background: "#000",
      position: "relative",
      overflow: "hidden",
    }}>
      <HyperspeedBg />
      <ClickSpark
        sparkColor="rgba(255,215,0,0.3)"
        sparkSize={14}
        sparkRadius={25}
        sparkCount={12}
        duration={600}
        easing="ease-out"
        extraScale={1.5}
      />
      <LoginForm />
    </div>
  )
}