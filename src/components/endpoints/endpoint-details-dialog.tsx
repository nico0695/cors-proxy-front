"use client";

import { MockEndpoint } from "@/lib/types";
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

interface EndpointDetailsDialogProps {
  endpoint: MockEndpoint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (endpoint: MockEndpoint) => void;
}

export function EndpointDetailsDialog({
  endpoint,
  open,
  onOpenChange,
  onEdit,
}: EndpointDetailsDialogProps) {
  if (!endpoint) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const fullUrl = `${apiBaseUrl}/api-mock/serve${endpoint.path}`;

  const formatResponseData = () => {
    if (endpoint.contentType === "application/json") {
      try {
        return JSON.stringify(endpoint.responseData, null, 2);
      } catch {
        return String(endpoint.responseData);
      }
    }
    return String(endpoint.responseData);
  };

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
                <span className="text-muted-foreground">Status Code:</span>
                <div className="mt-1">
                  <Badge variant="outline">{endpoint.statusCode}</Badge>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Content Type:</span>
                <p className="font-mono text-xs">{endpoint.contentType}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Delay:</span>
                <p>{endpoint.delayMs}ms</p>
              </div>
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
            <h3 className="font-semibold text-sm">Endpoint URL</h3>
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

          {/* Response Data */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Response Data</h3>
            <pre className="bg-muted p-4 rounded text-xs font-mono overflow-x-auto max-h-64">
              {formatResponseData()}
            </pre>
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
