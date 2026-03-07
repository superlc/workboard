'use client';

import * as React from 'react';
import { TaskInput } from '@/components/task-logger/TaskInput';
import { TaskList } from '@/components/task-logger/TaskList';
import { TaskBatchConfirmModal } from '@/components/task-logger/TaskBatchConfirmModal';

interface ParsedTask {
  content: string;
  start_time: string | null;
  end_time: string | null;
  tags: string[];
}

export default function LogPage() {
  const [parsedTasks, setParsedTasks] = React.useState<ParsedTask[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);
  const today = React.useMemo(() => new Date(), []);

  const handleTaskParsed = (data: any) => {
    const tasks = data.tasks || (Array.isArray(data) ? data : [data]);
    setParsedTasks(tasks);
    setIsModalOpen(true);
  };

  const handleSaveTasks = async (tasks: ParsedTask[]) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks }),
      });

      if (!response.ok) {
        throw new Error('Failed to save tasks');
      }

      setIsModalOpen(false);
      setParsedTasks([]);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('Save error:', error);
      alert('保存失败，请重试。');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">记录任务</h1>
        <p className="text-muted-foreground text-sm">
          用自然语言记录你的工作，AI 自动解析时间和标签。
        </p>
      </header>

      <TaskInput onParsed={handleTaskParsed} className="max-w-full" />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">今日任务</h2>
        <TaskList selectedDate={today} refreshTrigger={refreshTrigger} />
      </section>

      <TaskBatchConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        parsedTasks={parsedTasks}
        onSave={handleSaveTasks}
      />
    </div>
  );
}
