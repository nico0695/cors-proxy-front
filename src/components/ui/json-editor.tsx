"use client";

import { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-tomorrow.css";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function JsonEditor({
  value,
  onChange,
  placeholder = '{"message": "Hello World"}',
  className,
  minHeight = "200px",
}: JsonEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isValidJson, setIsValidJson] = useState<boolean>(false);

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

  return (
    <div
      className={cn(
        "relative",
        isFullscreen &&
          "fixed inset-0 z-50 bg-white dark:bg-background p-6 flex flex-col"
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

      {/* Editor */}
      <div
        className={cn(
          "border rounded-md overflow-hidden bg-[#2d2d2d]",
          jsonError && "border-destructive",
          isValidJson && "border-green-600",
          className,
          isFullscreen && "flex-1"
        )}
        style={{ minHeight: isFullscreen ? "auto" : minHeight }}
      >
        <Editor
          value={value}
          onValueChange={onChange}
          highlight={(code) => highlight(code, languages.json, "json")}
          padding={12}
          placeholder={placeholder}
          className="font-mono text-sm"
          style={{
            minHeight: isFullscreen ? "100%" : minHeight,
            backgroundColor: "#2d2d2d",
            color: "#ccc",
            fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
            lineHeight: "1.5",
          }}
          textareaClassName="focus:outline-none"
        />
      </div>

      {/* Fullscreen overlay backdrop */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/50 -z-10"
          onClick={() => setIsFullscreen(false)}
        />
      )}
    </div>
  );
}
