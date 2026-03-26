'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { CheckCircle, XCircle } from 'lucide-react';
import {
  useCrudEntries,
  useCreateCrudEntry,
  useUpdateCrudEntry,
  useDeleteCrudEntry,
} from '@/hooks/use-crud-tables';
import { CrudEntry, CrudFieldDefinition, CrudTable } from '@/lib/types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface CrudEntriesTableProps {
  table: CrudTable;
}

function formatCellValue(
  value: unknown,
  type: CrudFieldDefinition['type'],
): React.ReactNode {
  if (value === undefined || value === null) {
    return <span className="text-muted-foreground italic text-xs">—</span>;
  }
  if (type === 'boolean') {
    return value ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-muted-foreground" />
    );
  }
  if (type === 'date') {
    try {
      return format(new Date(String(value)), 'MMM d, yyyy');
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function validateEntryForm(
  data: Record<string, unknown>,
  schema: CrudFieldDefinition[],
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of schema) {
    const value = data[field.name];
    if (field.required) {
      if (value === undefined || value === null || value === '') {
        errors[field.name] = `${field.name} is required`;
        continue;
      }
    }
    if (value !== undefined && value !== null && value !== '') {
      if (field.type === 'number' && isNaN(Number(value))) {
        errors[field.name] = `${field.name} must be a number`;
      }
    }
  }
  return errors;
}

function buildInitialFormData(
  schema: CrudFieldDefinition[],
): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const field of schema) {
    if (field.type === 'boolean') data[field.name] = false;
    else data[field.name] = '';
  }
  return data;
}

export function CrudEntriesTable({ table }: CrudEntriesTableProps) {
  const { data: entries, isLoading, error } = useCrudEntries(table.basePath);
  const createMutation = useCreateCrudEntry(table.basePath);
  const updateMutation = useUpdateCrudEntry(table.basePath);
  const deleteMutation = useDeleteCrudEntry(table.basePath);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CrudEntry | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const openAdd = () => {
    setEditingEntry(null);
    setFormData(buildInitialFormData(table.schema));
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEdit = (entry: CrudEntry) => {
    setEditingEntry(entry);
    const data: Record<string, unknown> = {};
    for (const field of table.schema) {
      data[field.name] =
        entry[field.name] ?? (field.type === 'boolean' ? false : '');
    }
    setFormData(data);
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleDelete = (entryId: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      deleteMutation.mutate(entryId, {
        onSuccess: () => toast.success('Entry deleted'),
        onError: (error) =>
          toast.error(error.message || 'Failed to delete entry'),
      });
    }
  };

  const handleSubmit = async () => {
    const errors = validateEntryForm(formData, table.schema);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Coerce number fields
    const payload: Record<string, unknown> = { ...formData };
    for (const field of table.schema) {
      if (
        field.type === 'number' &&
        payload[field.name] !== '' &&
        payload[field.name] !== undefined
      ) {
        payload[field.name] = Number(payload[field.name]);
      }
    }

    try {
      if (editingEntry) {
        await updateMutation.mutateAsync({
          entryId: editingEntry.id,
          data: payload,
        });
        toast.success('Entry updated');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Entry created');
      }
      setDialogOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to save entry';
      if (message.toLowerCase().includes('full') || message.includes('422')) {
        toast.error(
          'Table is full. Delete some entries or increase maxEntries.',
        );
      } else if (
        message.toLowerCase().includes('disabled') ||
        message.includes('503')
      ) {
        toast.error('This table is currently disabled.');
      } else {
        toast.error(message);
      }
    }
  };

  const renderField = (field: CrudFieldDefinition) => {
    const value = formData[field.name];
    const fieldError = formErrors[field.name];

    if (field.type === 'boolean') {
      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={Boolean(value)}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, [field.name]: checked }))
            }
          />
          <span className="text-sm text-muted-foreground">
            {value ? 'True' : 'False'}
          </span>
        </div>
      );
    }

    if (field.type === 'date') {
      const dateVal = value ? String(value).slice(0, 10) : '';
      return (
        <Input
          type="date"
          value={dateVal}
          onChange={(e) => {
            const iso = e.target.value
              ? new Date(e.target.value).toISOString()
              : '';
            setFormData((prev) => ({ ...prev, [field.name]: iso }));
            if (fieldError)
              setFormErrors((prev) => ({ ...prev, [field.name]: '' }));
          }}
          className={fieldError ? 'border-destructive' : ''}
        />
      );
    }

    if (field.type === 'number') {
      return (
        <Input
          type="number"
          value={String(value ?? '')}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, [field.name]: e.target.value }));
            if (fieldError)
              setFormErrors((prev) => ({ ...prev, [field.name]: '' }));
          }}
          className={fieldError ? 'border-destructive' : ''}
        />
      );
    }

    return (
      <Input
        type="text"
        value={String(value ?? '')}
        onChange={(e) => {
          setFormData((prev) => ({ ...prev, [field.name]: e.target.value }));
          if (fieldError)
            setFormErrors((prev) => ({ ...prev, [field.name]: '' }));
        }}
        className={fieldError ? 'border-destructive' : ''}
      />
    );
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Entries{' '}
          {!isLoading && entries !== undefined && (
            <span className="text-muted-foreground font-normal text-base">
              ({entries.length})
            </span>
          )}
        </h2>
        <Button size="sm" onClick={openAdd} disabled={!table.enabled}>
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </div>

      {isLoading && <div className="h-32 bg-muted animate-pulse rounded-lg" />}

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load entries.
        </div>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto rounded-lg border">
          {!entries || entries.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              {'No entries yet. Click "Add Entry" to create one.'}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {table.schema.map((field) => (
                    <th
                      key={field.name}
                      className="px-4 py-3 text-left font-medium whitespace-nowrap"
                    >
                      {field.name}
                      {field.required && (
                        <span className="text-destructive ml-0.5">*</span>
                      )}
                      <span className="text-xs text-muted-foreground ml-1 font-normal">
                        ({field.type})
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left font-medium whitespace-nowrap">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-t hover:bg-muted/30">
                    {table.schema.map((field) => (
                      <td key={field.name} className="px-4 py-3">
                        {formatCellValue(entry[field.name], field.type)}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {format(new Date(entry.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => openEdit(entry)}
                          title="Edit entry"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:text-destructive"
                          onClick={() => handleDelete(entry.id)}
                          disabled={deleteMutation.isPending}
                          title="Delete entry"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEntry ? 'Edit Entry' : 'Add Entry'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {table.schema.map((field) => (
              <div key={field.name} className="space-y-1.5">
                <Label>
                  {field.name}
                  {field.required && (
                    <span className="text-destructive ml-0.5">*</span>
                  )}
                  <span className="text-xs text-muted-foreground ml-1">
                    ({field.type})
                  </span>
                </Label>
                {renderField(field)}
                {formErrors[field.name] && (
                  <p className="text-xs text-destructive">
                    {formErrors[field.name]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingEntry ? 'Save Changes' : 'Create Entry'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
