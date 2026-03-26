"use client";

import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected";
import { Header } from "@/components/shared/header";
import { CrudEntriesTable } from "@/components/crud/crud-entries-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useCrudTable } from "@/hooks/use-crud-tables";

export default function CrudEntriesPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: table, isLoading, error } = useCrudTable(params.id);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        <Header />
        <div className="border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/crud")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex-1">
                {isLoading ? (
                  <div className="space-y-2">
                    <div className="h-8 w-64 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                  </div>
                ) : table ? (
                  <>
                    <div className="flex items-center gap-2">
                      <h1 className="text-3xl font-bold tracking-tight">{table.name}</h1>
                      <Badge variant={table.enabled ? "default" : "secondary"}>
                        {table.enabled ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                      <code className="text-xs">/api-crud/serve/{table.basePath}</code>
                      {" · "}
                      {table.schema.length} field{table.schema.length !== 1 ? "s" : ""}
                      {" · "}
                      max {table.maxEntries} entries
                    </p>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {error && (
            <div className="text-center py-12 text-destructive text-sm">
              Failed to load table. It may have been deleted or you may not have access.
            </div>
          )}
          {!isLoading && !error && table && (
            <CrudEntriesTable table={table} />
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
