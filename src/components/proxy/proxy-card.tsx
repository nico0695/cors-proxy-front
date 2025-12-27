"use client";

import { ProxyEndpoint } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Code, Power, PowerOff, Edit, Copy, ExternalLink, Trash2 } from "lucide-react";
import { useUpdateProxyEndpoint, useDeleteProxyEndpoint } from "@/hooks/use-proxy-endpoints";
import { useState } from "react";
import toast from "react-hot-toast";

interface ProxyCardProps {
  endpoint: ProxyEndpoint;
  onViewDetails?: (endpoint: ProxyEndpoint) => void;
  onEdit?: (endpoint: ProxyEndpoint) => void;
}

export function ProxyCard({ endpoint, onViewDetails, onEdit }: ProxyCardProps) {
  const updateMutation = useUpdateProxyEndpoint();
  const deleteMutation = useDeleteProxyEndpoint();
  const [copied, setCopied] = useState(false);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const fullUrl = `${apiBaseUrl}/api-proxy/serve${endpoint.path}`;

  const toggleEnabled = () => {
    updateMutation.mutate(
      {
        id: endpoint.id,
        data: { enabled: !endpoint.enabled },
      },
      {
        onSuccess: () => {
          toast.success(`Proxy endpoint ${!endpoint.enabled ? "enabled" : "disabled"} successfully`);
        },
        onError: () => {
          toast.error("Failed to update proxy endpoint status");
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${endpoint.name}"?`)) {
      deleteMutation.mutate(endpoint.id, {
        onSuccess: () => {
          toast.success("Proxy endpoint deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete proxy endpoint");
        },
      });
    }
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success("URL copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy URL");
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base mb-1.5">{endpoint.name}</CardTitle>
            <div className="flex items-center gap-1.5">
              <code className="text-xs text-muted-foreground font-mono truncate">
                {endpoint.path}
              </code>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 shrink-0"
                onClick={copyUrl}
                title="Copy URL"
              >
                {copied ? (
                  <ExternalLink className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
          <Badge
            variant={endpoint.enabled ? "default" : "secondary"}
            className="shrink-0"
          >
            {endpoint.enabled ? (
              <>
                <Power className="h-3 w-3 mr-1" />
                Active
              </>
            ) : (
              <>
                <PowerOff className="h-3 w-3 mr-1" />
                Inactive
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">{endpoint.delayMs}ms</span>
          </div>
          {endpoint.statusCodeOverride && (
            <div className="flex items-center gap-1.5">
              <Code className="h-3 w-3 text-orange-500 shrink-0" />
              <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">
                Override: {endpoint.statusCodeOverride}
              </Badge>
            </div>
          )}
          <div className="col-span-2 truncate" title={endpoint.baseUrl}>
            <span className="text-muted-foreground">Target: </span>
            <span className="font-medium text-xs">{endpoint.baseUrl}</span>
          </div>
          {endpoint.groupId && (
            <div className="col-span-2">
              <Badge variant="secondary" className="text-xs">
                {endpoint.groupId}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-3 flex gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className={`h-7 text-xs px-3 flex-1 ${
            endpoint.enabled
              ? "hover:bg-red-50 hover:text-red-600 hover:border-red-300"
              : "bg-red-50 text-red-600 border-red-300 hover:bg-red-100"
          }`}
          onClick={toggleEnabled}
          disabled={updateMutation.isPending}
        >
          {endpoint.enabled ? "Disable" : "Enable"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs px-3 flex-1"
          onClick={() => onEdit?.(endpoint)}
        >
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs px-3 flex-1"
          onClick={() => onViewDetails?.(endpoint)}
        >
          Details
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs px-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          title="Delete proxy endpoint"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}
