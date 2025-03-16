"use client";

import type React from "react";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { AdminSidebar } from "../_components/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building,
  Check,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  User,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for residents
const mockResidents = [
  {
    id: "r1",
    name: "John Smith",
    email: "john.smith@example.com",
    unit: "A-101",
    phone: "+1 (555) 123-4567",
    status: "active",
    moveInDate: "2023-01-15",
    activeVisitors: 2,
  },
  {
    id: "r2",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    unit: "B-205",
    phone: "+1 (555) 987-6543",
    status: "active",
    moveInDate: "2023-03-22",
    activeVisitors: 1,
  },
  {
    id: "r3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    unit: "C-310",
    phone: "+1 (555) 456-7890",
    status: "inactive",
    moveInDate: "2022-11-05",
    activeVisitors: 0,
  },
  {
    id: "r4",
    name: "Emily Wilson",
    email: "emily.wilson@example.com",
    unit: "A-202",
    phone: "+1 (555) 234-5678",
    status: "active",
    moveInDate: "2023-05-10",
    activeVisitors: 3,
  },
  {
    id: "r5",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    unit: "B-110",
    phone: "+1 (555) 876-5432",
    status: "active",
    moveInDate: "2023-02-18",
    activeVisitors: 0,
  },
  {
    id: "r6",
    name: "Sarah Davis",
    email: "sarah.davis@example.com",
    unit: "C-405",
    phone: "+1 (555) 345-6789",
    status: "inactive",
    moveInDate: "2022-09-30",
    activeVisitors: 0,
  },
];

export default function ResidentsPage() {
  const { toast } = useToast();
  const [residents, setResidents] = useState(mockResidents);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newResident, setNewResident] = useState({
    name: "",
    email: "",
    unit: "",
    phone: "",
  });

  // Filter residents based on search query
  const filteredResidents = residents.filter(
    (resident) =>
      resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.unit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeResidents = filteredResidents.filter(
    (resident) => resident.status === "active"
  );
  const inactiveResidents = filteredResidents.filter(
    (resident) => resident.status === "inactive"
  );

  const handleStatusChange = (id: string, newStatus: "active" | "inactive") => {
    setResidents(
      residents.map((resident) =>
        resident.id === id ? { ...resident, status: newStatus } : resident
      )
    );

    toast({
      title: `Resident ${newStatus === "active" ? "activated" : "deactivated"}`,
      description: `The resident has been ${
        newStatus === "active" ? "activated" : "deactivated"
      } successfully.`,
    });
  };

  const handleAddResident = () => {
    // Validate form
    if (!newResident.name || !newResident.email || !newResident.unit) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Add new resident
    const id = `r${residents.length + 1}`;
    const today = new Date().toISOString().split("T")[0];

    setResidents([
      ...residents,
      {
        id,
        ...newResident,
        status: "active",
        moveInDate: today,
        activeVisitors: 0,
      },
    ]);

    // Reset form and close dialog
    setNewResident({
      name: "",
      email: "",
      unit: "",
      phone: "",
    });
    setShowAddDialog(false);

    toast({
      title: "Resident added",
      description: "The new resident has been added successfully.",
    });
  };

  return (
    <DashboardShell sidebar={<AdminSidebar />} allowedRoles={["admin"]}>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Residents</h1>
            <p className="text-muted-foreground">
              Manage residents and their access permissions
            </p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Resident
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Resident</DialogTitle>
                <DialogDescription>
                  Enter the details for the new resident. They will receive an
                  email invitation to set up their account.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newResident.name}
                    onChange={(e) =>
                      setNewResident({ ...newResident, name: e.target.value })
                    }
                    placeholder="John Smith"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newResident.email}
                    onChange={(e) =>
                      setNewResident({ ...newResident, email: e.target.value })
                    }
                    placeholder="john.smith@example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unit/Apartment</Label>
                    <Input
                      id="unit"
                      value={newResident.unit}
                      onChange={(e) =>
                        setNewResident({ ...newResident, unit: e.target.value })
                      }
                      placeholder="A-101"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={newResident.phone}
                      onChange={(e) =>
                        setNewResident({
                          ...newResident,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddResident}>Add Resident</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Resident Directory</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search residents..."
                    className="w-[200px] md:w-[300px] pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Building A</DropdownMenuItem>
                    <DropdownMenuItem>Building B</DropdownMenuItem>
                    <DropdownMenuItem>Building C</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Recently Added</DropdownMenuItem>
                    <DropdownMenuItem>Alphabetical</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active">
              <TabsList>
                <TabsTrigger value="active">
                  Active Residents
                  <Badge variant="secondary" className="ml-2">
                    {activeResidents.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="inactive">
                  Inactive Residents
                  <Badge variant="secondary" className="ml-2">
                    {inactiveResidents.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="mt-4">
                <ResidentTable
                  residents={activeResidents}
                  onStatusChange={handleStatusChange}
                  onViewDetails={setSelectedResident}
                />
              </TabsContent>
              <TabsContent value="inactive" className="mt-4">
                <ResidentTable
                  residents={inactiveResidents}
                  onStatusChange={handleStatusChange}
                  onViewDetails={setSelectedResident}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {selectedResident && (
          <ResidentDetailsDialog
            resident={selectedResident}
            onClose={() => setSelectedResident(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </DashboardShell>
  );
}

function ResidentTable({
  residents,
  onStatusChange,
  onViewDetails,
}: {
  residents: any[];
  onStatusChange: (id: string, status: "active" | "inactive") => void;
  onViewDetails: (resident: any) => void;
}) {
  if (residents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <User className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No residents found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Move-in Date</TableHead>
            <TableHead>Active Visitors</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {residents.map((resident) => (
            <TableRow key={resident.id}>
              <TableCell className="font-medium">{resident.name}</TableCell>
              <TableCell>{resident.unit}</TableCell>
              <TableCell>{resident.email}</TableCell>
              <TableCell>{formatDate(resident.moveInDate)}</TableCell>
              <TableCell>{resident.activeVisitors}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onViewDetails(resident)}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit Resident</DropdownMenuItem>
                    <DropdownMenuItem>View Visitors</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {resident.status === "active" ? (
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onStatusChange(resident.id, "inactive")}
                      >
                        Deactivate Resident
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => onStatusChange(resident.id, "active")}
                      >
                        Activate Resident
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ResidentDetailsDialog({
  resident,
  onClose,
  onStatusChange,
}: {
  resident: any;
  onClose: () => void;
  onStatusChange: (id: string, status: "active" | "inactive") => void;
}) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Resident Details</DialogTitle>
          <DialogDescription>
            View and manage resident information and access permissions
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{resident.name}</h3>
              <p className="text-sm text-muted-foreground">{resident.email}</p>
            </div>
            <Badge
              className={
                resident.status === "active"
                  ? "bg-green-500 ml-auto"
                  : "bg-secondary ml-auto"
              }
            >
              {resident.status === "active" ? "Active" : "Inactive"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Unit/Apartment</p>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <p>{resident.unit}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Phone Number</p>
              <p>{resident.phone}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Move-in Date</p>
              <p>{formatDate(resident.moveInDate)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Active Visitors</p>
              <p>{resident.activeVisitors}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Visitor Activity</h4>
            {resident.activeVisitors > 0 ? (
              <div className="rounded-md border p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">John Guest</p>
                      <p className="text-sm text-muted-foreground">
                        Valid until Mar 20, 2025
                      </p>
                    </div>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  {resident.activeVisitors > 1 && (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Jane Visitor</p>
                        <p className="text-sm text-muted-foreground">
                          Valid until Mar 18, 2025
                        </p>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-md border border-dashed p-4 flex flex-col items-center justify-center text-center">
                <p className="text-sm text-muted-foreground">
                  No recent visitor activity
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Access Permissions</h4>
            <div className="rounded-md border p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <p>Main Building Access</p>
                  </div>
                  <Badge variant="outline">Default</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <p>Visitor Management</p>
                  </div>
                  <Badge variant="outline">Default</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-destructive" />
                    <p>Admin Areas</p>
                  </div>
                  <Badge variant="outline">Restricted</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="sm:flex-1">
            Edit Resident
          </Button>
          <Button variant="outline" className="sm:flex-1">
            View All Visitors
          </Button>
          {resident.status === "active" ? (
            <Button
              variant="destructive"
              className="sm:flex-1"
              onClick={() => {
                onStatusChange(resident.id, "inactive");
                onClose();
              }}
            >
              Deactivate Resident
            </Button>
          ) : (
            <Button
              className="sm:flex-1"
              onClick={() => {
                onStatusChange(resident.id, "active");
                onClose();
              }}
            >
              Activate Resident
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Label({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  );
}

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
