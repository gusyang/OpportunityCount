"use client"

import { cn } from "@/lib/utils"
import {
  BarChart3,
  ClipboardList,
  Package,
  LayoutGrid,
  RefreshCcw,
  PenLine,
  ListChecks,
  CheckSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navItems = [
  { icon: BarChart3, label: "Item ABC", href: "#" },
  { icon: ClipboardList, label: "Count Ticket", href: "#" },
  { icon: LayoutGrid, label: "Count PWST Status", href: "#" },
  { icon: Package, label: "Inventory Count", href: "#" },
  { icon: PenLine, label: "Manual Count Entry", href: "#" },
  { icon: ListChecks, label: "Count Task", href: "#" },
  { icon: CheckSquare, label: "Result Acknowledge", href: "#" },
  { icon: RefreshCcw, label: "Count Result Approve", href: "#" },
  { icon: Settings, label: "Opportunity Count Setting", href: "#", active: true },
]

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 relative shrink-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo area */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-sidebar-border">
        <div className="flex items-center justify-center size-8 rounded-lg bg-sidebar-accent">
          <RefreshCcw className="size-4 text-sidebar-foreground" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-sm tracking-wide text-sidebar-foreground">
            CYCLE COUNT
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <ul className="flex flex-col gap-0.5 px-2">
          {navItems.map((item) => {
            const NavIcon = item.icon
            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  item.active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <NavIcon className="size-[18px] shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            )

            if (collapsed) {
              return (
                <li key={item.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                </li>
              )
            }

            return <li key={item.label}>{linkContent}</li>
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 flex size-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:bg-accent transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="size-3.5" />
        ) : (
          <ChevronLeft className="size-3.5" />
        )}
      </button>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Home className="size-4 text-sidebar-foreground/60" />
          {!collapsed && (
            <span className="text-xs text-sidebar-foreground/60">Fontana</span>
          )}
        </div>
      </div>
    </aside>
  )
}
