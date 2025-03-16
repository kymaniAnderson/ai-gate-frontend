"use client"

import type React from "react"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { ResidentSidebar } from "../_components/resident-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, Users } from "lucide-react"
import Link from "next/link"
import { VisitorList } from "../_components/visitor-list"
import { mockVisitors } from "@/lib/mock-data"

export default function ResidentDashboard() {
  const [activeVisitors, setActiveVisitors] = useState(mockVisitors.filter((visitor) => visitor.status === "active"))
  const [pastVisitors, setPastVisitors] = useState(mockVisitors.filter((visitor) => visitor.status === "expired"))

  return (
    <DashboardShell sidebar={<ResidentSidebar />} allowedRoles={["resident"]}>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Manage your visitors and access passes</p>
          </div>
          <Button asChild>
            <Link href="/resident/create-access">Create New Visitor Access</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <StatsCard
            title="Active Passes"
            value={activeVisitors.length.toString()}
            description="Current visitor passes"
            icon={<Users className="h-5 w-5 text-blue-600" />}
          />
          <StatsCard
            title="Today's Entries"
            value="3"
            description="Visitors today"
            icon={<CalendarDays className="h-5 w-5 text-green-600" />}
          />
          <StatsCard
            title="Upcoming"
            value="2"
            description="Scheduled for tomorrow"
            icon={<Clock className="h-5 w-5 text-amber-600" />}
          />
        </div>

        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">
              Active Visitors
              <Badge variant="secondary" className="ml-2">
                {activeVisitors.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="past">
              Past Visitors
              <Badge variant="secondary" className="ml-2">
                {pastVisitors.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4">
            <VisitorList
              visitors={activeVisitors}
              onRevokeAccess={(id) => {
                const visitor = activeVisitors.find((v) => v.id === id)
                if (visitor) {
                  visitor.status = "revoked"
                  setActiveVisitors(activeVisitors.filter((v) => v.id !== id))
                  setPastVisitors([...pastVisitors, visitor])
                }
              }}
            />
          </TabsContent>
          <TabsContent value="past" className="mt-4">
            <VisitorList visitors={pastVisitors} isPast />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}

function StatsCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

