-- AlterTable Student
ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT;

-- AlterTable Subscription
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "stripePriceId" TEXT;
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "stripeStatus" TEXT;
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "stripeSubscriptionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Student_stripeCustomerId_key" ON "Student"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- Fix orphaned Transaction references before adding FK
UPDATE "Transaction" SET "subscriptionId" = NULL WHERE "subscriptionId" IS NOT NULL AND "subscriptionId" NOT IN (SELECT id FROM "Subscription");

-- AddForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT IF EXISTS "Transaction_subscriptionId_fkey";
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
