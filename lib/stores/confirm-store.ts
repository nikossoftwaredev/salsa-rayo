import { create } from "zustand"

interface ConfirmOpts {
  title: string
  description: string
  actionLabel?: string
  onConfirm: () => void
}

interface ConfirmState {
  open: boolean
  title: string
  description: string
  actionLabel: string
  onConfirm: (() => void) | null
  confirm: (opts: ConfirmOpts) => void
  close: () => void
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  open: false,
  title: "",
  description: "",
  actionLabel: "Delete",
  onConfirm: null,
  confirm: ({ title, description, actionLabel, onConfirm }) =>
    set({ open: true, title, description, actionLabel: actionLabel ?? "Delete", onConfirm }),
  close: () => set({ open: false, onConfirm: null }),
}))
