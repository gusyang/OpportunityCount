"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface BlindCountItem {
  id: string
  itemName: string
  qty: string
  uom: string
}

const UOM_OPTIONS = ["EA", "CS", "Pallet"]

interface BlindCountScreenProps {
  location: string
  /** Pre-populated items to count (from system) */
  initialItems?: { itemName: string }[]
  onSubmit?: (items: BlindCountItem[]) => void
  onSkip?: () => void
}

export function BlindCountScreen({
  location,
  initialItems,
  onSubmit,
  onSkip,
}: BlindCountScreenProps) {
  const [items, setItems] = useState<BlindCountItem[]>(() => {
    if (initialItems && initialItems.length > 0) {
      return initialItems.map((it, i) => ({
        id: String(i + 1),
        itemName: it.itemName,
        qty: "0",
        uom: "EA",
      }))
    }
    return [{ id: "1", itemName: "", qty: "0", uom: "EA" }]
  })
  const [pressedBtn, setPressedBtn] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const updateItem = (id: string, field: keyof BlindCountItem, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const handleSubmit = () => {
    onSubmit?.(items)
  }

  return (
    <div className="flex-1 flex flex-col bg-[#f2f4f7] relative">
      {/* Backdrop to close dropdown when tapping outside */}
      {openDropdown && (
        <div
          className="absolute inset-0 z-20"
          onClick={() => setOpenDropdown(null)}
        />
      )}

      {/* Orange Banner */}
      <div className="mx-4 mt-3 rounded-2xl bg-gradient-to-r from-[#e67e22] to-[#f39c12] px-6 py-4 shadow-md">
        <h1 className="text-center text-lg font-extrabold text-white tracking-wide uppercase">
          Inventory Count
        </h1>
      </div>

      {/* Location Bar */}
      <div className="mx-4 mt-4 flex items-center justify-between rounded-xl bg-white border border-[#e2e6ed] px-5 py-3 shadow-sm">
        <span className="text-sm text-[#6b7a90] font-medium">Location</span>
        <span className="text-lg font-bold text-[#1c2333] font-mono tracking-wide">
          {location}
        </span>
      </div>

      {/* Instruction */}
      <p className="text-center text-sm text-[#6b7a90] mt-3 px-6 leading-relaxed">
        Count items here and{"\n"}enter actual quantities below.
      </p>

      {/* Items list - scrollable, relative container for dropdowns to escape */}
      <div className="flex-1 overflow-y-auto px-4 mt-3 pb-2" style={{ overflowX: "visible" }}>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white border border-[#e2e6ed] shadow-sm"
            >
              {/* Item Name */}
              <div className="px-4 pt-3.5 pb-2 border-b border-[#eef0f4]">
                <span className="text-sm font-bold text-[#1c2333]">
                  {item.itemName || "Unknown Item"}
                </span>
              </div>

              {/* Qty + UOM row */}
              <div className="flex items-center gap-3 px-4 py-3 relative">
                {/* Qty Input */}
                <div className="flex-1">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                    className={cn(
                      "w-full h-12 px-4 rounded-xl border-2 border-[#e2e6ed] bg-[#f8f9fb]",
                      "text-2xl font-black text-[#1c2333] text-center font-mono tabular-nums",
                      "focus:outline-none focus:border-[#3498db] focus:bg-white transition-all"
                    )}
                  />
                </div>

                {/* UOM - use native select for mobile-friendly dropdown */}
                <div className="w-28 relative">
                  <select
                    value={item.uom}
                    onChange={(e) => updateItem(item.id, "uom", e.target.value)}
                    className={cn(
                      "w-full h-12 px-3 pr-8 rounded-xl border-2 border-[#e2e6ed] bg-[#f8f9fb]",
                      "text-base font-bold text-[#1c2333] appearance-none",
                      "focus:outline-none focus:border-[#3498db] focus:bg-white transition-all"
                    )}
                  >
                    {UOM_OPTIONS.map((uom) => (
                      <option key={uom} value={uom}>
                        {uom}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#8b96a5] pointer-events-none" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-3 pt-2 flex flex-col gap-2.5">
        <button
          onClick={handleSubmit}
          onPointerDown={() => setPressedBtn("submit")}
          onPointerUp={() => setPressedBtn(null)}
          onPointerLeave={() => setPressedBtn(null)}
          className={cn(
            "w-full py-4 rounded-2xl text-base font-extrabold text-white tracking-wide transition-all",
            "bg-gradient-to-b from-[#2ecc71] to-[#27ae60] shadow-md",
            "active:scale-[0.98] active:shadow-sm",
            pressedBtn === "submit" && "scale-[0.98] shadow-sm"
          )}
        >
          SUBMIT
        </button>
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
      </div>
    </div>
  )
}
