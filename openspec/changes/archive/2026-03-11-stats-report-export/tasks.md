## 1. Translation Keys

- [x] 1.1 Add export-related keys to `messages/en.json` under `Stats` namespace: `export`, `exportCSV`, `exportMarkdown`
- [x] 1.2 Add corresponding Chinese keys to `messages/zh.json`: `导出`, `CSV`, `Markdown`

## 2. CSV Report Generator

- [x] 2.1 Create a `generateCSV` helper function in `TaskStats.tsx` that takes task list and date range, returns CSV string with header row (Date, Content, Start Time, End Time, Duration, Tags) and one row per task
- [x] 2.2 Handle CSV escaping: wrap fields containing commas or quotes in double quotes, escape inner double quotes as `""`
- [x] 2.3 Handle tasks with missing end_time: output empty End Time and default 0.5h duration

## 3. Markdown Report Generator

- [x] 3.1 Create a `generateMarkdown` helper function that takes task list, date range, daily hours, and total hours, returns Markdown string
- [x] 3.2 Generate header section with date range and total hours
- [x] 3.3 Generate daily hours summary table (Date | Hours columns)
- [x] 3.4 Generate task detail list grouped by date, showing content, time range, and tags for each task

## 4. Download Trigger

- [x] 4.1 Create a `downloadFile` utility function that takes content string, filename, and MIME type, creates a Blob, triggers browser download via temporary `<a>` element

## 5. Export UI

- [x] 5.1 Add an "Export" dropdown button to the stats page header area (next to DateRangePicker), visible only when data is loaded
- [x] 5.2 Dropdown shows two options: "CSV" and "Markdown", each triggering the respective generator + download
- [x] 5.3 Filename follows convention: `workboard-report-{startDate}-to-{endDate}.{csv|md}`
- [x] 5.4 Verify export button uses translated labels from `useTranslations('Stats')`

## 6. Verification

- [ ] 6.1 Test CSV export: select "This Week", export CSV, verify file downloads with correct filename and valid CSV content
- [ ] 6.2 Test Markdown export: select "Last 30 Days", export Markdown, verify file downloads with correct structure
- [ ] 6.3 Test i18n: switch to Chinese, verify button shows "导出" and report headers use Chinese labels
- [ ] 6.4 Test edge case: export with empty date range (no tasks), verify file still downloads with headers but no data rows
