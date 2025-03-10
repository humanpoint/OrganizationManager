import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Switch, Route, Redirect } from "wouter";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./lib/protected-route";

import AuthPage from "@/pages/auth-page";
import SuperAdminDashboard from "@/pages/super-admin-dashboard";
import OrgDashboard from "@/pages/org-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/super-admin" component={SuperAdminDashboard} />
      <ProtectedRoute path="/org/:orgId" component={OrgDashboard} />
      <Route path="/">
        {() => {
          const { user } = useAuth();
          if (!user) return <Redirect to="/auth" />;

          if (user.role === "superadmin") {
            return <Redirect to="/super-admin" />;
          }
          return <Redirect to={`/org/${user.organizationId}`} />;
        }}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;