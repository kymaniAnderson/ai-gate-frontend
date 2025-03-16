"use client";

import type React from "react";

import { DashboardShell } from "@/components/dashboard-shell";
import { AdminSidebar } from "../_components/admin-sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AlertTriangle,
  Building,
  CalendarDays,
  ShieldCheck,
  Users,
} from "lucide-react";

const visitorData = [
  { day: "Mon", count: 12 },
  { day: "Tue", count: 18 },
  { day: "Wed", count: 15 },
  { day: "Thu", count: 22 },
  { day: "Fri", count: 30 },
  { day: "Sat", count: 25 },
  { day: "Sun", count: 10 },
];

const securityEvents = [
  {
    id: "1",
    title: "Multiple Failed Access Attempts",
    description: "3 failed PIN attempts at Main Entrance",
    time: "09:45 AM",
    severity: "warning",
  },
  {
    id: "2",
    title: "Emergency Override Activated",
    description: "South Gate emergency override by Admin",
    time: "08:30 AM",
    severity: "critical",
  },
  {
    id: "3",
    title: "New Resident Added",
    description: "John Smith added to Building A",
    time: "Yesterday",
    severity: "info",
  },
];

const residents = [
  {
    id: "1",
    name: "John Smith",
    unit: "A-101",
    activeVisitors: 2,
    status: "active",
  },
  {
    id: "2",
    name: "Jane Doe",
    unit: "B-205",
    activeVisitors: 1,
    status: "active",
  },
  {
    id: "3",
    name: "Robert Johnson",
    unit: "C-310",
    activeVisitors: 0,
    status: "inactive",
  },
];

export default function AdminDashboard() {
  return (
    <DashboardShell sidebar={<AdminSidebar />} allowedRoles={["admin"]}>
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of property access and security
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <StatsCard
            title="Total Residents"
            value="42"
            description="Across all properties"
            icon={<Users className="h-5 w-5 text-blue-600" />}
          />
          <StatsCard
            title="Active Visitors"
            value="18"
            description="Currently on premises"
            icon={<CalendarDays className="h-5 w-5 text-green-600" />}
          />
          <StatsCard
            title="Security Alerts"
            value="2"
            description="Requiring attention"
            icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Traffic</CardTitle>
              <CardDescription>
                Weekly visitor entries across all properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    count: {
                      label: "Visitors",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={visitorData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="count"
                        fill="var(--color-count)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Events</CardTitle>
              <CardDescription>
                Recent security alerts and events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 rounded-md border"
                  >
                    <div className="mt-0.5">
                      {event.severity === "critical" ? (
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      ) : event.severity === "warning" ? (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      ) : (
                        <ShieldCheck className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{event.title}</p>
                        <span className="text-xs text-muted-foreground">
                          {event.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resident Overview</CardTitle>
            <CardDescription>
              Manage resident access and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active">
              <TabsList>
                <TabsTrigger value="active">Active Residents</TabsTrigger>
                <TabsTrigger value="inactive">Inactive Residents</TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="mt-4">
                <div className="space-y-4">
                  {residents
                    .filter((resident) => resident.status === "active")
                    .map((resident) => (
                      <div
                        key={resident.id}
                        className="flex items-center justify-between p-3 rounded-md border"
                      >
                        <div className="flex items-center gap-3">
                          <Building className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{resident.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Unit: {resident.unit}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-right">
                            <p>Active Visitors</p>
                            <p className="font-medium">
                              {resident.activeVisitors}
                            </p>
                          </div>
                          <Badge className="bg-green-500">Active</Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="inactive" className="mt-4">
                <div className="space-y-4">
                  {residents
                    .filter((resident) => resident.status === "inactive")
                    .map((resident) => (
                      <div
                        key={resident.id}
                        className="flex items-center justify-between p-3 rounded-md border"
                      >
                        <div className="flex items-center gap-3">
                          <Building className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{resident.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Unit: {resident.unit}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-right">
                            <p>Active Visitors</p>
                            <p className="font-medium">
                              {resident.activeVisitors}
                            </p>
                          </div>
                          <Badge variant="secondary">Inactive</Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

function StatsCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
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
  );
}
