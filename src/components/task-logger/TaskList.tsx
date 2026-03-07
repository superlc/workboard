'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Task {
  id: number;
  content: string;
  start_time: string | null;
  end_time: string | null;
  tags: string[];
}

interface TaskListProps {
  selectedDate: Date;
  refreshTrigger: number; // Increment to force refresh
  className?: string;
}

export function TaskList({ selectedDate, refreshTrigger, className }: TaskListProps) {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchTasks = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Format date as YYYY-MM-DD
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const response = await fetch(`/api/tasks?date=${dateStr}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, refreshTrigger]);

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const formatTime = (isoString: string | null) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="text-lg">
          {selectedDate.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })} 的任务
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm p-4 text-center">{error}</div>
        ) : tasks.length === 0 ? (
          <div className="text-muted-foreground text-sm text-center p-8">
            当天暂无任务记录。
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex flex-col items-center min-w-[60px] text-xs text-muted-foreground pt-1">
                  <span>{formatTime(task.start_time)}</span>
                  {task.end_time && (
                    <>
                      <div className="w-[1px] h-3 bg-border my-1" />
                      <span>{formatTime(task.end_time)}</span>
                    </>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{task.content}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {task.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] px-1 py-0 h-5">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
