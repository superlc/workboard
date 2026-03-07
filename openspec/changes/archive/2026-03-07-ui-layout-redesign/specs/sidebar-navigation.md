## Capability: sidebar-navigation

Persistent navigation component that allows users to switch between Log, Calendar, and Stats views.

## Requirements

### SIDE-1: Desktop Sidebar
- Display a fixed vertical sidebar on the left side of the screen on viewports ≥ 1024px.
- Width: 64px (icon-only mode).
- Contains navigation items stacked vertically at the top and a theme toggle at the bottom.
- Navigation items: Log (PenLine icon), Calendar (CalendarDays icon), Stats (BarChart3 icon).
- Active item: highlighted background with primary-color icon.
- Inactive items: muted color, hover shows subtle background.

### SIDE-2: Mobile Bottom Tab Bar
- On viewports < 1024px, hide the sidebar and show a fixed bottom tab bar.
- Tab bar height: ~56px.
- Same 3 navigation items as sidebar, displayed horizontally with icon + label.
- Active tab: primary color icon + label. Inactive: muted.

### SIDE-3: Route Integration
- Each navigation item links to a Next.js route:
  - Log → `/tasks`
  - Calendar → `/tasks/calendar`
  - Stats → `/tasks/stats`
- Active state is determined by the current pathname.
- Uses Next.js `Link` component and `usePathname()` for active detection.

### SIDE-4: Layout Shell
- `tasks/layout.tsx` renders the Sidebar alongside the main content area.
- Desktop: sidebar on left, content fills remaining width.
- Mobile: content takes full width, bottom tabs fixed at bottom.
