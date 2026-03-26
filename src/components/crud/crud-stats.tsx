'use client';

import { useCrudStats } from '@/hooks/use-crud-tables';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, XCircle, Table2 } from 'lucide-react';

export function CrudStats() {
  const { data: stats, isLoading, error } = useCrudStats();

  if (isLoading) {
    return (
      <div className="flex items-center gap-6 py-2 px-4 bg-muted/30 rounded-lg border">
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-2 px-4 bg-destructive/10 rounded-lg border border-destructive/30">
        <p className="text-sm text-destructive">
          Failed to load statistics. Make sure the API is running.
        </p>
      </div>
    );
  }

  const isUnlimited = stats?.maxTables === null;
  const isLow =
    !isUnlimited &&
    stats !== undefined &&
    stats.remaining !== null &&
    stats.remaining <= 2;

  return (
    <div className="flex flex-wrap items-center gap-4 py-2.5 px-4 bg-muted/30 rounded-lg border text-sm">
      <div className="flex items-center gap-2">
        <Table2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">Total:</span>
        <Badge variant="secondary" className="font-semibold">
          {stats?.total ?? 0}
          {isUnlimited ? '' : `/${stats?.maxTables ?? '—'}`}
        </Badge>
      </div>

      <div className="w-px h-4 bg-border" />

      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <span className="text-muted-foreground">Active:</span>
        <Badge
          variant="outline"
          className="font-semibold border-green-600 text-green-600"
        >
          {stats?.enabled ?? 0}
        </Badge>
      </div>

      <div className="w-px h-4 bg-border" />

      <div className="flex items-center gap-2">
        <XCircle className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">Inactive:</span>
        <Badge variant="outline" className="font-semibold">
          {stats?.disabled ?? 0}
        </Badge>
      </div>

      <div className="w-px h-4 bg-border" />

      <div className="flex items-center gap-2">
        <AlertCircle
          className={`h-4 w-4 ${isLow ? 'text-orange-500' : 'text-muted-foreground'}`}
        />
        <span className="text-muted-foreground">Available:</span>
        {isUnlimited ? (
          <Badge
            variant="outline"
            className="font-semibold border-teal-600 text-teal-700 dark:text-teal-400"
          >
            Unlimited
          </Badge>
        ) : (
          <Badge
            variant={isLow ? 'destructive' : 'outline'}
            className={`font-semibold ${
              isLow
                ? 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200'
                : ''
            }`}
          >
            {stats?.remaining ?? 0}
            {isLow && ' ⚠️'}
          </Badge>
        )}
      </div>
    </div>
  );
}
