"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { RuleListPanel } from "@/components/rule-list-panel"
import { RuleDetailPanel, DEFAULT_RULE_TEMPLATE } from "@/components/rule-detail-panel"
import { RuleEmptyState } from "@/components/rule-empty-state"
import type { Rule } from "@/lib/types"
import { SAMPLE_RULES } from "@/lib/types"
import { toast, Toaster } from "sonner"
import { Smartphone } from "lucide-react"

function createNewRule(): Rule {
  return {
    ...DEFAULT_RULE_TEMPLATE,
    id: Date.now().toString(),
    priority: 0,
    // Deep copy nested arrays and objects to avoid reference issues
    customers: [...DEFAULT_RULE_TEMPLATE.customers],
    taskTypes: [...DEFAULT_RULE_TEMPLATE.taskTypes],
    locationTypes: [...DEFAULT_RULE_TEMPLATE.locationTypes],
    itemGroups: [...DEFAULT_RULE_TEMPLATE.itemGroups],
    triggers: {
      ...DEFAULT_RULE_TEMPLATE.triggers,
      exceptionTypes: [...DEFAULT_RULE_TEMPLATE.triggers.exceptionTypes],
    },
    execution: {
      ...DEFAULT_RULE_TEMPLATE.execution,
    },
  }
}

export default function OpportunityCountSettingPage() {
  const [rules, setRules] = useState<Rule[]>(SAMPLE_RULES)
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null)
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  const [isNew, setIsNew] = useState(false)

  const selectedRule = editingRule

  const handleSelectRule = useCallback(
    (id: string) => {
      const rule = rules.find((r) => r.id === id)
      if (rule) {
        setSelectedRuleId(id)
        setEditingRule({ ...rule })
        setIsNew(false)
      }
    },
    [rules]
  )

  const handleNewRule = useCallback(() => {
    const newRule = createNewRule()
    setSelectedRuleId(newRule.id)
    setEditingRule(newRule)
    setIsNew(true)
  }, [])

  const handleSave = useCallback(() => {
    if (!editingRule) return

    if (!editingRule.name.trim()) {
      toast.error("Rule name is required")
      return
    }

    if (isNew) {
      setRules((prev) => [
        ...prev,
        { ...editingRule, priority: prev.length + 1 },
      ])
      toast.success("Rule created successfully")
    } else {
      setRules((prev) =>
        prev.map((r) => (r.id === editingRule.id ? editingRule : r))
      )
      toast.success("Rule saved successfully")
    }

    setIsNew(false)
  }, [editingRule, isNew])

  const handleDelete = useCallback(() => {
    if (!editingRule) return
    setRules((prev) => prev.filter((r) => r.id !== editingRule.id))
    setSelectedRuleId(null)
    setEditingRule(null)
    setIsNew(false)
    toast.success("Rule deleted")
  }, [editingRule])

  const handleMoveUp = useCallback((id: string) => {
    setRules((prev) => {
      const idx = prev.findIndex((r) => r.id === id)
      if (idx <= 0) return prev
      const next = [...prev]
      ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
      return next.map((r, i) => ({ ...r, priority: i + 1 }))
    })
  }, [])

  const handleMoveDown = useCallback((id: string) => {
    setRules((prev) => {
      const idx = prev.findIndex((r) => r.id === id)
      if (idx < 0 || idx >= prev.length - 1) return prev
      const next = [...prev]
      ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
      return next.map((r, i) => ({ ...r, priority: i + 1 }))
    })
  }, [])

  const handleToggleStatus = useCallback(
    (id: string, status: "active" | "disabled") => {
      setRules((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      )
      if (editingRule?.id === id) {
        setEditingRule((prev) => (prev ? { ...prev, status } : null))
      }
    },
    [editingRule]
  )

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />

      <div className="flex flex-1 min-w-0">
        {/* Rule list panel */}
        <div className="w-[320px] shrink-0 border-r border-border">
          <RuleListPanel
            rules={rules}
            selectedRuleId={selectedRuleId}
            onSelectRule={handleSelectRule}
            onNewRule={handleNewRule}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onToggleStatus={handleToggleStatus}
          />
        </div>

        {/* Detail panel */}
        <div className="flex-1 min-w-0 bg-background">
          {selectedRule ? (
            <RuleDetailPanel
              rule={selectedRule}
              onChange={setEditingRule}
              onSave={handleSave}
              onDelete={handleDelete}
              isNew={isNew}
            />
          ) : (
            <RuleEmptyState />
          )}
        </div>
      </div>
         {/* Device Preview FAB */}
      <Link
        href="/device-preview"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background shadow-lg hover:bg-foreground/90 transition-all"
      >
        <Smartphone className="size-4" />
        Device Preview
      </Link>

      <Toaster position="bottom-right" theme="light" />
    </div>
  )
}
