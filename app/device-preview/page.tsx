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
  location: "H0202",
  itemName: "test-itemA",
  qty: 1,
  uom: "CS",
}

const SAMPLE_EMPTY = {
  location: "H0202",
}

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
            {/* Variant toggle for Qty Verify */}
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
                onMatch={() => toast.success("MATCH confirmed")}
                onNotMatch={() => toast.info("NOT MATCH reported")}
                onSkip={() => toast("Skipped")}
                allowSkip={true}
              />
            </AndroidDeviceFrame>

            {/* Explanation card */}
            <div className="max-w-md w-full bg-card rounded-xl border border-border p-5 mt-2">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Qty Verify (Verify Quantity)
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {qtyVerifyVariant === "with-item"
                  ? "Shows location, item name, quantity and UOM. The operator physically verifies whether the actual inventory matches the system record. They can confirm MATCH, report NOT MATCH, or SKIP."
                  : "When the system expects the location to be empty, only the location is shown. The operator verifies if the location is truly empty. No item/qty details are displayed."}
              </p>
            </div>
          </div>
        )}

        {activeTab === "blind-count" && (
          <div className="flex flex-col items-center gap-6">
            {/* Device preview */}
            <AndroidDeviceFrame>
              <BlindCountScreen
                location="H0202"
                onSubmit={(items) =>
                  toast.success(`Submitted ${items.length} item(s)`)
                }
              />
            </AndroidDeviceFrame>

            {/* Explanation card */}
            <div className="max-w-md w-full bg-card rounded-xl border border-border p-5 mt-2">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Blind Count
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The operator sees the location but does not know the expected quantity.
                They must physically count each item and enter the item name, quantity, and UOM.
                Multiple items can be added for a single location.
              </p>
            </div>
          </div>
        )}
      </div>

      <Toaster position="bottom-center" theme="light" />
    </div>
  )
}
