import { IncomeView } from "@/components/admin/income/IncomeView"
import { getTransactions } from "@/server-actions/payments/get-transactions"

const IncomePage = async () => {
  const result = await getTransactions()
  const transactions = result.success ? result.data ?? [] : []

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Income</h2>
        <p className="text-muted-foreground">
          Track income and view all payment transactions.
        </p>
      </div>
      <IncomeView data={transactions} />
    </div>
  )
}

export default IncomePage
