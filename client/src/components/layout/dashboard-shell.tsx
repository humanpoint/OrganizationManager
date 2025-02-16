import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import SidebarNav from "./sidebar-nav";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logoutMutation } = useAuth();

  return (
    <div className="min-h-screen flex bg-background">
      <SidebarNav />
      
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b px-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold">
            {user?.role === "superadmin" ? "Application Admin" : "Organization Dashboard"}
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback>
                  {user?.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
