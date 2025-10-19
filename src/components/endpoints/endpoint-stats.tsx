"use client";

import { useStats } from "@/hooks/use-endpoints";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, XCircle, Database } from "lucide-react";

export function EndpointStats() {
  const { data: stats, isLoading, error } = useStats();

  if (isLoading) {
    return (
      <div className="flex items-center gap-6 py-2 px-4 bg-muted/30 rounded-lg border">
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-2 px-4 bg-destructive/10 rounded-lg border border-destructive/30">
        <p className="text-sm text-destructive">
          Failed to load statistics. Make sure the API is running.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4 py-2.5 px-4 bg-muted/30 rounded-lg border text-sm">
      <div className="flex items-center gap-2">
        <Database className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">Total:</span>
        <Badge variant="secondary" className="font-semibold">
          {stats?.total || 0}/{stats?.maxEndpoints || 50}
        </Badge>
      </div>

      <div className="w-px h-4 bg-border" />

      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <span className="text-muted-foreground">Active:</span>
        <Badge variant="outline" className="font-semibold border-green-600 text-green-600">
          {stats?.enabled || 0}
        </Badge>
      </div>

      <div className="w-px h-4 bg-border" />

      <div className="flex items-center gap-2">
        <XCircle className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">Inactive:</span>
        <Badge variant="outline" className="font-semibold">
          {stats?.disabled || 0}
        </Badge>
      </div>

      <div className="w-px h-4 bg-border" />

      <div className="flex items-center gap-2">
        <AlertCircle
          className={`h-4 w-4 ${
            stats && stats.remainingSlots <= 5
              ? "text-orange-500"
              : "text-muted-foreground"
          }`}
        />
        <span className="text-muted-foreground">Available:</span>
        <Badge
          variant={stats && stats.remainingSlots <= 5 ? "destructive" : "outline"}
          className={`font-semibold ${
            stats && stats.remainingSlots <= 5
              ? "bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200"
              : ""
          }`}
        >
          {stats?.remainingSlots || 0}
          {stats && stats.remainingSlots <= 5 && " ⚠️"}
        </Badge>
      </div>
    </div>
  );
}
