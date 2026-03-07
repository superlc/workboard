## Capability: log-view

The default view at `/tasks`. Focused on task input and immediate feedback.

## Requirements

### LOG-1: Task Input Area
- Display the `TaskInput` component prominently at the top of the view.
- Include a heading like "Log Task" and a brief subtitle.
- Input should be visually prominent — the clear focal point of the view.

### LOG-2: Today's Task List
- Below the input, show a "Today" section listing tasks for the current date.
- Reuse the existing `TaskList` component with `selectedDate` set to today.
- Auto-refresh when a new task is saved (via `refreshTrigger` state).

### LOG-3: Confirmation Flow
- After AI parsing, show `TaskConfirmationModal` for user review.
- On confirm, POST to `/api/tasks`, close modal, and refresh today's list.
- Same behavior as current implementation — no changes to the modal itself.

### LOG-4: No Calendar or Stats
- This view must NOT render the calendar or statistics components.
- Keep the interface clean and focused solely on recording.
