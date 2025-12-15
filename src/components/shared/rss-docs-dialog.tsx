"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Rss } from "lucide-react";
import toast from "react-hot-toast";

interface RssDocsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RssDocsDialog({ open, onOpenChange }: RssDocsDialogProps) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const truncateUrl = (url: string, maxStartChars: number = 10) => {
    // Remove protocol (http://, https://)
    let cleanUrl = url.replace(/^https?:\/\//, '');

    // Remove www. if present
    cleanUrl = cleanUrl.replace(/^www\./, '');

    // If still too long, truncate
    if (cleanUrl.length <= 30) return cleanUrl;

    // Keep first maxStartChars and last part
    const endChars = 15;
    return `${cleanUrl.slice(0, maxStartChars)}.....${cleanUrl.slice(-endChars)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[98vw] sm:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Rss className="h-4 w-4 sm:h-5 sm:w-5" />
            RSS Proxy Documentation
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Access RSS feeds without CORS restrictions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Overview Section */}
          <div>
            <h3 className="font-semibold mb-2 text-sm sm:text-base">What is RSS Proxy?</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Access and manipulate RSS feeds without browser CORS restrictions.
              Perfect for building feed readers, news aggregators, or content dashboards.
            </p>
          </div>

          {/* Basic Proxy Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm sm:text-base">Endpoint</h3>
              <Badge variant="secondary" className="text-xs">GET</Badge>
            </div>

            <div className="flex items-start sm:items-center gap-2">
              <code className="flex-1 bg-muted px-2 sm:px-3 py-2 rounded text-xs sm:text-sm font-mono break-all sm:break-normal">
                <span className="hidden sm:inline">{apiBaseUrl}/rss?url=&lt;feed-url&gt;</span>
                <span className="sm:hidden">{truncateUrl(`${apiBaseUrl}/rss?url=<feed-url>`)}</span>
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(`${apiBaseUrl}/rss?url=`)}
                className="shrink-0"
              >
                <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>

            <div>
              <h4 className="text-xs sm:text-sm font-semibold mb-2">Parameters</h4>
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border text-xs sm:text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="border px-2 sm:px-3 py-2 text-left">Parameter</th>
                      <th className="border px-2 sm:px-3 py-2 text-left">Type</th>
                      <th className="border px-2 sm:px-3 py-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-2 sm:px-3 py-2">
                        <code>url</code>
                      </td>
                      <td className="border px-2 sm:px-3 py-2">string</td>
                      <td className="border px-2 sm:px-3 py-2">
                        The RSS feed URL to fetch (required)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Mobile stacked layout */}
              <div className="sm:hidden border rounded bg-muted/50 p-3 space-y-2 text-xs">
                <div>
                  <span className="font-semibold">Parameter:</span> <code className="bg-muted px-1 py-0.5 rounded">url</code>
                </div>
                <div>
                  <span className="font-semibold">Type:</span> <span className="text-muted-foreground">string</span>
                </div>
                <div>
                  <span className="font-semibold">Description:</span> <span className="text-muted-foreground">The RSS feed URL to fetch (required)</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs sm:text-sm font-semibold mb-2">Examples</h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start gap-1 sm:gap-2">
                  <pre className="flex-1 bg-muted p-2 sm:p-3 rounded text-xs font-mono break-all sm:break-normal">
                    <span className="hidden sm:inline">{apiBaseUrl}/rss?url=https://feeds.bbci.co.uk/news/rss.xml</span>
                    <span className="sm:hidden">{truncateUrl(`${apiBaseUrl}/rss?url=https://feeds.bbci.co.uk/news/rss.xml`)}</span>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        `${apiBaseUrl}/rss?url=https://feeds.bbci.co.uk/news/rss.xml`
                      )
                    }
                    className="shrink-0"
                  >
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>

                <div className="flex items-start gap-1 sm:gap-2">
                  <pre className="flex-1 bg-muted p-2 sm:p-3 rounded text-xs font-mono break-all sm:break-normal">
                    <span className="hidden sm:inline">{apiBaseUrl}/rss?url=https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml</span>
                    <span className="sm:hidden">{truncateUrl(`${apiBaseUrl}/rss?url=https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml`)}</span>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        `${apiBaseUrl}/rss?url=https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml`
                      )
                    }
                    className="shrink-0"
                  >
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>

                <div className="flex items-start gap-1 sm:gap-2">
                  <pre className="flex-1 bg-muted p-2 sm:p-3 rounded text-xs font-mono break-all sm:break-normal">
                    <span className="hidden sm:inline">{apiBaseUrl}/rss?url=https://news.ycombinator.com/rss</span>
                    <span className="sm:hidden">{truncateUrl(`${apiBaseUrl}/rss?url=https://news.ycombinator.com/rss`)}</span>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        `${apiBaseUrl}/rss?url=https://news.ycombinator.com/rss`
                      )
                    }
                    className="shrink-0"
                  >
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>

                <div className="flex items-start gap-1 sm:gap-2">
                  <pre className="flex-1 bg-muted p-2 sm:p-3 rounded text-xs font-mono break-all sm:break-normal">
                    <span className="hidden sm:inline">{apiBaseUrl}/rss?url=https://www.reddit.com/r/programming/.rss</span>
                    <span className="sm:hidden">{truncateUrl(`${apiBaseUrl}/rss?url=https://www.reddit.com/r/programming/.rss`)}</span>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        `${apiBaseUrl}/rss?url=https://www.reddit.com/r/programming/.rss`
                      )
                    }
                    className="shrink-0"
                  >
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>

                <div className="flex items-start gap-1 sm:gap-2">
                  <pre className="flex-1 bg-muted p-2 sm:p-3 rounded text-xs font-mono break-all sm:break-normal">
                    <span className="hidden sm:inline">{apiBaseUrl}/rss?url=https://techcrunch.com/feed/</span>
                    <span className="sm:hidden">{truncateUrl(`${apiBaseUrl}/rss?url=https://techcrunch.com/feed/`)}</span>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        `${apiBaseUrl}/rss?url=https://techcrunch.com/feed/`
                      )
                    }
                    className="shrink-0"
                  >
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
