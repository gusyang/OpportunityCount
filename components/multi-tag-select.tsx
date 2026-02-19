"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { X, ChevronDown, Check } from "lucide-react"
import { useState } from "react"

interface MultiTagSelectProps {
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiTagSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
}: MultiTagSelectProps) {
  const [open, setOpen] = useState(false)

  const toggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option))
    } else {
      onChange([...value, option])
    }
  }

  const remove = (option: string) => {
    onChange(value.filter((v) => v !== option))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          tabIndex={0}
          className={cn(
            "flex items-center justify-between rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "w-full h-auto min-h-9 font-normal hover:bg-transparent cursor-pointer",
            className
          )}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {value.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              value.map((v) => (
                <Badge
                  key={v}
                  variant="secondary"
                  className="text-xs px-1.5 py-0 h-[22px] gap-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
                >
                  {v}
                  <button
                    className="ml-0.5 hover:text-destructive focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation()
                      remove(v)
                    }}
                    aria-label={`Remove ${v}`}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>
          <ChevronDown className="size-4 opacity-50 shrink-0 ml-2" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-1" align="start">
        <div className="flex flex-col">
          {options.map((option) => {
            const selected = value.includes(option)
            return (
              <button
                key={option}
                onClick={() => toggle(option)}
                className={cn(
                  "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors text-left",
                  selected
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-accent text-foreground"
                )}
              >
                <div
                  className={cn(
                    "size-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                    selected
                      ? "bg-primary border-primary"
                      : "border-input"
                  )}
                >
                  {selected && <Check className="size-3 text-primary-foreground" />}
                </div>
                {option}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
