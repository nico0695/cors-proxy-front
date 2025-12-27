"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
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
import { Switch } from "@/components/ui/switch";
import { DelayInput } from "@/components/ui/delay-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProxyEndpointSchema, type CreateProxyEndpointFormData, MAX_PROXY_DELAY_MS } from "@/lib/validations";
import { useCreateProxyEndpoint } from "@/hooks/use-proxy-endpoints";
import { Loader2 } from "lucide-react";

interface CreateProxyDialogProps {
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
  { value: "502", label: "502 - Bad Gateway" },
  { value: "503", label: "503 - Service Unavailable" },
];

export function CreateProxyDialog({ open, onOpenChange }: CreateProxyDialogProps) {
  const createMutation = useCreateProxyEndpoint();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateProxyEndpointFormData>({
    resolver: zodResolver(createProxyEndpointSchema),
    defaultValues: {
      name: "",
      path: "",
      baseUrl: "",
      groupId: "",
      enabled: true,
      delayMs: 0,
    },
  });

  const enabled = watch("enabled");
  const statusCodeOverride = watch("statusCodeOverride");

  const onSubmit = async (data: CreateProxyEndpointFormData) => {
    try {
      await createMutation.mutateAsync(data);

      toast.success("Proxy endpoint created successfully");
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create proxy endpoint:", error);
      toast.error("Failed to create proxy endpoint. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Proxy Endpoint</DialogTitle>
          <DialogDescription>
            Create a new HTTP proxy endpoint. Configure forwarding to upstream servers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="My Proxy Endpoint"
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
            <Label htmlFor="baseUrl">Base URL *</Label>
            <Input
              id="baseUrl"
              placeholder="https://api.example.com"
              {...register("baseUrl")}
            />
            <p className="text-xs text-muted-foreground">
              Must start with http:// or https://
            </p>
            {errors.baseUrl && (
              <p className="text-sm text-destructive">{errors.baseUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="groupId">Group ID (optional)</Label>
            <Input
              id="groupId"
              placeholder="external-apis"
              {...register("groupId")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="statusCodeOverride">Status Code Override (optional)</Label>
            <Select
              value={statusCodeOverride?.toString() || "none"}
              onValueChange={(value) =>
                setValue("statusCodeOverride", value === "none" ? undefined : parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="None - Use upstream response" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None - Use upstream response</SelectItem>
                {STATUS_CODES.map((code) => (
                  <SelectItem key={code.value} value={code.value}>
                    {code.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              When set, prevents upstream call and returns this status code
            </p>
          </div>

          <DelayInput
            value={watch("delayMs") || 0}
            onChange={(value) => setValue("delayMs", value)}
            error={errors.delayMs?.message}
          />

          <div className="flex items-center space-x-2">
            <Switch
              id="enabled"
              checked={enabled}
              onCheckedChange={(checked) => setValue("enabled", checked)}
            />
            <Label htmlFor="enabled">Enable proxy endpoint</Label>
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
              Create Proxy Endpoint
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
