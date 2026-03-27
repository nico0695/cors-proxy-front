'use client';

import { useState } from 'react';
import { Copy, Check, BookOpen } from 'lucide-react';
import { CrudFieldDefinition, CrudFieldType, CrudTable } from '@/lib/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn, getApiBaseUrl, joinUrl } from '@/lib/utils';
import toast from 'react-hot-toast';

interface CrudApiGuideSheetProps {
  table: CrudTable | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EndpointDef {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  url: string;
  description: string;
  note?: string;
  hasBody?: boolean;
}

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-sky-100 text-sky-800 border border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800',
  POST: 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
  PATCH: 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
  DELETE: 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
};

function buildEndpoints(baseUrl: string, basePath: string): EndpointDef[] {
  const base = joinUrl(baseUrl, `/api-crud/serve/${basePath}`);
  return [
    {
      method: 'GET',
      url: base,
      description: 'List all entries',
      note: 'Supports ?page=1&limit=20',
    },
    {
      method: 'GET',
      url: `${base}/:id`,
      description: 'Get entry by ID',
    },
    {
      method: 'POST',
      url: base,
      description: 'Create a new entry',
      hasBody: true,
    },
    {
      method: 'PATCH',
      url: `${base}/:id`,
      description: 'Update entry (partial)',
      hasBody: true,
    },
    {
      method: 'DELETE',
      url: `${base}/:id`,
      description: 'Delete entry',
    },
  ];
}

function generateSampleBody(
  schema: CrudFieldDefinition[],
): Record<string, unknown> {
  const samples: Record<CrudFieldType, unknown> = {
    string: 'example text',
    number: 42,
    boolean: true,
    date: new Date().toISOString(),
  };
  return Object.fromEntries(schema.map((f) => [f.name, samples[f.type]]));
}

export function CrudApiGuideSheet({
  table,
  open,
  onOpenChange,
}: CrudApiGuideSheetProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!table) return null;

  const apiBaseUrl = getApiBaseUrl();
  const endpoints = buildEndpoints(apiBaseUrl, table.basePath);
  const baseUrl = joinUrl(apiBaseUrl, `/api-crud/serve/${table.basePath}`);
  const sampleBody =
    table.schema.length > 0
      ? JSON.stringify(generateSampleBody(table.schema), null, 2)
      : null;

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <div className="flex items-center gap-2 pr-6">
            <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400 shrink-0" />
            <SheetTitle className="truncate">{table.name}</SheetTitle>
          </div>
          <SheetDescription>
            API Guide — public endpoints, no authentication required
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Base URL */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Base URL
            </p>
            <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2">
              <code className="text-xs font-mono flex-1 break-all">
                {baseUrl}
              </code>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 shrink-0"
                onClick={() => copyText(baseUrl, 'base')}
                title="Copy base URL"
              >
                {copiedKey === 'base' ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>

          {/* Endpoints */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Endpoints
            </p>
            <div className="space-y-2">
              {endpoints.map((endpoint) => {
                const key = `${endpoint.method}-${endpoint.url}`;
                return (
                  <div
                    key={key}
                    className="rounded-md border bg-card p-3 space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={cn(
                            'inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[10px] font-bold font-mono uppercase',
                            METHOD_COLORS[endpoint.method],
                          )}
                        >
                          {endpoint.method}
                        </span>
                        <code className="text-xs font-mono break-all text-foreground">
                          {endpoint.url.replace('/:id', '')}
                          {endpoint.url.includes('/:id') && (
                            <span className="text-muted-foreground">/:id</span>
                          )}
                        </code>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 shrink-0"
                        onClick={() => copyText(endpoint.url, key)}
                        title="Copy URL"
                      >
                        {copiedKey === key ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 pl-0.5">
                      <span className="text-xs text-muted-foreground">
                        {endpoint.description}
                      </span>
                      {endpoint.note && (
                        <span className="text-[10px] text-muted-foreground/70 italic">
                          · {endpoint.note}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sample Body */}
          {sampleBody && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Sample Request Body (POST / PATCH)
              </p>
              <div className="relative rounded-md border bg-muted/50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 h-6 w-6 p-0"
                  onClick={() => copyText(sampleBody, 'body')}
                  title="Copy JSON"
                >
                  {copiedKey === 'body' ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
                <pre className="text-xs font-mono p-3 pr-10 overflow-x-auto">
                  {sampleBody}
                </pre>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
