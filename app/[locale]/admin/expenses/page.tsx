import { ExpensesView } from "@/components/admin/expenses/ExpensesView"
import { getExpenses } from "@/server-actions/expenses/get-expenses"
import { getExpenseCategories } from "@/server-actions/expenses/get-expense-categories"

const ExpensesPage = async () => {
  const [expensesResult, categoriesResult] = await Promise.all([
    getExpenses(),
    getExpenseCategories(),
  ])

  const expenses = expensesResult.success ? expensesResult.data ?? [] : []
  const categories = categoriesResult.success ? categoriesResult.data ?? [] : []

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Expenses</h2>
        <p className="text-muted-foreground">
          Track and manage all outgoing expenses.
        </p>
      </div>
      <ExpensesView data={expenses} categories={categories} />
    </div>
  )
}

export default ExpensesPage
