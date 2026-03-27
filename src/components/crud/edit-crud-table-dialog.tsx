'use client';

import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  updateCrudTableSchema,
  type UpdateCrudTableFormData,
} from '@/lib/validations';
import { useUpdateCrudTable } from '@/hooks/use-crud-tables';
import { crudEntryKeys } from '@/hooks/use-crud-tables';
import { api } from '@/lib/api';
import { CrudTable } from '@/lib/types';
import { getApiBaseUrl, joinUrl } from '@/lib/utils';
import { AlertCircle, Loader2, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EditCrudTableDialogProps {
  table: CrudTable | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FIELD_TYPES = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'date', label: 'Date' },
];

const apiBaseUrl = getApiBaseUrl();

export function EditCrudTableDialog({
  table,
  open,
  onOpenChange,
}: EditCrudTableDialogProps) {
  const updateMutation = useUpdateCrudTable();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<UpdateCrudTableFormData>({
    resolver: zodResolver(updateCrudTableSchema),
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'schema',
  });

  // Check if the table has entries (to lock schema editing)
  const { data: hasEntries } = useQuery({
    queryKey: crudEntryKeys.lists(table?.basePath ?? ''),
    queryFn: () => api.getCrudEntries(table!.basePath),
    select: (data) => data.length > 0,
    enabled: !!table,
  });

  useEffect(() => {
    if (table) {
      reset({
        name: table.name,
        basePath: table.basePath,
        maxEntries: table.maxEntries,
        enabled: table.enabled,
        schema: table.schema.map((f) => ({ ...f })),
      });
      replace(table.schema.map((f) => ({ ...f })));
    }
  }, [table, reset, replace]);

  const enabled = watch('enabled');
  const basePath = watch('basePath');

  const onSubmit = async (data: UpdateCrudTableFormData) => {
    if (!table) return;
    try {
      await updateMutation.mutateAsync({ id: table.id, data });
      toast.success('Table updated successfully');
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update table';
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Table</DialogTitle>
          <DialogDescription>
            Update table configuration. Schema changes require the table to have
            no entries.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name *</Label>
            <Input
              id="edit-name"
              placeholder="Product Catalog"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-basePath">Base Path *</Label>
            <Input
              id="edit-basePath"
              placeholder="products"
              {...register('basePath')}
            />
            <p className="text-xs text-muted-foreground">
              Serve URL:{' '}
              <code className="bg-muted px-1 rounded">
                {joinUrl(apiBaseUrl, `/api-crud/serve/${basePath || '…'}`)}
              </code>
            </p>
            {errors.basePath && (
              <p className="text-sm text-destructive">
                {errors.basePath.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-maxEntries">Max Entries</Label>
            <Input
              id="edit-maxEntries"
              type="number"
              min={1}
              max={1000}
              {...register('maxEntries', { valueAsNumber: true })}
            />
            {errors.maxEntries && (
              <p className="text-sm text-destructive">
                {errors.maxEntries.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>
                Fields *{' '}
                <Badge variant="secondary" className="ml-1">
                  {fields.length}
                </Badge>
              </Label>
            </div>

            {hasEntries && (
              <div className="flex items-start gap-2 rounded-md border border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30 dark:border-yellow-700 px-3 py-2.5 text-sm text-yellow-800 dark:text-yellow-300">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  This table has existing entries. The schema cannot be modified
                  until all entries are deleted.
                </span>
              </div>
            )}

            {errors.schema && !Array.isArray(errors.schema) && (
              <p className="text-sm text-destructive">
                {errors.schema.message}
              </p>
            )}

            <div
              className={`space-y-2 ${hasEntries ? 'pointer-events-none opacity-50' : ''}`}
            >
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
                      setValue(
                        `schema.${index}.type`,
                        val as 'string' | 'number' | 'boolean' | 'date',
                      )
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
                    <span className="text-xs text-muted-foreground">
                      Required
                    </span>
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

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() =>
                  append({ name: '', type: 'string', required: false })
                }
                disabled={fields.length >= 20}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="edit-enabled"
              checked={enabled ?? true}
              onCheckedChange={(checked) => setValue('enabled', checked)}
            />
            <Label htmlFor="edit-enabled">Enable table</Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
