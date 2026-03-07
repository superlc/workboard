'use client';

import * as React from 'react';
import { TaskInput } from '@/components/task-logger/TaskInput';
import { TaskCalendar } from '@/components/task-logger/TaskCalendar';
import { TaskList } from '@/components/task-logger/TaskList';
import { TaskStats } from '@/components/task-logger/TaskStats';
import { TaskConfirmationModal } from '@/components/task-logger/TaskConfirmationModal';

export default function TasksPage() {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [parsedTask, setParsedTask] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

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
      setRefreshTrigger((prev) => prev + 1); // Refresh list
      
      // If task date is different from selected, switch view?
      // For now, keep selected date or switch to today if task is today.
      if (task.start_time) {
        const taskDate = new Date(task.start_time);
        if (taskDate.toDateString() === new Date().toDateString()) {
           setSelectedDate(taskDate);
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save task. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Work Task Logger</h1>
        <p className="text-muted-foreground">
          Log what you did, when you did it. Let AI handle the details.
        </p>
        <div className="w-full max-w-xl">
          <TaskInput onParsed={handleTaskParsed} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <TaskCalendar 
            selectedDate={selectedDate} 
            onSelectDate={setSelectedDate} 
            className="w-full"
          />
          <div className="hidden lg:block">
            <TaskStats /> {/* Show stats in sidebar on desktop */}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <TaskList 
            selectedDate={selectedDate} 
            refreshTrigger={refreshTrigger} 
          />
          <div className="lg:hidden">
            <TaskStats /> {/* Show stats below list on mobile */}
          </div>
        </div>
      </div>

      <TaskConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        parsedData={parsedTask}
        onSave={handleSaveTask}
      />
    </div>
  );
}
