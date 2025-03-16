"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { ResidentSidebar } from "../_components/resident-sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VisitorList } from "../_components/visitor-list";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

// Add types based on the API documentation
interface AccessPass {
  id: string;
  visitorName: string;
  location: string;
  name: string;
  pin: string;
  qrCode: string | null;
  status: "active" | "expired" | "cancelled";
  createdAt: string;
  accessType: "time-bound" | "date-range" | "usage-limit";
  validFrom?: string;
  validTimeFrom?: string;
  validTimeTo?: string;
  validTo?: string;
  usageLimit?: number;
  usageCount?: number;
}

interface AccessPassResponse {
  active: AccessPass[];
  expired: AccessPass[];
  cancelled: AccessPass[];
}

export default function VisitorsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [passes, setPasses] = useState<AccessPassResponse>({
    active: [],
    expired: [],
    cancelled: [],
  });

  useEffect(() => {
    const fetchPasses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/access-passes/my-passes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("You must be logged in to view your access passes");
          }
          throw new Error("Failed to fetch access passes");
        }

        const data = await response.json();
        setPasses(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        toast({
          title: "Error",
          description:
            err instanceof Error
              ? err.message
              : "Failed to fetch access passes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPasses();
  }, [toast]);

  // Filter passes based on search query
  const filteredPasses = {
    active: passes.active.filter(
      (pass) =>
        pass.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pass.location.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    expired: passes.expired.filter(
      (pass) =>
        pass.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pass.location.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    cancelled: passes.cancelled.filter(
      (pass) =>
        pass.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pass.location.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  };

  const handleRevokeAccess = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/access-passes/${id}/revoke`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to revoke access pass");
      }

      // Update local state
      setPasses((prev) => ({
        active: prev.active.filter((pass) => pass.id !== id),
        cancelled: [
          ...prev.cancelled,
          {
            ...prev.active.find((pass) => pass.id === id)!,
            status: "cancelled",
          },
        ],
        expired: prev.expired,
      }));

      toast({
        title: "Access Revoked",
        description: "The access pass has been revoked successfully.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to revoke access",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <DashboardShell sidebar={<ResidentSidebar />} allowedRoles={["resident"]}>
        <div className="flex flex-col gap-6 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-4 w-96 bg-muted rounded" />
            <div className="h-[400px] w-full bg-muted rounded" />
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell sidebar={<ResidentSidebar />} allowedRoles={["resident"]}>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Manage Visitors
            </h1>
            <p className="text-muted-foreground">
              Create and manage visitor access passes
            </p>
          </div>
          <Button asChild>
            <Link href="/resident/create-access">
              <Plus className="mr-2 h-4 w-4" />
              Create New Access
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Visitor Access Passes</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search visitors..."
                  className="w-full sm:w-[250px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <CardDescription>
              Manage access passes for your visitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active">
              <TabsList>
                <TabsTrigger value="active">
                  Active ({filteredPasses.active.length})
                </TabsTrigger>
                <TabsTrigger value="expired">
                  Expired ({filteredPasses.expired.length})
                </TabsTrigger>
                <TabsTrigger value="cancelled">
                  Cancelled ({filteredPasses.cancelled.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="mt-4">
                <VisitorList
                  visitors={filteredPasses.active}
                  onRevokeAccess={handleRevokeAccess}
                />
              </TabsContent>
              <TabsContent value="expired" className="mt-4">
                <VisitorList visitors={filteredPasses.expired} isPast />
              </TabsContent>
              <TabsContent value="cancelled" className="mt-4">
                <VisitorList visitors={filteredPasses.cancelled} isPast />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
