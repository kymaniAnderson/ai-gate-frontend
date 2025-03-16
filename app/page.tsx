import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QrCode } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <div className="flex-1 flex items-center gap-2 font-semibold">
            <QrCode className="h-6 w-6 text-primary" />
            <span className="text-primary text-xl">AccessPass</span>
          </div>
          <Button asChild variant="outline">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight mb-6 md:text-5xl">
              Seamless Visitor Access Management
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Streamline visitor access for residents, guests, security, and
              property managers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 w-full max-w-7xl mx-auto">
            <RoleCard
              title="Residents"
              description="Manage visitor access, create passes, and track guest entries"
              href="/login?role=resident"
            />
            <RoleCard
              title="Visitors"
              description="Use QR codes or PINs to access properties with ease"
              href="/visitor"
            />
            <RoleCard
              title="Security Guards"
              description="Verify visitor access and maintain secure entry logs"
              href="/login?role=security"
            />
            <RoleCard
              title="Property Managers"
              description="Oversee resident access, visitor logs, and system activity"
              href="/login?role=admin"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function RoleCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4 pt-6">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="pb-6">
        <Button asChild className="w-full">
          <Link href={href}>Continue as {title.slice(0, -1)}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <div className="h-6 w-6 bg-primary/40 rounded-full"></div>
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
