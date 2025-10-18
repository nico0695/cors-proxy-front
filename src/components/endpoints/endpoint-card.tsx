"use client";

import { MockEndpoint } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Code, Power, PowerOff } from "lucide-react";
import { useUpdateEndpoint } from "@/hooks/use-endpoints";

interface EndpointCardProps {
  endpoint: MockEndpoint;
  onViewDetails?: (endpoint: MockEndpoint) => void;
}

export function EndpointCard({ endpoint, onViewDetails }: EndpointCardProps) {
  const updateMutation = useUpdateEndpoint();

  const toggleEnabled = () => {
    updateMutation.mutate({
      id: endpoint.id,
      data: { enabled: !endpoint.enabled },
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{endpoint.name}</CardTitle>
            <code className="text-sm text-muted-foreground font-mono">
              {endpoint.path}
            </code>
          </div>
          <Badge
            variant={endpoint.enabled ? "default" : "secondary"}
            className="ml-2"
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

      <CardContent className="space-y-2">
        <div className="flex items-center gap-4 text-sm">
          <Badge variant="outline">
            <Code className="h-3 w-3 mr-1" />
            {endpoint.statusCode}
          </Badge>
          <span className="text-muted-foreground flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {endpoint.delayMs}ms
          </span>
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">Content Type: </span>
          <span className="font-medium">{endpoint.contentType}</span>
        </div>

        {endpoint.groupId && (
          <div className="text-sm">
            <Badge variant="secondary">{endpoint.groupId}</Badge>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          variant={endpoint.enabled ? "outline" : "default"}
          size="sm"
          onClick={toggleEnabled}
          disabled={updateMutation.isPending}
        >
          {endpoint.enabled ? "Disable" : "Enable"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails?.(endpoint)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
