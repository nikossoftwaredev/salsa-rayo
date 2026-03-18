import { prisma } from "@/lib/db"
import {
  AADE_INVOICE_TYPES,
  AADE_PAYMENT_METHODS,
  AADE_VAT_RATES,
} from "@/lib/aade"
import {
  getAadeClient,
  submitInvoiceToAade,
  updateInvoiceFromError,
} from "./aade-helpers"

const PAYMENT_METHOD_MAP: Record<string, number> = {
  cash: AADE_PAYMENT_METHODS.CASH,
  card: AADE_PAYMENT_METHODS.POS,
  stripe: AADE_PAYMENT_METHODS.POS,
  "bank-transfer": AADE_PAYMENT_METHODS.DOMESTIC_ACCOUNT,
}

interface IssueInvoiceInput {
  transactionId: string
  amount: number
  paymentMethod: string
  description?: string
  studentName?: string | null
  studentAddress?: string | null
}

export const issueInvoice = async (input: IssueInvoiceInput) => {
  const client = getAadeClient()
  if (!client) {
    console.warn("[AADE] Client not configured, skipping invoice issuance")
    return null
  }

  const vatCategory = parseInt(process.env.AADE_DEFAULT_VAT_CATEGORY || "1")
  const vatRate = AADE_VAT_RATES[vatCategory] || 0
  const grossAmount = input.amount
  const netAmount = parseFloat((grossAmount / (1 + vatRate)).toFixed(2))
  const vatAmount = parseFloat((grossAmount - netAmount).toFixed(2))

  const series = process.env.AADE_INVOICE_SERIES || "A"

  // Atomic sequence number increment
  const sequence = await prisma.invoiceSequence.upsert({
    where: { series },
    create: { series, lastNumber: 1 },
    update: { lastNumber: { increment: 1 } },
  })

  const sequenceNumber = sequence.lastNumber
  const paymentMethodCode = PAYMENT_METHOD_MAP[input.paymentMethod] || AADE_PAYMENT_METHODS.CASH

  // Fetch student from transaction for counterpart data (skip if already provided)
  let studentName = input.studentName
  let studentAddress = input.studentAddress
  if (studentName === undefined) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: input.transactionId },
      include: { student: { select: { name: true, address: true } } },
    })
    studentName = transaction?.student?.name
    studentAddress = transaction?.student?.address
  }

  // Create pending invoice record
  const invoice = await prisma.invoice.create({
    data: {
      transactionId: input.transactionId,
      series,
      sequenceNumber,
      invoiceType: AADE_INVOICE_TYPES.SERVICE_PROVISION_RECEIPT,
      issueDate: new Date(),
      netAmount,
      vatAmount,
      grossAmount,
      vatCategory,
      paymentMethodCode,
      status: "pending",
    },
  })

  try {
    const response = await submitInvoiceToAade(client, invoice, {
      name: studentName,
      address: studentAddress,
    })
    return { invoiceId: invoice.id, ...response }
  } catch (error) {
    console.error("[AADE] Invoice submission failed:", error)
    await updateInvoiceFromError({
      invoiceId: invoice.id,
      error,
      retryCount: 1,
    })
    return { invoiceId: invoice.id, success: false }
  }
}
