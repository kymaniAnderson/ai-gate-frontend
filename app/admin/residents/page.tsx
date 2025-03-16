"use client";

import { useState, useEffect } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ResidentsPage() {
  const { toast } = useToast();
  const [residents, setResidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newResident, setNewResident] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users?filters[role][type][$eq]=resident`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch residents");
        }

        const data = await response.json();
        setResidents(data);
      } catch (error) {
        toast({
          title: "Error fetching residents",
          description: "Failed to load resident data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResidents();
  }, [toast]);

  const filteredResidents = residents.filter(
    (resident: any) =>
      resident.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeResidents = filteredResidents.filter(
    (resident: any) => !resident.blocked
  );
  const inactiveResidents = filteredResidents.filter(
    (resident: any) => resident.blocked
  );

  const handleAddResident = async () => {
    if (!newResident.email) {
      toast({
        title: "Missing information",
        description: "Please provide an email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: newResident.email,
            role: "resident",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to invite resident");
      }

      setNewResident({ name: "", email: "" });
      setShowAddDialog(false);
      toast({
        title: "Resident invited",
        description: "An invitation has been sent to the resident's email.",
      });
    } catch (error) {
      toast({
        title: "Failed to invite resident",
        description: "There was an error inviting the resident.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardShell sidebar={<AdminSidebar />} allowedRoles={["admin"]}>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Residents</h1>
            <p className="text-muted-foreground">
              Manage resident access and permissions
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
                  Enter the resident's email to send them an invitation.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newResident.email}
                    onChange={(e) =>
                      setNewResident({ ...newResident, email: e.target.value })
                    }
                    placeholder="resident@example.com"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddResident}>Send Invitation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Resident Directory</CardTitle>
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
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active">
              <TabsList>
                <TabsTrigger value="active">
                  Active
                  <Badge variant="secondary" className="ml-2">
                    {activeResidents.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="inactive">
                  Inactive
                  <Badge variant="secondary" className="ml-2">
                    {inactiveResidents.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="mt-4">
                <ResidentTable residents={activeResidents} />
              </TabsContent>
              <TabsContent value="inactive" className="mt-4">
                <ResidentTable residents={inactiveResidents} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

function ResidentTable({ residents }: { residents: any[] }) {
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
            <TableHead>Email</TableHead>
            <TableHead>Unit Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {residents.map((resident) => (
            <TableRow key={resident.id}>
              <TableCell className="font-medium">{resident.username}</TableCell>
              <TableCell>{resident.email}</TableCell>
              <TableCell>{resident.units?.length || 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
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
