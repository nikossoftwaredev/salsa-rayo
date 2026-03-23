"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Banknote, TrendingDown, BarChart3, Calendar } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { type ExpenseCategory } from "@/lib/db"
import { type ExpenseWithCategory } from "@/server-actions/expenses/get-expenses"
import { deleteExpense } from "@/server-actions/expenses/delete-expense"
import { ExpensesTable } from "./ExpensesTable"
import { ExpenseDialog } from "./ExpenseDialog"
import { CategoryManager } from "./CategoryManager"

interface ExpensesViewProps {
  data: ExpenseWithCategory[]
  categories: ExpenseCategory[]
}

interface StatCard {
  label: string
  value: string | number
  icon: React.ElementType
  colorClass: string
}

export const ExpensesView = ({ data, categories }: ExpensesViewProps) => {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<ExpenseWithCategory | null>(null)
  const [deletingExpense, setDeletingExpense] = useState<ExpenseWithCategory | null>(null)

  const stats = useMemo(() => {
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()

    let totalThisMonth = 0
    let totalYTD = 0
    const categoryTotals: Record<string, number> = {}

    for (const expense of data) {
      const date = new Date(expense.date)
      const amount = expense.amount

      if (date.getFullYear() === thisYear) {
        totalYTD += amount
        if (date.getMonth() === thisMonth) totalThisMonth += amount
      }

      const catName = expense.category.name
      categoryTotals[catName] = (categoryTotals[catName] ?? 0) + amount
    }

    const topCategory = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    )[0]

    return [
      {
        label: "This Month",
        value: `€${totalThisMonth.toFixed(0)}`,
        icon: Calendar,
        colorClass: "text-rose-500",
      },
      {
        label: "Top Category",
        value: topCategory ? topCategory[0] : "-",
        icon: TrendingDown,
        colorClass: "text-amber-500",
      },
      {
        label: "Avg Per Expense",
        value: data.length > 0 ? `€${(totalYTD / data.length).toFixed(0)}` : "€0",
        icon: BarChart3,
        colorClass: "text-blue-500",
      },
      {
        label: "Total YTD",
        value: `€${totalYTD.toFixed(0)}`,
        icon: Banknote,
        colorClass: "text-primary",
      },
    ] satisfies StatCard[]
  }, [data])

  const handleEdit = useCallback((expense: ExpenseWithCategory) => {
    setEditingExpense(expense)
    setDialogOpen(true)
  }, [])

  const handleDelete = useCallback((expense: ExpenseWithCategory) => {
    setDeletingExpense(expense)
  }, [])

  const confirmDelete = async () => {
    if (!deletingExpense) return
    const result = await deleteExpense(deletingExpense.id)
    if (result.success) {
      toast.success("Expense deleted")
      router.refresh()
    } else {
      toast.error(result.error)
    }
    setDeletingExpense(null)
  }

  const handleOpenNew = () => {
    setEditingExpense(null)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <stat.icon className={`size-5 ${stat.colorClass}`} />
            </div>
            <p className="mt-2 text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleOpenNew}>
          Add Expense
        </Button>
        <CategoryManager categories={categories} />
      </div>

      <ExpensesTable
        data={data}
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {dialogOpen && (
        <ExpenseDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          categories={categories}
          expense={editingExpense}
        />
      )}

      <AlertDialog
        open={!!deletingExpense}
        onOpenChange={(open) => { if (!open) setDeletingExpense(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete expense?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the €{deletingExpense?.amount.toFixed(2)}{" "}
              {deletingExpense?.category.name} expense. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
