"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, LogOut } from "lucide-react";

export default function BlockedPage() {
  const { user, logout, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated, redirect to auth page
    if (status === "unauthenticated") {
      router.push("/auth");
      return;
    }

    // If user is enabled, redirect to home
    if (status === "authenticated" && user?.status === "enabled") {
      router.push("/");
    }
  }, [status, user, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
            <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-500" />
          </div>
          <CardTitle className="text-2xl">Account Blocked</CardTitle>
          <CardDescription className="text-base">
            Your account is currently blocked and awaiting administrator approval
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              Your registration has been received, but your account needs to be approved by an
              administrator before you can access the system.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">What to do next:</p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Contact your system administrator</li>
              <li>Wait for your account to be approved</li>
              <li>Check back later to see if access has been granted</li>
            </ul>
          </div>

          {user && (
            <div className="rounded-lg border bg-card p-3">
              <p className="text-sm">
                <span className="font-medium">Account:</span> {user.name}
              </p>
              {user.email && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
              )}
            </div>
          )}

          <Button variant="outline" className="w-full" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
