import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Building2,
  Users,
  Wrench,
  FileText,
  Settings,
  BarChart,
  MessageSquare,
  Calendar,
} from "lucide-react";

const navigationItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Building2, label: "Properties", href: "/properties" },
  { icon: Users, label: "Tenants", href: "/tenants" },
  { icon: Wrench, label: "Maintenance", href: "/maintenance" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: FileText, label: "Documents", href: "/documents" },
  { icon: BarChart, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="space-y-1">
      {navigationItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
