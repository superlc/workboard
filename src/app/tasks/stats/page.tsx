'use client';

import { TaskStats } from '@/components/task-logger/TaskStats';

export default function StatsPage() {
  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Statistics</h1>
        <p className="text-muted-foreground text-sm">查看你的工作时间分布和标签统计。</p>
      </header>

      <TaskStats />
    </div>
  );
}
