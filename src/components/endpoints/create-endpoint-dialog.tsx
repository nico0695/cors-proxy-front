"use client";

import { useState } from "react";
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
import { createEndpointSchema, type CreateEndpointFormData } from "@/lib/validations";
import { useCreateEndpoint } from "@/hooks/use-endpoints";
import { Loader2 } from "lucide-react";

interface CreateEndpointDialogProps {
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

export function CreateEndpointDialog({ open, onOpenChange }: CreateEndpointDialogProps) {
  const createMutation = useCreateEndpoint();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateEndpointFormData>({
    resolver: zodResolver(createEndpointSchema),
    defaultValues: {
      name: "",
      path: "",
      groupId: "",
      responseData: "",
      contentType: "application/json",
      statusCode: 200,
      enabled: true,
      delayMs: 0,
    },
  });

  const contentType = watch("contentType");
  const enabled = watch("enabled");

  const onSubmit = async (data: CreateEndpointFormData) => {
    try {
      // Parse responseData as JSON if content type is JSON
      let parsedResponseData: unknown = data.responseData;
      if (data.contentType === "application/json") {
        try {
          parsedResponseData = JSON.parse(data.responseData);
        } catch (e) {
          alert("Invalid JSON in response data");
          return;
        }
      }

      await createMutation.mutateAsync({
        ...data,
        responseData: parsedResponseData,
      });

      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create endpoint:", error);
      alert("Failed to create endpoint. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Endpoint</DialogTitle>
          <DialogDescription>
            Create a new mock API endpoint. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
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
            <Label htmlFor="path">Path *</Label>
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
            <Label htmlFor="groupId">Group ID (optional)</Label>
            <Input
              id="groupId"
              placeholder="auth-endpoints"
              {...register("groupId")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type *</Label>
              <Select
                defaultValue="application/json"
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
              <Label htmlFor="statusCode">Status Code *</Label>
              <Select
                defaultValue="200"
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
            <Label htmlFor="responseData">Response Data *</Label>
            <Textarea
              id="responseData"
              placeholder={
                contentType === "application/json"
                  ? '{"message": "Hello World"}'
                  : "Your response data here"
              }
              rows={8}
              className="font-mono text-sm"
              {...register("responseData")}
            />
            {errors.responseData && (
              <p className="text-sm text-destructive">
                {errors.responseData.message}
              </p>
            )}
            {contentType === "application/json" && (
              <p className="text-xs text-muted-foreground">
                Must be valid JSON
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
                reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Endpoint
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
