"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, X } from "lucide-react"

interface QRScannerProps {
  onScan: (result: string) => void
  onClose?: () => void
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isScanning) {
      // In a real implementation, we would use a library like html5-qrcode
      // For this MVP, we'll simulate scanning after a delay
      const timer = setTimeout(() => {
        // Simulate a successful scan
        const mockQrValue = `VISITOR-${Math.floor(Math.random() * 1000000)}`
        onScan(mockQrValue)
        setIsScanning(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isScanning, onScan])

  const startScanning = () => {
    setError(null)
    setIsScanning(true)
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <div className="flex justify-end mb-2">
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden">
            {isScanning ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-pulse text-center">
                    <p>Scanning...</p>
                    <p className="text-sm text-muted-foreground mt-2">Position the QR code within the frame</p>
                  </div>
                </div>
                {/* Scanning animation */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary animate-[scan_2s_ease-in-out_infinite]" />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button onClick={startScanning} disabled={isScanning} className="w-full">
            {isScanning ? "Scanning..." : "Scan QR Code"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

