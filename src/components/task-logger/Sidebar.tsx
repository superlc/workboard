'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PenLine, CalendarDays, BarChart3 } from 'lucide-react';
import { SettingsPanel } from '@/components/settings-panel';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/tasks', label: '录入', icon: PenLine },
  { href: '/tasks/calendar', label: '日历', icon: CalendarDays },
  { href: '/tasks/stats', label: '统计', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/tasks') return pathname === '/tasks';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-16 h-screen border-r bg-card fixed left-0 top-0 z-40">
        <nav className="flex flex-col items-center gap-1 pt-4">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group relative flex items-center justify-center w-12 h-12 rounded-lg transition-colors',
                  active
                    ? 'bg-accent text-primary'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {/* Tooltip on hover */}
                <span className="absolute left-full ml-2 px-2 py-1 rounded-md bg-popover text-popover-foreground text-xs font-medium shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-col items-center pb-4">
          <SettingsPanel />
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-14 border-t bg-card flex items-center justify-around">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors',
                active
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
