import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

type LoginData = Pick<InsertUser, "username" | "password">;

const SUPER_ADMIN_CODE = "SUPER123"; // In production, this would be more secure

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [adminCode, setAdminCode] = useState("");
  const [showSuperAdminOption, setShowSuperAdminOption] = useState(false);

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(insertUserSchema.pick({ username: true, password: true })),
  });

  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      role: "employee",
    }
  });

  const handleAdminCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setAdminCode(code);
    setShowSuperAdminOption(code === SUPER_ADMIN_CODE);
    if (code === SUPER_ADMIN_CODE) {
      registerForm.setValue("role", "superadmin");
    } else {
      registerForm.setValue("role", "employee");
    }
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Construction ERP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit(data => loginMutation.mutate(data))}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input {...loginForm.register("username")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input type="password" {...loginForm.register("password")} />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Login
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={registerForm.handleSubmit(data => registerMutation.mutate(data))}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input {...registerForm.register("username")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input type="email" {...registerForm.register("email")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input type="password" {...registerForm.register("password")} />
                    </div>
                    <div className="space-y-2">
                      <Label>Admin Code (Optional)</Label>
                      <Input 
                        type="text" 
                        value={adminCode}
                        onChange={handleAdminCodeChange}
                        placeholder="Enter code for superadmin access"
                      />
                    </div>
                    {showSuperAdminOption && (
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <RadioGroup 
                          defaultValue="superadmin"
                          onValueChange={(value) => registerForm.setValue("role", value as "superadmin" | "employee")}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="superadmin" id="superadmin" />
                            <Label htmlFor="superadmin">Super Admin</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="employee" id="employee" />
                            <Label htmlFor="employee">Employee</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    )}
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Register as {showSuperAdminOption ? 'Super Admin' : 'Employee'}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="hidden lg:flex flex-1 bg-muted items-center justify-center p-8">
        <div className="max-w-lg space-y-8">
          <h1 className="text-4xl font-bold">
            Welcome to Construction ERP
          </h1>
          <p className="text-lg text-muted-foreground">
            A comprehensive solution for managing construction projects, vendors, and resources.
          </p>
        </div>
      </div>
    </div>
  );
}