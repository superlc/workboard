## Context

The user needs a local-first, AI-powered tool to log work tasks effortlessly. The current application is a Next.js project. We need to integrate a new module that handles natural language input, parses it via AI, and stores structured task data locally.

## Goals / Non-Goals

**Goals:**
- Provide a frictionless interface for logging tasks (Command Bar).
- Accurately parse natural language into structured task data (Time, Content, Tags) using AI.
- Store tasks persistently in a local SQLite database.
- Visualize daily tasks on a calendar and weekly stats on a dashboard.
- Handle ambiguous inputs with a user confirmation UI.

**Non-Goals:**
- Cloud sync or multi-device support (Local-first).
- Team collaboration features.
- Complex project management hierarchies (Epics, Stories).

## Decisions

### Database: SQLite with `better-sqlite3`
- **Rationale**: Zero-configuration, serverless, and stores data in a single file (`work-tasks.db`), making it easy to backup and move. `better-sqlite3` is synchronous and very fast, suitable for local desktop-like web apps.
- **Alternative**: PostgreSQL (Requires server setup), JSON files (Hard to query/aggregate).

### AI Parsing: CodeBuddy SDK
- **Rationale**: Leverages existing configuration and capabilities.
- **Flow**: Client -> Next.js API Route -> CodeBuddy SDK -> Client (Confirmation) -> API (Save).

### UI Architecture: Server Components + Client Islands
- **Dashboard**: Server Component to fetch initial data.
- **Input/Calendar**: Client Components for interactivity.
- **Styling**: Tailwind CSS (Consistent with existing project).

### Data Schema
- **Table `tasks`**:
  - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
  - `content`: TEXT (What was done)
  - `start_time`: DATETIME (ISO8601)
  - `end_time`: DATETIME (ISO8601)
  - `tags`: TEXT (JSON array of strings)
  - `created_at`: DATETIME DEFAULT CURRENT_TIMESTAMP

## Risks / Trade-offs

- **AI Latency**: Parsing might take 1-2 seconds.
  - *Mitigation*: Optimistic UI updates or clear loading states.
- **Ambiguity in NLP**: "Fixed bug" (When? How long?).
  - *Mitigation*: Default to "Now - 30mins" if unspecified, but ALWAYS show a confirmation modal for the user to adjust.
- **Local Data Loss**: If the user deletes the `.db` file.
  - *Mitigation*: The file is in the project root (or user data dir), simple to backup.

## Migration Plan

1. Add `better-sqlite3` dependency.
2. Create `lib/db.ts` for database connection and initialization.
3. Create API routes.
4. Build UI components.
