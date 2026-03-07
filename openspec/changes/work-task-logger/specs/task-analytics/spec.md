## ADDED Requirements

### Requirement: Weekly Summary
The system SHALL display a summary of work tasks over the last 7 days.

#### Scenario: User views stats
- **WHEN** the user navigates to the "Stats" tab
- **THEN** it shows a bar chart of total hours worked per day for the last week

### Requirement: Tag Distribution
The system SHALL display a breakdown of tasks by tag.

#### Scenario: User views pie chart
- **WHEN** the user scrolls down on the Stats page
- **THEN** it displays a pie chart showing the percentage of time spent on each tag (e.g., "Dev", "Meeting")
