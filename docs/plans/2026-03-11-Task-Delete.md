# Task Delete Implementation Plan
> **For implementation:** Use executing-plans skill to implement this plan task-by-task.

**Goal:** Add inline delete functionality to task list items with hover-reveal trigger and two-step confirmation.
**Architecture:** DELETE API endpoint + optimistic UI removal in TaskList + i18n support.
**Tech Stack:** Next.js API route, React state, lucide-react icons, Tailwind CSS.

---

## Task 1: Add i18n translation keys

**Files:** `messages/en.json` (modify), `messages/zh.json` (modify)

**Step 1:** Add keys to `messages/en.json` — in the `"TaskList"` section, add:
```json
"deleteConfirm": "Delete?",
"deleteFailed": "Delete failed"
```

**Step 2:** Add keys to `messages/zh.json` — in the `"TaskList"` section, add:
```json
"deleteConfirm": "删除?",
"deleteFailed": "删除失败"
```

**Step 3:** Verify no JSON syntax errors.

**Step 4:** Commit:
```bash
git add messages/en.json messages/zh.json && git commit -m "feat: add i18n keys for task delete"
```

---

## Task 2: Add DELETE API endpoint

**Files:** `src/app/api/tasks/route.ts` (modify)

**Step 1:** Add a `DELETE` export function to `src/app/api/tasks/route.ts`:

```typescript
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Valid task id is required' },
        { status: 400 }
      );
    }

    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = stmt.run(Number(id));

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
```

**Step 2:** Verify build: `npx next build 2>&1 | grep -E "(error|✓ Compiled)"`.

**Step 3:** Commit:
```bash
git add src/app/api/tasks/route.ts && git commit -m "feat: add DELETE endpoint for tasks API"
```

---

## Task 3: Add inline delete UI to TaskList

**Files:** `src/components/task-logger/TaskList.tsx` (modify)

**Step 1:** Add `Trash2` import from `lucide-react`:
```typescript
import { Loader2, Trash2 } from 'lucide-react';
```

**Step 2:** Add state for delete confirmation tracking inside the component:
```typescript
const [deletingId, setDeletingId] = React.useState<number | null>(null);
```

**Step 3:** Add click-outside effect to cancel confirmation:
```typescript
React.useEffect(() => {
  if (deletingId === null) return;
  const handleClickOutside = () => setDeletingId(null);
  // Delay to avoid catching the current click
  const timer = setTimeout(() => {
    document.addEventListener('click', handleClickOutside);
  }, 0);
  return () => {
    clearTimeout(timer);
    document.removeEventListener('click', handleClickOutside);
  };
}, [deletingId]);
```

**Step 4:** Add the delete handler function (optimistic removal with rollback):
```typescript
const handleDelete = async (taskId: number) => {
  // Optimistic removal
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  const removedTask = tasks[taskIndex];
  setTasks((prev) => prev.filter((t) => t.id !== taskId));
  setDeletingId(null);

  try {
    const response = await fetch(`/api/tasks?id=${taskId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Delete failed');
  } catch {
    // Rollback: re-insert at original position
    setTasks((prev) => {
      const copy = [...prev];
      copy.splice(taskIndex, 0, removedTask);
      return copy;
    });
    setError(t('deleteFailed'));
    setTimeout(() => setError(null), 3000);
  }
};
```

**Step 5:** Update the task card rendering — wrap existing card div with `group` class, add delete button area. Replace the task card `<div>` (the one with `key={task.id}`) with:

```tsx
<div key={task.id} className="group flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors relative">
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
```

**Step 6:** Verify lint: check for linter errors.

**Step 7:** Verify build: `npx next build 2>&1 | grep -E "(error|✓ Compiled)"`.

**Step 8:** Commit:
```bash
git add src/components/task-logger/TaskList.tsx && git commit -m "feat: add inline delete with two-step confirmation to TaskList"
```

---

## Task 4: Manual verification

- [ ] 4.1: Run `npm run dev`, navigate to input page, hover over a task → trash icon appears
- [ ] 4.2: Click trash icon → changes to red "Delete?" / "删除?" text
- [ ] 4.3: Click elsewhere → confirmation cancels, trash icon returns
- [ ] 4.4: Click trash icon → click "Delete?" → task disappears from list
- [ ] 4.5: Refresh page → deleted task is gone (persisted)
- [ ] 4.6: Navigate to calendar page → same delete behavior works
- [ ] 4.7: Switch language → labels display correctly in both languages
