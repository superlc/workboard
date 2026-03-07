'use client';

import * as React from 'react';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TaskInputProps {
  onParsed: (parsedData: any) => void;
  className?: string;
}

export function TaskInput({ onParsed, className }: TaskInputProps) {
  const [text, setText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }),
      });

      if (!response.ok) {
        throw new Error('Parsing failed');
      }

      const data = await response.json();
      onParsed(data); // Pass parsed data to parent
      setText(''); // Clear input on success
    } catch (err) {
      setError('Failed to process task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('relative w-full max-w-lg mx-auto', className)}>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Log a task: 'Fixed login bug at 10am...'"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
          className="pr-12"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={loading || !text.trim()}
          className="absolute right-0 top-0 bottom-0 rounded-l-none"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
