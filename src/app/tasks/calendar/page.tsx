'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { TaskCalendar } from '@/components/task-logger/TaskCalendar';
import { TaskList } from '@/components/task-logger/TaskList';

export default function CalendarPage() {
  const t = useTranslations('CalendarPage');
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground text-sm">{t('description')}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <TaskCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            className="w-full"
          />
        </div>
        <div className="lg:col-span-8">
          <TaskList selectedDate={selectedDate} refreshTrigger={0} />
        </div>
      </div>
    </div>
  );
}
