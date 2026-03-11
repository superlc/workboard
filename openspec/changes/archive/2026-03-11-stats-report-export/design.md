## Context

The statistics page (`TaskStats.tsx`) already fetches task data for a selected date range and computes daily hours and tag distribution. The computed `StatsData` and raw task list are available in component state. Users currently have no way to extract this data — they can only view charts in the browser.

## Goals / Non-Goals

**Goals:**
- Allow users to download a report for the currently selected date range
- Support two formats: CSV (for spreadsheets) and Markdown (for pasting into docs/chat)
- CSV includes per-task rows with date, content, start/end time, duration, tags
- Markdown includes a summary table (daily hours) and task detail list
- Export button integrated naturally into the stats page header area
- All UI text internationalized

**Non-Goals:**
- Server-side report generation (unnecessary — data is already client-side)
- PDF export (complex dependency, not needed for personal tool)
- Excel (.xlsx) format (CSV covers spreadsheet use cases)
- Scheduled/automated exports
- Email delivery

## Decisions

### 1. Client-side generation using Blob + download link
**Choice**: Generate report content in the browser, create a `Blob`, trigger download via temporary `<a>` element.

**Alternatives considered**:
- Server-side API endpoint: Unnecessary round-trip — data is already fetched client-side
- Clipboard copy: Doesn't produce a file; could be added later as a complementary action

**Rationale**: Zero dependencies, instant download, works offline. The data volume is small (at most ~30 days of tasks).

### 2. Two format options: CSV and Markdown
**Choice**: Dropdown or two-button export with CSV and Markdown options.

**Rationale**: CSV serves spreadsheet/timesheet workflows. Markdown serves copy-paste into reports, Slack, Notion, etc. These two cover the primary use cases without adding complexity.

### 3. Report content structure
**Choice**:
- **CSV**: Header row + one row per task: `Date, Content, Start, End, Duration (h), Tags`
- **Markdown**: Header with date range and total hours → daily summary table → task detail list grouped by date

**Rationale**: CSV is flat by nature (per-task rows). Markdown benefits from grouping by date for readability.

### 4. Filename convention
**Choice**: `workboard-report-{startDate}-to-{endDate}.{csv|md}`

**Rationale**: Self-documenting filename with date range. `workboard` prefix identifies the source.

### 5. Export trigger UI
**Choice**: Single "Export" button next to the date range picker. Clicking shows a small dropdown with "CSV" and "Markdown" options.

**Rationale**: Keeps the UI clean — one button instead of two. The dropdown appears only on click.

## Risks / Trade-offs

- [Large date ranges produce long reports] → Acceptable for personal tool; ~30 days × ~10 tasks/day = ~300 rows max
- [CSV doesn't handle commas in task content] → Standard CSV escaping (wrap in quotes, escape inner quotes)
- [Markdown table alignment with CJK characters] → Use simple list format instead of fixed-width tables for task details
