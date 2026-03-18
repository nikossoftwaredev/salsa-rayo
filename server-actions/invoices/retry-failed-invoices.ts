"use server"

import { prisma } from "@/lib/db"
import {
  getAadeClient,
  submitInvoiceToAade,
  updateInvoiceFromError,
} from "@/lib/invoicing/aade-helpers"
import { isAdmin } from "../is-admin"

const MAX_RETRIES = 5
const RETRY_COOLDOWN_MS = 30 * 60 * 1000 // 30 minutes

export const retryFailedInvoices = async () => {
  const adminCheck = await isAdmin()
  if (!adminCheck)
    return { success: false as const, error: "Unauthorized" }

  const client = getAadeClient()
  if (!client)
    return { success: false as const, error: "AADE not configured" }

  const cutoff = new Date(Date.now() - RETRY_COOLDOWN_MS)

  const failedInvoices = await prisma.invoice.findMany({
    where: {
      status: "failed",
      retryCount: { lt: MAX_RETRIES },
      OR: [
        { lastRetryAt: null },
        { lastRetryAt: { lt: cutoff } },
      ],
    },
    take: 10,
  })

  const results = await Promise.allSettled(
    failedInvoices.map(async (invoice) => {
      try {
        const response = await submitInvoiceToAade(client, invoice)
        return response.success
      } catch (error) {
        await updateInvoiceFromError({
          invoiceId: invoice.id,
          error,
          retryCount: invoice.retryCount + 1,
        })
        return false
      }
    })
  )

  const retried = results.length
  const succeeded = results.filter(
    (r) => r.status === "fulfilled" && r.value
  ).length

  return {
    success: true as const,
    total: failedInvoices.length,
    retried,
    succeeded,
  }
}
