"use client"

import { useState } from "react"
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"

interface SensitiveValueProps {
  value: string
}

export const SensitiveValue = ({ value }: SensitiveValueProps) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <span className={visible ? "" : "blur-md select-none"}>{value}</span>
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        {visible ? <IoEyeOffOutline size={14} /> : <IoEyeOutline size={14} />}
      </button>
    </div>
  )
}
