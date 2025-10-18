"use client";

import { useStats } from "@/hooks/use-endpoints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, XCircle, Database } from "lucide-react";

export function EndpointStats() {
  const { data: stats, isLoading, error } = useStats();

  console.log('EndpointStats - Loading:', isLoading);
  console.log('EndpointStats - Error:', error);
  console.log('EndpointStats - Data:', stats);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded" />
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
          <p className="text-sm text-destructive">
            Failed to load statistics. Make sure the API is running.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Endpoints</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.total || 0}</div>
          <p className="text-xs text-muted-foreground">
            of {stats?.maxEndpoints || 50} max
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Enabled</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.enabled || 0}</div>
          <p className="text-xs text-muted-foreground">Active endpoints</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Disabled</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.disabled || 0}</div>
          <p className="text-xs text-muted-foreground">Inactive endpoints</p>
        </CardContent>
      </Card>

      <Card
        className={
          stats && stats.remainingSlots <= 5 ? "border-orange-500" : ""
        }
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Remaining Slots
          </CardTitle>
          <AlertCircle
            className={`h-4 w-4 ${
              stats && stats.remainingSlots <= 5
                ? "text-orange-500"
                : "text-muted-foreground"
            }`}
          />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.remainingSlots || 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats && stats.remainingSlots <= 5 ? "⚠️ Running low" : "Available"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
