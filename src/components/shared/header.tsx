"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LogOut, User, Rss, Database, Network, Users } from "lucide-react";
import { RssDocsDialog } from "./rss-docs-dialog";
import { NavButton } from "./nav-button";
import { useState } from "react";

export function Header() {
  const { user, logout } = useAuth();
  const [rssDocsOpen, setRssDocsOpen] = useState(false);

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
            <NavButton href="/" icon={Database} label="Mock APIs" color="blue" />
            <NavButton href="/proxy" icon={Network} label="HTTP Proxy" color="blue" />
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
              <NavButton href="/users" icon={Users} label="Users" color="purple" />
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
