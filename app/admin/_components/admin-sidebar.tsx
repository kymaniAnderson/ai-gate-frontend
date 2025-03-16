"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building,
  CalendarClock,
  Home,
  LogOut,
  ShieldAlert,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Residents",
    href: "/admin/residents",
    icon: Users,
  },
  {
    title: "Properties",
    href: "/admin/properties",
    icon: Building,
  },
  {
    title: "Access Logs",
    href: "/admin/logs",
    icon: CalendarClock,
  },
  {
    title: "Security",
    href: "/admin/security",
    icon: ShieldAlert,
  },
  {
    title: "Logout",
    href: "/logout",
    icon: LogOut,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full flex-col gap-2 p-4">
      <div className="px-4 py-2">
        <h2 className="text-lg font-semibold tracking-tight">Admin Portal</h2>
        <p className="text-sm text-muted-foreground">
          Property management dashboard
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
