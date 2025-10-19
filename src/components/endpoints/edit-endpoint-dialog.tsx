"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JsonEditor } from "@/components/ui/json-editor";
import { updateEndpointSchema, type UpdateEndpointFormData } from "@/lib/validations";
import { useUpdateEndpoint } from "@/hooks/use-endpoints";
import { Loader2 } from "lucide-react";
import type { MockEndpoint } from "@/lib/types";

interface EditEndpointDialogProps {
  endpoint: MockEndpoint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_CODES = [
  { value: "200", label: "200 - OK" },
  { value: "201", label: "201 - Created" },
  { value: "204", label: "204 - No Content" },
  { value: "400", label: "400 - Bad Request" },
  { value: "401", label: "401 - Unauthorized" },
  { value: "403", label: "403 - Forbidden" },
  { value: "404", label: "404 - Not Found" },
  { value: "500", label: "500 - Internal Server Error" },
  { value: "503", label: "503 - Service Unavailable" },
];

const CONTENT_TYPES = [
  { value: "application/json", label: "JSON" },
  { value: "application/xml", label: "XML" },
  { value: "text/plain", label: "Plain Text" },
  { value: "text/html", label: "HTML" },
];

export function EditEndpointDialog({
  endpoint,
  open,
  onOpenChange
}: EditEndpointDialogProps) {
  const updateMutation = useUpdateEndpoint();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UpdateEndpointFormData>({
    resolver: zodResolver(updateEndpointSchema),
  });

  const contentType = watch("contentType");
  const enabled = watch("enabled");

  // Populate form when endpoint changes
  useEffect(() => {
    if (endpoint) {
      // Format response data based on content type
      let formattedResponseData = "";
      if (endpoint.contentType === "application/json") {
        try {
          formattedResponseData = JSON.stringify(endpoint.responseData, null, 2);
        } catch {
          formattedResponseData = String(endpoint.responseData);
        }
      } else {
        formattedResponseData = String(endpoint.responseData);
      }

      reset({
        name: endpoint.name,
        path: endpoint.path,
        groupId: endpoint.groupId || "",
        responseData: formattedResponseData,
        contentType: endpoint.contentType as any,
        statusCode: endpoint.statusCode,
        enabled: endpoint.enabled,
        delayMs: endpoint.delayMs,
      });
    }
  }, [endpoint, reset]);

  const onSubmit = async (data: UpdateEndpointFormData) => {
    if (!endpoint) return;

    try {
      // Parse responseData as JSON if content type is JSON
      let parsedResponseData: unknown = data.responseData;
      if (data.contentType === "application/json" && data.responseData) {
        try {
          parsedResponseData = JSON.parse(data.responseData);
        } catch (e) {
          alert("Invalid JSON in response data");
          return;
        }
      }

      // Only include fields that were actually provided
      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.path !== undefined) updateData.path = data.path;
      if (data.groupId !== undefined) updateData.groupId = data.groupId;
      if (data.responseData !== undefined) updateData.responseData = parsedResponseData;
      if (data.contentType !== undefined) updateData.contentType = data.contentType;
      if (data.statusCode !== undefined) updateData.statusCode = data.statusCode;
      if (data.enabled !== undefined) updateData.enabled = data.enabled;
      if (data.delayMs !== undefined) updateData.delayMs = data.delayMs;

      await updateMutation.mutateAsync({
        id: endpoint.id,
        data: updateData,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update endpoint:", error);
      alert("Failed to update endpoint. Please try again.");
    }
  };

  if (!endpoint) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Endpoint</DialogTitle>
          <DialogDescription>
            Update the endpoint configuration. Only modified fields will be updated.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="My Test Endpoint"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="path">Path</Label>
            <Input
              id="path"
              placeholder="/api/users"
              {...register("path")}
            />
            {errors.path && (
              <p className="text-sm text-destructive">{errors.path.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="groupId">Group ID</Label>
            <Input
              id="groupId"
              placeholder="auth-endpoints"
              {...register("groupId")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type</Label>
              <Select
                value={contentType}
                onValueChange={(value) =>
                  setValue("contentType", value as any)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="statusCode">Status Code</Label>
              <Select
                value={watch("statusCode")?.toString()}
                onValueChange={(value) =>
                  setValue("statusCode", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_CODES.map((code) => (
                    <SelectItem key={code.value} value={code.value}>
                      {code.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delayMs">Delay (ms)</Label>
            <Input
              id="delayMs"
              type="number"
              min="0"
              max="10000"
              placeholder="0"
              {...register("delayMs", { valueAsNumber: true })}
            />
            {errors.delayMs && (
              <p className="text-sm text-destructive">{errors.delayMs.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="responseData">Response Data</Label>
            {contentType === "application/json" ? (
              <JsonEditor
                value={watch("responseData") || ""}
                onChange={(value) => setValue("responseData", value)}
                placeholder='{"message": "Hello World"}'
                minHeight="300px"
              />
            ) : (
              <Textarea
                id="responseData"
                placeholder="Your response data here"
                rows={8}
                className="font-mono text-sm"
                {...register("responseData")}
              />
            )}
            {errors.responseData && (
              <p className="text-sm text-destructive">
                {errors.responseData.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="enabled"
              checked={enabled}
              onCheckedChange={(checked) => setValue("enabled", checked)}
            />
            <Label htmlFor="enabled">Enable endpoint</Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Endpoint
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
