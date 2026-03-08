"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  getStudentsForAttendance,
  type StudentForAttendance,
} from "@/server-actions/students/get-students-for-attendance"

export const useStudentSearch = () => {
  const [search, setSearch] = useState("")
  const [students, setStudents] = useState<StudentForAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const isMountedRef = useRef(true)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    setLoading(true)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      const result = await getStudentsForAttendance({ search: value })
      if (isMountedRef.current) {
        setStudents(result.success ? result.data ?? [] : [])
        setLoading(false)
      }
    }, 300)
  }, [])

  useEffect(() => {
    isMountedRef.current = true

    const doFetch = async () => {
      const result = await getStudentsForAttendance({ search: "" })
      if (isMountedRef.current) {
        setStudents(result.success ? result.data ?? [] : [])
        setLoading(false)
      }
    }

    doFetch()

    return () => {
      isMountedRef.current = false
      clearTimeout(debounceRef.current)
    }
  }, [])

  return { search, students, loading, handleSearch }
}

export type { StudentForAttendance }
