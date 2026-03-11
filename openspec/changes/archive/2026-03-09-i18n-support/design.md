## Context

The application is a personal work task logger built with Next.js App Router, using React client components. All UI text (~50+ strings across 13 files) is hardcoded in Chinese. The app has no SEO requirements (personal tool), uses `better-sqlite3` for data, and already has a settings panel with theme switching.

## Goals / Non-Goals

**Goals:**
- Support English (default) and Chinese UI languages
- Persist language preference across sessions
- Translate all user-facing UI text including placeholders, labels, buttons, tooltips, date formats
- Provide language switching in the existing settings panel
- Preserve AI parsing quality regardless of UI language

**Non-Goals:**
- URL-based routing (`/en/tasks`, `/zh/tasks`) — unnecessary for a personal tool
- Server-side locale negotiation (Accept-Language header)
- Translating user-generated content (task names, tags)
- Translating AI system prompts (kept in Chinese for parsing quality)
- Supporting more than 2 languages initially

## Decisions

### 1. Library: next-intl (non-routing mode)
**Choice**: `next-intl` with cookie-based locale storage, no `[locale]` route segment.

**Alternatives considered**:
- Hand-rolled i18n (React Context + JSON files): Simpler but lacks TypeScript safety, interpolation, plurals
- react-i18next: Mature but poor App Router integration
- next-intl with routing: Requires middleware + route restructuring, overkill for personal tool

**Rationale**: next-intl provides professional i18n infrastructure (type safety, ICU format support) while its non-routing mode avoids restructuring the entire route tree.

### 2. Locale persistence: Cookie via API route
**Choice**: `/api/locale` POST endpoint sets `NEXT_LOCALE` cookie, `router.refresh()` triggers re-render.

**Rationale**: next-intl reads locale from `request.ts` during server rendering. Cookies are the simplest mechanism that works across server/client boundary without URL changes.

### 3. Translation file format: Flat JSON with dot-notation namespaces
**Choice**: `messages/en.json` and `messages/zh.json` with namespace grouping (`nav.*`, `input.*`, `stats.*`, etc.)

**Rationale**: JSON is the next-intl standard. Namespace grouping via `useTranslations('namespace')` keeps component code clean.

### 4. AI Prompt isolation
**Choice**: AI system prompt in `/api/parse/route.ts` stays in Chinese, never translated.

**Rationale**: The prompt contains Chinese examples critical for parsing Chinese natural language input. Users switching UI to English will still input tasks in Chinese.

### 5. Date formatting
**Choice**: Dynamic locale parameter in `toLocaleDateString()` calls, reading from `useLocale()`.

**Rationale**: Dates like weekday names and month formats should match the UI language.

## Risks / Trade-offs

- [Cookie-based locale requires page refresh] → `router.refresh()` provides near-instant reload; acceptable UX for infrequent language changes
- [No TypeScript key checking for translation strings] → next-intl supports this via generated types, can be added later
- [AI prompt mismatch with UI language] → Documented as intentional; users expect to input Chinese regardless of UI language
