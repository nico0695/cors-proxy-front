"use client";

import { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-tomorrow.css";
import { Button } from "@/components/ui/button";
import {
  Maximize2,
  Minimize2,
  AlertCircle,
  CheckCircle2,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileJson
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  statusCodeTemplates,
  commonObjectTemplates,
  type JsonTemplate
} from "@/lib/json-templates";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  maxHeight?: string;
}

export function JsonEditor({
  value,
  onChange,
  placeholder = '{"message": "Hello World"}',
  className,
  minHeight = "200px",
  maxHeight,
}: JsonEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isValidJson, setIsValidJson] = useState<boolean>(false);
  const [showUtilityPanel, setShowUtilityPanel] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Validate JSON whenever value changes
  useEffect(() => {
    if (!value.trim()) {
      setJsonError(null);
      setIsValidJson(false);
      return;
    }

    try {
      JSON.parse(value);
      setJsonError(null);
      setIsValidJson(true);
    } catch (e) {
      const error = e as Error;
      setJsonError(error.message);
      setIsValidJson(false);
    }
  }, [value]);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);
      onChange(formatted);
    } catch (e) {
      // If JSON is invalid, don't format
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(value);
      const minified = JSON.stringify(parsed);
      onChange(minified);
    } catch (e) {
      // If JSON is invalid, don't minify
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const clearJson = () => {
    onChange("");
  };

  const insertTemplate = (template: JsonTemplate) => {
    const formatted = JSON.stringify(template.template, null, 2);
    onChange(formatted);
  };

  return (
    <div
      className={cn(
        "relative",
        isFullscreen && "fixed inset-0 z-50 bg-background p-6 flex flex-col"
      )}
    >
      {/* Header with controls */}
      <div className="flex items-center justify-between mb-2 z-10">
        <div className="flex items-center gap-2 text-sm">
          {isValidJson && value.trim() && (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Valid JSON</span>
            </div>
          )}
          {jsonError && (
            <div className="flex items-center gap-1 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="max-w-md truncate">Error: {jsonError}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={formatJson}
            disabled={!isValidJson}
          >
            Format
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={minifyJson}
            disabled={!isValidJson}
          >
            Minify
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Main content area - flex layout only in fullscreen */}
      <div className={cn(isFullscreen && "flex gap-4 flex-1 overflow-hidden")}>
        {/* Editor */}
        <div
          className={cn(
            "border rounded-md overflow-auto bg-muted",
            jsonError && "border-destructive",
            isValidJson && "border-green-600",
            className,
            isFullscreen && "flex-1"
          )}
          style={{
            minHeight: isFullscreen ? "auto" : minHeight,
            maxHeight: isFullscreen ? "100%" : maxHeight
          }}
        >
          <Editor
            value={value}
            onValueChange={onChange}
            highlight={(code) => highlight(code, languages.json, "json")}
            padding={12}
            placeholder={placeholder}
            className="font-mono text-sm bg-muted text-foreground"
            style={{
              fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
              lineHeight: "1.5",
            }}
            textareaClassName="focus:outline-none bg-transparent"
          />
        </div>

        {/* Utility Panel - Only show in fullscreen */}
        {isFullscreen && showUtilityPanel && (
          <div className="w-80 border rounded-md bg-card p-4 overflow-y-auto flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <FileJson className="h-4 w-4" />
                Utilities
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowUtilityPanel(false)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Actions Section */}
            <div className="space-y-2 mb-6">
              <h4 className="text-xs font-medium text-muted-foreground uppercase">Actions</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4 mr-2" />
                {copySuccess ? "Copied!" : "Copy JSON"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={clearJson}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>

            {/* Status Code Templates */}
            <div className="space-y-2 mb-6">
              <h4 className="text-xs font-medium text-muted-foreground uppercase">
                By Status Code
              </h4>
              <div className="space-y-1">
                {statusCodeTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => insertTemplate(template)}
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors border border-border"
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {template.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Common Object Templates */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase">
                Common Objects
              </h4>
              <div className="space-y-1">
                {commonObjectTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => insertTemplate(template)}
                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors border border-border"
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {template.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Show Panel Button - Only show in fullscreen when panel is hidden */}
        {isFullscreen && !showUtilityPanel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowUtilityPanel(true)}
            className="fixed right-6 top-20"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
