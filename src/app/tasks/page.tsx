'use client';

import * as React from 'react';
import { TaskInput } from '@/components/task-logger/TaskInput';
import { TaskList } from '@/components/task-logger/TaskList';
import { TaskConfirmationModal } from '@/components/task-logger/TaskConfirmationModal';

export default function LogPage() {
  const [parsedTask, setParsedTask] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);
  const today = React.useMemo(() => new Date(), []);

  const handleTaskParsed = (data: any) => {
    setParsedTask(data);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (task: any) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error('Failed to save task');
      }

      setIsModalOpen(false);
      setParsedTask(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save task. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Log Task</h1>
        <p className="text-muted-foreground text-sm">
          用自然语言记录你的工作，AI 自动解析时间和标签。
        </p>
      </header>

      <TaskInput onParsed={handleTaskParsed} className="max-w-full" />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Today</h2>
        <TaskList selectedDate={today} refreshTrigger={refreshTrigger} />
      </section>

      <TaskConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        parsedData={parsedTask}
        onSave={handleSaveTask}
      />
    </div>
  );
}
