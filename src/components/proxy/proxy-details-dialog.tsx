"use client";

import { ProxyEndpoint } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Edit } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface ProxyDetailsDialogProps {
  endpoint: ProxyEndpoint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (endpoint: ProxyEndpoint) => void;
}

export function ProxyDetailsDialog({
  endpoint,
  open,
  onOpenChange,
  onEdit,
}: ProxyDetailsDialogProps) {
  if (!endpoint) return null;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const fullUrl = `${apiBaseUrl}/api-proxy/serve${endpoint.path}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                {endpoint.name}
                <Badge variant={endpoint.enabled ? "default" : "secondary"}>
                  {endpoint.enabled ? "Active" : "Inactive"}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                <code className="text-sm font-mono">{endpoint.path}</code>
              </DialogDescription>
            </div>
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onEdit(endpoint);
                  onOpenChange(false);
                }}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">ID:</span>
                <p className="font-mono">{endpoint.id}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Delay:</span>
                <p>{endpoint.delayMs}ms</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Base URL:</span>
                <p className="font-mono text-xs break-all">
                  {endpoint.baseUrl || (
                    <span className="italic text-muted-foreground">
                      Dynamic mode - requires ?url= parameter
                    </span>
                  )}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Cache:</span>
                <p>
                  {endpoint.useCache ? (
                    <Badge variant="outline" className="border-green-500 text-green-600 dark:border-green-400 dark:text-green-400">
                      Enabled (5 min TTL)
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">Disabled</span>
                  )}
                </p>
              </div>
              {endpoint.statusCodeOverride && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Status Override:</span>
                  <div className="mt-1">
                    <Badge variant="outline" className="border-orange-500 text-orange-600">
                      {endpoint.statusCodeOverride} (Upstream call prevented)
                    </Badge>
                  </div>
                </div>
              )}
              {endpoint.groupId && (
                <div>
                  <span className="text-muted-foreground">Group:</span>
                  <div className="mt-1">
                    <Badge variant="secondary">{endpoint.groupId}</Badge>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* URL */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Proxy URL</h3>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono break-all">
                {fullUrl}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(fullUrl)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(fullUrl, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Timestamps</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Created:</span>
                <p>{format(new Date(endpoint.createdAt), "PPpp")}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Last Updated:</span>
                <p>{format(new Date(endpoint.updatedAt), "PPpp")}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
