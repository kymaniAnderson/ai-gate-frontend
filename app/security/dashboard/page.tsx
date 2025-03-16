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
} from "lucide-react";
import { mockVisitors } from "@/lib/mock-data";
import { Html5Qrcode } from "html5-qrcode";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
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
        { facingMode: "environment" }, // Use back camera if available
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          try {
            const code = decodedText.split("/").pop();
            if (!code) throw new Error("Invalid QR code");

            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/access-passes/code/${code}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (!response.ok) {
              throw new Error(
                response.status === 404
                  ? "Invalid QR code"
                  : "Failed to verify access pass"
              );
            }

            const data = await response.json();
            setScanResult(data);

            // Stop scanning after finding a valid QR code
            await stopScanner();

            toast({
              title:
                data.status === "active" ? "Access Granted" : "Access Denied",
              description: `${data.visitorName} - Pass is ${data.status}`,
              variant: data.status === "active" ? "default" : "destructive",
            });
          } catch (err) {
            console.error("QR code verification error:", err);
            // Don't stop scanning on error, just show the toast
            toast({
              title: "Invalid QR Code",
              description:
                err instanceof Error ? err.message : "Failed to verify access",
              variant: "destructive",
            });
          }
        },
        (errorMessage) => {
          // Ignore errors during scanning as they're usually just failed reads
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

  const handlePinComplete = (pin: string) => {
    // In a real app, this would validate the PIN with the server
    const visitor = mockVisitors.find((v) => v.pin === pin);

    if (visitor && visitor.status === "active") {
      toast({
        title: "Access Granted",
        description: `${visitor.name} has been granted access.`,
        variant: "default",
      });

      setRecentEntries([
        {
          id: Date.now().toString(),
          name: visitor.name,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "approved",
        },
        ...recentEntries,
      ]);
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid or expired PIN.",
        variant: "destructive",
      });

      setRecentEntries([
        {
          id: Date.now().toString(),
          name: "Unknown Visitor",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "denied",
        },
        ...recentEntries,
      ]);
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
