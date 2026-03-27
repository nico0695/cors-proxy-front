'use client';

import { useState } from 'react';
import { useCrudTables } from '@/hooks/use-crud-tables';
import { CrudTableCard } from './crud-table-card';
import { CrudTableDetailsDialog } from './crud-table-details-dialog';
import { EditCrudTableDialog } from './edit-crud-table-dialog';
import { CrudApiGuideSheet } from './crud-api-guide-sheet';
import { Card, CardContent } from '@/components/ui/card';
import { CrudTable } from '@/lib/types';
import { getApiBaseUrl } from '@/lib/utils';

export function CrudTableList() {
  const { data: tables, isLoading, error } = useCrudTables();
  const apiBaseUrl = getApiBaseUrl();
  const [selectedTable, setSelectedTable] = useState<CrudTable | null>(null);
  const [editingTable, setEditingTable] = useState<CrudTable | null>(null);
  const [apiGuideTable, setApiGuideTable] = useState<CrudTable | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="h-6 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                <div className="h-20 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-lg font-semibold mb-2">Failed to load tables</p>
            <p className="text-sm text-muted-foreground">
              Make sure the API server is running at{' '}
              <code className="bg-muted px-2 py-1 rounded">
                {apiBaseUrl}
              </code>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tables || tables.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-lg font-semibold mb-2">
              No custom API tables yet
            </p>
            <p className="text-sm text-muted-foreground">
              Create your first table to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tables.map((table) => (
          <CrudTableCard
            key={table.id}
            table={table}
            onViewDetails={setSelectedTable}
            onEdit={setEditingTable}
            onApiGuide={setApiGuideTable}
          />
        ))}
      </div>

      <CrudTableDetailsDialog
        table={selectedTable}
        open={!!selectedTable}
        onOpenChange={(open) => !open && setSelectedTable(null)}
        onEdit={(table) => {
          setSelectedTable(null);
          setEditingTable(table);
        }}
      />

      <EditCrudTableDialog
        table={editingTable}
        open={!!editingTable}
        onOpenChange={(open) => !open && setEditingTable(null)}
      />

      <CrudApiGuideSheet
        table={apiGuideTable}
        open={!!apiGuideTable}
        onOpenChange={(open) => !open && setApiGuideTable(null)}
      />
    </>
  );
}
