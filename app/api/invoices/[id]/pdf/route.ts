export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { isAdmin } from "@/server-actions/is-admin"
import { generateInvoicePdf, type InvoicePdfData } from "@/lib/invoicing/generate-invoice-pdf"

export const GET = async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const adminCheck = await isAdmin()
  if (!adminCheck)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { transaction: { include: { student: true } } },
  })

  if (!invoice)
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 })

  const data: InvoicePdfData = {
    issuerName: process.env.AADE_ISSUER_NAME || "Salsa Rayo",
    issuerVat: process.env.AADE_ISSUER_VAT || "",
    issuerProfession: process.env.AADE_ISSUER_PROFESSION || "",
    issuerDoy: process.env.AADE_ISSUER_DOY || "",
    issuerAddress: process.env.AADE_ISSUER_ADDRESS || "",
    series: invoice.series,
    sequenceNumber: invoice.sequenceNumber,
    issueDate: invoice.issueDate.toISOString().split("T")[0],
    mark: invoice.mark || "",
    invoiceType: invoice.invoiceType,
    paymentMethodCode: invoice.paymentMethodCode,
    customerName: invoice.transaction?.student?.name || invoice.transaction?.studentName || undefined,
    customerVat: invoice.customerVat || undefined,
    customerAddress: invoice.transaction?.student?.address || undefined,
    netAmount: invoice.netAmount,
    vatAmount: invoice.vatAmount,
    grossAmount: invoice.grossAmount,
    vatCategory: invoice.vatCategory,
    description: invoice.transaction?.description || "Υπηρεσίες χορού",
    qrUrl: invoice.qrUrl || undefined,
  }

  try {
    const pdfBuffer = await generateInvoicePdf(data)

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="invoice-${invoice.series}-${invoice.sequenceNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error("[PDF] Generation failed:", error)
    return NextResponse.json(
      { error: "PDF generation failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
