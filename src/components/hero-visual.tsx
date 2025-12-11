"use client"

import { useEffect, useState } from "react"

export function HeroVisual() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Central orb with glow */}
      <div className="absolute top-1/2 right-[15%] -translate-y-1/2 hidden lg:block">
        <div className="relative w-[400px] h-[400px]">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-foreground/5 animate-scale-in" />

          {/* Middle ring */}
          <div
            className="absolute inset-12 rounded-full border border-foreground/10 animate-scale-in"
            style={{ animationDelay: "0.2s" }}
          />

          {/* Inner glow */}
          <div
            className="absolute inset-24 rounded-full bg-gradient-to-br from-foreground/5 to-transparent animate-scale-in animate-subtle-pulse"
            style={{ animationDelay: "0.4s" }}
          />

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-foreground/20 animate-pulse-dot" />

          {/* Orbiting elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-foreground/30 animate-orbit" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-foreground/20 animate-orbit-reverse" />

          {/* Floating dots */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-foreground/20 animate-float"
              style={{
                top: `${20 + i * 15}%`,
                left: `${10 + i * 18}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${6 + i}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Gradient overlay from bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}
