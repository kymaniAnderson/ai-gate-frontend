"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { ResidentSidebar } from "../_components/resident-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import Link from "next/link"

export default function CreateAccessPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [accessType, setAccessType] = useState("time-bound")
  const [accessMethod, setAccessMethod] = useState("qr-pin")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would send data to the server
    toast({
      title: "Access created",
      description: "The visitor access has been created successfully.",
    })

    // Redirect to dashboard
    router.push("/resident/dashboard")
  }

  return (
    <DashboardShell sidebar={<ResidentSidebar />} allowedRoles={["resident"]}>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/resident/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Create New Visitor Access</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Visitor Information</CardTitle>
              <CardDescription>Enter the details for your visitor's access pass</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="visitor-name">Visitor Name</Label>
                <Input id="visitor-name" placeholder="Enter visitor name" required />
              </div>

              <div className="space-y-2">
                <Label>Access Type</Label>
                <RadioGroup value={accessType} onValueChange={setAccessType} className="grid gap-4 pt-2">
                  <div className="flex items-start space-x-3 space-y-0">
                    <RadioGroupItem value="time-bound" id="time-bound" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="time-bound" className="font-medium">
                        Time-bound
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Valid for a specific time period (e.g., 3 PM - 6 PM today)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-y-0">
                    <RadioGroupItem value="date-range" id="date-range" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="date-range" className="font-medium">
                        Date Range
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Valid for a range of dates (e.g., March 15 - March 20)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-y-0">
                    <RadioGroupItem value="usage-limit" id="usage-limit" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="usage-limit" className="font-medium">
                        Usage Limit
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Valid for a specific number of entries (e.g., 3 entries)
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {accessType === "time-bound" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="date" type="date" className="pl-10" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="time-from">From</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="time-from" type="time" className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time-to">To</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="time-to" type="time" className="pl-10" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {accessType === "date-range" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date-from">From Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="date-from" type="date" className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-to">To Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="date-to" type="date" className="pl-10" />
                    </div>
                  </div>
                </div>
              )}

              {accessType === "usage-limit" && (
                <div className="space-y-2">
                  <Label htmlFor="usage-count">Number of Entries</Label>
                  <Select defaultValue="3">
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of entries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 entry</SelectItem>
                      <SelectItem value="2">2 entries</SelectItem>
                      <SelectItem value="3">3 entries</SelectItem>
                      <SelectItem value="5">5 entries</SelectItem>
                      <SelectItem value="10">10 entries</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Access Method</Label>
                <RadioGroup value={accessMethod} onValueChange={setAccessMethod} className="grid gap-4 pt-2">
                  <div className="flex items-start space-x-3 space-y-0">
                    <RadioGroupItem value="qr-pin" id="qr-pin" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="qr-pin" className="font-medium">
                        QR Code + PIN
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Visitor can use QR code or enter PIN at the entrance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-y-0">
                    <RadioGroupItem value="pin-only" id="pin-only" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="pin-only" className="font-medium">
                        PIN Only
                      </Label>
                      <p className="text-sm text-muted-foreground">Visitor will only use a PIN code for entry</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="notifications" className="flex flex-col space-y-1">
                  <span>Receive Notifications</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Get notified when your visitor enters
                  </span>
                </Label>
                <Switch id="notifications" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/resident/dashboard">Cancel</Link>
              </Button>
              <Button type="submit">Create Access Pass</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardShell>
  )
}

