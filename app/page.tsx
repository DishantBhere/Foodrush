"use client"

import { MenuSection } from "@/components/menu-section"
import { CartSidebar } from "@/components/cart-sidebar"
import { Header } from "@/components/header"
import Chatbot from "@/components/ui/chatbot"
import ClickSpark from "@/components/ClickSpark"
import { useState, useEffect, useRef } from "react"
const HERO_SLIDES = [
  {
    image: "/img1.jpg",
    tag: "Today's Special",
    title: "Taste the\nCampus",
    subtitle: "Fresh, hot & made with love — right at your canteen",
    cta: "Order Now",
  },
  {
    image: "/img2.jpg",
    tag: "Most Loved",
    title: "Student\nFavourites",
    subtitle: "The dishes your batch keeps coming back for",
    cta: "Explore Menu",
  },
  {
    image: "/img3.jpg",
    tag: "Quick Bites",
    title: "Fast.\nFresh.\nFilling.",
    subtitle: "Between lectures? We've got you covered",
    cta: "View Specials",
  },
  {
    image: "/img4.jpg",
    tag: null,
    title: null,
    subtitle: null,
    cta: null,
  },
]

const FEATURES = [
  { icon: "⚡", title: "Lightning Fast", desc: "Ready in 10–15 mins. Skip the queue." },
  { icon: "🍽️", title: "Fresh Daily",    desc: "Prepared fresh every morning." },
  { icon: "💰", title: "Student Prices", desc: "Meals starting at just ₹30." },
  { icon: "📍", title: "Campus Only",    desc: "Pick up from canteen. Easy." },
]

const STATS = [
  { value: 500, suffix: "+", label: "Students Served Daily",  icon: "👨‍🎓", decimal: false },
  { value: 30,  suffix: "+", label: "Menu Items",             icon: "🍛",  decimal: false },
  { value: 3,   suffix: "",  label: "Years Serving Campus",   icon: "🏆",  decimal: false },
  { value: 4.8, suffix: "★", label: "Average Rating",         icon: "⭐",  decimal: true  },
]

const MARQUEE_ITEMS = [
  "🍛 Fresh Biryani", "🍜 Hot Noodles", "🥙 Veg Wraps", "☕ Masala Chai",
  "🍕 Pizza Slices",  "🧆 Samosa",      "🍱 Thali Special", "🥤 Cold Drinks",
  "🍰 Desserts",      "🫓 Sandwiches",
]

function useCountUp(target: number, duration = 1800, decimal = false) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const steps = 60
          const step = target / steps
          let current = 0
          const timer = setInterval(() => {
            current += step
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(decimal ? Math.round(current * 10) / 10 : Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration, decimal])

  return { count, ref }
}

function StatCard({ value, suffix, label, icon, decimal }: typeof STATS[0]) {
  const { count, ref } = useCountUp(value, 1800, decimal)
  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center text-center rounded-2xl p-8"
      style={{
        background: "rgba(255,247,211,0.06)",
        border: "1px solid rgba(255,247,211,0.12)",
        transition: "all 0.3s ease",
        cursor: "default",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.background = "rgba(255,247,211,0.12)"
        el.style.transform = "translateY(-6px)"
        el.style.borderColor = "rgba(255,247,211,0.28)"
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.background = "rgba(255,247,211,0.06)"
        el.style.transform = "translateY(0)"
        el.style.borderColor = "rgba(255,247,211,0.12)"
      }}
    >
      <span style={{ fontSize: "2rem", lineHeight: 1, marginBottom: "0.75rem" }}>{icon}</span>
      <p className="font-extrabold text-[#fff7d3] leading-none" style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)" }}>
        {decimal ? (count as number).toFixed(1) : (count as number).toLocaleString()}
        <span style={{ color: "#ffd700" }}>{suffix}</span>
      </p>
      <p className="mt-2 text-sm leading-snug" style={{ color: "rgba(255,247,211,0.55)", maxWidth: "120px" }}>
        {label}
      </p>
    </div>
  )
}

function MarqueeStrip() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div
      className="overflow-hidden py-4"
      style={{
        background: "#6b0d14",
        borderTop: "1px solid rgba(255,247,211,0.08)",
        borderBottom: "1px solid rgba(255,247,211,0.08)",
      }}
    >
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { display: flex; width: max-content; animation: marquee 22s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>
      <div className="marquee-track">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 font-semibold text-sm whitespace-nowrap"
            style={{ color: "#fff7d3", padding: "0 2.2rem", opacity: 0.75 }}
          >
            {item}
            <span style={{ color: "rgba(255,247,211,0.25)", fontSize: "0.5rem" }}>●</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function InstagramGrid() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-[0.35em] font-semibold mb-3" style={{ color: "rgba(255,247,211,0.4)" }}>
          From Our Kitchen
        </p>
        <h2 className="font-extrabold text-[#fff7d3] tracking-tight" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
          Food Gallery
        </h2>
        <div className="mx-auto mt-4 rounded-full" style={{ width: "3rem", height: "3px", background: "rgba(255,247,211,0.2)" }} />
        <p className="mt-3 text-sm" style={{ color: "rgba(255,247,211,0.5)" }}>
          Real food. Real students. Real campus. 📸
        </p>
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
        <div className="relative rounded-2xl overflow-hidden group cursor-pointer" style={{ gridRow: "span 2", minHeight: "380px" }}>
          <img src="/gallery1.jpg" alt="Gallery 1" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(to top, rgba(90,8,14,0.85) 0%, transparent 60%)" }}>
            <span className="text-sm font-bold text-[#fff7d3]">Samosa Time 🧆</span>
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden group cursor-pointer" style={{ minHeight: "185px" }}>
          <img src="/gallery2.jpg" alt="Gallery 2" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(to top, rgba(90,8,14,0.85) 0%, transparent 60%)" }}>
            <span className="text-sm font-bold text-[#fff7d3]">Biryani Monday 🍛</span>
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden group cursor-pointer" style={{ minHeight: "185px" }}>
          <img src="/gallery3.jpg" alt="Gallery 3" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(to top, rgba(90,8,14,0.85) 0%, transparent 60%)" }}>
            <span className="text-sm font-bold text-[#fff7d3]">Noodle Vibes 🍜</span>
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden group cursor-pointer" style={{ minHeight: "185px" }}>
          <img src="/gallery4.jpg" alt="Gallery 4" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(to top, rgba(90,8,14,0.85) 0%, transparent 60%)" }}>
            <span className="text-sm font-bold text-[#fff7d3]">Pizza & More 🍕</span>
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden group cursor-pointer" style={{ minHeight: "185px" }}>
          <img src="/gallery5.jpg" alt="Gallery 5" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(to top, rgba(90,8,14,0.85) 0%, transparent 60%)" }}>
            <span className="text-sm font-bold text-[#fff7d3]">Our Kitchen 👨‍🍳</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const [slide, setSlide] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setSlide(s => (s + 1) % HERO_SLIDES.length)
        setFading(false)
      }, 400)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (i: number) => {
    if (i === slide) return
    setFading(true)
    setTimeout(() => { setSlide(i); setFading(false) }, 400)
  }

  const current = HERO_SLIDES[slide]
  const isBlankSlide = !current.tag && !current.title

  return (
    <div className="min-h-screen bg-[#9f242f] text-[#fff7d3] overflow-x-hidden">


      <ClickSpark
        sparkColor="#ffd700"
        sparkSize={12}
        sparkRadius={20}
        sparkCount={10}
        duration={500}
        easing="ease-out"
        extraScale={1.2}
      >
        <Header />

        {/* ── HERO ── */}
        <section className="relative w-full overflow-hidden" style={{ height: "clamp(480px, 88vh, 700px)" }}>
          <div className="absolute inset-0" style={{ opacity: fading ? 0 : 1, transition: "opacity 0.4s ease" }}>
            <img src={current.image} alt="Hero" className="w-full h-full object-cover object-center" />
            {!isBlankSlide && (
              <>
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(90,8,14,0.92) 0%, rgba(90,8,14,0.75) 30%, rgba(90,8,14,0.3) 55%, transparent 75%)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(90,8,14,0.55) 0%, transparent 40%)" }} />
              </>
            )}
          </div>

          {!isBlankSlide && (
            <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-14 lg:px-20" style={{ maxWidth: "520px", opacity: fading ? 0 : 1, transition: "opacity 0.4s ease" }}>
              {current.tag && (
                <span className="inline-flex items-center gap-2 w-fit mb-5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest" style={{ background: "rgba(255,247,211,0.12)", border: "1px solid rgba(255,247,211,0.25)", color: "#fff7d3", backdropFilter: "blur(8px)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] inline-block" />
                  {current.tag}
                </span>
              )}
              {current.title && (
                <h1 className="font-extrabold text-[#fff7d3] leading-[1.08] mb-5" style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)", whiteSpace: "pre-line" }}>
                  {current.title}
                </h1>
              )}
              {current.subtitle && (
                <p className="leading-relaxed mb-8" style={{ color: "rgba(255,247,211,0.75)", fontSize: "clamp(0.88rem, 1.6vw, 1.1rem)", maxWidth: "360px" }}>
                  {current.subtitle}
                </p>
              )}
              {current.cta && (
                <a href="#menu" className="inline-flex items-center gap-2 w-fit font-bold rounded-full shadow-lg transition-all duration-200 hover:scale-105 active:scale-95" style={{ background: "#fff7d3", color: "#9f242f", padding: "0.85rem 2rem", fontSize: "clamp(0.85rem, 1.4vw, 1rem)" }}>
                  {current.cta}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              )}
            </div>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {HERO_SLIDES.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} style={{ width: i === slide ? "2rem" : "0.6rem", height: "0.6rem", borderRadius: "9999px", background: i === slide ? "#fff7d3" : "rgba(255,247,211,0.35)", border: "none", cursor: "pointer", transition: "all 0.3s ease", padding: 0 }} />
            ))}
          </div>
          <div className="absolute bottom-6 right-6 z-20 font-mono text-xs hidden md:block" style={{ color: "rgba(255,247,211,0.4)" }}>
            {String(slide + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{ background: "#7d1a23", borderTop: "1px solid rgba(255,247,211,0.08)", borderBottom: "1px solid rgba(255,247,211,0.08)" }}>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {FEATURES.map((f, i) => (
                <div key={f.title} className="flex items-start gap-3 px-5 py-6" style={{ borderRight: i < FEATURES.length - 1 ? "1px solid rgba(255,247,211,0.08)" : "none" }}>
                  <span style={{ fontSize: "1.4rem", lineHeight: 1, marginTop: "2px" }}>{f.icon}</span>
                  <div>
                    <p className="font-bold text-[#fff7d3] text-sm">{f.title}</p>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "rgba(255,247,211,0.5)" }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <MarqueeStrip />

        {/* ── STATS ── */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.35em] font-semibold mb-3" style={{ color: "rgba(255,247,211,0.4)" }}>By the Numbers</p>
            <h2 className="font-extrabold text-[#fff7d3] tracking-tight" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>Trusted by the Campus</h2>
            <div className="mx-auto mt-4 rounded-full" style={{ width: "3rem", height: "3px", background: "rgba(255,247,211,0.2)" }} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(s => <StatCard key={s.label} {...s} />)}
          </div>
        </section>

        {/* ── PROMO ── */}
        <section className="container mx-auto px-4 pb-10">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ minHeight: "clamp(160px, 26vw, 320px)" }}>
            <img src="/img5.jpg" alt="Promo" className="absolute inset-0 w-full h-full object-cover object-center" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(90,8,14,0.90) 0%, rgba(90,8,14,0.65) 40%, rgba(90,8,14,0.1) 100%)" }} />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-8 md:px-12 py-10">
              <div>
                <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: "rgba(255,247,211,0.5)" }}>Limited Time Offer</p>
                <h3 className="font-extrabold text-[#fff7d3] leading-tight" style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)" }}>
                  Combo Meals <span style={{ color: "#ffd700" }}>Starting ₹49</span>
                </h3>
                <p className="mt-2 text-sm max-w-sm" style={{ color: "rgba(255,247,211,0.6)" }}>Main course + drink + dessert at an unbeatable student price</p>
              </div>
              <a href="#menu" className="shrink-0 font-bold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg" style={{ background: "#fff7d3", color: "#9f242f", padding: "1rem 2.2rem", fontSize: "0.9rem", whiteSpace: "nowrap" }}>
                Grab the Deal →
              </a>
            </div>
          </div>
        </section>

        {/* ── MENU ── */}
        <main id="menu" className="py-14">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.35em] font-semibold mb-3" style={{ color: "rgba(255,247,211,0.4)" }}>What's Cooking</p>
              <h2 className="font-extrabold text-[#fff7d3] tracking-tight" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>Our Menu</h2>
              <div className="mx-auto mt-4 rounded-full" style={{ width: "3rem", height: "3px", background: "rgba(255,247,211,0.2)" }} />
              <p className="mt-4 max-w-md mx-auto" style={{ color: "rgba(255,247,211,0.55)", fontSize: "clamp(0.85rem, 1.5vw, 1rem)" }}>
                Choose your favourites from our carefully crafted selections
              </p>
            </div>
            <MenuSection />
          </div>
        </main>

        {/* ── GALLERY ── */}
        <InstagramGrid />

        {/* ── VISIT US ── */}
        <section className="container mx-auto px-4 pb-14">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ height: "clamp(200px, 30vw, 360px)" }}>
            <img src="/visitus.jpg" alt="Visit Us" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(90,8,14,0.88) 0%, rgba(90,8,14,0.5) 40%, transparent 70%)" }} />
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14">
              <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: "rgba(255,247,211,0.5)" }}>Our Location</p>
              <h3 className="font-extrabold text-[#fff7d3] leading-tight" style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)" }}>Come Visit Us</h3>
              <p className="text-sm mt-2" style={{ color: "rgba(255,247,211,0.6)" }}>FOODRUSH Canteen · Near Main Building · Ground Floor · Open Mon–Sat, 8am–8pm</p>
              <div className="mt-5 inline-flex items-center gap-2 w-fit text-sm font-semibold rounded-full transition-all duration-200 hover:bg-[#fff7d3] hover:text-[#9f242f] cursor-pointer" style={{ border: "1px solid rgba(255,247,211,0.35)", color: "#fff7d3", padding: "0.6rem 1.4rem" }}>
                📍 Get Directions
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}

<footer className="relative bg-[#6b0d14] border-t border-[#fff7d3]/10 overflow-hidden">
  
  {/* subtle texture */}
  <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(circle_at_20%_20%,#ffffff10,transparent_40%)]"></div>

  <div className="container mx-auto px-6 pt-16 pb-8 relative z-10">
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-12 border-b border-[#fff7d3]/10">
      
      {/* Left */}
      <div className="space-y-5">
        <p className="font-black text-[#fff7d3] text-3xl tracking-tight flex items-center gap-2">
          <span className="bg-[#fff7d3]/10 p-2 rounded-xl">🍽️</span>
          FoodRush
        </p>

        <p className="text-[#fff7d3]/60 text-sm leading-relaxed max-w-md">
          Your campus canteen — serving hot, fresh meals to hungry students every day.
        </p>
      </div>

      {/* Right */}
      <div className="bg-black/10 backdrop-blur-sm border border-[#fff7d3]/10 rounded-2xl p-6 shadow-lg">
        
        <div className="flex items-center justify-between mb-5">
          <p className="font-bold text-[#fff7d3] text-xs uppercase tracking-[0.2em]">
            Opening Hours
          </p>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-green-400 text-[10px] font-bold uppercase tracking-wider">
              Open Now
            </span>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          
          <div className="flex items-center justify-between group">
            <span className="text-[#fff7d3]/60 group-hover:text-[#fff7d3] transition-colors">
              Mon – Fri
            </span>
            <span className="text-[#fff7d3] font-medium">8:00am – 8:00pm</span>
          </div>

          <div className="flex items-center justify-between group">
            <span className="text-[#fff7d3]/60 group-hover:text-[#fff7d3] transition-colors">
              Saturday
            </span>
            <span className="text-[#fff7d3] font-medium">9:00am – 6:00pm</span>
          </div>

          <div className="flex items-center justify-between opacity-70">
            <span className="text-[#fff7d3]/50">Sunday</span>
            <span className="text-[#ffd700] font-bold uppercase text-xs tracking-wide">
              Closed
            </span>
          </div>

        </div>
      </div>

    </div>

    {/* Bottom */}
    <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
      
      <p className="text-[#fff7d3]/30 text-xs tracking-wide">
        © {new Date().getFullYear()} FoodRush. All rights reserved.
      </p>

      <p className="text-[#fff7d3]/40 text-sm flex items-center gap-1">
        Made with <span className="text-[#ffd700] animate-pulse">♥</span> by
        <span className="text-[#fff7d3] font-semibold hover:text-[#ffd700] transition-colors cursor-pointer">
          Dishant Bhere
        </span>
      </p>

    </div>

  </div>
</footer>

      </ClickSpark>
      <CartSidebar />
      <Chatbot />
    </div>
  )
}