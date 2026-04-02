-- Consolidate multiple subscriptions per student into one (keep the newest)
-- For each student with duplicates: move transactions to the kept sub, delete old subs

-- Step 1: Move transactions from old subscriptions to the newest one per student
UPDATE "Transaction" t
SET "subscriptionId" = kept.id
FROM (
  SELECT DISTINCT ON ("studentId") id, "studentId"
  FROM "Subscription"
  ORDER BY "studentId", "expiresAt" DESC
) kept
JOIN "Subscription" old ON old."studentId" = kept."studentId" AND old.id != kept.id
WHERE t."subscriptionId" = old.id;

-- Step 2: Delete the old duplicate subscriptions (now orphaned)
DELETE FROM "Subscription" s
WHERE EXISTS (
  SELECT 1 FROM "Subscription" newer
  WHERE newer."studentId" = s."studentId"
    AND newer."expiresAt" > s."expiresAt"
);

-- Step 3: Deactivate expired subscriptions
UPDATE "Subscription"
SET "isActive" = false
WHERE "expiresAt" < NOW() AND "isActive" = true;
