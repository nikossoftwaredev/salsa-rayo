"use client"

import { useState, useRef, useEffect } from "react"
import { IoSearchOutline, IoPersonOutline, IoCheckmark, IoClose } from "react-icons/io5"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getInitials } from "@/lib/format"
import { useStudentSearch } from "@/hooks/use-student-search"

interface StudentFilterProps {
  value: string | undefined
  onSelect: (studentId: string | undefined) => void
}

export const StudentFilter = ({ value, onSelect }: StudentFilterProps) => {
  const [open, setOpen] = useState(false)
  const { search, students, loading, handleSearch } = useStudentSearch()
  const inputRef = useRef<HTMLInputElement>(null)
  const selectedStudent = value ? students.find((s) => s.id === value) : null

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => inputRef.current?.focus(), 0)
    return () => clearTimeout(timer)
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <IoPersonOutline size={14} className="mr-2" />
          {selectedStudent ? (
            <>
              <span className="max-w-[120px] truncate">{selectedStudent.name}</span>
              <span
                className="ml-1.5 rounded-full p-0.5 hover:bg-accent"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect(undefined)
                }}
              >
                <IoClose size={12} />
              </span>
            </>
          ) : (
            "Student"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="flex items-center border-b px-3 py-2">
          <IoSearchOutline size={14} className="mr-2 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search students..."
            maxLength={100}
            className="h-7 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <ScrollArea className="max-h-[280px] [&>[data-slot=scroll-area-viewport]]:max-h-[280px]">
          {loading ? (
            <div className="space-y-1 p-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2.5 px-2 py-1.5">
                  <Skeleton className="size-8 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : students.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No students found.</p>
          ) : (
            <div className="p-1">
              {students.map((student) => {
                const isSelected = value === student.id
                return (
                  <button
                    key={student.id}
                    type="button"
                    className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent"
                    }`}
                    onClick={() => {
                      onSelect(isSelected ? undefined : student.id)
                      setOpen(false)
                    }}
                  >
                    <div className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {getInitials(student.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium leading-tight">{student.name}</p>
                      {student.email && (
                        <p className="truncate text-xs text-muted-foreground leading-tight mt-0.5">{student.email}</p>
                      )}
                    </div>
                    {isSelected && (
                      <IoCheckmark size={16} className="shrink-0 text-primary" />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
