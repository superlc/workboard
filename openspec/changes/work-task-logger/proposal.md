## Why

Knowledge workers often struggle to track their time and tasks accurately. Traditional time tracking tools require manual entry which creates friction. This tool aims to reduce that friction by allowing users to log tasks using natural language ("fixed login bug at 10am"), leveraging AI to parse and structure the data automatically. This enables effortless time tracking and insights into work patterns.

## What Changes

- Introduce a new "Work Task Logger" tool within the existing Next.js application.
- Add a natural language input interface for task logging.
- Implement AI-powered parsing of task descriptions (time, content, tags) using CodeBuddy SDK.
- Create a local SQLite database for persistent task storage.
- Build a calendar-based dashboard for viewing daily tasks.
- Develop a statistics view for weekly work analysis.
- Implement a disambiguation flow for unclear task inputs.

## Capabilities

### New Capabilities

- `task-entry`: Natural language input parsing and task creation logic.
- `task-storage`: Local SQLite database schema and access layer.
- `task-dashboard`: UI for calendar view, task lists, and interaction.
- `task-analytics`: Statistical visualization of work data.

### Modified Capabilities

<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->

## Impact

- **Frontend**: New pages/components for Task Logger (Dashboard, Input, Stats).
- **Backend**: New API routes for NLP parsing and SQLite interaction.
- **Database**: Introduction of SQLite database file.
- **Dependencies**: Adding `better-sqlite3` (or similar), `codebuddy-sdk` integration.
