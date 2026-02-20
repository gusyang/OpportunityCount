"use client"

import { useState } from "react"
import { AndroidDeviceFrame } from "@/components/android-device-frame"
import { QtyVerifyScreen } from "@/components/qty-verify-screen"
import { BlindCountScreen } from "@/components/blind-count-screen"
import { toast, Toaster } from "sonner"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

type Tab = "qty-verify" | "blind-count"
type QtyVerifyVariant = "with-item" | "empty"

const SAMPLE_WITH_ITEM = {
  location: "A-01-02",
  itemName: "Widget-A123 Heavy Duty",
  qty: 12,
  uom: "EA/PLT",
}

const SAMPLE_EMPTY = {
  location: "A-01-02",
  itemName: undefined,
  qty: 0,
  uom: "EA/PLT",
}

const SAMPLE_BLIND_ITEMS = [
  { itemName: "Widget-A123 Heavy Duty" },
  { itemName: "Steel Bolt M10x50 (Pack of 50)" },
  { itemName: "Safety Gloves (Carton)" },
]

export default function DevicePreviewPage() {
  const [activeTab, setActiveTab] = useState<Tab>("qty-verify")
  const [qtyVerifyVariant, setQtyVerifyVariant] = useState<QtyVerifyVariant>("with-item")

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-card border-b border-border">
        <div className="flex items-center gap-4 px-6 py-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Settings
          </Link>
          <div className="h-5 w-px bg-border" />
          <h1 className="text-sm font-semibold text-foreground">
            Android Device Preview
          </h1>
        </div>
      </header>

      <div className="px-6 py-8">
        {/* Tab selector */}
        <div className="flex items-center justify-center gap-1 mb-8">
          <button
            onClick={() => setActiveTab("qty-verify")}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === "qty-verify"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            Qty Verify
          </button>
          <button
            onClick={() => setActiveTab("blind-count")}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === "blind-count"
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            Blind Count
          </button>
        </div>

        {activeTab === "qty-verify" && (
          <div className="flex flex-col items-center gap-6">
            {/* Variant toggle */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
              <button
                onClick={() => setQtyVerifyVariant("with-item")}
                className={cn(
                  "px-4 py-1.5 rounded-md text-xs font-medium transition-all",
                  qtyVerifyVariant === "with-item"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                With Item (Non-Empty)
              </button>
              <button
                onClick={() => setQtyVerifyVariant("empty")}
                className={cn(
                  "px-4 py-1.5 rounded-md text-xs font-medium transition-all",
                  qtyVerifyVariant === "empty"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Empty Location
              </button>
            </div>

            {/* Device preview */}
            <AndroidDeviceFrame>
              <QtyVerifyScreen
                detail={qtyVerifyVariant === "with-item" ? SAMPLE_WITH_ITEM : SAMPLE_EMPTY}
                onMatch={() => toast.success(qtyVerifyVariant === "with-item" ? "MATCH confirmed" : "EMPTY confirmed")}
                onNotMatch={() => toast.info(qtyVerifyVariant === "with-item" ? "NOT MATCH reported" : "NOT EMPTY reported")}
                onSkip={() => toast("Skipped this location")}
                allowSkip={true}
              />
            </AndroidDeviceFrame>

            {/* Explanation */}
            <div className="max-w-md w-full bg-card rounded-xl border border-border p-5 mt-2">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Qty Verify
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {qtyVerifyVariant === "with-item"
                  ? "Displays location, item, expected quantity and UOM. The operator physically verifies whether actual inventory matches the system record, then confirms MATCH, NOT MATCH, or SKIP."
                  : "When expected quantity is 0, the operator verifies whether the location is truly empty. Button labels change to EMPTY / NOT EMPTY. No SKIP button is shown."}
              </p>
            </div>
          </div>
        )}

        {activeTab === "blind-count" && (
          <div className="flex flex-col items-center gap-6">
            {/* Device preview */}
            <AndroidDeviceFrame>
              <BlindCountScreen
                location="A-01-02"
                initialItems={SAMPLE_BLIND_ITEMS}
                onSubmit={(items) =>
                  toast.success(`Submitted ${items.length} item(s)`)
                }
                onSkip={() => toast("Skipped this location")}
              />
            </AndroidDeviceFrame>

            {/* Explanation */}
            <div className="max-w-md w-full bg-card rounded-xl border border-border p-5 mt-2">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Blind Count
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The operator sees the location and item names but not expected quantities.
                They physically count each item and enter the actual quantity with the appropriate UOM.
                Multiple items can be counted at a single location.
              </p>
            </div>
          </div>
        )}
      </div>

      <Toaster position="bottom-center" theme="light" />
    </div>
  )
}
