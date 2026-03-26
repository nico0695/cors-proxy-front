'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Edit, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { CrudTable } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface CrudTableDetailsDialogProps {
  table: CrudTable | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (table: CrudTable) => void;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export function CrudTableDetailsDialog({
  table,
  open,
  onOpenChange,
  onEdit,
}: CrudTableDetailsDialogProps) {
  const { user } = useAuth();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  if (!table) return null;

  const serveUrl = `${apiBaseUrl}/api-crud/serve/${table.basePath}`;

  const copyToClipboard = async (text: string, type: 'url' | 'id') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'url') {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      } else {
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
      }
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2 pr-6">
            <DialogTitle className="flex items-center gap-2">
              {table.name}
              <Badge variant={table.enabled ? 'default' : 'secondary'}>
                {table.enabled ? 'Active' : 'Inactive'}
              </Badge>
            </DialogTitle>
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onEdit(table);
                }}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs mb-1">ID</p>
              <div className="flex items-center gap-1">
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded truncate max-w-[140px]">
                  {table.id}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0"
                  onClick={() => copyToClipboard(table.id, 'id')}
                >
                  {copiedId ? (
                    <ExternalLink className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Base Path</p>
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                {table.basePath}
              </code>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Max Entries</p>
              <span className="font-medium">{table.maxEntries}</span>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Fields</p>
              <span className="font-medium">{table.schema.length}</span>
            </div>
            {user?.role === 'admin' && (
              <div className="col-span-2">
                <p className="text-muted-foreground text-xs mb-1">Owner ID</p>
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded break-all">
                  {table.ownerUserId}
                </code>
              </div>
            )}
            <div>
              <p className="text-muted-foreground text-xs mb-1">Created</p>
              <span className="text-xs">
                {format(new Date(table.createdAt), 'MMM d, yyyy HH:mm')}
              </span>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Updated</p>
              <span className="text-xs">
                {format(new Date(table.updatedAt), 'MMM d, yyyy HH:mm')}
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Schema</p>
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Name</th>
                    <th className="px-3 py-2 text-left font-medium">Type</th>
                    <th className="px-3 py-2 text-left font-medium">
                      Required
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {table.schema.map((field) => (
                    <tr key={field.name} className="border-t">
                      <td className="px-3 py-2">
                        <code className="bg-muted px-1 rounded">
                          {field.name}
                        </code>
                      </td>
                      <td className="px-3 py-2">
                        <Badge variant="outline" className="text-xs">
                          {field.type}
                        </Badge>
                      </td>
                      <td className="px-3 py-2">
                        {field.required ? (
                          <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Serve URL</p>
            <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2">
              <code className="text-xs flex-1 truncate">{serveUrl}</code>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 shrink-0"
                onClick={() => copyToClipboard(serveUrl, 'url')}
                title="Copy serve URL"
              >
                {copiedUrl ? (
                  <ExternalLink className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Public endpoint — no authentication required
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
