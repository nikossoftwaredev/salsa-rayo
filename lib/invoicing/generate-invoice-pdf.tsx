import { renderToBuffer, Document, Page, View, Text, Image, StyleSheet, Font } from "@react-pdf/renderer"
import { AADE_VAT_RATES } from "@/lib/aade/constants"
import path from "path"
import fs from "fs"

// Register Roboto (supports Greek characters)
const fontsDir = path.join(process.cwd(), "public", "fonts")
Font.register({
  family: "Roboto",
  fonts: [
    { src: path.join(fontsDir, "Roboto-Regular.ttf"), fontWeight: 400 },
    { src: path.join(fontsDir, "Roboto-Bold.ttf"), fontWeight: 700 },
  ],
})

// Load logo as base64 data URI (cached - read once from disk)
let cachedLogoDataUri: string | null = null
const loadLogoDataUri = () => {
  if (!cachedLogoDataUri) {
    const logoPath = path.join(process.cwd(), "public", "images", "logo-black.png")
    const buffer = fs.readFileSync(logoPath)
    cachedLogoDataUri = `data:image/png;base64,${buffer.toString("base64")}`
  }
  return cachedLogoDataUri
}

const INVOICE_TYPE_LABELS: Record<string, string> = {
  "11.1": "ΑΠΟΔΕΙΞΗ ΛΙΑΝΙΚΗΣ ΠΩΛΗΣΗΣ",
  "11.2": "ΑΠΟΔΕΙΞΗ ΠΑΡΟΧΗΣ ΥΠΗΡΕΣΙΩΝ",
  "11.3": "ΑΠΛΟΠΟΙΗΜΕΝΟ ΤΙΜΟΛΟΓΙΟ",
  "11.4": "ΠΙΣΤΩΤΙΚΟ ΣΤΟΙΧΕΙΟ ΛΙΑΝΙΚΗΣ",
  "1.1": "ΤΙΜΟΛΟΓΙΟ ΠΩΛΗΣΗΣ",
  "2.1": "ΤΙΜΟΛΟΓΙΟ ΠΑΡΟΧΗΣ ΥΠΗΡΕΣΙΩΝ",
}

const PAYMENT_METHOD_LABELS: Record<number, string> = {
  1: "Εγχώριος Λογαριασμός",
  2: "Αλλοδαπός Λογαριασμός",
  3: "Μετρητά",
  4: "Επιταγή",
  5: "Επί Πιστώσει",
  6: "Web Banking",
  7: "POS / Κάρτα",
}

export interface InvoicePdfData {
  issuerName: string
  issuerVat: string
  issuerProfession: string
  issuerDoy: string
  issuerAddress: string
  series: string
  sequenceNumber: number
  issueDate: string
  mark: string
  invoiceType: string
  paymentMethodCode: number
  customerName?: string
  customerVat?: string
  customerAddress?: string
  netAmount: number
  vatAmount: number
  grossAmount: number
  vatCategory: number
  description: string
  qrUrl?: string
}

const fmt = (n: number) => n.toFixed(2).replace(".", ",")

const PRIMARY = "#5b4fdb"
const PRIMARY_LIGHT = "#f0eeff"
const DARK = "#1a1a2e"
const GRAY = "#6b7280"
const BORDER = "#e5e7eb"

const s = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: "Roboto",
    color: DARK,
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: `2 solid ${PRIMARY}`,
  },
  logo: { width: 50, height: 50 },
  headerRight: { alignItems: "flex-end" },
  brandName: { fontSize: 18, fontWeight: 700, color: PRIMARY },
  brandSub: { fontSize: 8, color: GRAY, marginTop: 2 },
  // Invoice type banner
  typeBanner: {
    backgroundColor: PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderRadius: 4,
  },
  typeText: { color: "#fff", fontWeight: 700, fontSize: 12, textAlign: "center", letterSpacing: 1 },
  // Info grid (2 columns)
  infoGrid: { flexDirection: "row", gap: 16, marginBottom: 16 },
  infoBox: { flex: 1, border: `1 solid ${BORDER}`, borderRadius: 4, overflow: "hidden" },
  infoTitle: {
    fontSize: 8,
    fontWeight: 700,
    color: PRIMARY,
    backgroundColor: PRIMARY_LIGHT,
    paddingVertical: 4,
    paddingHorizontal: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoRow: { flexDirection: "row", paddingVertical: 3, paddingHorizontal: 8, borderBottom: `0.5 solid ${BORDER}` },
  infoLabel: { width: 80, fontSize: 8, color: GRAY },
  infoValue: { flex: 1, fontSize: 9 },
  // Invoice details row
  detailsRow: {
    flexDirection: "row",
    backgroundColor: PRIMARY_LIGHT,
    border: `1 solid ${BORDER}`,
    borderRadius: 4,
    marginBottom: 16,
    paddingVertical: 8,
  },
  detailCell: { flex: 1, alignItems: "center" },
  detailLabel: { fontSize: 7, color: GRAY, textTransform: "uppercase", letterSpacing: 0.3 },
  detailValue: { fontSize: 10, fontWeight: 700, marginTop: 2 },
  // Table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: DARK,
    borderRadius: 4,
    paddingVertical: 6,
    marginBottom: 1,
  },
  tableHeaderCell: {
    color: "#fff",
    fontWeight: 700,
    fontSize: 7,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottom: `0.5 solid ${BORDER}`,
  },
  tableCell: { fontSize: 9, textAlign: "center" },
  // Totals
  totalsSection: { marginTop: 8, alignItems: "flex-end" },
  totalsRow: { flexDirection: "row", width: 220, paddingVertical: 3 },
  totalsLabel: { flex: 1, fontSize: 9, color: GRAY },
  totalsValue: { width: 80, fontSize: 9, textAlign: "right" },
  grandTotalRow: {
    flexDirection: "row",
    width: 220,
    paddingVertical: 6,
    marginTop: 4,
    borderTop: `1.5 solid ${PRIMARY}`,
  },
  grandTotalLabel: { flex: 1, fontSize: 11, fontWeight: 700, color: PRIMARY },
  grandTotalValue: { width: 80, fontSize: 11, fontWeight: 700, color: PRIMARY, textAlign: "right" },
  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: "auto",
    paddingTop: 20,
    borderTop: `1 solid ${BORDER}`,
  },
  footerNote: { fontSize: 7, color: GRAY, marginTop: 2 },
  qrBox: {
    width: 70,
    height: 70,
    border: `1 solid ${BORDER}`,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  qrText: { fontSize: 5, color: GRAY },
})

const COL = { desc: "35%", qty: "8%", price: "14%", net: "14%", vatPct: "8%", vat: "10%", total: "11%" }

export const generateInvoicePdf = async (data: InvoicePdfData): Promise<Buffer> => {
  const vatPct = Math.round((AADE_VAT_RATES[data.vatCategory] ?? 0) * 100)
  const logoSrc = loadLogoDataUri()

  const doc = (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image src={logoSrc} style={s.logo} />
            <View>
              <Text style={s.brandName}>Salsa Rayo</Text>
              <Text style={s.brandSub}>Dance School</Text>
            </View>
          </View>
          <View style={s.headerRight}>
            <Text style={{ fontSize: 8, color: GRAY }}>MARK</Text>
            <Text style={{ fontSize: 11, fontWeight: 700, color: PRIMARY }}>{data.mark || "-"}</Text>
            <Text style={{ fontSize: 8, color: GRAY, marginTop: 4 }}>{data.issueDate}</Text>
          </View>
        </View>

        {/* Invoice Type Banner */}
        <View style={s.typeBanner}>
          <Text style={s.typeText}>
            {INVOICE_TYPE_LABELS[data.invoiceType] ?? data.invoiceType}
          </Text>
        </View>

        {/* Invoice Details Row */}
        <View style={s.detailsRow}>
          <View style={s.detailCell}>
            <Text style={s.detailLabel}>Σειρά</Text>
            <Text style={s.detailValue}>{data.series}</Text>
          </View>
          <View style={s.detailCell}>
            <Text style={s.detailLabel}>Α.Α.</Text>
            <Text style={s.detailValue}>{data.sequenceNumber}</Text>
          </View>
          <View style={s.detailCell}>
            <Text style={s.detailLabel}>Ημερομηνία</Text>
            <Text style={s.detailValue}>{data.issueDate}</Text>
          </View>
          <View style={s.detailCell}>
            <Text style={s.detailLabel}>Τρόπος Πληρωμής</Text>
            <Text style={s.detailValue}>{PAYMENT_METHOD_LABELS[data.paymentMethodCode] ?? "-"}</Text>
          </View>
        </View>

        {/* Issuer + Customer Info Grid */}
        <View style={s.infoGrid}>
          {/* Issuer */}
          <View style={s.infoBox}>
            <Text style={s.infoTitle}>Στοιχεία Εκδότη</Text>
            <View style={s.infoRow}>
              <Text style={s.infoLabel}>Επωνυμία</Text>
              <Text style={s.infoValue}>{data.issuerName}</Text>
            </View>
            <View style={s.infoRow}>
              <Text style={s.infoLabel}>Α.Φ.Μ.</Text>
              <Text style={s.infoValue}>{data.issuerVat}</Text>
            </View>
            {data.issuerProfession ? (
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>Δραστηριότητα</Text>
                <Text style={s.infoValue}>{data.issuerProfession}</Text>
              </View>
            ) : null}
            {data.issuerDoy ? (
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>Δ.Ο.Υ.</Text>
                <Text style={s.infoValue}>{data.issuerDoy}</Text>
              </View>
            ) : null}
            {data.issuerAddress ? (
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>Διεύθυνση</Text>
                <Text style={s.infoValue}>{data.issuerAddress}</Text>
              </View>
            ) : null}
          </View>

          {/* Customer */}
          <View style={s.infoBox}>
            <Text style={s.infoTitle}>Στοιχεία Λήπτη</Text>
            {data.customerName ? (
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>Ονοματεπώνυμο</Text>
                <Text style={s.infoValue}>{data.customerName}</Text>
              </View>
            ) : null}
            {data.customerVat ? (
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>Α.Φ.Μ.</Text>
                <Text style={s.infoValue}>{data.customerVat}</Text>
              </View>
            ) : null}
            {data.customerAddress ? (
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>Διεύθυνση</Text>
                <Text style={s.infoValue}>{data.customerAddress}</Text>
              </View>
            ) : null}
            {!data.customerName && !data.customerVat && (
              <View style={{ padding: 8 }}>
                <Text style={{ fontSize: 8, color: GRAY }}>Λιανική πώληση</Text>
              </View>
            )}
          </View>
        </View>

        {/* Line Items Table */}
        <View style={{ marginBottom: 8 }}>
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderCell, { width: COL.desc, textAlign: "left", paddingLeft: 8 }]}>Περιγραφή</Text>
            <Text style={[s.tableHeaderCell, { width: COL.qty }]}>Ποσ.</Text>
            <Text style={[s.tableHeaderCell, { width: COL.price }]}>Τιμή</Text>
            <Text style={[s.tableHeaderCell, { width: COL.net }]}>Καθ. Αξία</Text>
            <Text style={[s.tableHeaderCell, { width: COL.vatPct }]}>ΦΠΑ %</Text>
            <Text style={[s.tableHeaderCell, { width: COL.vat }]}>ΦΠΑ</Text>
            <Text style={[s.tableHeaderCell, { width: COL.total }]}>Σύνολο</Text>
          </View>
          <View style={s.tableRow}>
            <Text style={[s.tableCell, { width: COL.desc, textAlign: "left", paddingLeft: 8 }]}>{data.description}</Text>
            <Text style={[s.tableCell, { width: COL.qty }]}>1</Text>
            <Text style={[s.tableCell, { width: COL.price }]}>{fmt(data.netAmount)} &euro;</Text>
            <Text style={[s.tableCell, { width: COL.net }]}>{fmt(data.netAmount)} &euro;</Text>
            <Text style={[s.tableCell, { width: COL.vatPct }]}>{vatPct}%</Text>
            <Text style={[s.tableCell, { width: COL.vat }]}>{fmt(data.vatAmount)} &euro;</Text>
            <Text style={[s.tableCell, { width: COL.total }]}>{fmt(data.grossAmount)} &euro;</Text>
          </View>
        </View>

        {/* Totals */}
        <View style={s.totalsSection}>
          <View style={s.totalsRow}>
            <Text style={s.totalsLabel}>Καθαρή Αξία</Text>
            <Text style={s.totalsValue}>{fmt(data.netAmount)} &euro;</Text>
          </View>
          <View style={s.totalsRow}>
            <Text style={s.totalsLabel}>ΦΠΑ ({vatPct}%)</Text>
            <Text style={s.totalsValue}>{fmt(data.vatAmount)} &euro;</Text>
          </View>
          <View style={s.grandTotalRow}>
            <Text style={s.grandTotalLabel}>Πληρωτέο</Text>
            <Text style={s.grandTotalValue}>{fmt(data.grossAmount)} &euro;</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <View style={s.qrBox}>
            <Text style={s.qrText}>QR Code</Text>
            <Text style={[s.qrText, { marginTop: 2 }]}>MARK: {data.mark}</Text>
          </View>
          <View style={{ flex: 1, paddingHorizontal: 16 }}>
            <Text style={s.footerNote}>
              Η ευθύνη για το περιεχόμενο του παραστατικού ανήκει αποκλειστικά στον εκδότη αυτού.
            </Text>
            <Text style={s.footerNote}>Σελίδα 1 από 1</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 8, fontWeight: 700, color: PRIMARY }}>Salsa Rayo</Text>
            <Text style={{ fontSize: 7, color: GRAY }}>salsa-rayo.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  )

  return Buffer.from(await renderToBuffer(doc))
}
