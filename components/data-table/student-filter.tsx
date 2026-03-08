"use client"

import { useState } from "react"
import { IoSearchOutline, IoPersonOutline } from "react-icons/io5"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useStudentSearch } from "@/hooks/use-student-search"

interface StudentFilterProps {
  value: string | undefined
  onSelect: (studentId: string | undefined) => void
}

export const StudentFilter = ({ value, onSelect }: StudentFilterProps) => {
  const [open, setOpen] = useState(false)
  const { search, students, loading, handleSearch } = useStudentSearch()
  const selectedName = value
    ? students.find((s) => s.id === value)?.name
    : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <IoPersonOutline size={14} className="mr-2" />
          {selectedName ?? "Student"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0" align="start">
        <div className="flex items-center border-b px-3 py-2">
          <IoSearchOutline size={14} className="mr-2 shrink-0 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search students..."
            maxLength={100}
            className="h-8 border-0 p-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <ScrollArea className="max-h-[200px]">
          {loading ? (
            <div className="space-y-1 p-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-full" />
              ))}
            </div>
          ) : students.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No students found.</p>
          ) : (
            <div className="p-1">
              {students.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent cursor-pointer"
                  onClick={() => {
                    onSelect(value === student.id ? undefined : student.id)
                    setOpen(false)
                  }}
                >
                  <span className="truncate">{student.name}</span>
                  <span className="ml-auto truncate text-xs text-muted-foreground">
                    {student.email}
                  </span>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
        {value && (
          <div className="border-t p-1">
            <button
              type="button"
              className="flex w-full items-center justify-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent cursor-pointer"
              onClick={() => {
                onSelect(undefined)
                setOpen(false)
              }}
            >
              Clear filter
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
