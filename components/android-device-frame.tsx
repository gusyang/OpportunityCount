"use client"

import { cn } from "@/lib/utils"
import { Battery, Signal, Wifi } from "lucide-react"

interface AndroidDeviceFrameProps {
  children: React.ReactNode
  className?: string
}

export function AndroidDeviceFrame({ children, className }: AndroidDeviceFrameProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-[380px] rounded-[2.5rem] border-[3px] border-foreground/20 bg-foreground/5 p-2 shadow-xl",
        className
      )}
    >
      {/* Inner frame */}
      <div className="relative overflow-hidden rounded-[2rem] bg-[#1a1a2e] min-h-[680px] flex flex-col">
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 py-2 text-[11px] text-[#e0e0e0]">
          <span className="font-medium tabular-nums">12:30</span>
          <div className="flex items-center gap-1.5">
            <Signal className="size-3" />
            <Wifi className="size-3" />
            <Battery className="size-3.5" />
          </div>
        </div>

        {/* Screen content */}
        <div className="flex-1 flex flex-col">
          {children}
        </div>

        {/* Bottom nav bar */}
        <div className="flex items-center justify-center py-2">
          <div className="h-1 w-28 rounded-full bg-[#e0e0e0]/30" />
        </div>
      </div>
    </div>
  )
}
