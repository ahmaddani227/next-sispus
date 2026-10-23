"use client";

import {useState, useEffect} from "react";
import { usePathname } from "next/navigation";
import { Calendar, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useCurrentDate } from "@/hooks/useCurrentDate";

interface TopbarProps {
  onToggleSidebar: () => void;
  title?: string;
  dateString?: string;
}

const Topbar = ({
  onToggleSidebar,
  title,
  dateString,
}: TopbarProps) => {
  const currentDate = useCurrentDate(dateString);
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState<string>(title || "Dashboard");

  useEffect(() => {
    const updateTitleFromBrowser = () => {
      if (typeof document !== "undefined" && document.title) {
        const parts = document.title.split(" - ");
        const titleText = parts[0]?.trim() || document.title;
        if (titleText) {
          setPageTitle(titleText);
        }
      }
    };

    updateTitleFromBrowser();
    const timer = setTimeout(updateTitleFromBrowser, 50);

    let observer: MutationObserver | null = null;
    const titleElement = document.querySelector("title");
    if (titleElement) {
      observer = new MutationObserver(() => {
        updateTitleFromBrowser();
      });
      observer.observe(titleElement, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => {
      clearTimeout(timer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [pathname, title]);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/95 px-4 sm:px-8 backdrop-blur-xs">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={onToggleSidebar}
          className="lg:hidden text-slate-600 dark:text-slate-300"
          aria-label="Buka navigasi menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2.5">
          <h2 className="font-headline-sm text-sm sm:text-base font-bold text-foreground">
            {pageTitle}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="hidden sm:flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
          <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span suppressHydrationWarning>{currentDate}</span>
        </div>

         <ModeToggle />
      </div>
    </header>
  );
}

export default Topbar