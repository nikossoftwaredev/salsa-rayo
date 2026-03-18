-- AlterTable: Add Stripe fields
ALTER TABLE "Student" ADD COLUMN "stripeCustomerId" TEXT;

ALTER TABLE "Subscription" ADD COLUMN "stripePriceId" TEXT,
ADD COLUMN "stripeStatus" TEXT,
ADD COLUMN "stripeSubscriptionId" TEXT;

ALTER TABLE "Transaction" ADD COLUMN "stripeInvoiceId" TEXT,
ADD COLUMN "stripePaymentIntentId" TEXT;

-- CreateTable: Invoice
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT,
    "mark" TEXT,
    "uid" TEXT,
    "authCode" TEXT,
    "qrUrl" TEXT,
    "series" TEXT NOT NULL,
    "sequenceNumber" INTEGER NOT NULL,
    "invoiceType" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "netAmount" DOUBLE PRECISION NOT NULL,
    "vatAmount" DOUBLE PRECISION NOT NULL,
    "grossAmount" DOUBLE PRECISION NOT NULL,
    "vatCategory" INTEGER NOT NULL,
    "paymentMethodCode" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "aadeErrors" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "lastRetryAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancellationMark" TEXT,
    "customerVat" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable: InvoiceSequence
CREATE TABLE "InvoiceSequence" (
    "id" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvoiceSequence_pkey" PRIMARY KEY ("id")
);

-- CreateIndexes
CREATE UNIQUE INDEX "Invoice_transactionId_key" ON "Invoice"("transactionId");
CREATE UNIQUE INDEX "Invoice_mark_key" ON "Invoice"("mark");
CREATE UNIQUE INDEX "Invoice_uid_key" ON "Invoice"("uid");
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");
CREATE INDEX "Invoice_mark_idx" ON "Invoice"("mark");
CREATE UNIQUE INDEX "InvoiceSequence_series_key" ON "InvoiceSequence"("series");
CREATE UNIQUE INDEX "Student_stripeCustomerId_key" ON "Student"("stripeCustomerId");
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");
CREATE UNIQUE INDEX "Transaction_stripePaymentIntentId_key" ON "Transaction"("stripePaymentIntentId");

-- Fix orphaned Transaction references before adding FKs
UPDATE "Transaction" SET "studentId" = NULL WHERE "studentId" IS NOT NULL AND "studentId" NOT IN (SELECT id FROM "Student");
UPDATE "Transaction" SET "subscriptionId" = NULL WHERE "subscriptionId" IS NOT NULL AND "subscriptionId" NOT IN (SELECT id FROM "Subscription");

-- AddForeignKeys (drop first in case they exist from db push)
ALTER TABLE "Transaction" DROP CONSTRAINT IF EXISTS "Transaction_studentId_fkey";
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Transaction" DROP CONSTRAINT IF EXISTS "Transaction_subscriptionId_fkey";
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
