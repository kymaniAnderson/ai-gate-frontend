"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { ResidentSidebar } from "../_components/resident-sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

// Mock data for access logs
const mockAccessLogs = [
  {
    id: "log1",
    visitorName: "John Guest",
    entryTime: "2025-03-15T10:30:00",
    exitTime: "2025-03-15T11:45:00",
    accessMethod: "QR Code",
    status: "approved",
  },
  {
    id: "log2",
    visitorName: "Jane Visitor",
    entryTime: "2025-03-15T11:15:00",
    exitTime: null,
    accessMethod: "PIN",
    status: "approved",
  },
  {
    id: "log3",
    visitorName: "Unknown Visitor",
    entryTime: "2025-03-15T11:45:00",
    exitTime: null,
    accessMethod: "QR Code",
    status: "denied",
    reason: "Expired access pass",
  },
  {
    id: "log4",
    visitorName: "Alice Williams",
    entryTime: "2025-03-15T12:30:00",
    exitTime: "2025-03-15T14:15:00",
    accessMethod: "QR Code",
    status: "approved",
  },
  {
    id: "log5",
    visitorName: "Bob Brown",
    entryTime: "2025-03-14T13:45:00",
    exitTime: "2025-03-14T15:30:00",
    accessMethod: "PIN",
    status: "approved",
  },
  {
    id: "log6",
    visitorName: "Carol Davis",
    entryTime: "2025-03-14T14:30:00",
    exitTime: "2025-03-14T16:45:00",
    accessMethod: "Manual",
    status: "approved",
  },
  {
    id: "log7",
    visitorName: "David Wilson",
    entryTime: "2025-03-13T09:15:00",
    exitTime: "2025-03-13T10:30:00",
    accessMethod: "QR Code",
    status: "approved",
  },
];

export default function ResidentLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter logs based on search query and filters
  const filteredLogs = mockAccessLogs.filter((log) => {
    // Search filter
    const matchesSearch = log.visitorName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Date filter
    let matchesDate = true;
    if (dateFilter === "today") {
      const today = new Date().toISOString().split("T")[0];
      matchesDate = log.entryTime.startsWith(today);
    } else if (dateFilter === "yesterday") {
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];
      matchesDate = log.entryTime.startsWith(yesterday);
    } else if (dateFilter === "week") {
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      matchesDate = log.entryTime >= weekAgo;
    }

    // Status filter
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;

    return matchesSearch && matchesDate && matchesStatus;
  });

  return (
    <DashboardShell sidebar={<ResidentSidebar />} allowedRoles={["resident"]}>
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Access Logs</h1>
          <p className="text-muted-foreground">
            View visitor entry and exit records for your residence
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>Visitor History</CardTitle>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search visitors..."
                    className="w-full sm:w-[200px] pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="denied">Denied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <CardDescription>
              Records of visitor entries and exits for your residence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visitor</TableHead>
                    <TableHead>Entry Time</TableHead>
                    <TableHead>Exit Time</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No access logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">
                          {log.visitorName}
                        </TableCell>
                        <TableCell>{formatDateTime(log.entryTime)}</TableCell>
                        <TableCell>
                          {log.exitTime
                            ? formatDateTime(log.exitTime)
                            : "Still on premises"}
                        </TableCell>
                        <TableCell>{log.accessMethod}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              log.status === "approved"
                                ? "bg-green-500"
                                : "bg-destructive"
                            }
                          >
                            {log.status === "approved" ? "Approved" : "Denied"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

function formatDateTime(dateTimeString: string) {
  const date = new Date(dateTimeString);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
