## Why

Users need to share or archive their work statistics for reporting purposes (weekly reports, team standups, timesheet submissions). Currently, statistics are only viewable in the browser with no way to extract the data. Adding report export allows users to download their task and hours data for any selected date range.

## What Changes

- Add an "Export" button to the statistics page that downloads a report for the current date range
- Support CSV export format containing daily hours breakdown and per-task details
- Support Markdown export format for easy pasting into documents or chat tools
- Export respects the currently selected date range (week/month/last7/last30/custom)
- All export UI text is internationalized (en/zh)

## Capabilities

### New Capabilities
- `report-export`: Report generation and download from the statistics page — CSV and Markdown formats, date-range-aware, with task details and hours summary

### Modified Capabilities
<!-- No existing spec-level behavior changes needed -->

## Impact

- **Modified files**: `TaskStats.tsx` (add export button + logic), `en.json` / `zh.json` (new translation keys)
- **No new dependencies**: Uses browser-native `Blob` + download link for file generation
- **No API changes**: Export is client-side using already-fetched task data
- **No breaking changes**
