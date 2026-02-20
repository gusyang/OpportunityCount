"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"

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
  const isEmpty = !detail.itemName && (!detail.qty || detail.qty === 0)

  return (
    <div className="flex-1 flex flex-col bg-[#f2f4f7]">
      {/* Red Banner */}
      <div className="mx-4 mt-3 rounded-2xl bg-gradient-to-r from-[#d32f2f] to-[#e53935] px-6 py-4 shadow-md">
        <h1 className="text-center text-lg font-extrabold text-white tracking-wide uppercase">
          Inventory Verification
        </h1>
      </div>

      {/* Detail Card */}
      <div className="mx-4 mt-4 rounded-2xl bg-white shadow-sm border border-[#e2e6ed] overflow-hidden">
        {/* Location row */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#eef0f4]">
          <span className="text-sm text-[#6b7a90] font-medium">Location</span>
          <span className="text-base font-bold text-[#1c2333] font-mono tracking-wide">
            {detail.location}
          </span>
        </div>

        {/* Item row - always show when not empty */}
        {!isEmpty && detail.itemName && (
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#eef0f4]">
            <span className="text-sm text-[#6b7a90] font-medium">Item</span>
            <span className="text-sm font-bold text-[#1c2333] text-right max-w-[60%]">
              {detail.itemName}
            </span>
          </div>
        )}

        {/* Qty row */}
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-sm text-[#6b7a90] font-medium">Expected Qty</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-black text-[#1c2333] tabular-nums leading-none">
              {isEmpty ? 0 : (detail.qty ?? 0)}
            </span>
            <span className="text-lg font-bold text-[#8b96a5] uppercase">
              {detail.uom || "EA/PLT"}
            </span>
          </div>
        </div>
      </div>

      {/* Prompt Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6">
        {isEmpty ? (
          <>
            <p className="text-base text-[#3a4556] text-center leading-relaxed">
              Location should be{" "}
              <span className="font-extrabold text-[#d32f2f] uppercase">Empty</span>{" "}
              now.
            </p>
            <p className="text-base font-bold text-[#1c2333] mt-2 text-center">
              Please confirm
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-[#6b7a90] text-center">
              Does remaining qty
            </p>
            <p className="text-center mt-1">
              <span className="text-xl font-extrabold text-[#1c2333] uppercase">
                Match {detail.qty ?? 0}
              </span>{" "}
              <span className="text-xl font-bold text-[#8b96a5] uppercase">
                {detail.uom || "EA/PLT"}
              </span>
              <span className="text-xl font-extrabold text-[#1c2333]">?</span>
            </p>
            <p className="text-base font-bold text-[#1c2333] mt-2 text-center">
              Please confirm
            </p>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-3 flex flex-col gap-2.5">
        {/* Main action row */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMatch}
            onPointerDown={() => setPressedBtn("match")}
            onPointerUp={() => setPressedBtn(null)}
            onPointerLeave={() => setPressedBtn(null)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-extrabold text-white tracking-wide transition-all",
              "bg-gradient-to-b from-[#2ecc71] to-[#27ae60] shadow-md",
              "active:scale-[0.97] active:shadow-sm",
              pressedBtn === "match" && "scale-[0.97] shadow-sm"
            )}
          >
            <Check className="size-5 stroke-[3]" />
            {isEmpty ? "EMPTY" : "MATCH"}
          </button>
          <button
            onClick={onNotMatch}
            onPointerDown={() => setPressedBtn("notmatch")}
            onPointerUp={() => setPressedBtn(null)}
            onPointerLeave={() => setPressedBtn(null)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-extrabold text-white tracking-wide transition-all",
              "bg-gradient-to-b from-[#e74c3c] to-[#c0392b] shadow-md",
              "active:scale-[0.97] active:shadow-sm",
              pressedBtn === "notmatch" && "scale-[0.97] shadow-sm"
            )}
          >
            <X className="size-5 stroke-[3]" />
            {isEmpty ? "NOT EMPTY" : "NOT MATCH"}
          </button>
        </div>

        {/* Skip button */}
        {allowSkip && (
          <button
            onClick={onSkip}
            onPointerDown={() => setPressedBtn("skip")}
            onPointerUp={() => setPressedBtn(null)}
            onPointerLeave={() => setPressedBtn(null)}
            className={cn(
              "w-full py-3.5 rounded-2xl text-sm font-bold text-[#6b7a90] tracking-wide transition-all",
              "bg-[#dfe3ea] shadow-sm",
              "active:scale-[0.98] active:shadow-none",
              pressedBtn === "skip" && "scale-[0.98] shadow-none"
            )}
          >
            SKIP
          </button>
        )}
      </div>
    </div>
  )
}
