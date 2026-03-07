'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ParsedTask {
  content: string;
  start_time: string | null;
  end_time: string | null;
  tags: string[];
}

interface TaskBatchConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  parsedTasks: ParsedTask[];
  onSave: (tasks: ParsedTask[]) => void;
}

function toDatetimeLocal(timeStr: string | null): string | null {
  if (!timeStr) return null;
  const match = timeStr.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/);
  if (match) return match[1];
  try {
    const d = new Date(timeStr);
    if (isNaN(d.getTime())) return null;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return null;
  }
}

export function TaskBatchConfirmModal({ isOpen, onClose, parsedTasks, onSave }: TaskBatchConfirmModalProps) {
  const [formTasks, setFormTasks] = React.useState<ParsedTask[]>([]);

  React.useEffect(() => {
    if (parsedTasks.length > 0) {
      setFormTasks(
        parsedTasks.map((t) => ({
          ...t,
          start_time: toDatetimeLocal(t.start_time),
          end_time: toDatetimeLocal(t.end_time),
        }))
      );
    }
  }, [parsedTasks]);

  const handleFieldChange = (index: number, field: keyof ParsedTask, value: any) => {
    setFormTasks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleTagsChange = (index: number, value: string) => {
    const tags = value.split(',').map((tag) => tag.trim()).filter(Boolean);
    handleFieldChange(index, 'tags', tags);
  };

  const handleRemove = (index: number) => {
    const updated = formTasks.filter((_, i) => i !== index);
    if (updated.length === 0) {
      onClose();
    } else {
      setFormTasks(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formTasks.length > 0) {
      onSave(formTasks);
    }
  };

  if (formTasks.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>确认任务（共 {formTasks.length} 条）</DialogTitle>
          <DialogDescription>
            请确认 AI 解析的任务详情，可逐条修改或删除后批量保存。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {formTasks.map((task, index) => (
            <div
              key={index}
              className="relative rounded-lg border bg-card p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  任务 {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-4 items-center gap-3">
                <Label className="text-right text-xs">内容</Label>
                <Input
                  value={task.content}
                  onChange={(e) => handleFieldChange(index, 'content', e.target.value)}
                  className="col-span-3 h-8 text-sm"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-3">
                <Label className="text-right text-xs">开始</Label>
                <Input
                  type="datetime-local"
                  value={task.start_time || ''}
                  onChange={(e) => handleFieldChange(index, 'start_time', e.target.value)}
                  className="col-span-3 h-8 text-sm"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-3">
                <Label className="text-right text-xs">结束</Label>
                <Input
                  type="datetime-local"
                  value={task.end_time || ''}
                  onChange={(e) => handleFieldChange(index, 'end_time', e.target.value)}
                  className="col-span-3 h-8 text-sm"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-3">
                <Label className="text-right text-xs">标签</Label>
                <Input
                  value={task.tags.join(', ')}
                  onChange={(e) => handleTagsChange(index, e.target.value)}
                  className="col-span-3 h-8 text-sm"
                  placeholder="开发, 会议（逗号分隔）"
                />
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit">
              全部保存（{formTasks.length} 条）
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
