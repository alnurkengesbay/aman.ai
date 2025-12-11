import { Brain } from "lucide-react"

export function Logo({ className = "", size = "default" }: { className?: string; size?: "sm" | "default" | "large" }) {
  const iconSize = size === "large" ? "h-10 w-10" : size === "sm" ? "h-5 w-5" : "h-6 w-6"
  const textSize = size === "large" ? "text-xl" : size === "sm" ? "text-sm" : "text-base"

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative">
        <Brain className={`${iconSize} animate-subtle-pulse`} strokeWidth={1.5} />
      </div>
      <span className={`${textSize} font-mono font-medium tracking-tight`}>
        aman<span className="text-muted-foreground">.ai</span>
      </span>
    </div>
  )
}
