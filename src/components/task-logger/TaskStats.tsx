'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Task {
  id: number;
  content: string;
  start_time: string | null;
  end_time: string | null;
  tags: string[];
}

interface StatsData {
  dailyHours: { date: string; hours: number }[];
  tagDistribution: { tag: string; count: number }[];
}

export function TaskStats() {
  const [stats, setStats] = React.useState<StatsData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/tasks?limit=1000'); // Fetch enough history
        const data: Task[] = await response.json();
        
        // Process data for last 7 days
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(today.getDate() - (6 - i));
          return d.toISOString().split('T')[0];
        });

        const dailyHours = last7Days.map(date => {
          const tasksForDay = data.filter(t => t.start_time?.startsWith(date));
          const hours = tasksForDay.reduce((acc, t) => {
            if (t.start_time && t.end_time) {
              const start = new Date(t.start_time).getTime();
              const end = new Date(t.end_time).getTime();
              return acc + (end - start) / (1000 * 60 * 60);
            }
            return acc + 0.5; // Default 30 mins if no end time
          }, 0);
          return { date, hours };
        });

        const tagCounts: Record<string, number> = {};
        data.forEach(t => {
          t.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        });

        const tagDistribution = Object.entries(tagCounts)
          .map(([tag, count]) => ({ tag, count }))
          .sort((a, b) => b.count - a.count);

        setStats({ dailyHours, tagDistribution });
      } catch (e) {
        console.error('Failed to load stats', e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div>正在加载统计数据...</div>;
  if (!stats) return <div>暂无统计数据</div>;

  const maxHours = Math.max(...stats.dailyHours.map(d => d.hours), 1);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>本周工作量</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-40 pt-4">
            {stats.dailyHours.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group">
                <div 
                  className="w-full bg-primary/80 rounded-t-md transition-all group-hover:bg-primary relative"
                  style={{ height: `${(d.hours / maxHours) * 100}%` }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-popover px-1 rounded shadow-sm">
                    {d.hours.toFixed(1)}h
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                  {new Date(d.date).toLocaleDateString('zh-CN', { weekday: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tag Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.tagDistribution.slice(0, 5).map((t) => (
              <div key={t.tag} className="flex items-center gap-2">
                <span className="text-sm w-20 truncate">{t.tag}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${(t.count / Math.max(...stats.tagDistribution.map(d => d.count))) * 100}%` }} 
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">{t.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
