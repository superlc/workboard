# Task Delete Feature — Design

## Goal
Allow users to delete individual task records from the task list, with a safe inline confirmation pattern.

## Architecture
- **Trigger**: Hover to reveal a delete icon (Trash2) on each task card. On touch devices (no hover), always visible.
- **Confirmation**: Inline two-step — click trash icon → button changes to red "Confirm?" text → click again to delete. Clicking elsewhere cancels.
- **API**: New `DELETE /api/tasks?id={id}` endpoint, deletes by primary key.
- **State update**: Optimistic — remove from local state immediately, rollback on API failure.
- **Scope**: TaskList component (used in both input page and calendar page). No prop changes needed — delete is self-contained within TaskList.

## Components

### 1. DELETE API handler (`src/app/api/tasks/route.ts`)
- Accept `id` query param, validate it's a number
- Execute `DELETE FROM tasks WHERE id = ?`
- Return 200 on success, 404 if no rows affected, 400 if missing id

### 2. TaskList inline delete (`src/components/task-logger/TaskList.tsx`)
- Add `deletingId` state (number | null) to track which task is in confirmation mode
- Each task card gets a delete button area:
  - Default: hidden, shown on hover (`group-hover:opacity-100`)
  - Touch fallback: `@media (hover: none)` always show
  - When `deletingId === task.id`: show red "Confirm?" text
- On confirm click: optimistically remove from `tasks` state, call `DELETE /api/tasks?id={id}`, rollback on failure
- Click-outside listener to reset `deletingId` to null

### 3. i18n keys
- `TaskList.deleteConfirm`: "Delete?" / "删除?"
- `TaskList.deleteFailed`: "Delete failed" / "删除失败"

## Data Flow
```
User hovers task → sees 🗑️ → clicks → sees "Delete?" (red)
→ clicks again → task removed from UI (optimistic)
→ DELETE /api/tasks?id=X → success → done
                          → failure → task restored in UI + error toast
```

## Error Handling
- API returns non-ok → restore task to original position in array, show brief error message
- Missing id param → 400 response

## Testing
- Manual: hover reveals icon, click shows confirm, click again deletes, click-outside cancels
- Verify both input page and calendar page work correctly
