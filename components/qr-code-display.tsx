"use client"

import { useEffect, useRef } from "react"
import QRCode from "qrcode"
import { Card, CardContent } from "@/components/ui/card"

interface QRCodeDisplayProps {
  value: string
  size?: number
  className?: string
}

export function QRCodeDisplay({ value, size = 200, className }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(
        canvasRef.current,
        value,
        {
          width: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        (error) => {
          if (error) console.error("Error generating QR code:", error)
        },
      )
    }
  }, [value, size])

  return (
    <Card className={className}>
      <CardContent className="flex justify-center p-6">
        <canvas ref={canvasRef} />
      </CardContent>
    </Card>
  )
}

