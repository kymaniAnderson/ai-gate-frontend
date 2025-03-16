"use client"

import type React from "react"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { SecuritySidebar } from "../_components/security-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QRScanner } from "@/components/qr-scanner"
import { PinInput } from "@/components/pin-input"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, CheckCircle, Clock, QrCode, ShieldAlert, XCircle } from "lucide-react"
import { mockVisitors } from "@/lib/mock-data"

export default function SecurityDashboard() {
  const { toast } = useToast()
  const [showScanner, setShowScanner] = useState(false)
  const [recentEntries, setRecentEntries] = useState<
    {
      id: string
      name: string
      time: string
      status: "approved" | "denied"
    }[]
  >([
    {
      id: "1",
      name: "John Smith",
      time: "10:30 AM",
      status: "approved",
    },
    {
      id: "2",
      name: "Jane Doe",
      time: "11:15 AM",
      status: "approved",
    },
    {
      id: "3",
      name: "Unknown Visitor",
      time: "11:45 AM",
      status: "denied",
    },
  ])

  const handleScan = (result: string) => {
    // In a real app, this would validate the QR code with the server
    const visitorId = result.split("-")[1]
    const visitor = mockVisitors.find((v) => v.id === visitorId)

    if (visitor && visitor.status === "active") {
      toast({
        title: "Access Granted",
        description: `${visitor.name} has been granted access.`,
        variant: "default",
      })

      setRecentEntries([
        {
          id: Date.now().toString(),
          name: visitor.name,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "approved",
        },
        ...recentEntries,
      ])
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid or expired access pass.",
        variant: "destructive",
      })

      setRecentEntries([
        {
          id: Date.now().toString(),
          name: "Unknown Visitor",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "denied",
        },
        ...recentEntries,
      ])
    }

    setShowScanner(false)
  }

  const handlePinComplete = (pin: string) => {
    // In a real app, this would validate the PIN with the server
    const visitor = mockVisitors.find((v) => v.pin === pin)

    if (visitor && visitor.status === "active") {
      toast({
        title: "Access Granted",
        description: `${visitor.name} has been granted access.`,
        variant: "default",
      })

      setRecentEntries([
        {
          id: Date.now().toString(),
          name: visitor.name,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "approved",
        },
        ...recentEntries,
      ])
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid or expired PIN.",
        variant: "destructive",
      })

      setRecentEntries([
        {
          id: Date.now().toString(),
          name: "Unknown Visitor",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "denied",
        },
        ...recentEntries,
      ])
    }
  }

  return (
    <DashboardShell sidebar={<SecuritySidebar />} allowedRoles={["security"]}>
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
          <p className="text-muted-foreground">Verify visitor access and manage entry logs</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Verification</CardTitle>
              <CardDescription>Scan QR code or enter PIN to verify visitor access</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="qr">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="qr">
                    <QrCode className="mr-2 h-4 w-4" />
                    QR Code
                  </TabsTrigger>
                  <TabsTrigger value="pin">
                    <Clock className="mr-2 h-4 w-4" />
                    PIN Entry
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="qr" className="pt-4">
                  {showScanner ? (
                    <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 gap-4">
                      <QrCode className="h-16 w-16 text-muted-foreground" />
                      <p className="text-center text-muted-foreground">
                        Scan a visitor's QR code to verify their access
                      </p>
                      <Button onClick={() => setShowScanner(true)}>Open Scanner</Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="pin" className="pt-4">
                  <div className="flex flex-col items-center justify-center py-8 gap-6">
                    <p className="text-center text-muted-foreground">Enter the visitor's 6-digit PIN code</p>
                    <PinInput onComplete={handlePinComplete} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Entries</CardTitle>
              <CardDescription>Log of recent visitor verifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEntries.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No recent entries</p>
                ) : (
                  recentEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 rounded-md border">
                      <div className="flex items-center gap-3">
                        {entry.status === "approved" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                        <div>
                          <p className="font-medium">{entry.name}</p>
                          <p className="text-sm text-muted-foreground">{entry.time}</p>
                        </div>
                      </div>
                      <Badge variant={entry.status === "approved" ? "default" : "destructive"}>
                        {entry.status === "approved" ? "Approved" : "Denied"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Security Alerts</CardTitle>
            <CardDescription>Recent security events that require attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-md border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <p className="font-medium">Multiple Failed Access Attempts</p>
                  <p className="text-sm text-muted-foreground">3 failed PIN attempts at Main Entrance (09:45 AM)</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-md border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <p className="font-medium">Emergency Override Activated</p>
                  <p className="text-sm text-muted-foreground">South Gate emergency override by Admin (08:30 AM)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

function Badge({
  children,
  variant,
  className,
}: {
  children: React.ReactNode
  variant?: "default" | "secondary" | "destructive" | "outline"
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variant === "default" && "bg-primary text-primary-foreground",
        variant === "secondary" && "bg-secondary text-secondary-foreground",
        variant === "destructive" && "bg-destructive text-destructive-foreground",
        variant === "outline" && "border border-input bg-background",
        className,
      )}
    >
      {children}
    </span>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

