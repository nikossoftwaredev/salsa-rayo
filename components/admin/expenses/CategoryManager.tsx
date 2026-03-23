"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { type ExpenseCategory } from "@/lib/db"
import { createExpenseCategory } from "@/server-actions/expenses/create-expense-category"
import { deleteExpenseCategory } from "@/server-actions/expenses/delete-expense-category"

interface CategoryManagerProps {
  categories: ExpenseCategory[]
}

export const CategoryManager = ({ categories }: CategoryManagerProps) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!newName.trim()) return
    setLoading(true)

    const result = await createExpenseCategory(newName)
    if (result.success) {
      toast.success("Category created", { description: newName.trim() })
      setNewName("")
      router.refresh()
    } else {
      toast.error(result.error)
    }

    setLoading(false)
  }

  const handleDelete = async (category: ExpenseCategory) => {
    const result = await deleteExpenseCategory(category.id)
    if (result.success) {
      toast.success("Category deleted", { description: category.name })
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Categories
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Expense Categories</DialogTitle>
          <DialogDescription>
            Add or remove expense categories.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="New category name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleCreate()
                }
              }}
              size="sm"
            />
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={loading || !newName.trim()}
            >
              <Plus className="size-4" />
            </Button>
          </div>

          <div className="max-h-[240px] overflow-y-auto space-y-1">
            {categories.length === 0 && (
              <p className="text-sm text-muted-foreground py-2 text-center">
                No categories yet
              </p>
            )}
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between rounded-md border px-3 py-2"
              >
                <span className="text-sm">{cat.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(cat)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
