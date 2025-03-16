"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarClock, Home, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/resident/dashboard",
    icon: Home,
  },
  {
    title: "Manage Visitors",
    href: "/resident/visitors",
    icon: Users,
  },
  {
    title: "Access Logs",
    href: "/resident/logs",
    icon: CalendarClock,
  },
];

export function ResidentSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full flex-col gap-2 p-4">
      <div className="px-4 py-2">
        <h2 className="text-lg font-semibold tracking-tight">
          Resident Portal
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage your visitor access
        </p>
      </div>
      <nav className="grid gap-1 px-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "transparent"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
