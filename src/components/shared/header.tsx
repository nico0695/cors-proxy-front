"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LogOut, User, Rss, Database, Network, Users } from "lucide-react";
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
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className={
                pathname === "/"
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                  : "border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-300"
              }
            >
              <Link href="/" className="flex items-center">
                <Database className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Mock APIs</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className={
                pathname === "/proxy"
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                  : "border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-300"
              }
            >
              <Link href="/proxy" className="flex items-center">
                <Network className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">HTTP Proxy</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRssDocsOpen(true)}
              className="border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:border-amber-400 dark:text-amber-400 dark:hover:bg-amber-950 dark:hover:text-amber-300"
            >
              <div className="flex items-center">
                <Rss className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">RSS Docs</span>
              </div>
            </Button>
            {user?.role === "admin" && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className={
                  pathname === "/users"
                    ? "border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                    : "border-purple-500 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-950 dark:hover:text-purple-300"
                }
              >
                <Link href="/users" className="flex items-center">
                  <Users className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Users</span>
                </Link>
              </Button>
            )}
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
