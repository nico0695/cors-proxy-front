"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "./protected";

interface AdminOnlyProps {
  children: React.ReactNode;
}

export function AdminOnly({ children }: AdminOnlyProps) {
  const { user, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && user?.role !== "admin") {
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

  if (status === "authenticated" && user?.role !== "admin") {
    return null;
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
}
