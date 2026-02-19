"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { MapPin, Package, Plus, Trash2, Send, ChevronDown } from "lucide-react"

interface BlindCountItem {
  id: string
  itemName: string
  qty: string
  uom: string
}

const UOM_OPTIONS = ["EA", "CS", "Pallet"]

interface BlindCountScreenProps {
  location: string
  onSubmit?: (items: BlindCountItem[]) => void
}

export function BlindCountScreen({ location, onSubmit }: BlindCountScreenProps) {
  const [items, setItems] = useState<BlindCountItem[]>([
    { id: "1", itemName: "", qty: "", uom: "EA" },
  ])
  const [pressedBtn, setPressedBtn] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), itemName: "", qty: "", uom: "EA" },
    ])
  }

  const removeItem = (id: string) => {
    if (items.length <= 1) return
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof BlindCountItem, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const handleSubmit = () => {
    onSubmit?.(items)
  }

  return (
    <div className="flex-1 flex flex-col px-4 py-3">
      {/* Header bar */}
      <div className="rounded-t-xl bg-[#2a2a4a] px-4 py-3">
        <h1 className="text-sm font-semibold text-[#e0e0e0] tracking-wide">
          Blind Count
        </h1>
      </div>

      {/* Card body */}
      <div className="flex-1 flex flex-col bg-[#f5f5f0] rounded-b-xl shadow-lg">
        {/* Location section */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-7 rounded bg-[#2a2a4a]/10">
              <MapPin className="size-4 text-[#2a2a4a]" />
            </div>
            <div>
              <span className="text-[10px] text-[#888] uppercase tracking-wider">Location</span>
              <p className="text-sm font-bold text-[#222] font-mono leading-tight">{location}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-[#d0d0c8]" />

        {/* Items list - scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-[#333] uppercase tracking-wider">
              Items ({items.length})
            </p>
            <button
              onClick={addItem}
              className="flex items-center gap-1 text-[10px] font-semibold text-[#2a2a4a] hover:text-[#1a1a3e] transition-colors"
            >
              <Plus className="size-3.5" />
              Add Item
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="rounded-lg border border-[#d0d0c8] bg-[#fafaf5] p-3"
              >
                {/* Item header */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Package className="size-3.5 text-[#666]" />
                    <span className="text-[10px] font-semibold text-[#666] uppercase">
                      Item {index + 1}
                    </span>
                  </div>
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 rounded hover:bg-[#ffcdd2]/50 transition-colors"
                    >
                      <Trash2 className="size-3.5 text-[#c62828]" />
                    </button>
                  )}
                </div>

                {/* Item Name input */}
                <div className="mb-2.5">
                  <label className="text-[10px] text-[#888] uppercase tracking-wider mb-1 block">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={item.itemName}
                    onChange={(e) => updateItem(item.id, "itemName", e.target.value)}
                    placeholder="Scan or enter item..."
                    className="w-full h-9 px-3 rounded-md border border-[#ccc] bg-white text-xs text-[#222] placeholder:text-[#aaa] focus:outline-none focus:border-[#2a2a4a] focus:ring-1 focus:ring-[#2a2a4a]/30 transition-all"
                  />
                </div>

                {/* Qty + UOM row */}
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-[#888] uppercase tracking-wider mb-1 block">
                      Qty
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                      placeholder="0"
                      className="w-full h-9 px-3 rounded-md border border-[#ccc] bg-white text-xs text-[#222] font-mono placeholder:text-[#aaa] focus:outline-none focus:border-[#2a2a4a] focus:ring-1 focus:ring-[#2a2a4a]/30 transition-all"
                    />
                  </div>
                  <div className="w-24 relative">
                    <label className="text-[10px] text-[#888] uppercase tracking-wider mb-1 block">
                      UOM
                    </label>
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === item.id ? null : item.id)
                      }
                      className="w-full h-9 px-3 rounded-md border border-[#ccc] bg-white text-xs text-[#222] flex items-center justify-between focus:outline-none focus:border-[#2a2a4a] focus:ring-1 focus:ring-[#2a2a4a]/30 transition-all"
                    >
                      <span>{item.uom}</span>
                      <ChevronDown className="size-3.5 text-[#888]" />
                    </button>
                    {openDropdown === item.id && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md border border-[#ccc] shadow-lg z-10 overflow-hidden">
                        {UOM_OPTIONS.map((uom) => (
                          <button
                            key={uom}
                            onClick={() => {
                              updateItem(item.id, "uom", uom)
                              setOpenDropdown(null)
                            }}
                            className={cn(
                              "w-full text-left px-3 py-2 text-xs hover:bg-[#e8e8e0] transition-colors",
                              item.uom === uom
                                ? "bg-[#2a2a4a]/10 font-semibold text-[#2a2a4a]"
                                : "text-[#444]"
                            )}
                          >
                            {uom}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <div className="px-4 pb-4 pt-2">
          <button
            onClick={handleSubmit}
            onPointerDown={() => setPressedBtn("submit")}
            onPointerUp={() => setPressedBtn(null)}
            onPointerLeave={() => setPressedBtn(null)}
            className={cn(
              "w-full py-3 rounded-lg text-sm font-bold tracking-wide transition-all border-2 flex items-center justify-center gap-2",
              "bg-[#2a2a4a] border-[#2a2a4a] text-white",
              pressedBtn === "submit" && "scale-95 brightness-90"
            )}
          >
            <Send className="size-4" />
            SUBMIT COUNT
          </button>
        </div>
      </div>
    </div>
  )
}
