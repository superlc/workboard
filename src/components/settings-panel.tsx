"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Settings, Sun, Moon, Monitor, Languages } from "lucide-react";
import { cn } from "@/lib/utils";

export function SettingsPanel() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("Settings");
  const locale = useLocale();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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
    { value: "light", label: t("themeLight"), icon: Sun },
    { value: "dark", label: t("themeDark"), icon: Moon },
    { value: "system", label: t("themeSystem"), icon: Monitor },
  ] as const;

  const langOptions = [
    { value: "en", label: "English" },
    { value: "zh", label: "中文" },
  ] as const;

  const handleLocaleChange = async (newLocale: string) => {
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: newLocale }),
    });
    router.refresh();
  };

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-lg transition-colors",
          open
            ? "bg-accent text-primary"
            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
        )}
        aria-label={t("label")}
      >
        <Settings className="h-5 w-5" />
      </button>

      {open && mounted && (
        <div className="absolute left-full bottom-0 ml-2 w-48 rounded-lg border bg-popover text-popover-foreground shadow-lg p-3 z-50">
          {/* Theme */}
          <p className="text-xs font-medium text-muted-foreground mb-2">{t("theme")}</p>
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

          {/* Divider */}
          <div className="border-t my-2" />

          {/* Language */}
          <p className="text-xs font-medium text-muted-foreground mb-2">{t("language")}</p>
          <div className="flex flex-col gap-1">
            {langOptions.map((opt) => {
              const active = locale === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleLocaleChange(opt.value)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors w-full text-left",
                    active
                      ? "bg-accent text-accent-foreground font-medium"
                      : "hover:bg-accent/50"
                  )}
                >
                  <Languages className="h-4 w-4" />
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
