'use client';

import * as React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TaskCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  className?: string;
}

export function TaskCalendar({ selectedDate, onSelectDate, className }: TaskCalendarProps) {
  const t = useTranslations('Calendar');
  const locale = useLocale();
  const [currentMonth, setCurrentMonth] = React.useState(new Date(selectedDate));
  const [taskDates, setTaskDates] = React.useState<Set<string>>(new Set());

  const pad = (n: number) => String(n).padStart(2, '0');
  const toLocalDateStr = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  React.useEffect(() => {
    async function fetchTaskDates() {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const dates = new Set<string>();

      try {
        const res = await fetch('/api/tasks');
        const tasks: { start_time: string | null }[] = await res.json();
        const prefix = `${year}-${pad(month + 1)}`;
        tasks.forEach((task) => {
          if (task.start_time?.startsWith(prefix)) {
            const dateStr = task.start_time.substring(0, 10);
            dates.add(dateStr);
          }
        });
      } catch (e) {
        console.error('Failed to fetch task dates', e);
      }
      setTaskDates(dates);
    }
    fetchTaskDates();
  }, [currentMonth]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  };

  const days = getDaysInMonth(currentMonth);
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const dateLocale = locale === 'zh' ? 'zh-CN' : 'en-US';
  const weekDays = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];

  return (
    <div className={cn('p-4 border rounded-md shadow-sm bg-card', className)}>
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold">
          {currentMonth.toLocaleDateString(dateLocale, { year: 'numeric', month: 'long' })}
        </div>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
        {weekDays.map((day) => (
          <div key={day} className="py-1">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const hasTask = taskDates.has(toLocalDateStr(day));
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          return (
            <Button
              key={day.toISOString()}
              variant={isSelected ? 'default' : 'ghost'}
              className={cn(
                'h-8 w-8 p-0 text-sm font-normal relative',
                isToday && !isSelected && 'text-primary font-bold'
              )}
              onClick={() => onSelectDate(day)}
            >
              {day.getDate()}
              {hasTask && (
                <span
                  className={cn(
                    'absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full',
                    isSelected ? 'bg-primary-foreground' : 'bg-primary'
                  )}
                />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
