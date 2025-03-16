"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VisitorEntryPage() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState("");

  const handleGetAccess = () => {
    router.push(`/visitor/${accessCode}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Visitor Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="access-code">Enter Access Code</Label>
            <div className="flex space-x-2">
              <Input
                id="access-code"
                placeholder="Enter your access code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
              />
              <Button onClick={handleGetAccess}>Get Access</Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-center text-xs text-muted-foreground">
            Need help? Contact the property manager
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
