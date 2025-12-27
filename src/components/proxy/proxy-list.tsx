"use client";

import { useState } from "react";
import { useProxyEndpoints } from "@/hooks/use-proxy-endpoints";
import { ProxyCard } from "./proxy-card";
import { ProxyDetailsDialog } from "./proxy-details-dialog";
import { EditProxyDialog } from "./edit-proxy-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ProxyEndpoint } from "@/lib/types";

export function ProxyList() {
  const { data: endpoints, isLoading, error } = useProxyEndpoints();
  const [selectedEndpoint, setSelectedEndpoint] = useState<ProxyEndpoint | null>(null);
  const [editingEndpoint, setEditingEndpoint] = useState<ProxyEndpoint | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="h-6 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                <div className="h-20 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-lg font-semibold mb-2">Failed to load proxy endpoints</p>
            <p className="text-sm text-muted-foreground">
              Make sure the API server is running at{" "}
              <code className="bg-muted px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}
              </code>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!endpoints || endpoints.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-lg font-semibold mb-2">No proxy endpoints yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first proxy endpoint to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {endpoints.map((endpoint) => (
          <ProxyCard
            key={endpoint.id}
            endpoint={endpoint}
            onViewDetails={setSelectedEndpoint}
            onEdit={setEditingEndpoint}
          />
        ))}
      </div>

      <ProxyDetailsDialog
        endpoint={selectedEndpoint}
        open={!!selectedEndpoint}
        onOpenChange={(open) => !open && setSelectedEndpoint(null)}
        onEdit={(endpoint) => {
          setSelectedEndpoint(null);
          setEditingEndpoint(endpoint);
        }}
      />

      <EditProxyDialog
        endpoint={editingEndpoint}
        open={!!editingEndpoint}
        onOpenChange={(open) => !open && setEditingEndpoint(null)}
      />
    </>
  );
}
