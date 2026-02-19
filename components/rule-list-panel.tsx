"use client"

import { cn } from "@/lib/utils"
import type { Rule } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  ChevronUp,
  ChevronDown,
  GripVertical,
  PackageX,
  TrendingDown,
  AlertTriangle,
  Users,
  Clipboard,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface RuleListPanelProps {
  rules: Rule[]
  selectedRuleId: string | null
  onSelectRule: (id: string) => void
  onNewRule: () => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onToggleStatus?: (id: string, status: "active" | "disabled") => void
}

function TriggerIcon({ type, active }: { type: string; active: boolean }) {
  const iconClass = cn(
    "size-4",
    active ? "text-primary" : "text-muted-foreground/40"
  )

  const icons: Record<string, { icon: React.ReactNode; label: string }> = {
    zeroStock: {
      icon: <PackageX className={iconClass} />,
      label: "Zero Stock",
    },
    lowStock: {
      icon: <TrendingDown className={iconClass} />,
      label: "Low Stock",
    },
    exception: {
      icon: <AlertTriangle className={iconClass} />,
      label: "Exception",
    },
  }

  const item = icons[type]
  if (!item) return null

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">{item.icon}</span>
      </TooltipTrigger>
      <TooltipContent>
        {item.label}: {active ? "Enabled" : "Disabled"}
      </TooltipContent>
    </Tooltip>
  )
}

export function RuleListPanel({
  rules,
  selectedRuleId,
  onSelectRule,
  onNewRule,
  onMoveUp,
  onMoveDown,
  onToggleStatus,
}: RuleListPanelProps) {
  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h2 className="text-sm font-semibold text-card-foreground">
            Rule Priority
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {rules.length} rule{rules.length !== 1 ? "s" : ""} configured
          </p>
        </div>
        <Button size="sm" onClick={onNewRule} className="h-8 gap-1.5">
          <Plus className="size-3.5" />
          New Rule
        </Button>
      </div>

      {/* Rule list */}
      <div className="flex-1 overflow-y-auto py-1">
        {rules.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Clipboard className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-card-foreground">No rules yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create your first rule to start configuring opportunity counts.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col">
            {rules.map((rule, index) => (
              <li key={rule.id}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectRule(rule.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      onSelectRule(rule.id)
                    }
                  }}
                  className={cn(
                    "w-full text-left px-3 py-3 flex items-start gap-2 transition-colors border-l-[3px] cursor-pointer",
                    selectedRuleId === rule.id
                      ? "bg-accent/60 border-l-primary"
                      : "border-l-transparent hover:bg-accent/30",
                    rule.status === "disabled" && "opacity-60"
                  )}
                >
                  {/* Priority & drag handle */}
                  <div className="flex flex-col items-center gap-0.5 pt-0.5 shrink-0">
                    <GripVertical className="size-3.5 text-muted-foreground/50" />
                    <span className="text-[10px] font-mono font-semibold text-muted-foreground">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-sm font-medium truncate transition-colors",
                        rule.status === "active" ? "text-card-foreground" : "text-muted-foreground"
                      )}>
                        {rule.name}
                      </span>
                      <div onClick={(e) => e.stopPropagation()} className="flex items-center">
                        <Switch
                          checked={rule.status === "active"}
                          onCheckedChange={(c) => onToggleStatus?.(rule.id, c ? "active" : "disabled")}
                          className="scale-75 data-[state=checked]:bg-success"
                        />
                      </div>
                    </div>

                    {/* Trigger icons */}
                    <div className="flex items-center gap-2.5 mt-1.5">
                      <TriggerIcon
                        type="zeroStock"
                        active={rule.triggers.zeroStock}
                      />
                      <TriggerIcon
                        type="lowStock"
                        active={rule.triggers.lowStock}
                      />
                      <TriggerIcon
                        type="exception"
                        active={rule.triggers.exception}
                      />
                    </div>

                    {/* Customers & Task types */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Users className="size-3" />
                        <span className="truncate max-w-[100px]">
                          {rule.customers.length > 2
                            ? `${rule.customers.slice(0, 2).join(", ")} +${rule.customers.length - 2}`
                            : rule.customers.join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clipboard className="size-3" />
                        <span className="truncate max-w-[80px]">
                          {rule.taskTypes.join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Move buttons */}
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onMoveUp(rule.id)
                      }}
                      disabled={index === 0}
                      className={cn(
                        "size-5 flex items-center justify-center rounded transition-colors",
                        index === 0
                          ? "text-muted-foreground/30 cursor-not-allowed"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                      aria-label="Move rule up"
                    >
                      <ChevronUp className="size-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onMoveDown(rule.id)
                      }}
                      disabled={index === rules.length - 1}
                      className={cn(
                        "size-5 flex items-center justify-center rounded transition-colors",
                        index === rules.length - 1
                          ? "text-muted-foreground/30 cursor-not-allowed"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                      aria-label="Move rule down"
                    >
                      <ChevronDown className="size-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
