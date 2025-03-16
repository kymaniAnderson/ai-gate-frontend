"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface PinInputProps {
  length?: number
  onComplete?: (pin: string) => void
  className?: string
}

export function PinInput({ length = 6, onComplete, className }: PinInputProps) {
  const [pin, setPin] = useState<string[]>(Array(length).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus the first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value.slice(-1) // Only take the last character

    setPin(newPin)

    // Auto-focus next input if value is entered
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }

    // Check if PIN is complete
    const newPinString = newPin.join("")
    if (newPinString.length === length && !newPinString.includes("") && onComplete) {
      onComplete(newPinString)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !pin[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Only proceed if pasted content is all digits and not longer than our pin length
    if (!/^\d+$/.test(pastedData) || pastedData.length > length) return

    const newPin = [...pin]

    // Fill the pin array with the pasted digits
    for (let i = 0; i < Math.min(pastedData.length, length); i++) {
      newPin[i] = pastedData[i]
    }

    setPin(newPin)

    // Focus the appropriate input
    const focusIndex = Math.min(pastedData.length, length - 1)
    if (inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex].focus()
    }

    // Check if PIN is complete
    const newPinString = newPin.join("")
    if (newPinString.length === length && !newPinString.includes("") && onComplete) {
      onComplete(newPinString)
    }
  }

  return (
    <div className={cn("flex justify-center gap-2", className)}>
      {pin.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          className="h-12 w-12 text-center text-lg"
        />
      ))}
    </div>
  )
}

