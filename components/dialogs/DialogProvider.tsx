"use client";

import { useDialogStore } from "@/lib/stores/dialog-store";

import { StudentDialog } from "@/components/admin/students/StudentDialog";
import { InstructorDialog } from "@/components/admin/instructors/InstructorDialog";
import { ScheduleEntryDialog } from "@/components/admin/schedule/ScheduleEntryDialog";
import { PaymentDialog } from "@/components/admin/students/PaymentDialog";
import { TransactionHistoryDialog } from "@/components/admin/students/TransactionHistoryDialog";
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog";

export const DialogProvider = () => {
  const currentDialog = useDialogStore((state) => state.currentDialog);

  return (
    <>
      {currentDialog === "StudentDialog" && <StudentDialog />}
      {currentDialog === "PaymentDialog" && <PaymentDialog />}
      {currentDialog === "TransactionHistoryDialog" && <TransactionHistoryDialog />}
      {currentDialog === "InstructorDialog" && <InstructorDialog />}
      {currentDialog === "ScheduleEntryDialog" && <ScheduleEntryDialog />}
      <ConfirmDialog />
    </>
  );
};
