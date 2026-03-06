"use client"

import { DataTable } from "@/components/data-table/data-table"
import { columns } from "./columns"
import { IncomeToolbar } from "./income-toolbar"
import { type TransactionWithStudent } from "@/server-actions/payments/get-transactions"

interface IncomeTableProps {
  data: TransactionWithStudent[]
}

export const IncomeTable = ({ data }: IncomeTableProps) => (
  <DataTable
    columns={columns}
    data={data}
    toolbar={(table) => <IncomeToolbar table={table} />}
  />
)
