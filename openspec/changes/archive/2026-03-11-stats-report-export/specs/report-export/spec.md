## ADDED Requirements

### Requirement: Export button on statistics page
The statistics page SHALL display an "Export" button in the header area near the date range picker. The button SHALL be visible whenever statistics data is loaded.

#### Scenario: Export button visible with data
- **WHEN** the statistics page has loaded task data for a date range
- **THEN** an "Export" button SHALL be displayed

#### Scenario: Export button hidden during loading
- **WHEN** the statistics page is in a loading state
- **THEN** the "Export" button SHALL NOT be displayed

### Requirement: Export format selection
Clicking the "Export" button SHALL present two format options: CSV and Markdown. The user MUST select one format to trigger the download.

#### Scenario: User selects CSV format
- **WHEN** user clicks "Export" and selects "CSV"
- **THEN** a CSV file SHALL be generated and downloaded

#### Scenario: User selects Markdown format
- **WHEN** user clicks "Export" and selects "Markdown"
- **THEN** a Markdown file SHALL be generated and downloaded

### Requirement: CSV report content
The CSV export SHALL contain a header row and one row per task within the selected date range. Columns SHALL be: Date, Content, Start Time, End Time, Duration (hours), Tags.

#### Scenario: CSV with multiple tasks
- **WHEN** the date range contains 3 tasks across 2 days
- **THEN** the CSV SHALL contain 1 header row and 3 data rows with correct date, content, times, duration, and tags for each task

#### Scenario: CSV escaping for special characters
- **WHEN** a task content contains commas or double quotes
- **THEN** the field SHALL be wrapped in double quotes and inner double quotes SHALL be escaped as `""`

#### Scenario: CSV with task missing end time
- **WHEN** a task has a start time but no end time
- **THEN** the Duration column SHALL show "0.5" (default) and End Time SHALL be empty

### Requirement: Markdown report content
The Markdown export SHALL contain: a header with the date range and total hours, a daily hours summary table, and a task detail list grouped by date.

#### Scenario: Markdown header section
- **WHEN** exporting for date range 2026-03-01 to 2026-03-07 with 15.5 total hours
- **THEN** the Markdown SHALL begin with a heading showing the date range and "Total: 15.5h"

#### Scenario: Markdown daily summary table
- **WHEN** exporting for a range with 3 days of data
- **THEN** the Markdown SHALL include a table with Date and Hours columns listing each day's hours

#### Scenario: Markdown task details grouped by date
- **WHEN** exporting for a range with tasks on 2 different dates
- **THEN** the Markdown SHALL group tasks under date headings, showing each task's content, time range, and tags

### Requirement: Download filename convention
The downloaded file SHALL be named `workboard-report-{startDate}-to-{endDate}.{ext}` where `{ext}` is `csv` or `md`.

#### Scenario: CSV filename
- **WHEN** exporting CSV for range 2026-03-01 to 2026-03-07
- **THEN** the filename SHALL be `workboard-report-2026-03-01-to-2026-03-07.csv`

#### Scenario: Markdown filename
- **WHEN** exporting Markdown for range 2026-03-01 to 2026-03-07
- **THEN** the filename SHALL be `workboard-report-2026-03-01-to-2026-03-07.md`

### Requirement: Export uses current date range
The export SHALL use the currently selected date range from the date range picker, fetching the same task data that is displayed in the statistics charts.

#### Scenario: Export after changing date range
- **WHEN** user switches date range to "This Month" and clicks Export
- **THEN** the exported report SHALL contain only tasks within the current month

### Requirement: Export UI text internationalized
All export-related UI text (button labels, format names, report headers) SHALL be translated in both English and Chinese.

#### Scenario: Export button in English
- **WHEN** locale is `en`
- **THEN** the button SHALL display "Export" and format options SHALL show "CSV" and "Markdown"

#### Scenario: Export button in Chinese
- **WHEN** locale is `zh`
- **THEN** the button SHALL display "导出" and format options SHALL show "CSV" and "Markdown"
