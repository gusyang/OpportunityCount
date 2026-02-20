"use client"

import { cn } from "@/lib/utils"
import { Signal, Wifi, Battery } from "lucide-react"

interface AndroidDeviceFrameProps {
  children: React.ReactNode
  className?: string
}

export function AndroidDeviceFrame({ children, className }: AndroidDeviceFrameProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-[380px] rounded-[2.8rem] bg-[#1c2333] p-[6px] shadow-2xl",
        "ring-1 ring-[#2a3548]",
        className
      )}
    >
      {/* Notch / camera cutout */}
      <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-10 w-20 h-[5px] rounded-full bg-[#0d1117]" />

      {/* Inner screen */}
      <div className="relative overflow-hidden rounded-[2.4rem] bg-[#f2f4f7] min-h-[700px] flex flex-col">
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 py-2 bg-[#1c2333] text-[11px] text-white/80">
          <span className="font-medium tabular-nums">9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="size-3" />
            <Wifi className="size-3" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px]">85%</span>
              <Battery className="size-3.5" />
            </div>
          </div>
        </div>

        {/* Screen content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>

        {/* Home indicator */}
        <div className="flex items-center justify-center py-2 bg-[#f2f4f7]">
          <div className="h-[4px] w-28 rounded-full bg-[#1c2333]/20" />
        </div>
      </div>
    </div>
  )
}
