"use client";

import { useState } from "react";
import { useEndpoints } from "@/hooks/use-endpoints";
import { EndpointCard } from "./endpoint-card";
import { EndpointDetailsDialog } from "./endpoint-details-dialog";
import { EditEndpointDialog } from "./edit-endpoint-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { MockEndpoint } from "@/lib/types";

export function EndpointList() {
  const { data: endpoints, isLoading, error } = useEndpoints();
  const [selectedEndpoint, setSelectedEndpoint] = useState<MockEndpoint | null>(null);
  const [editingEndpoint, setEditingEndpoint] = useState<MockEndpoint | null>(null);

  console.log('EndpointList - Loading:', isLoading);
  console.log('EndpointList - Error:', error);
  console.log('EndpointList - Data:', endpoints);

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
            <p className="text-lg font-semibold mb-2">Failed to load endpoints</p>
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
            <p className="text-lg font-semibold mb-2">No endpoints yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first mock endpoint to get started
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
          <EndpointCard
            key={endpoint.id}
            endpoint={endpoint}
            onViewDetails={setSelectedEndpoint}
            onEdit={setEditingEndpoint}
          />
        ))}
      </div>

      <EndpointDetailsDialog
        endpoint={selectedEndpoint}
        open={!!selectedEndpoint}
        onOpenChange={(open) => !open && setSelectedEndpoint(null)}
        onEdit={(endpoint) => {
          setSelectedEndpoint(null);
          setEditingEndpoint(endpoint);
        }}
      />

      <EditEndpointDialog
        endpoint={editingEndpoint}
        open={!!editingEndpoint}
        onOpenChange={(open) => !open && setEditingEndpoint(null)}
      />
    </>
  );
}
