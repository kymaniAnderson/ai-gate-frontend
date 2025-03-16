"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QRCodeDisplay } from "@/components/qr-code-display";
import { PinDisplay } from "@/components/pin-display";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, HelpCircle, QrCode, Share2 } from "lucide-react";
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
  validTo?: string;
  validTimeFrom?: string;
  validTimeTo?: string;
  usageLimit?: number;
  usageCount?: number;
}

export default function VisitorAccessPage() {
  const params = useParams();
  const { toast } = useToast();
  const [accessPass, setAccessPass] = useState<AccessPass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccessPass = async () => {
      try {
        const code = params.id as string;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/access-passes/code/${code}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Access pass not found");
          }
          throw new Error("Failed to fetch access pass");
        }

        const data = await response.json();
        setAccessPass(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAccessPass();
  }, [params.id]);

  const shareAccess = () => {
    if (!accessPass) return;

    if (navigator.share) {
      navigator
        .share({
          title: `Access Pass for ${accessPass.location}`,
          text: `Here is your access pass for ${accessPass.location}`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "The access link has been copied to your clipboard.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Loading Access Pass</CardTitle>
            <CardDescription>Please wait...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <div className="animate-pulse h-48 w-48 bg-muted rounded-md" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !accessPass) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Access Error</CardTitle>
            <CardDescription>
              {error || "An unknown error occurred"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8 gap-4">
            <HelpCircle className="h-16 w-16 text-muted-foreground" />
            <p className="text-center text-muted-foreground">
              This access pass may have expired or been revoked. Please contact
              the resident for assistance.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">
              Request Help
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Badge
              className={
                accessPass.status === "active"
                  ? "bg-green-500"
                  : accessPass.status === "expired"
                  ? "bg-secondary"
                  : "bg-destructive"
              }
            >
              {accessPass.status === "active"
                ? "Active"
                : accessPass.status === "expired"
                ? "Expired"
                : "Cancelled"}
            </Badge>
          </div>
          <CardTitle>Access Pass for {accessPass.location}</CardTitle>
          <CardDescription>Welcome, {accessPass.visitorName}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {accessPass.qrCode && (
            <div className="flex flex-col items-center gap-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Scan this QR code at the entrance
              </h3>
              <QRCodeDisplay
                value={`https://ai-gate-frontend.vercel.app/visitor/${accessPass.pin}`}
                size={200}
                className="w-full"
              />
            </div>
          )}

          <div className="flex flex-col items-center gap-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {accessPass.qrCode ? "Or use this PIN code" : "Use this PIN code"}
            </h3>
            <PinDisplay pin={accessPass.pin} />
          </div>

          <div className="rounded-md bg-muted p-4 space-y-2">
            {(accessPass.validFrom || accessPass.validTo) && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {accessPass.validFrom}{" "}
                  {accessPass.validTo ? `- ${accessPass.validTo}` : ""}
                </span>
              </div>
            )}
            {(accessPass.validTimeFrom || accessPass.validTimeTo) && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {accessPass.validTimeFrom}{" "}
                  {accessPass.validTimeTo ? `- ${accessPass.validTimeTo}` : ""}
                </span>
              </div>
            )}
            {accessPass.usageLimit !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                <QrCode className="h-4 w-4 text-muted-foreground" />
                <span>
                  {accessPass.usageCount} / {accessPass.usageLimit} entries used
                </span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full" onClick={shareAccess}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Access Pass
          </Button>
          <Button className="w-full" variant="outline">
            Request Help
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
