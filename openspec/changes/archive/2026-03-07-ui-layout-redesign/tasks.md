## Tasks

### 1. Create Sidebar component ✅
- **File**: `src/components/task-logger/Sidebar.tsx`
- **Spec**: SIDE-1, SIDE-2, SIDE-3
- **Details**:
  - Create a `'use client'` component with desktop sidebar (fixed left, 64px, icon-only) and mobile bottom tab bar.
  - Navigation items: Log (`/tasks`, PenLine), Calendar (`/tasks/calendar`, CalendarDays), Stats (`/tasks/stats`, BarChart3).
  - Use `usePathname()` from `next/navigation` to determine active item.
  - Use `Link` from `next/link` for navigation.
  - Desktop: vertical icon stack with tooltip-like labels on hover, theme toggle at bottom.
  - Mobile (<1024px): horizontal bottom bar with icon + text label.
  - Active state: bg-accent + text-primary. Inactive: text-muted-foreground.

### 2. Create tasks layout with sidebar shell ✅
- **File**: `src/app/tasks/layout.tsx`
- **Spec**: SIDE-4
- **Details**:
  - Create a layout component that renders `Sidebar` alongside `{children}`.
  - Desktop: `flex` row — sidebar (w-16) + main content (flex-1, overflow-auto).
  - Mobile: main content full width + bottom tabs (add bottom padding to avoid overlap).
  - Full viewport height (`h-screen`).

### 3. Refactor tasks/page.tsx as Log view ✅
- **File**: `src/app/tasks/page.tsx`
- **Spec**: LOG-1, LOG-2, LOG-3, LOG-4
- **Details**:
  - Strip out calendar and stats components from the current page.
  - Keep: heading ("Log Task"), `TaskInput`, `TaskList` (with selectedDate fixed to today), `TaskConfirmationModal`.
  - State: `refreshTrigger` for list refresh after save, `parsedTask` + `isModalOpen` for confirmation flow.
  - Clean, focused layout: heading → input → today's tasks.

### 4. Create Calendar view page ✅
- **File**: `src/app/tasks/calendar/page.tsx`
- **Spec**: CAL-1, CAL-2, CAL-3
- **Details**:
  - `'use client'` page with local `selectedDate` state.
  - Render `TaskCalendar` and `TaskList` in a 2-column grid (desktop) or single column (mobile).
  - No input, no stats.

### 5. Create Stats view page ✅
- **File**: `src/app/tasks/stats/page.tsx`
- **Spec**: STAT-1, STAT-2
- **Details**:
  - Simple page rendering `TaskStats` at full width.
  - Add a heading ("Statistics") for context.
  - No input, no calendar.

### 6. Update root page redirect ✅
- **File**: `src/app/page.tsx`
- **Details**:
  - Ensure the root `/` still redirects to `/tasks` (should already work, verify).

### 7. Clean up and verify ✅
- **Details**:
  - Remove any unused imports from refactored files.
  - Verify all three views render correctly.
  - Verify sidebar active states match current route.
  - Verify mobile bottom tabs work at narrow viewport.
