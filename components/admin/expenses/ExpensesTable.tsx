"use client"

import { useMemo } from "react"
import { DataTable } from "@/components/data-table/data-table"
import { createColumns, type ExpenseRowActions } from "./columns"
import { ExpensesToolbar } from "./expenses-toolbar"
import { type ExpenseWithCategory } from "@/server-actions/expenses/get-expenses"
import { type ExpenseCategory } from "@/lib/db"

interface ExpensesTableProps {
  data: ExpenseWithCategory[]
  categories: ExpenseCategory[]
  onEdit: ExpenseRowActions["onEdit"]
  onDelete: ExpenseRowActions["onDelete"]
}

export const ExpensesTable = ({
  data,
  categories,
  onEdit,
  onDelete,
}: ExpensesTableProps) => {
  const columns = useMemo(
    () => createColumns({ onEdit, onDelete }),
    [onEdit, onDelete]
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      toolbar={(table) => (
        <ExpensesToolbar table={table} categories={categories} />
      )}
    />
  )
}
