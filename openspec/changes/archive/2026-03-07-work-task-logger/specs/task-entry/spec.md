## ADDED Requirements

### Requirement: Natural Language Input
The system SHALL accept free-form text input from the user describing a task.

#### Scenario: User enters a task description
- **WHEN** the user types "Fixed login bug at 10am" and presses Enter
- **THEN** the system sends the text to the backend for parsing

### Requirement: AI Parsing
The system SHALL use CodeBuddy SDK to parse the natural language input into structured data (content, start_time, end_time, tags).

#### Scenario: Successful parsing
- **WHEN** the backend receives "Fixed login bug at 10am"
- **THEN** it returns a JSON object with `content="Fixed login bug"`, `start_time="10:00"`, `tags=["Dev"]`

#### Scenario: Ambiguous input
- **WHEN** the backend receives "Worked on report" (no time specified)
- **THEN** it returns a JSON object with `content="Worked on report"`, `start_time=null`, `end_time=null`

### Requirement: Task Confirmation
The system SHALL present a confirmation modal with the parsed data before saving.

#### Scenario: User reviews parsed data
- **WHEN** the parsing is complete
- **THEN** a modal appears showing the extracted fields, allowing the user to edit or confirm

#### Scenario: User saves task
- **WHEN** the user clicks "Confirm" in the modal
- **THEN** the task is saved to the database and the modal closes
