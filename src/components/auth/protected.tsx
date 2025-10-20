"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { status, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      // Redirect to auth page with return URL
      const returnUrl = pathname !== "/" ? `?returnUrl=${encodeURIComponent(pathname)}` : "";
      router.push(`/auth${returnUrl}`);
    } else if (status === "authenticated" && user?.status === "blocked") {
      // Redirect blocked users to blocked page
      router.push("/blocked");
    }
  }, [status, user, router, pathname]);

  // Show loading state while checking auth
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

  // Show nothing while redirecting
  if (status === "unauthenticated" || user?.status === "blocked") {
    return null;
  }

  // User is authenticated and enabled, render children
  return <>{children}</>;
}
