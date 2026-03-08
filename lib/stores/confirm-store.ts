import { create } from "zustand"

type ConfirmVariant = "destructive" | "default"

interface ConfirmOpts {
  title: string
  description: string
  actionLabel?: string
  variant?: ConfirmVariant
  onConfirm: () => void | Promise<void>
}

interface ConfirmState {
  open: boolean
  title: string
  description: string
  actionLabel: string
  variant: ConfirmVariant
  onConfirm: (() => void | Promise<void>) | null
  confirm: (opts: ConfirmOpts) => void
  close: () => void
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  open: false,
  title: "",
  description: "",
  actionLabel: "Delete",
  variant: "destructive",
  onConfirm: null,
  confirm: ({ title, description, actionLabel, variant, onConfirm }) =>
    set({ open: true, title, description, actionLabel: actionLabel ?? "Delete", variant: variant ?? "destructive", onConfirm }),
  close: () => set({ open: false, onConfirm: null }),
}))
