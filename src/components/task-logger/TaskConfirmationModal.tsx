'use client';

import * as React from 'react';
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

interface TaskConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  parsedData: ParsedTask | null;
  onSave: (task: ParsedTask) => void;
}

export function TaskConfirmationModal({ isOpen, onClose, parsedData, onSave }: TaskConfirmationModalProps) {
  const [formData, setFormData] = React.useState<ParsedTask | null>(null);

  // Convert time string to datetime-local format (YYYY-MM-DDTHH:mm)
  // AI now returns local time without timezone suffix (e.g. "2026-03-06T18:00:00")
  const toDatetimeLocal = (timeStr: string | null): string | null => {
    if (!timeStr) return null;
    // Already in local format, just truncate to YYYY-MM-DDTHH:mm
    const match = timeStr.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/);
    if (match) return match[1];
    // Fallback: try parsing as Date (for legacy UTC format with Z)
    try {
      const d = new Date(timeStr);
      if (isNaN(d.getTime())) return null;
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return null;
    }
  };

  React.useEffect(() => {
    if (parsedData) {
      setFormData({
        ...parsedData,
        start_time: toDatetimeLocal(parsedData.start_time),
        end_time: toDatetimeLocal(parsedData.end_time),
      });
    }
  }, [parsedData]);

  const handleChange = (field: keyof ParsedTask, value: any) => {
    setFormData((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    handleChange('tags', tags);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Task</DialogTitle>
          <DialogDescription>
            Review the parsed task details before saving.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              Task
            </Label>
            <Input
              id="content"
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start_time" className="text-right">
              Start Time
            </Label>
            <Input
              id="start_time"
              type="datetime-local"
              value={formData.start_time || ''}
              onChange={(e) => handleChange('start_time', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end_time" className="text-right">
              End Time
            </Label>
            <Input
              id="end_time"
              type="datetime-local"
              value={formData.end_time || ''}
              onChange={(e) => handleChange('end_time', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Input
              id="tags"
              value={formData.tags.join(', ')}
              onChange={handleTagsChange}
              className="col-span-3"
              placeholder="Dev, Meeting (comma separated)"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Confirm & Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
