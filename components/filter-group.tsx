"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface FilterOption {
  id: string
  label: string
  count: number
}

interface FilterGroupProps {
  title: string
  options: FilterOption[]
  selectedOptions: string[]
  onOptionChange: (optionId: string, checked: boolean) => void
}

export function FilterGroup({ title, options, selectedOptions, onOptionChange }: FilterGroupProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option.id)
          return (
            <div key={option.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={option.id}
                  checked={isSelected}
                  onCheckedChange={(checked) => onOptionChange(option.id, checked as boolean)}
                  className="rounded-md border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:ring-primary"
                />
                <label
                  htmlFor={option.id}
                  className="text-sm text-foreground cursor-pointer hover:text-primary transition-colors"
                >
                  {option.label}
                </label>
              </div>
              <Badge variant="secondary" className="rounded-full bg-muted/50 text-muted-foreground hover:bg-muted">
                {option.count}
              </Badge>
            </div>
          )
        })}
      </div>
    </div>
  )
}
