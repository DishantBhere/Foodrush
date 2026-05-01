"use client"

export function AdminHeader() {
  return (
    <header style={{
      background: "rgba(255,247,211,0.04)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,247,211,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 40,
      overflow: "hidden",
    }}>

      {/* Subtle shimmer blobs */}
      <div style={{
        position: "absolute", top: "-20px", left: "30%",
        width: "180px", height: "80px", borderRadius: "50%",
        background: "rgba(255,247,211,0.03)",
        filter: "blur(20px)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-10px", right: "20%",
        width: "120px", height: "60px", borderRadius: "50%",
        background: "rgba(255,215,0,0.04)",
        filter: "blur(16px)",
        pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 2rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
      }}>

        {/* LEFT — Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "10px",
            background: "linear-gradient(135deg, #fff7d3, #ffe48a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: "1rem", color: "#9f242f",
            letterSpacing: "-0.05em", flexShrink: 0,
            boxShadow: "0 4px 16px rgba(255,247,211,0.25)",
          }}>
            FR
          </div>

          <div>
            <p style={{
              fontWeight: 800, color: "#fff7d3",
              fontSize: "1.05rem", letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}>
              FoodRush
              <span style={{
                marginLeft: "8px",
                fontSize: "0.6rem", fontWeight: 700,
                color: "rgba(255,247,211,0.35)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                verticalAlign: "middle",
              }}>
                · Admin
              </span>
            </p>
            <p style={{
              fontSize: "0.62rem", color: "rgba(255,247,211,0.25)",
              letterSpacing: "0.18em", textTransform: "uppercase", marginTop: "1px",
            }}>
              Campus Canteen Management
            </p>
          </div>
        </div>

        {/* RIGHT — Live indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <style>{`
            @keyframes livePulse {
              0%, 100% { opacity: 1; box-shadow: 0 0 6px #4ade80; }
              50% { opacity: 0.6; box-shadow: 0 0 14px #4ade80; }
            }
          `}</style>
          <div style={{
            display: "flex", alignItems: "center", gap: "7px",
            background: "rgba(74,222,128,0.08)",
            border: "1px solid rgba(74,222,128,0.25)",
            borderRadius: "9999px",
            padding: "6px 14px",
          }}>
            <span style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: "#4ade80",
              display: "inline-block",
              animation: "livePulse 2s ease-in-out infinite",
            }} />
            <span style={{
              fontSize: "0.72rem", color: "#4ade80",
              fontWeight: 700, letterSpacing: "0.05em",
            }}>
              Live
            </span>
          </div>
        </div>

      </div>

      {/* Bottom shimmer line */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "1px",
        background: "linear-gradient(to right, transparent, rgba(255,247,211,0.15), rgba(255,215,0,0.2), rgba(255,247,211,0.15), transparent)",
      }} />
    </header>
  )
}