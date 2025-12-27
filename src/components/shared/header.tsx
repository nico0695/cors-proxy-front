"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LogOut, User, Rss, Database, Network } from "lucide-react";
import { RssDocsDialog } from "./rss-docs-dialog";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const { user, logout } = useAuth();
  const [rssDocsOpen, setRssDocsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">Administrator</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant={pathname === "/" ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link href="/">
                  <Database className="h-4 w-4 mr-2" />
                  Mock APIs
                </Link>
              </Button>
              <Button
                variant={pathname === "/proxy" ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link href="/proxy">
                  <Network className="h-4 w-4 mr-2" />
                  HTTP Proxy
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRssDocsOpen(true)}
              className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-300"
            >
              <Rss className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">RSS Docs</span>
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      <RssDocsDialog open={rssDocsOpen} onOpenChange={setRssDocsOpen} />
    </header>
  );
}
