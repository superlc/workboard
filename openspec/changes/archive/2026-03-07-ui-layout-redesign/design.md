## Context

The Work Task Logger currently renders all UI (input, calendar, task list, stats) in a single `tasks/page.tsx`. This redesign separates them into three focused views behind a sidebar navigation, using Next.js nested layouts.

## Goals / Non-Goals

**Goals:**
- Separate recording, browsing, and analysis into distinct views to improve user focus.
- Provide a persistent sidebar for fast navigation between views.
- Keep today's tasks visible in the Log view for instant recording feedback.
- Adapt gracefully to mobile via a bottom tab bar.
- Maintain all existing functionality — no feature regression.

**Non-Goals:**
- Redesigning individual components (TaskCalendar, TaskStats internals stay the same).
- Adding new features (editing, deleting tasks, etc.).
- Changing the API layer or database schema.

## Decisions

### Layout: Sidebar + Content Area

- **Rationale**: A sidebar provides persistent, always-visible navigation. With only 3 views, icon-only mode (~64px wide) is sufficient and doesn't waste horizontal space.
- **Alternative**: Top tab bar — rejected because it competes with the header and feels less "app-like".

### Routing: Next.js Nested Routes

- `/tasks` → Log view (default, task input + today's tasks)
- `/tasks/calendar` → Calendar view (date picker + daily task list)
- `/tasks/stats` → Statistics view (charts + summaries)
- **Rationale**: Clean URLs, browser back/forward works naturally, each view is a separate page component, and `tasks/layout.tsx` provides the shared sidebar shell.
- **Alternative**: Client-side tab state — rejected because it loses URL bookmarkability and breaks back button.

### Sidebar Design

- Desktop (≥1024px): Fixed left sidebar, icon-only (64px), with tooltip labels on hover.
- Mobile (<1024px): Hidden sidebar, replaced by fixed bottom tab bar.
- Items: Log (PenLine icon), Calendar (CalendarDays icon), Stats (BarChart3 icon).
- Bottom slot: Theme toggle button.
- Active state: highlighted background + primary color icon.

### Log View Design

- Large input area at top (keep existing `TaskInput` but give it more visual prominence).
- Below: "Today's Tasks" section — a lightweight version of `TaskList` that always shows today's date.
- `TaskConfirmationModal` remains the same, triggered after AI parsing.
- After saving, the today's list auto-refreshes.

### Calendar View Design

- Left: `TaskCalendar` component (existing).
- Right: `TaskList` for the selected date (existing).
- Same 2-column layout as before, but now in isolation without input or stats clutter.

### Stats View Design

- `TaskStats` component (existing) rendered at full content width.
- More room for charts and potential future summary cards.

## Component Architecture

```
tasks/layout.tsx          ← Sidebar + <main>{children}</main>
├── tasks/page.tsx        ← Log view: TaskInput + TodayTaskList
├── tasks/calendar/page.tsx ← Calendar view: TaskCalendar + TaskList
└── tasks/stats/page.tsx  ← Stats view: TaskStats (full width)

components/task-logger/
├── Sidebar.tsx           ← NEW: navigation sidebar + mobile bottom tabs
├── TaskInput.tsx         ← EXISTING (no change)
├── TaskCalendar.tsx      ← EXISTING (no change)
├── TaskList.tsx          ← EXISTING (no change)
├── TaskStats.tsx         ← EXISTING (no change)
└── TaskConfirmationModal.tsx ← EXISTING (no change)
```

## Risks / Trade-offs

- **State sharing across routes**: `selectedDate`, `refreshTrigger` etc. currently live in the single page component. With route splitting, we need to either lift state to layout or use URL params/search params.
  - *Decision*: Calendar view manages its own `selectedDate` state locally. Log view always shows today. No cross-route state needed.
- **Mobile sidebar vs. bottom tabs**: Bottom tabs take vertical space on small screens.
  - *Mitigation*: Only 3 items, keep the bar thin (~56px).

## Migration Plan

1. Create `Sidebar.tsx` component with desktop sidebar + mobile bottom tabs.
2. Create `tasks/layout.tsx` that wraps children with the sidebar.
3. Refactor `tasks/page.tsx` to be the Log view (input + today's tasks only).
4. Create `tasks/calendar/page.tsx` with calendar + task list.
5. Create `tasks/stats/page.tsx` with stats component.
6. Update `page.tsx` (root) redirect if needed.
7. Clean up unused imports/code from old single-page layout.
