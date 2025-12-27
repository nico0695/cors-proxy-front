"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected";
import { Header } from "@/components/shared/header";
import { ProxyStats } from "@/components/proxy/proxy-stats";
import { ProxyList } from "@/components/proxy/proxy-list";
import { CreateProxyDialog } from "@/components/proxy/create-proxy-dialog";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { proxyEndpointKeys, proxyStatsKeys } from "@/hooks/use-proxy-endpoints";

export default function ProxyPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: proxyEndpointKeys.all });
    queryClient.invalidateQueries({ queryKey: proxyStatsKeys.all });
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        <Header />

        <div className="border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  HTTP Proxy Manager
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage and configure HTTP proxy endpoints
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Proxy
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="space-y-6">
            <ProxyStats />

            <section>
              <h2 className="text-lg font-semibold mb-4">Proxy Endpoints</h2>
              <ProxyList />
            </section>
          </div>
        </div>

        <CreateProxyDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      </main>
    </ProtectedRoute>
  );
}
