import { useQuery, useMutation } from "@tanstack/react-query";
import { Organization, insertOrgSchema, insertUserSchema } from "@shared/schema";
import DashboardShell from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";

// Combined schema for organization and admin creation
const createOrgWithAdminSchema = z.object({
  organization: insertOrgSchema,
  admin: insertUserSchema.extend({
    role: z.literal("admin"),
  }),
});

type CreateOrgWithAdmin = z.infer<typeof createOrgWithAdminSchema>;

export default function SuperAdminDashboard() {
  const { data: organizations, isLoading } = useQuery<Organization[]>({
    queryKey: ["/api/organizations"],
  });

  const form = useForm<CreateOrgWithAdmin>({
    resolver: zodResolver(createOrgWithAdminSchema),
    defaultValues: {
      admin: {
        role: "admin",
      },
    },
  });

  const createOrgMutation = useMutation({
    mutationFn: async (data: CreateOrgWithAdmin) => {
      const res = await apiRequest("POST", "/api/organizations", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/organizations"] });
      form.reset();
    },
  });

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage all organizations in the system
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Organization</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit((data) => createOrgMutation.mutate(data))} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Organization Details</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="organization.name">Organization Name</Label>
                    <Input {...form.register("organization.name")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization.address">Address</Label>
                    <Input {...form.register("organization.address")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization.primaryContactName">Primary Contact Name</Label>
                    <Input {...form.register("organization.primaryContactName")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization.primaryContactNumber">Primary Contact Number</Label>
                    <Input {...form.register("organization.primaryContactNumber")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization.designation">Designation</Label>
                    <Input {...form.register("organization.designation")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization.primaryEmail">Primary Email</Label>
                    <Input type="email" {...form.register("organization.primaryEmail")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization.primaryPhone">Primary Phone</Label>
                    <Input {...form.register("organization.primaryPhone")} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Admin User Details</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin.username">Username</Label>
                    <Input {...form.register("admin.username")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin.email">Email</Label>
                    <Input type="email" {...form.register("admin.email")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin.password">Password</Label>
                    <Input type="password" {...form.register("admin.password")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin.designation">Designation</Label>
                    <Input {...form.register("admin.designation")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin.contactNumber">Contact Number</Label>
                    <Input {...form.register("admin.contactNumber")} />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={createOrgMutation.isPending}
              >
                {createOrgMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Organization with Admin
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {organizations?.map((org) => (
          <Card key={org.id}>
            <CardHeader>
              <CardTitle>{org.name}</CardTitle>
              <CardDescription>{org.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contact:</span>
                  <span>{org.primaryContactName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{org.primaryEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{org.primaryPhone}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}