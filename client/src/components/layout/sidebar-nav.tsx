import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import {
  Building2,
  Users,
  Construction,
  Truck,
  Package,
  FileText,
  LayoutDashboard,
  Settings,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const superAdminItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/super-admin",
    icon: LayoutDashboard,
  },
  {
    title: "Organizations",
    href: "/super-admin/organizations",
    icon: Building2,
  },
  {
    title: "Settings",
    href: "/super-admin/settings",
    icon: Settings,
  },
];

const orgItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/org",
    icon: LayoutDashboard,
  },
  {
    title: "Customers",
    href: "/org/customers",
    icon: Users,
  },
  {
    title: "Construction Sites",
    href: "/org/sites",
    icon: Construction,
  },
  {
    title: "Vendors",
    href: "/org/vendors",
    icon: Truck,
  },
  {
    title: "Items",
    href: "/org/items",
    icon: Package,
  },
  {
    title: "Quotations",
    href: "/org/quotations",
    icon: FileText,
  },
];

export default function SidebarNav() {
  const [location] = useLocation();
  const { user } = useAuth();
  const items = user?.role === "superadmin" ? superAdminItems : orgItems;

  return (
    <div className="fixed left-0 top-0 w-64 h-screen border-r bg-sidebar">
      <div className="h-16 border-b flex items-center px-6">
        <h1 className="font-semibold text-lg text-sidebar-foreground">
          Construction ERP
        </h1>
      </div>

      <ScrollArea className="h-[calc(100vh-4rem)] px-3 py-4">
        <nav className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2",
                    location === item.href && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}
