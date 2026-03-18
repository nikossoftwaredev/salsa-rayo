"use server"

import { prisma } from "@/lib/db"
import {
  getAadeClient,
  submitInvoiceToAade,
  updateInvoiceFromError,
} from "@/lib/invoicing/aade-helpers"
import { isAdmin } from "../is-admin"

export const retryFailedInvoice = async (invoiceId: string) => {
  const adminCheck = await isAdmin()
  if (!adminCheck)
    return { success: false as const, error: "Unauthorized" }

  const client = getAadeClient()
  if (!client)
    return { success: false as const, error: "AADE not configured" }

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
  })

  if (!invoice)
    return { success: false as const, error: "Invoice not found" }

  if (invoice.status !== "failed")
    return { success: false as const, error: "Invoice is not in failed state" }

  try {
    const response = await submitInvoiceToAade(client, invoice)

    if (response.success) return { success: true as const }
    return { success: false as const, error: response.errors?.[0]?.message || "AADE rejected invoice" }
  } catch (error) {
    await updateInvoiceFromError({
      invoiceId: invoice.id,
      error,
      retryCount: invoice.retryCount + 1,
    })
    return { success: false as const, error: "Invoice submission failed" }
  }
}
