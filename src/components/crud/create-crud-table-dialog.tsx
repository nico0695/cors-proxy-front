"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCrudTableSchema, type CreateCrudTableFormData } from "@/lib/validations";
import { useCreateCrudTable } from "@/hooks/use-crud-tables";
import { getApiBaseUrl, joinUrl } from "@/lib/utils";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CreateCrudTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FIELD_TYPES = [
  { value: "string", label: "String" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "date", label: "Date" },
];

const apiBaseUrl = getApiBaseUrl();

export function CreateCrudTableDialog({ open, onOpenChange }: CreateCrudTableDialogProps) {
  const createMutation = useCreateCrudTable();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<CreateCrudTableFormData>({
    resolver: zodResolver(createCrudTableSchema),
    defaultValues: {
      name: "",
      basePath: "",
      schema: [{ name: "", type: "string", required: false }],
      maxEntries: 15,
      enabled: true,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "schema" });
  const enabled = watch("enabled");
  const basePath = watch("basePath");

  const onSubmit = async (data: CreateCrudTableFormData) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Table created successfully");
      reset();
      onOpenChange(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create table";
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Table</DialogTitle>
          <DialogDescription>
            Define a data table with a custom schema. It will be exposed as a public REST API.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Product Catalog"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="basePath">Base Path *</Label>
            <Input
              id="basePath"
              placeholder="products"
              {...register("basePath")}
            />
            <p className="text-xs text-muted-foreground">
              Serve URL:{" "}
              <code className="bg-muted px-1 rounded">
                {joinUrl(apiBaseUrl, `/api-crud/serve/${basePath || "…"}`)}
              </code>
            </p>
            {errors.basePath && (
              <p className="text-sm text-destructive">{errors.basePath.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxEntries">Max Entries</Label>
            <Input
              id="maxEntries"
              type="number"
              min={1}
              max={1000}
              {...register("maxEntries", { valueAsNumber: true })}
            />
            {errors.maxEntries && (
              <p className="text-sm text-destructive">{errors.maxEntries.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>
                Fields *{" "}
                <Badge variant="secondary" className="ml-1">
                  {fields.length}
                </Badge>
              </Label>
            </div>

            {errors.schema && !Array.isArray(errors.schema) && (
              <p className="text-sm text-destructive">{errors.schema.message}</p>
            )}

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex-1 space-y-1">
                    <Input
                      placeholder="fieldName"
                      {...register(`schema.${index}.name`)}
                    />
                    {errors.schema?.[index]?.name && (
                      <p className="text-xs text-destructive">
                        {errors.schema[index]?.name?.message}
                      </p>
                    )}
                  </div>
                  <Select
                    value={watch(`schema.${index}.type`)}
                    onValueChange={(val) =>
                      setValue(`schema.${index}.type`, val as "string" | "number" | "boolean" | "date")
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELD_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-1.5 pt-2">
                    <Switch
                      checked={watch(`schema.${index}.required`)}
                      onCheckedChange={(checked) =>
                        setValue(`schema.${index}.required`, checked)
                      }
                    />
                    <span className="text-xs text-muted-foreground">Required</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-0.5 h-9 w-9 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(index)}
                    disabled={fields.length <= 1}
                    title="Remove field"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => append({ name: "", type: "string", required: false })}
              disabled={fields.length >= 20}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="enabled"
              checked={enabled}
              onCheckedChange={(checked) => setValue("enabled", checked)}
            />
            <Label htmlFor="enabled">Enable table</Label>
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
              Create Table
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
