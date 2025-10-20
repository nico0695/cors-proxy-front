"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            className: "!bg-card !text-card-foreground !border !border-border",
            style: {
              padding: "12px 20px",
              borderRadius: "8px",
              fontSize: "14px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "hsl(var(--card))",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "hsl(var(--card))",
              },
            },
          }}
        />
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
