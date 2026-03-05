"use client";

import { useDialogStore } from "@/lib/stores/dialog-store";

import { StudentDialog } from "@/components/admin/students/StudentDialog";

export const DialogProvider = () => {
  const currentDialog = useDialogStore((state) => state.currentDialog);

  return (
    <>{currentDialog === "StudentDialog" && <StudentDialog />}</>
  );
};
