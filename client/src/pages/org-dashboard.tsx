import DashboardShell from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { 
  Users, 
  Construction, 
  Truck, 
  Package, 
  FileText
} from "lucide-react";

const stats = [
  {
    title: "Customers",
    icon: Users,
    value: "23",
    description: "Active customers",
  },
  {
    title: "Sites",
    icon: Construction,
    value: "45",
    description: "Construction sites",
  },
  {
    title: "Vendors",
    icon: Truck,
    value: "12",
    description: "Active vendors",
  },
  {
    title: "Items",
    icon: Package,
    value: "145",
    description: "Items in inventory",
  },
  {
    title: "Quotations",
    icon: FileText,
    value: "34",
    description: "Open quotations",
  },
];

export default function OrgDashboard() {
  const { user } = useAuth();

  return (
    <DashboardShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.username}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Activity feed coming soon...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Quick action buttons coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
