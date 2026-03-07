'use client';

import * as React from 'react';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
      onParsed(data);
      setText('');
    } catch (err) {
      setError('解析失败，请重试。');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Textarea
          placeholder="用自然语言记录工作，例如：&#10;上午10点到12点修复了登录页面的Bug&#10;下午2点开会讨论新需求，持续1小时"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          rows={4}
          className="resize-none pr-14 min-h-[120px]"
        />
        <Button
          type="submit"
          size="icon"
          disabled={loading || !text.trim()}
          className="absolute right-3 bottom-3"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
      <p className="text-muted-foreground text-xs mt-2">
        按 Enter 发送，Shift + Enter 换行
      </p>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
