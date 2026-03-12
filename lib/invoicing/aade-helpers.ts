import { prisma, type Invoice } from "@/lib/db"
import {
  createAadeClient,
  AADE_INCOME_CLASSIFICATION,
  AADE_INCOME_CLASSIFICATION_CATEGORY,
  type AadeInvoiceInput,
  type AadeSubmissionResponse,
} from "@/lib/aade"

export const getAadeClient = () => {
  const userId = process.env.AADE_USER_ID
  const subscriptionKey = process.env.AADE_SUBSCRIPTION_KEY
  const environment = (process.env.AADE_ENVIRONMENT || "dev") as "dev" | "production"

  if (!userId || !subscriptionKey) return null

  return createAadeClient({ userId, subscriptionKey, environment })
}

export const buildAadeInvoiceFromRecord = (invoice: Invoice): AadeInvoiceInput => ({
  issuer: {
    vatNumber: process.env.AADE_ISSUER_VAT || "",
    country: "GR",
    branch: parseInt(process.env.AADE_ISSUER_BRANCH || "0"),
  },
  invoiceHeader: {
    series: invoice.series,
    aa: invoice.sequenceNumber.toString(),
    issueDate: invoice.issueDate.toISOString().split("T")[0],
    invoiceType: invoice.invoiceType,
    currency: "EUR",
  },
  invoiceDetails: [
    {
      lineNumber: 1,
      netValue: invoice.netAmount,
      vatCategory: invoice.vatCategory,
      vatAmount: invoice.vatAmount,
      incomeClassification: {
        classificationType: AADE_INCOME_CLASSIFICATION.SERVICE_REVENUE_RETAIL,
        classificationCategory: AADE_INCOME_CLASSIFICATION_CATEGORY.SERVICE_PROVISION_REVENUE,
        amount: invoice.netAmount,
      },
    },
  ],
  paymentMethods: [
    {
      type: invoice.paymentMethodCode,
      amount: invoice.grossAmount,
    },
  ],
})

export const updateInvoiceFromResponse = async ({
  invoiceId,
  response,
  retryCount,
}: {
  invoiceId: string
  response: AadeSubmissionResponse
  retryCount: number
}) => {
  if (response.success) {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: "submitted",
        mark: response.mark,
        uid: response.uid,
        authCode: response.authenticationCode,
        qrUrl: response.qrUrl,
        submittedAt: new Date(),
        retryCount,
        lastRetryAt: new Date(),
      },
    })
  } else {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: "failed",
        aadeErrors: JSON.stringify(response.errors),
        retryCount,
        lastRetryAt: new Date(),
      },
    })
  }
}

export const updateInvoiceFromError = async ({
  invoiceId,
  error,
  retryCount,
}: {
  invoiceId: string
  error: unknown
  retryCount: number
}) => {
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      status: "failed",
      aadeErrors: JSON.stringify([
        { code: "EXCEPTION", message: error instanceof Error ? error.message : "Unknown error" },
      ]),
      retryCount,
      lastRetryAt: new Date(),
    },
  })
}

type AadeClient = ReturnType<typeof createAadeClient>

export const submitInvoiceToAade = async (client: AadeClient, invoice: Invoice) => {
  const aadeInvoice = buildAadeInvoiceFromRecord(invoice)
  const response = await client.sendInvoice(aadeInvoice)

  await updateInvoiceFromResponse({
    invoiceId: invoice.id,
    response,
    retryCount: invoice.retryCount + 1,
  })

  return response
}
