## 1. Infrastructure Setup

- [x] 1.1 Install `next-intl` package
- [x] 1.2 Create `src/i18n/request.ts` with cookie-based locale detection (default: `en`)
- [x] 1.3 Update `next.config.ts` with `createNextIntlPlugin()` wrapper
- [x] 1.4 Create `/api/locale` POST route to set `NEXT_LOCALE` cookie

## 2. Translation Files

- [x] 2.1 Create `messages/en.json` with all namespaced translation keys
- [x] 2.2 Create `messages/zh.json` with corresponding Chinese translations

## 3. Layout Integration

- [x] 3.1 Update `src/app/layout.tsx` — add `NextIntlClientProvider`, dynamic `<html lang>` attribute
- [x] 3.2 Pass messages and locale to provider from server-side `getMessages()`

## 4. Component Migration

- [x] 4.1 Migrate `Sidebar.tsx` — navigation labels (录入→Input, 日历→Calendar, 统计→Stats)
- [x] 4.2 Migrate `TaskInput.tsx` — placeholder, form labels, buttons, error messages
- [x] 4.3 Migrate `TaskList.tsx` — empty state, task display, date formatting
- [x] 4.4 Migrate `TaskCalendar.tsx` — weekday headers, month names, empty state
- [x] 4.5 Migrate `TaskBatchConfirmModal.tsx` — modal title, labels, buttons
- [x] 4.6 Migrate `TaskStats.tsx` — chart labels, date range presets, tooltips

## 5. Page Migration

- [x] 5.1 Migrate `tasks/page.tsx` — page title
- [x] 5.2 Migrate `tasks/calendar/page.tsx` — page title
- [x] 5.3 Migrate `tasks/stats/page.tsx` — page title

## 6. Settings Panel

- [x] 6.1 Add language switcher section to `settings-panel.tsx` (English / 中文 options)
- [x] 6.2 Implement locale switch via `/api/locale` POST + `router.refresh()`

## 7. API Layer

- [x] 7.1 Change API error messages in `tasks/route.ts` to English
- [x] 7.2 Verify AI prompt in `parse/route.ts` remains in Chinese (no changes needed)
