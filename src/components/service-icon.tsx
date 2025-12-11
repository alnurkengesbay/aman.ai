"use client"

import { Scan, Activity, ClipboardList, Dna, Droplets, HeartPulse, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap: Record<string, LucideIcon> = {
  Scan,
  Activity,
  ClipboardList,
  Dna,
  Droplets,
  HeartPulse,
}

interface ServiceIconProps {
  name: string
  className?: string
}

export function ServiceIcon({ name, className }: ServiceIconProps) {
  const Icon = iconMap[name] || Scan
  return <Icon className={cn("w-5 h-5", className)} />
}


