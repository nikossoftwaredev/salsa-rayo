-- CreateTable
CREATE TABLE "_SubscriptionScheduleEntries" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SubscriptionScheduleEntries_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SubscriptionScheduleEntries_B_index" ON "_SubscriptionScheduleEntries"("B");

-- AddForeignKey
ALTER TABLE "_SubscriptionScheduleEntries" ADD CONSTRAINT "_SubscriptionScheduleEntries_A_fkey" FOREIGN KEY ("A") REFERENCES "ScheduleEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubscriptionScheduleEntries" ADD CONSTRAINT "_SubscriptionScheduleEntries_B_fkey" FOREIGN KEY ("B") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

