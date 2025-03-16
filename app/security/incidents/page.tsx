"use client";

import { useState, useRef } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { SecuritySidebar } from "../_components/security-sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Clock,
  Download,
  FileText,
  Plus,
  Printer,
  Search,
} from "lucide-react";

// Mock data for previous incidents
const mockIncidents = [
  {
    id: "INC-001",
    title: "Unauthorized Access Attempt",
    date: "2025-03-15T10:30:00",
    location: "Main Entrance",
    type: "Security Breach",
    status: "Resolved",
    reportedBy: "Sam Security",
  },
  {
    id: "INC-002",
    title: "Visitor Altercation",
    date: "2025-03-14T15:45:00",
    location: "Parking Lot",
    type: "Disturbance",
    status: "Under Investigation",
    reportedBy: "Sam Security",
  },
  {
    id: "INC-003",
    title: "Property Damage",
    date: "2025-03-12T09:15:00",
    location: "Building B Lobby",
    type: "Vandalism",
    status: "Resolved",
    reportedBy: "Sam Security",
  },
  {
    id: "INC-004",
    title: "Fire Alarm Activation",
    date: "2025-03-10T14:20:00",
    location: "Building A, 3rd Floor",
    type: "Emergency",
    status: "Resolved",
    reportedBy: "System",
  },
  {
    id: "INC-005",
    title: "Suspicious Person",
    date: "2025-03-08T18:30:00",
    location: "South Gate",
    type: "Security Concern",
    status: "Resolved",
    reportedBy: "Sam Security",
  },
];

export default function IncidentsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("new");
  const [incidents, setIncidents] = useState(mockIncidents);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Form state for new incident
  const [newIncident, setNewIncident] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    location: "",
    type: "Security Breach",
    description: "",
    actionTaken: "",
    witnesses: "",
    involvedPersons: "",
  });

  // Filter incidents based on search query
  const filteredIncidents = incidents.filter(
    (incident) =>
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateIncident = () => {
    // Validate form
    if (
      !newIncident.title ||
      !newIncident.location ||
      !newIncident.description
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Create new incident
    const id = `INC-${String(incidents.length + 1).padStart(3, "0")}`;
    const dateTime = `${newIncident.date}T${convertTo24Hour(newIncident.time)}`;

    const incident = {
      id,
      title: newIncident.title,
      date: dateTime,
      location: newIncident.location,
      type: newIncident.type,
      status: "New",
      reportedBy: "Sam Security",
      description: newIncident.description,
      actionTaken: newIncident.actionTaken,
      witnesses: newIncident.witnesses,
      involvedPersons: newIncident.involvedPersons,
    };

    setIncidents([incident, ...incidents]);

    // Reset form
    setNewIncident({
      title: "",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      location: "",
      type: "Security Breach",
      description: "",
      actionTaken: "",
      witnesses: "",
      involvedPersons: "",
    });

    // Show success message
    toast({
      title: "Incident report created",
      description: `Incident report ${id} has been created successfully.`,
    });

    // Switch to history tab and select the new incident
    setActiveTab("history");
    setSelectedIncident(incident);
  };

  const handleExportPDF = () => {
    // In a real implementation, this would use a library like jsPDF or html2pdf
    // For this MVP, we'll simulate the export
    toast({
      title: "Exporting PDF",
      description: "The incident report is being exported as PDF.",
    });

    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "PDF Exported",
        description: "The incident report has been exported successfully.",
      });
    }, 1500);
  };

  const handlePrint = () => {
    // In a real implementation, this would use window.print() with proper styling
    toast({
      title: "Printing Report",
      description: "The incident report is being sent to the printer.",
    });
  };

  return (
    <DashboardShell sidebar={<SecuritySidebar />} allowedRoles={["security"]}>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Incident Reports
            </h1>
            <p className="text-muted-foreground">
              Create and manage security incident reports
            </p>
          </div>
          {activeTab === "history" && (
            <Button onClick={() => setActiveTab("new")}>
              <Plus className="mr-2 h-4 w-4" />
              New Incident
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="new">New Incident</TabsTrigger>
            <TabsTrigger value="history">Incident History</TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Incident Details</CardTitle>
                  <CardDescription>
                    Enter the details of the security incident
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Incident Title</Label>
                    <Input
                      id="title"
                      placeholder="Brief description of the incident"
                      value={newIncident.title}
                      onChange={(e) =>
                        setNewIncident({
                          ...newIncident,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="date"
                          type="date"
                          className="pl-10"
                          value={newIncident.date}
                          onChange={(e) =>
                            setNewIncident({
                              ...newIncident,
                              date: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="time"
                          type="time"
                          className="pl-10"
                          value={newIncident.time}
                          onChange={(e) =>
                            setNewIncident({
                              ...newIncident,
                              time: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Where the incident occurred"
                      value={newIncident.location}
                      onChange={(e) =>
                        setNewIncident({
                          ...newIncident,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Incident Type</Label>
                    <Select
                      value={newIncident.type}
                      onValueChange={(value) =>
                        setNewIncident({ ...newIncident, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select incident type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Security Breach">
                          Security Breach
                        </SelectItem>
                        <SelectItem value="Disturbance">Disturbance</SelectItem>
                        <SelectItem value="Vandalism">Vandalism</SelectItem>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                        <SelectItem value="Maintenance Issue">
                          Maintenance Issue
                        </SelectItem>
                        <SelectItem value="Suspicious Activity">
                          Suspicious Activity
                        </SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Incident Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Detailed description of what happened"
                      className="min-h-[100px]"
                      value={newIncident.description}
                      onChange={(e) =>
                        setNewIncident({
                          ...newIncident,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="action">Action Taken</Label>
                    <Textarea
                      id="action"
                      placeholder="Actions taken to address the incident"
                      value={newIncident.actionTaken}
                      onChange={(e) =>
                        setNewIncident({
                          ...newIncident,
                          actionTaken: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="witnesses">Witnesses</Label>
                    <Input
                      id="witnesses"
                      placeholder="Names of any witnesses"
                      value={newIncident.witnesses}
                      onChange={(e) =>
                        setNewIncident({
                          ...newIncident,
                          witnesses: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="involved">Persons Involved</Label>
                    <Input
                      id="involved"
                      placeholder="Names of persons involved"
                      value={newIncident.involvedPersons}
                      onChange={(e) =>
                        setNewIncident({
                          ...newIncident,
                          involvedPersons: e.target.value,
                        })
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleCreateIncident}>
                    Create Incident Report
                  </Button>
                </CardFooter>
              </Card>

              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Report Preview</CardTitle>
                  <CardDescription>
                    Preview how the incident report will appear
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    ref={reportRef}
                    className="border rounded-md p-6 space-y-4 min-h-[500px] bg-white text-black"
                  >
                    <div className="text-center border-b pb-4">
                      <h2 className="text-xl font-bold">INCIDENT REPORT</h2>
                      <p className="text-sm text-gray-600">
                        {newIncident.date
                          ? formatDate(newIncident.date)
                          : "Date"}{" "}
                        |{newIncident.time ? " " + newIncident.time : " Time"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-b pb-4">
                      <div>
                        <p className="text-sm font-semibold">Report ID:</p>
                        <p>
                          INC-{String(incidents.length + 1).padStart(3, "0")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Reported By:</p>
                        <p>Sam Security</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Incident Type:</p>
                        <p>{newIncident.type || "Type"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Location:</p>
                        <p>{newIncident.location || "Location"}</p>
                      </div>
                    </div>

                    <div className="space-y-4 border-b pb-4">
                      <div>
                        <p className="text-sm font-semibold">Incident Title:</p>
                        <p>{newIncident.title || "Title"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Description:</p>
                        <p className="whitespace-pre-line">
                          {newIncident.description ||
                            "Description of the incident"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 border-b pb-4">
                      <div>
                        <p className="text-sm font-semibold">Action Taken:</p>
                        <p className="whitespace-pre-line">
                          {newIncident.actionTaken ||
                            "Actions taken to address the incident"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold">Witnesses:</p>
                        <p>{newIncident.witnesses || "None"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          Persons Involved:
                        </p>
                        <p>{newIncident.involvedPersons || "None"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Incident History</CardTitle>
                  <CardDescription>
                    Browse and search past incident reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search incidents..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredIncidents.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                              No incidents found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredIncidents.map((incident) => (
                            <TableRow
                              key={incident.id}
                              className={
                                selectedIncident?.id === incident.id
                                  ? "bg-muted"
                                  : ""
                              }
                              onClick={() => setSelectedIncident(incident)}
                              style={{ cursor: "pointer" }}
                            >
                              <TableCell className="font-medium">
                                {incident.id}
                              </TableCell>
                              <TableCell>{incident.title}</TableCell>
                              <TableCell>{formatDate(incident.date)}</TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    incident.status === "Resolved"
                                      ? "bg-green-500"
                                      : incident.status ===
                                        "Under Investigation"
                                      ? "bg-amber-500"
                                      : "bg-blue-500"
                                  }
                                >
                                  {incident.status}
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

              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Incident Details</CardTitle>
                      <CardDescription>
                        View and export incident report
                      </CardDescription>
                    </div>
                    {selectedIncident && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePrint}
                        >
                          <Printer className="mr-2 h-4 w-4" />
                          Print
                        </Button>
                        <Button size="sm" onClick={handleExportPDF}>
                          <Download className="mr-2 h-4 w-4" />
                          Export PDF
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedIncident ? (
                    <div className="border rounded-md p-6 space-y-4 bg-white text-black">
                      <div className="text-center border-b pb-4">
                        <h2 className="text-xl font-bold">INCIDENT REPORT</h2>
                        <p className="text-sm text-gray-600">
                          {formatDate(selectedIncident.date)} |{" "}
                          {formatTime(selectedIncident.date)}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-b pb-4">
                        <div>
                          <p className="text-sm font-semibold">Report ID:</p>
                          <p>{selectedIncident.id}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Reported By:</p>
                          <p>{selectedIncident.reportedBy}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            Incident Type:
                          </p>
                          <p>{selectedIncident.type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Location:</p>
                          <p>{selectedIncident.location}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Status:</p>
                          <Badge
                            className={
                              selectedIncident.status === "Resolved"
                                ? "bg-green-500"
                                : selectedIncident.status ===
                                  "Under Investigation"
                                ? "bg-amber-500"
                                : "bg-blue-500"
                            }
                          >
                            {selectedIncident.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-4 border-b pb-4">
                        <div>
                          <p className="text-sm font-semibold">
                            Incident Title:
                          </p>
                          <p>{selectedIncident.title}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Description:</p>
                          <p className="whitespace-pre-line">
                            {selectedIncident.description ||
                              "A suspicious individual attempted to enter the building using an expired access pass. Security personnel intervened and the individual left the premises without incident."}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 border-b pb-4">
                        <div>
                          <p className="text-sm font-semibold">Action Taken:</p>
                          <p className="whitespace-pre-line">
                            {selectedIncident.actionTaken ||
                              "The individual was asked to leave the premises. The incident was logged and the resident whose pass was being used was notified."}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold">Witnesses:</p>
                          <p>{selectedIncident.witnesses || "None"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            Persons Involved:
                          </p>
                          <p>
                            {selectedIncident.involvedPersons ||
                              "Unknown individual attempting to use expired pass"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 pt-4 border-t">
                        <p className="text-xs text-gray-500 text-center">
                          This is an official incident report generated by Sleek
                          Entry Access system. Report generated on{" "}
                          {new Date().toLocaleDateString()} at{" "}
                          {new Date().toLocaleTimeString()}.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Select an incident to view details
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}

// Helper functions
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function convertTo24Hour(timeString: string) {
  const [time, modifier] = timeString.split(" ");
  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = String(Number.parseInt(hours, 10) + 12);
  }

  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;
}
