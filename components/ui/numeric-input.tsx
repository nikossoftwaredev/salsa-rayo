"use client"

import * as React from "react"
import { Input, type inputVariants } from "@/components/ui/input"
import type { VariantProps } from "class-variance-authority"

const DECIMAL_PATTERN = /^\d*\.?\d*$/
const INTEGER_PATTERN = /^\d*$/

interface NumericInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "onChange" | "value" | "size">,
    VariantProps<typeof inputVariants> {
  value: string | number
  onChange: (value: string) => void
  allowDecimal?: boolean
}

const NumericInput = ({ value, onChange, allowDecimal = true, onKeyDown, ...props }: NumericInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value

    if (raw === "") {
      onChange(raw)
      return
    }

    const pattern = allowDecimal ? DECIMAL_PATTERN : INTEGER_PATTERN
    if (pattern.test(raw)) onChange(raw)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault()
      const current = parseFloat(String(value)) || 0
      const next = e.key === "ArrowUp" ? current + 1 : Math.max(0, current - 1)
      onChange(String(next))
    }
    onKeyDown?.(e)
  }

  return (
    <Input
      type="text"
      inputMode={allowDecimal ? "decimal" : "numeric"}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
}

export { NumericInput }
