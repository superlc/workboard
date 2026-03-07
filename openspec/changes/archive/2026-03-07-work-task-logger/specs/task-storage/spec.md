## ADDED Requirements

### Requirement: Task Persistence
The system SHALL store task records in a local SQLite database.

#### Scenario: Save a new task
- **WHEN** the backend receives a POST request with task details
- **THEN** it inserts a new row into the `tasks` table with `content`, `start_time`, `end_time`, `tags`

#### Scenario: Retrieve tasks for a day
- **WHEN** the frontend requests tasks for "2026-03-07"
- **THEN** the backend returns all tasks where `start_time` falls on that date

### Requirement: Database Initialization
The system SHALL automatically create the database file and table if they do not exist.

#### Scenario: First run
- **WHEN** the application starts for the first time
- **THEN** it creates `work-tasks.db` and executes the schema migration
