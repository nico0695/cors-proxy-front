"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavButtonProps {
  href: string;
  icon: LucideIcon;
  label: string;
  color: "blue" | "amber" | "purple";
}

const colorClasses = {
  blue: {
    active: "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    inactive:
      "border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-300",
  },
  amber: {
    active: "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    inactive:
      "border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:border-amber-400 dark:text-amber-400 dark:hover:bg-amber-950 dark:hover:text-amber-300",
  },
  purple: {
    active: "border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    inactive:
      "border-purple-500 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-950 dark:hover:text-purple-300",
  },
};

export function NavButton({ href, icon: Icon, label, color }: NavButtonProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Button
      variant="outline"
      size="sm"
      asChild
      className={cn(
        "transition-all duration-200",
        isActive ? colorClasses[color].active : colorClasses[color].inactive
      )}
    >
      <Link href={href} prefetch={true}>
        <div className="flex items-center">
          <Icon className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">{label}</span>
        </div>
      </Link>
    </Button>
  );
}
