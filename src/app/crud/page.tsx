"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/protected";
import { Header } from "@/components/shared/header";
import { CrudStats } from "@/components/crud/crud-stats";
import { CrudTableList } from "@/components/crud/crud-table-list";
import { CreateCrudTableDialog } from "@/components/crud/create-crud-table-dialog";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { useCrudStats, crudTableKeys, crudStatsKeys } from "@/hooks/use-crud-tables";

export default function CrudPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: stats } = useCrudStats();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: crudTableKeys.all });
    queryClient.invalidateQueries({ queryKey: crudStatsKeys.all });
  };

  const isAtLimit = stats?.remaining === 0;

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        <Header />
        <div className="border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Custom APIs</h1>
                <p className="text-muted-foreground mt-1">
                  Create and manage custom CRUD table APIs
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button
                  size="sm"
                  onClick={() => setCreateDialogOpen(true)}
                  disabled={isAtLimit}
                  title={isAtLimit ? "You have reached your table limit" : undefined}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Table
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 space-y-6">
          <CrudStats />
          <section>
            <h2 className="text-lg font-semibold mb-4">Tables</h2>
            <CrudTableList />
          </section>
        </div>

        <CreateCrudTableDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      </main>
    </ProtectedRoute>
  );
}
