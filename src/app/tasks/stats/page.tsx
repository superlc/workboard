'use client';

import { useTranslations } from 'next-intl';
import { TaskStats } from '@/components/task-logger/TaskStats';

export default function StatsPage() {
  const t = useTranslations('StatsPage');

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground text-sm">{t('description')}</p>
      </header>

      <TaskStats />
    </div>
  );
}
