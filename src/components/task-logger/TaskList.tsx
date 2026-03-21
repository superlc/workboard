'use client';

import * as React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, Trash2 } from 'lucide-react';
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
  refreshTrigger: number;
  className?: string;
}

export function TaskList({ selectedDate, refreshTrigger, className }: TaskListProps) {
  const t = useTranslations('TaskList');
  const locale = useLocale();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const fetchTasks = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
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

  // Click-outside to cancel delete confirmation
  React.useEffect(() => {
    if (deletingId === null) return;
    const handleClickOutside = () => setDeletingId(null);
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [deletingId]);

  // Optimistic delete with rollback
  const handleDelete = async (taskId: number) => {
    const taskIndex = tasks.findIndex((item) => item.id === taskId);
    const removedTask = tasks[taskIndex];
    setTasks((prev) => prev.filter((item) => item.id !== taskId));
    setDeletingId(null);

    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
    } catch {
      setTasks((prev) => {
        const copy = [...prev];
        copy.splice(taskIndex, 0, removedTask);
        return copy;
      });
      setError(t('deleteFailed'));
      setTimeout(() => setError(null), 3000);
    }
  };

  const dateLocale = locale === 'zh' ? 'zh-CN' : 'en-US';
  const dateLabel = selectedDate.toLocaleDateString(dateLocale, {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="text-lg">
          {t('dateTasksTitle', { date: dateLabel })}
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
            {t('noTasks')}
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="group flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
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
                <div className="flex items-center self-center">
                  {deletingId === task.id ? (
                    <button
                      className="text-xs text-destructive font-medium px-2 py-1 rounded hover:bg-destructive/10 transition-colors cursor-pointer whitespace-nowrap"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(task.id);
                      }}
                    >
                      {t('deleteConfirm')}
                    </button>
                  ) : (
                    <button
                      className="opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 text-muted-foreground hover:text-destructive p-1 rounded transition-all cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingId(task.id);
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
