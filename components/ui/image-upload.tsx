"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Loader2, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useConfirmStore } from "@/lib/stores/confirm-store"
import { uploadImage, removeImage } from "@/server-actions/upload-image"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  className?: string
  size?: number
  rounded?: "full" | "md" | "lg"
}

export const ImageUpload = ({
  value,
  onChange,
  folder = "general",
  className,
  size = 120,
  rounded = "lg",
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [removing, setRemoving] = useState(false)
  const { confirm } = useConfirmStore()
  const inputRef = useRef<HTMLInputElement>(null)

  const roundedClass = rounded === "full" ? "rounded-full" : rounded === "md" ? "rounded-md" : "rounded-lg"

  const handleUpload = useCallback(async (file: File) => {
    setError(null)
    setUploading(true)
    setProgress(0)

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90))
    }, 200)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)

      const result = await uploadImage(formData)

      clearInterval(progressInterval)
      setProgress(100)

      if (!result.success) {
        setError(result.error)
        return
      }

      onChange(result.url)
    } catch {
      setError("Upload failed. Please try again.")
    } finally {
      clearInterval(progressInterval)
      setUploading(false)
      setProgress(0)
    }
  }, [folder, onChange])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
    if (inputRef.current) inputRef.current.value = ""
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith("image/")) handleUpload(file)
  }

  const handleRemove = () => {
    if (!value) return
    confirm({
      title: "Remove image?",
      description: "The image will be deleted. You can upload a new one afterwards.",
      actionLabel: "Remove",
      onConfirm: async () => {
        setRemoving(true)
        try {
          await removeImage(value)
          onChange("")
        } finally {
          setRemoving(false)
        }
      },
    })
  }

  if (value) {
    return (
      <div className={cn("relative inline-block", className)} style={{ width: size, height: size }}>
        <Image
          src={value}
          alt="Uploaded image"
          fill
          className={cn("object-cover", roundedClass)}
        />
        {/* Always visible: hover-only controls are unreachable on touch screens */}
        <Button
          type="button"
          variant="destructive"
          size="icon-sm"
          onClick={handleRemove}
          disabled={removing}
          aria-label="Remove image"
          className="absolute -right-2 -top-2 rounded-full shadow-md"
        >
          {removing ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      <div
        className={cn(
          "relative flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/40 bg-card cursor-pointer transition-all duration-200",
          "hover:border-primary/60 hover:bg-card/80",
          dragOver && "border-primary bg-primary/10",
          uploading && "pointer-events-none opacity-60"
        )}
        style={{ width: size, height: size }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {uploading ? (
          <span className="text-lg font-medium text-primary">{progress}%</span>
        ) : (
          <>
            <Plus className="size-12 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Add Image</span>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 cursor-pointer opacity-0"
          disabled={uploading}
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
