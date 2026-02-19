"use client"

import { Settings, ArrowLeft } from "lucide-react"

export function RuleEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Settings className="size-7 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">
        Select a Rule to Configure
      </h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm leading-relaxed">
        Choose a rule from the list on the left to view and edit its configuration, or create a new rule to get started.
      </p>
      <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
        <ArrowLeft className="size-3.5" />
        <span>Select a rule from the priority list</span>
      </div>
    </div>
  )
}
