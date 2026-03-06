"use client"

import { DataTable } from "@/components/data-table/data-table"
import { columns } from "./columns"
import { StudentsToolbar } from "./students-toolbar"
import { type StudentWithSubscriptions } from "./types"

interface StudentsTableProps {
  data: StudentWithSubscriptions[]
}

export const StudentsTable = ({ data }: StudentsTableProps) => (
  <DataTable
    columns={columns}
    data={data}
    toolbar={(table) => <StudentsToolbar table={table} />}
    initialColumnVisibility={{ address: false, joinedAt: false }}
    storageKey="dt-col-students"
  />
)
