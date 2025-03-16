"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PinDisplayProps {
  pin: string
  className?: string
}

export function PinDisplay({ pin, className }: PinDisplayProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex justify-center">
          <div className="grid grid-cols-6 gap-2">
            {pin.split("").map((digit, index) => (
              <div
                key={index}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-md border border-input bg-background text-xl font-semibold",
                )}
              >
                {digit}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

