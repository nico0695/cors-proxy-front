'use client';

import { CrudTable } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Power,
  PowerOff,
  Edit,
  Copy,
  ExternalLink,
  Trash2,
  Rows3,
  BookOpen,
} from 'lucide-react';
import {
  useUpdateCrudTable,
  useDeleteCrudTable,
} from '@/hooks/use-crud-tables';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface CrudTableCardProps {
  table: CrudTable;
  onViewDetails?: (table: CrudTable) => void;
  onEdit?: (table: CrudTable) => void;
  onApiGuide?: (table: CrudTable) => void;
}

export function CrudTableCard({
  table,
  onViewDetails,
  onEdit,
  onApiGuide,
}: CrudTableCardProps) {
  const updateMutation = useUpdateCrudTable();
  const deleteMutation = useDeleteCrudTable();
  const { user } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const serveUrl = `${apiBaseUrl}/api-crud/serve/${table.basePath}`;

  const toggleEnabled = () => {
    updateMutation.mutate(
      { id: table.id, data: { enabled: !table.enabled } },
      {
        onSuccess: () => {
          toast.success(
            `Table ${!table.enabled ? 'enabled' : 'disabled'} successfully`,
          );
        },
        onError: () => {
          toast.error('Failed to update table status');
        },
      },
    );
  };

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete "${table.name}"? This will permanently delete all its entries.`,
      )
    ) {
      deleteMutation.mutate(table.id, {
        onSuccess: () => {
          toast.success('Table deleted successfully');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to delete table');
        },
      });
    }
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(serveUrl);
      setCopied(true);
      toast.success('URL copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy URL');
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base mb-1.5">{table.name}</CardTitle>
            <div className="flex items-center gap-1.5">
              <code className="text-xs text-muted-foreground font-mono truncate">
                {table.basePath}
              </code>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 shrink-0"
                onClick={copyUrl}
                title="Copy serve URL"
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
            variant={table.enabled ? 'default' : 'secondary'}
            className="shrink-0"
          >
            {table.enabled ? (
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
            <span className="text-muted-foreground">Fields:</span>
            <span className="font-medium">{table.schema.length}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Max entries:</span>
            <span className="font-medium">{table.maxEntries}</span>
          </div>
          {user?.role === 'admin' && (
            <div className="col-span-2 flex items-center gap-1.5">
              <span className="text-muted-foreground">Owner:</span>
              <Badge
                variant="secondary"
                className="text-xs font-mono truncate max-w-[160px]"
              >
                {table.ownerUserId}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-3 flex flex-col gap-2">
        <div className="flex w-full gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className={`h-7 text-xs px-3 flex-1 ${
              table.enabled
                ? 'hover:bg-red-50 hover:text-red-600 hover:border-red-300'
                : 'bg-red-50 text-red-600 border-red-300 hover:bg-red-100'
            }`}
            onClick={toggleEnabled}
            disabled={updateMutation.isPending}
          >
            {table.enabled ? 'Disable' : 'Enable'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs px-3 flex-1"
            onClick={() => onEdit?.(table)}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs px-3 flex-1"
            onClick={() => onViewDetails?.(table)}
          >
            Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs px-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            title="Delete table"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
        <div className="flex w-full gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs flex-1 border-teal-600 text-teal-700 hover:bg-teal-50 hover:text-teal-800 dark:border-teal-500 dark:text-teal-400 dark:hover:bg-teal-950"
            onClick={() => router.push(`/crud/${table.id}`)}
          >
            <Rows3 className="h-3 w-3 mr-1.5" />
            Manage Entries
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs flex-1 border-violet-400 text-violet-700 hover:bg-violet-50 hover:text-violet-800 dark:border-violet-500 dark:text-violet-400 dark:hover:bg-violet-950"
            onClick={() => onApiGuide?.(table)}
          >
            <BookOpen className="h-3 w-3 mr-1.5" />
            API Guide
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
