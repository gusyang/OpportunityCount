"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { MapPin, Package, Hash, Ruler, SkipForward } from "lucide-react"

interface CountDetail {
  location: string
  itemName?: string
  qty?: number
  uom?: string
}

interface QtyVerifyScreenProps {
  detail: CountDetail
  onMatch?: () => void
  onNotMatch?: () => void
  onSkip?: () => void
  allowSkip?: boolean
}

export function QtyVerifyScreen({
  detail,
  onMatch,
  onNotMatch,
  onSkip,
  allowSkip = true,
}: QtyVerifyScreenProps) {
  const [pressedBtn, setPressedBtn] = useState<string | null>(null)
  const isEmpty = !detail.itemName && !detail.qty

  return (
    <div className="flex-1 flex flex-col px-4 py-3">
      {/* Header bar */}
      <div className="rounded-t-xl bg-[#2a2a4a] px-4 py-3">
        <h1 className="text-sm font-semibold text-[#e0e0e0] tracking-wide">
          On-Screen Opportunity Count
        </h1>
      </div>

      {/* Card body */}
      <div className="flex-1 flex flex-col bg-[#f5f5f0] rounded-b-xl shadow-lg">
        {/* Count Detail section */}
        <div className="px-4 pt-4 pb-3">
          <p className="text-xs font-bold text-[#333] mb-2 uppercase tracking-wider">
            Count Detail:
          </p>

          <div className="flex flex-col gap-2">
            {/* Location - always shown */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-6 rounded bg-[#2a2a4a]/10">
                <MapPin className="size-3.5 text-[#2a2a4a]" />
              </div>
              <span className="text-xs text-[#666]">Location:</span>
              <span className="text-xs font-semibold text-[#222] font-mono">{detail.location}</span>
            </div>

            {/* Item - only when not empty */}
            {!isEmpty && detail.itemName && (
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center size-6 rounded bg-[#2a2a4a]/10">
                  <Package className="size-3.5 text-[#2a2a4a]" />
                </div>
                <span className="text-xs text-[#666]">Item:</span>
                <span className="text-xs font-semibold text-[#222]">{detail.itemName}</span>
              </div>
            )}

            {/* Qty + UOM - only when not empty */}
            {!isEmpty && detail.qty !== undefined && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center size-6 rounded bg-[#2a2a4a]/10">
                    <Hash className="size-3.5 text-[#2a2a4a]" />
                  </div>
                  <span className="text-xs text-[#666]">Qty:</span>
                  <span className="text-xs font-bold text-[#222] font-mono">
                    {detail.qty} {detail.uom || "EA"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-[#d0d0c8]" />

        {/* Message */}
        <div className="px-4 py-4 flex-1">
          {isEmpty ? (
            <p className="text-xs leading-relaxed text-[#444]">
              Before you drop inventory, the system indicates that the location is
              empty. Can you please{" "}
              <span className="text-[#2e7d32] font-semibold">physically verify</span>{" "}
              and confirm the empty status of the location?
            </p>
          ) : (
            <p className="text-xs leading-relaxed text-[#444]">
              Before you drop inventory, please physically verify and confirm
              inventory of the location match system record.
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="px-4 pb-4 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={onNotMatch}
              onPointerDown={() => setPressedBtn("notmatch")}
              onPointerUp={() => setPressedBtn(null)}
              onPointerLeave={() => setPressedBtn(null)}
              className={cn(
                "flex-1 py-3 rounded-lg text-sm font-bold tracking-wide transition-all border-2",
                "bg-[#ffcdd2] border-[#ef5350] text-[#c62828]",
                pressedBtn === "notmatch" && "scale-95 brightness-90"
              )}
            >
              NOT MATCH
            </button>
            <button
              onClick={onMatch}
              onPointerDown={() => setPressedBtn("match")}
              onPointerUp={() => setPressedBtn(null)}
              onPointerLeave={() => setPressedBtn(null)}
              className={cn(
                "flex-1 py-3 rounded-lg text-sm font-bold tracking-wide transition-all border-2",
                "bg-[#c8e6c9] border-[#66bb6a] text-[#2e7d32]",
                pressedBtn === "match" && "scale-95 brightness-90"
              )}
            >
              MATCH
            </button>
          </div>

          {allowSkip && (
            <button
              onClick={onSkip}
              onPointerDown={() => setPressedBtn("skip")}
              onPointerUp={() => setPressedBtn(null)}
              onPointerLeave={() => setPressedBtn(null)}
              className={cn(
                "w-full py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all border",
                "bg-[#e0e0e0]/60 border-[#bdbdbd] text-[#616161] flex items-center justify-center gap-1.5",
                pressedBtn === "skip" && "scale-95 brightness-90"
              )}
            >
              <SkipForward className="size-3.5" />
              SKIP
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
