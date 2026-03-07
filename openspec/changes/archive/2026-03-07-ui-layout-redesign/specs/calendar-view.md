## Capability: calendar-view

Dedicated view at `/tasks/calendar` for browsing tasks by date.

## Requirements

### CAL-1: Date Picker
- Display the `TaskCalendar` component for month navigation and date selection.
- Manages its own `selectedDate` state locally within this page.

### CAL-2: Daily Task List
- Show the `TaskList` component for the selected date, positioned beside the calendar on desktop.
- Desktop layout: 2-column (calendar left, task list right).
- Mobile layout: single column (calendar on top, task list below).

### CAL-3: No Input or Stats
- This view must NOT render the task input or statistics components.
- Pure browsing/review experience.
