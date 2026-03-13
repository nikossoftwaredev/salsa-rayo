"use server"

import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"
import { issueInvoice } from "@/lib/invoicing/issue-invoice"

export const issueInvoiceForTransaction = async (transactionId: string, customAmount?: number) => {
  const adminCheck = await isAdmin()
  if (!adminCheck)
    return { success: false as const, error: "Unauthorized" }

  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { invoice: true, student: true },
  })

  if (!transaction)
    return { success: false as const, error: "Transaction not found" }

  if (transaction.invoice)
    return { success: false as const, error: "Invoice already exists for this transaction" }

  try {
    const result = await issueInvoice({
      transactionId: transaction.id,
      amount: customAmount ?? transaction.amount,
      paymentMethod: transaction.paymentMethod,
      customerName: transaction.student?.name || transaction.studentName,
      description: transaction.description || undefined,
    })

    if (!result)
      return { success: false as const, error: "AADE not configured" }

    return { success: true as const, invoiceId: result.invoiceId }
  } catch (error) {
    console.error("[AADE] Manual invoice issuance failed:", error)
    return { success: false as const, error: "Invoice issuance failed" }
  }
}
