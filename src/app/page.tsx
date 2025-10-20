"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected";
import { Header } from "@/components/shared/header";
import { EndpointStats } from "@/components/endpoints/endpoint-stats";
import { EndpointList } from "@/components/endpoints/endpoint-list";
import { CreateEndpointDialog } from "@/components/endpoints/create-endpoint-dialog";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { endpointKeys, statsKeys } from "@/hooks/use-endpoints";

export default function Home() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: endpointKeys.all });
    queryClient.invalidateQueries({ queryKey: statsKeys.all });
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
                  Mock API Manager
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage and test your mock API endpoints
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Endpoint
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="space-y-6">
            <EndpointStats />

            <section>
              <h2 className="text-lg font-semibold mb-4">Endpoints</h2>
              <EndpointList />
            </section>
          </div>
        </div>

        <CreateEndpointDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      </main>
    </ProtectedRoute>
  );
}
