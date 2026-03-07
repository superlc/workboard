import { Sidebar } from '@/components/task-logger/Sidebar';

export default function TasksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      {/* Main content: offset for desktop sidebar, bottom padding for mobile tabs */}
      <main className="flex-1 lg:ml-16 overflow-auto pb-16 lg:pb-0">
        {children}
      </main>
    </div>
  );
}
