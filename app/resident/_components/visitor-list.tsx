"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { QRCodeDisplay } from "@/components/qr-code-display";
import { PinDisplay } from "@/components/pin-display";
import type { Visitor } from "@/lib/types";
import {
  AlertTriangle,
  Calendar,
  Clock,
  Copy,
  QrCode,
  Share2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VisitorListProps {
  visitors: Visitor[];
  isPast?: boolean;
  onRevokeAccess?: (id: string) => void;
}

export function VisitorList({
  visitors,
  isPast = false,
  onRevokeAccess,
}: VisitorListProps) {
  const { toast } = useToast();
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);

  if (visitors.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-center text-muted-foreground">
            {isPast ? "No past visitors found" : "No active visitors found"}
          </p>
          {!isPast && (
            <Button asChild className="mt-4">
              <a href="/resident/create-access">Create New Visitor Access</a>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The access link has been copied to your clipboard.",
    });
  };

  const shareAccess = (visitor: Visitor) => {
    if (navigator.share) {
      navigator
        .share({
          title: `Access Pass for ${visitor.name}`,
          text: `Here is your access pass for ${visitor.location}`,
          url: `https://ai-gate-frontend.vercel.app/visitor/${visitor.id}`,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      copyToClipboard(
        `https://ai-gate-frontend.vercel.app/visitor/${visitor.id}`
      );
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {visitors.map((visitor) => (
        <Card key={visitor.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>{visitor.name}</CardTitle>
              <AccessStatusBadge status={visitor.status} />
            </div>
            <CardDescription>{visitor.location}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid gap-1">
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
          <CardFooter className="flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedVisitor(visitor)}
                >
                  View Access
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Access Details for {selectedVisitor?.name}
                  </DialogTitle>
                  <DialogDescription>
                    Share this access pass with your visitor
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                  <QRCodeDisplay
                    value={`https://ai-gate-frontend.vercel.app/visitor/${selectedVisitor?.id}`}
                    size={250}
                  />

                  <div className="text-center">
                    <h3 className="font-semibold">Access PIN</h3>
                    <PinDisplay pin={selectedVisitor?.pin || "000000"} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {selectedVisitor?.validFrom}{" "}
                        {selectedVisitor?.validTo
                          ? `- ${selectedVisitor?.validTo}`
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {selectedVisitor?.validTimeFrom}{" "}
                        {selectedVisitor?.validTimeTo
                          ? `- ${selectedVisitor?.validTimeTo}`
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      copyToClipboard(
                        `https://ai-gate-frontend.vercel.app/visitor/${selectedVisitor?.id}`
                      )
                    }
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Link
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() =>
                      selectedVisitor && shareAccess(selectedVisitor)
                    }
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Access
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {!isPast && onRevokeAccess && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Revoke
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Revoke Access</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to revoke access for {visitor.name}?
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center gap-2 p-4 bg-destructive/10 rounded-md">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <p className="text-sm">
                      The visitor will no longer be able to use this access
                      pass.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        onRevokeAccess(visitor.id);
                        toast({
                          title: "Access revoked",
                          description: `Access for ${visitor.name} has been revoked.`,
                        });
                      }}
                    >
                      Revoke Access
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function AccessStatusBadge({ status }: { status: string }) {
  if (status === "active") {
    return <Badge className="bg-green-500">Active</Badge>;
  } else if (status === "expired") {
    return <Badge variant="secondary">Expired</Badge>;
  } else if (status === "revoked") {
    return <Badge variant="destructive">Revoked</Badge>;
  } else if (status === "pending") {
    return (
      <Badge variant="outline" className="bg-amber-500 text-white">
        Pending
      </Badge>
    );
  }
  return null;
}
