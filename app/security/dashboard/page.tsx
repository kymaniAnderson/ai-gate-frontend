"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { SecuritySidebar } from "../_components/security-sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRScanner } from "@/components/qr-scanner";
import { PinInput } from "@/components/pin-input";
import { useToast } from "@/hooks/use-toast";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  QrCode,
  ShieldAlert,
  XCircle,
  Check,
  X,
} from "lucide-react";
import { mockVisitors } from "@/lib/mock-data";
import { Html5Qrcode } from "html5-qrcode";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  validTo?: string;
  validTimeFrom?: string;
  validTimeTo?: string;
  usageLimit?: number;
  usageCount?: number;
}

export default function SecurityDashboard() {
  const { toast } = useToast();
  const [showScanner, setShowScanner] = useState(false);
  const [recentEntries, setRecentEntries] = useState<
    {
      id: string;
      name: string;
      time: string;
      status: "approved" | "denied";
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
  ]);
  const [pin, setPin] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<AccessPass | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Cleanup function
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const verifyAccessPass = async (pin: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/access-passes/code/${pin}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "Invalid PIN code"
            : "Failed to verify access pass"
        );
      }

      const data = await response.json();
      setScanResult(data);

      toast({
        title: data.status === "active" ? "Access Granted" : "Access Denied",
        description: `${data.visitorName} - Pass is ${data.status}`,
        variant: data.status === "active" ? "default" : "destructive",
      });

      return data;
    } catch (err) {
      throw err;
    }
  };

  const startScanner = async () => {
    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      const cameras = await Html5Qrcode.getCameras();
      if (cameras.length === 0) {
        throw new Error("No cameras found");
      }

      setIsScanning(true);
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          try {
            // Extract PIN from URL
            const pin = decodedText.split("/visitor/").pop();
            if (!pin) throw new Error("Invalid QR code format");

            const data = await verifyAccessPass(pin);
            if (data) {
              await stopScanner();
            }
          } catch (err) {
            console.error("QR code verification error:", err);
            toast({
              title: "Invalid QR Code",
              description:
                err instanceof Error ? err.message : "Failed to verify access",
              variant: "destructive",
            });
          }
        },
        (errorMessage) => {
          console.debug("QR Scan error:", errorMessage);
        }
      );
    } catch (err) {
      console.error("Scanner initialization error:", err);
      toast({
        title: "Camera Error",
        description: "Failed to access camera. Please check permissions.",
        variant: "destructive",
      });
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;

    setLoading(true);
    try {
      await verifyAccessPass(pin);
      setPin("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify access");
      toast({
        title: "Access Denied",
        description: err instanceof Error ? err.message : "Invalid access pass",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell sidebar={<SecuritySidebar />} allowedRoles={["security"]}>
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Security Dashboard
          </h1>
          <p className="text-muted-foreground">
            Verify visitor access and manage entry logs
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Entries</CardTitle>
              <CardDescription>
                Log of recent visitor verifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEntries.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No recent entries
                  </p>
                ) : (
                  recentEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 rounded-md border"
                    >
                      <div className="flex items-center gap-3">
                        {entry.status === "approved" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                        <div>
                          <p className="font-medium">{entry.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {entry.time}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          entry.status === "approved"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {entry.status === "approved" ? "Approved" : "Denied"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manual PIN Entry</CardTitle>
              <CardDescription>Enter the visitor's PIN code</CardDescription>
            </CardHeader>
            <form onSubmit={handlePinSubmit}>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="pin">PIN Code</Label>
                  <Input
                    id="pin"
                    placeholder="Enter 6-digit PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    maxLength={6}
                    pattern="\d{6}"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Verifying..." : "Verify PIN"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>QR Code Scanner</CardTitle>
              <CardDescription>
                {isScanning
                  ? "Scanning for QR code..."
                  : "Click start to begin scanning"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                id="qr-reader"
                className={`w-full ${
                  isScanning ? "block" : "hidden"
                } aspect-video`}
              />
              {!isScanning && (
                <div className="aspect-video flex items-center justify-center border-2 border-dashed rounded-md">
                  <QrCode className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={isScanning ? stopScanner : startScanner}
              >
                {isScanning ? "Stop Scanner" : "Open Scanner"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Security Alerts</CardTitle>
            <CardDescription>
              Recent security events that require attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-md border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <p className="font-medium">Multiple Failed Access Attempts</p>
                  <p className="text-sm text-muted-foreground">
                    3 failed PIN attempts at Main Entrance (09:45 AM)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-md border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <p className="font-medium">Emergency Override Activated</p>
                  <p className="text-sm text-muted-foreground">
                    South Gate emergency override by Admin (08:30 AM)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {(scanResult || error) && (
          <Card
            className={
              error
                ? "border-destructive"
                : scanResult?.status === "active"
                ? "border-green-500"
                : "border-destructive"
            }
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {error ? (
                  <>
                    <X className="h-5 w-5 text-destructive" />
                    <span className="text-destructive">Access Denied</span>
                  </>
                ) : scanResult?.status === "active" ? (
                  <>
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-green-500">Access Granted</span>
                  </>
                ) : (
                  <>
                    <X className="h-5 w-5 text-destructive" />
                    <span className="text-destructive">Access Denied</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            {scanResult && !error && (
              <CardContent>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-muted-foreground">Visitor</dt>
                    <dd className="text-sm font-medium">
                      {scanResult.visitorName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Location</dt>
                    <dd className="text-sm font-medium">
                      {scanResult.location}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Status</dt>
                    <dd className="text-sm font-medium capitalize">
                      {scanResult.status}
                    </dd>
                  </div>
                  {scanResult.accessType === "time-bound" && (
                    <div>
                      <dt className="text-sm text-muted-foreground">
                        Valid Time
                      </dt>
                      <dd className="text-sm font-medium">
                        {scanResult.validTimeFrom} - {scanResult.validTimeTo}
                      </dd>
                    </div>
                  )}
                  {scanResult.accessType === "usage-limit" && (
                    <div>
                      <dt className="text-sm text-muted-foreground">Usage</dt>
                      <dd className="text-sm font-medium">
                        {scanResult.usageCount} / {scanResult.usageLimit}{" "}
                        entries
                      </dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}

function Badge({
  children,
  variant,
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variant === "default" && "bg-primary text-primary-foreground",
        variant === "secondary" && "bg-secondary text-secondary-foreground",
        variant === "destructive" &&
          "bg-destructive text-destructive-foreground",
        variant === "outline" && "border border-input bg-background",
        className
      )}
    >
      {children}
    </span>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
