"use client"

import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  id?: string
}

export const DatePicker = ({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  id,
}: DatePickerProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        id={id}
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !value && "text-muted-foreground",
          className
        )}
      >
        <CalendarIcon className="size-4 mr-2 text-muted-foreground" />
        {value ? format(value, "MMM d, yyyy") : placeholder}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        mode="single"
        selected={value}
        onSelect={onChange}
        defaultMonth={value}
      />
    </PopoverContent>
  </Popover>
)
