## 1. Setup & Infrastructure

- [x] 1.1 Install `better-sqlite3` and `codebuddy-sdk` (or configure API calls if SDK not available as npm package).
- [x] 1.2 Create `lib/db.ts` to initialize SQLite database and `tasks` table.
- [x] 1.3 Add `.env` configuration for CodeBuddy API Key.

## 2. Backend Implementation

- [ ] 2.1 Create API route `/api/tasks` for GET (list) and POST (create).
- [ ] 2.2 Create API route `/api/parse` for calling CodeBuddy SDK to parse natural language.
- [ ] 2.3 Implement SQLite data access functions (insert, select by date, select range).

## 3. Frontend Components

- [ ] 3.1 Create `TaskInput` component with Command Bar UI.
- [ ] 3.2 Create `TaskConfirmationModal` for reviewing AI-parsed data.
- [ ] 3.3 Create `TaskCalendar` component for date selection.
- [ ] 3.4 Create `TaskList` component to display tasks for the selected day.
- [ ] 3.5 Create `TaskStats` component with charts (Weekly Summary, Tag Distribution).

## 4. Integration & Pages

- [ ] 4.1 Create main page `/tasks` (or modify `page.tsx`) to assemble Dashboard.
- [ ] 4.2 Connect `TaskInput` to `/api/parse` and then `TaskConfirmationModal`.
- [ ] 4.3 Connect `TaskConfirmationModal` to `/api/tasks` (POST).
- [ ] 4.4 Connect `TaskCalendar` and `TaskList` to `/api/tasks` (GET).
- [ ] 4.5 Create `/tasks/stats` page (or tab) and connect to analytics data.

## 5. Polish

- [ ] 5.1 Add loading states for AI parsing and data fetching.
- [ ] 5.2 Add error handling for network or parsing failures.
- [ ] 5.3 Verify data persistence by restarting the app.
