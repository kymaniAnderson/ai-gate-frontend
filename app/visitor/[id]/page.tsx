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
import { mockVisitors } from "@/lib/mock-data";
import type { Visitor } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function VisitorAccessPage() {
  const params = useParams();
  const { toast } = useToast();
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO fetch from an API
    const id = params.id as string;
    const foundVisitor = mockVisitors.find((v) => v.id === id);

    setTimeout(() => {
      if (foundVisitor) {
        setVisitor(foundVisitor);
      } else {
        setError("Access pass not found or has expired");
      }
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const shareAccess = () => {
    if (!visitor) return;

    if (navigator.share) {
      navigator
        .share({
          title: `Access Pass for ${visitor.location}`,
          text: `Here is your access pass for ${visitor.location}`,
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

  if (error || !visitor) {
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
                visitor.status === "active"
                  ? "bg-green-500"
                  : visitor.status === "expired"
                  ? "bg-secondary"
                  : visitor.status === "revoked"
                  ? "bg-destructive"
                  : "bg-amber-500"
              }
            >
              {visitor.status === "active"
                ? "Active"
                : visitor.status === "expired"
                ? "Expired"
                : visitor.status === "revoked"
                ? "Revoked"
                : "Pending"}
            </Badge>
          </div>
          <CardTitle>Access Pass for {visitor.location}</CardTitle>
          <CardDescription>Welcome, {visitor.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Scan this QR code at the entrance
            </h3>
            <QRCodeDisplay
              value={`https://sleekentry.com/visitor/${visitor.id}`}
              size={200}
              className="w-full"
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Or use this PIN code
            </h3>
            <PinDisplay pin={visitor.pin} />
          </div>

          <div className="rounded-md bg-muted p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {visitor.validFrom}{" "}
                {visitor.validTo ? `- ${visitor.validTo}` : ""}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {visitor.validTimeFrom}{" "}
                {visitor.validTimeTo ? `- ${visitor.validTimeTo}` : ""}
              </span>
            </div>
            {visitor.usageLimit && (
              <div className="flex items-center gap-2 text-sm">
                <QrCode className="h-4 w-4 text-muted-foreground" />
                <span>
                  {visitor.usageCount} / {visitor.usageLimit} entries used
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
