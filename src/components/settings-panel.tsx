"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Settings, Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export function SettingsPanel() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close panel on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const themeOptions = [
    { value: "light", label: "浅色", icon: Sun },
    { value: "dark", label: "深色", icon: Moon },
    { value: "system", label: "跟随系统", icon: Monitor },
  ] as const;

  return (
    <div ref={panelRef} className="relative">
      {/* Settings trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-lg transition-colors",
          open
            ? "bg-accent text-primary"
            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
        )}
        aria-label="设置"
      >
        <Settings className="h-5 w-5" />
      </button>

      {/* Settings popover */}
      {open && mounted && (
        <div className="absolute left-full bottom-0 ml-2 w-48 rounded-lg border bg-popover text-popover-foreground shadow-lg p-3 z-50">
          <p className="text-xs font-medium text-muted-foreground mb-2">主题</p>
          <div className="flex flex-col gap-1">
            {themeOptions.map((opt) => {
              const active = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors w-full text-left",
                    active
                      ? "bg-accent text-accent-foreground font-medium"
                      : "hover:bg-accent/50"
                  )}
                >
                  <opt.icon className="h-4 w-4" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
