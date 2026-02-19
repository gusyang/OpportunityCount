"use client"

import type { Rule } from "@/lib/types"
import {
  CUSTOMERS,
  TASK_TYPES,
  LOCATION_TYPES,
  ITEM_GROUPS,
  EXCEPTION_TYPES,
  ASSIGNEES,
} from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MultiTagSelect } from "@/components/multi-tag-select"
import {
  Save,
  Trash2,
  Info,
  Settings2,
  Target,
  Zap,
  Cog,
  PackageX,
  TrendingDown,
  AlertTriangle,
  Clipboard,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RuleDetailPanelProps {
  rule: Rule
  onChange: (rule: Rule) => void
  onSave: () => void
  onDelete: () => void
  isNew?: boolean
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <CardHeader className="pb-2">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10">
          <Icon className="size-4 text-primary" />
        </div>
        <div>
          <CardTitle className="text-sm">{title}</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            {description}
          </p>
        </div>
      </div>
    </CardHeader>
  )
}

function FieldLabel({
  htmlFor,
  label,
  tooltip,
}: {
  htmlFor?: string
  label: string
  tooltip?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Label htmlFor={htmlFor} className="text-xs font-medium text-foreground">
        {label}
      </Label>
      {tooltip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="size-3.5 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-[380px]">{tooltip}</TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}

const countMethodInfo: Record<string, { label: string; description: string }> = {
  smart: {
    label: "Smart Select",
    description:
      "System decides: Executes 'Verify Quantity' when expected inventory is zero; enforces 'Blind Count' when expected inventory is greater than zero",
  },
  confirm_empty: {
    label: "Verify Quantity",
    description:
      "Show Qty/UOM. Operator confirms match. Mismatch triggers Count Task or Blind Count.",
  },
  blind: {
    label: "Blind Count",
    description:
      "Hide quantity. Operator must count and enter the number.",
  },
}

export function RuleDetailPanel({
  rule,
  onChange,
  onSave,
  onDelete,
  isNew,
}: RuleDetailPanelProps) {
  const updateField = <K extends keyof Rule>(key: K, value: Rule[K]) => {
    onChange({ ...rule, [key]: value })
  }

  const updateTrigger = <K extends keyof Rule["triggers"]>(
    key: K,
    value: Rule["triggers"][K]
  ) => {
    onChange({ ...rule, triggers: { ...rule.triggers, [key]: value } })
  }

  const updateExecution = <K extends keyof Rule["execution"]>(
    key: K,
    value: Rule["execution"][K]
  ) => {
    onChange({ ...rule, execution: { ...rule.execution, [key]: value } })
  }

  const handleSave = () => {
    const errors: string[] = []

    if (!rule.name.trim()) {
      errors.push("Rule name cannot be empty")
    }

    const hasTrigger =
      rule.triggers.zeroStock ||
      rule.triggers.lowStock ||
      rule.triggers.exception

    if (!hasTrigger) {
      errors.push("Trigger rules cannot be empty")
    }

    if (rule.taskTypes.length === 0) {
      errors.push("Triggering task cannot be empty")
    }

    if (rule.locationTypes.length === 0) {
      errors.push("Location type cannot be empty")
    }

    if (errors.length > 0) {
      alert(errors.join("\n"))
      return
    }

    onSave()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-card-foreground">
            {isNew ? "New Rule" : "Edit Rule"}
          </h2>
          {!isNew && (
            <Badge
              variant="secondary"
              className={cn(
                "text-[10px] h-[18px]",
                rule.status === "active"
                  ? "bg-success text-success-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {rule.status === "active" ? "Active" : "Disabled"}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="h-8 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          )}
          <Button size="sm" onClick={handleSave} className="h-8 gap-1.5">
            <Save className="size-3.5" />
            Save Rule
          </Button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-6xl">
          {/* General Settings */}
          <Card className="shadow-none py-0">
            <SectionHeader
              icon={Settings2}
              title="Basic Info"
              description="Name and status of this rule"
            />
            <CardContent className="pb-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <FieldLabel
                  htmlFor="rule-name"
                  label="Rule Name"
                  tooltip="Give this rule a clear name"
                />
                <Input
                  id="rule-name"
                  value={rule.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="e.g., High-Value Zero Stock Review"
                  className="h-9"
                />
              </div>

              <div className="flex items-center justify-between">
                <FieldLabel
                  label="Status"
                  tooltip="Toggle to enable or disable this rule globally"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {rule.status === "active" ? "Active" : "Disabled"}
                  </span>
                  <Switch
                    checked={rule.status === "active"}
                    onCheckedChange={(checked) =>
                      updateField("status", checked ? "active" : "disabled")
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <FieldLabel
                  label="Customers"
                  tooltip="Apply this rule to specific customers"
                />
                <MultiTagSelect
                  options={CUSTOMERS}
                  value={rule.customers}
                  onChange={(v) => updateField("customers", v)}
                  placeholder="Select customers..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Scope */}
          <Card className="shadow-none py-0">
            <SectionHeader
              icon={Target}
              title="Scope"
              description="Where and when this rule applies"
            />
            <CardContent className="pb-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <FieldLabel
                  label="Triggering Tasks"
                  tooltip={
                    <div className="flex flex-col gap-1 whitespace-nowrap">
                      <span>• Pick/Move/Replen: Trigger AFTER Pull (Source)</span>
                      <span>• Putaway: Trigger BEFORE Drop (Target)</span>
                    </div>
                  }
                />
                <MultiTagSelect
                  options={TASK_TYPES}
                  value={rule.taskTypes}
                  onChange={(v) => updateField("taskTypes", v)}
                  placeholder="Select task types..."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <FieldLabel
                  label="Location Types"
                  tooltip="Which locations are covered"
                />
                <MultiTagSelect
                  options={LOCATION_TYPES}
                  value={rule.locationTypes}
                  onChange={(v) => updateField("locationTypes", v)}
                  placeholder="Select location types..."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <FieldLabel
                  label="Item ABC Groups"
                  tooltip="Which items are covered"
                />
                <MultiTagSelect
                  options={ITEM_GROUPS}
                  value={rule.itemGroups}
                  onChange={(v) => updateField("itemGroups", v)}
                  placeholder="Select item ABC groups..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Trigger Events */}
          <Card className="shadow-none py-0">
            <SectionHeader
              icon={Zap}
              title="Trigger Rules"
              description="Conditions that start a count"
            />
            <CardContent className="pb-5 flex flex-col gap-4">
              {/* Zero Stock */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background">
                <div className="flex items-center justify-center size-8 rounded-md bg-primary/10 shrink-0 mt-0.5">
                  <PackageX className="size-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Empty Trigger
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Trigger when stock reaches 0
                      </p>
                    </div>
                    <Switch
                      checked={rule.triggers.zeroStock}
                      onCheckedChange={(v) => updateTrigger("zeroStock", v)}
                    />
                  </div>
                </div>
              </div>

              {/* Low Stock */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background">
                <div className="flex items-center justify-center size-8 rounded-md bg-primary/10 shrink-0 mt-0.5">
                  <TrendingDown className="size-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Threshold Trigger
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Trigger when stock is below a number
                      </p>
                    </div>
                    <Switch
                      checked={rule.triggers.lowStock}
                      onCheckedChange={(v) => updateTrigger("lowStock", v)}
                    />
                  </div>
                  {rule.triggers.lowStock && (
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <Label className="text-xs text-muted-foreground shrink-0">
                        Min Quantity:
                      </Label>
                      <Input
                        type="number"
                        min={1}
                        value={rule.triggers.lowStockThreshold}
                        onChange={(e) =>
                          updateTrigger(
                            "lowStockThreshold",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="h-8 w-24"
                      />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        (System UOM: EA/CS/PLT)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Exception */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background">
                <div className="flex items-center justify-center size-8 rounded-md bg-primary/10 shrink-0 mt-0.5">
                  <AlertTriangle className="size-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Exception Trigger (Select at least one)
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Trigger when operator reports a shortage
                      </p>
                    </div>
                    <Switch
                      checked={rule.triggers.exception}
                      onCheckedChange={(v) => updateTrigger("exception", v)}
                    />
                  </div>
                  {rule.triggers.exception && (
                    <div className="mt-3 flex flex-col gap-2">
                      <Label className="text-xs text-muted-foreground">
                        Exception Types:
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {EXCEPTION_TYPES.map((type) => (
                          <label
                            key={type}
                            className="flex items-center gap-1.5 cursor-pointer"
                          >
                            <Checkbox
                              checked={rule.triggers.exceptionTypes.includes(
                                type
                              )}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  updateTrigger("exceptionTypes", [
                                    ...rule.triggers.exceptionTypes,
                                    type,
                                  ])
                                } else {
                                  updateTrigger(
                                    "exceptionTypes",
                                    rule.triggers.exceptionTypes.filter(
                                      (t) => t !== type
                                    )
                                  )
                                }
                              }}
                            />
                            <span className="text-xs text-foreground">
                              {type}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Execution Logic */}
          <Card className="shadow-none py-0">
            <SectionHeader
              icon={Cog}
              title="Task Options"
              description="How the count task behaves"
            />
            <CardContent className="pb-5 flex flex-col gap-4">
              {/* Count Method */}
              <div className="flex flex-col gap-2">
                <FieldLabel
                  label="Count Behavior"
                  tooltip="Determines how the operator performs the count"
                />
                <Select
                  value={rule.execution.countMethod}
                  onValueChange={(v) =>
                    updateExecution(
                      "countMethod",
                      v as Rule["execution"]["countMethod"]
                    )
                  }
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(countMethodInfo).map(([key, info]) => (
                      <SelectItem key={key} value={key}>
                        {info.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {countMethodInfo[rule.execution.countMethod]?.description}
                </p>
              </div>

              {/* Default Assignee */}
              <div className="flex flex-col gap-1.5">
                <FieldLabel
                  label="Default Assignee"
                  tooltip="Who the count task is assigned to by default"
                />
                <Select
                  value={rule.execution.defaultAssignee}
                  onValueChange={(v) =>
                    updateExecution("defaultAssignee", v)
                  }
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSIGNEES.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Toggle options */}
              <div className="flex flex-col gap-3 pt-1">
                <div className="flex items-center justify-between py-2 px-3 rounded-lg border border-border bg-background">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Force Count
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Operator must count immediately
                    </p>
                  </div>
                  <Switch
                    checked={rule.execution.instantCount}
                    onCheckedChange={(v) =>
                      updateExecution("instantCount", v)
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-2 px-3 rounded-lg border border-border bg-background">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Allow Skip
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Operator can skip this task
                    </p>
                  </div>
                  <Switch
                    checked={rule.execution.allowSkip}
                    onCheckedChange={(v) =>
                      updateExecution("allowSkip", v)
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-2 px-3 rounded-lg border border-border bg-background">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Avoid Duplicates
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Don't create if count already exists
                    </p>
                  </div>
                  <Switch
                    checked={rule.execution.preventDuplicates}
                    onCheckedChange={(v) =>
                      updateExecution("preventDuplicates", v)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export const DEFAULT_RULE_TEMPLATE = {
  name: "",
  status: "active" as const,
  customers: [] as string[],
  taskTypes: ["Pick Movement"],
  locationTypes: ["Location", "Pick"],
  itemGroups: [] as string[],
  triggers: {
    zeroStock: true,
    lowStock: false,
    lowStockThreshold: 0,
    exception: false,
    exceptionTypes: [] as string[],
  },
  execution: {
    countMethod: "confirm_empty" as const,
    defaultAssignee: "Unassigned",
    instantCount: false,
    allowSkip: false,
    preventDuplicates: true,
  },
}
