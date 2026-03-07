## Why

The current Tasks page places input, calendar, task list, and statistics all in a single view. This creates visual clutter and splits user attention across multiple unrelated operations. Users cannot focus on their primary intent — whether that's logging a new task, browsing history, or reviewing statistics. A layout redesign is needed to separate these concerns into distinct, focused views.

## What Changes

- Replace the single-page dashboard layout with a **sidebar navigation + content area** pattern.
- Split the current page into three focused views: **Log** (input + today's tasks), **Calendar** (date picker + task list), and **Stats** (charts + summaries).
- Add a persistent left sidebar with icon navigation for switching between views.
- Leverage Next.js nested routing (`/tasks`, `/tasks/calendar`, `/tasks/stats`) for clean URL structure.
- Adapt to mobile with a bottom tab bar replacing the sidebar.

## Capabilities

### New Capabilities

- `sidebar-navigation`: Persistent sidebar component with icon-based navigation, active route highlighting, and mobile bottom-tab adaptation.
- `log-view`: Focused task input view showing only the input area and today's task list for immediate feedback.
- `calendar-view`: Dedicated calendar browsing view with date picker and daily task list, free of input/stats clutter.
- `stats-view`: Full-width statistics view with expanded charts and summary cards.

### Modified Capabilities

- `task-dashboard`: The existing single-page dashboard is decomposed into the three views above. The layout wrapper (`tasks/layout.tsx`) now provides the sidebar shell.

## Impact

- **Frontend**: New `tasks/layout.tsx` (sidebar shell), new `Sidebar.tsx` component, restructured route pages (`tasks/page.tsx`, `tasks/calendar/page.tsx`, `tasks/stats/page.tsx`).
- **Backend**: No changes — API routes remain the same.
- **Database**: No changes.
- **Dependencies**: No new dependencies needed. Uses existing shadcn/ui components and lucide-react icons.
