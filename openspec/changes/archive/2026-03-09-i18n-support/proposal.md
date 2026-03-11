## Why

The application has ~50+ hardcoded Chinese strings across 13 files, making it inaccessible to non-Chinese speakers. Adding internationalization (i18n) support with English as default and Chinese as an option improves usability and sets a foundation for future language additions.

## What Changes

- Install and configure `next-intl` for non-routing (cookie-based) locale management
- Extract all hardcoded UI text into structured translation files (`en.json`, `zh.json`)
- Replace all hardcoded strings in components/pages with `useTranslations()` calls
- Add language switcher to the settings panel (alongside existing theme toggle)
- Dynamic `<html lang>` attribute and date formatting locale
- AI parsing prompt remains in Chinese regardless of UI language (parsing quality preservation)
- API error messages switched to English (language-neutral for API layer)

## Capabilities

### New Capabilities
- `i18n`: Internationalization infrastructure — locale detection, translation loading, language switching, and dynamic locale-aware formatting

### Modified Capabilities
<!-- No existing specs to modify -->

## Impact

- **Dependencies**: Added `next-intl` package
- **Config**: `next.config.ts` wrapped with `createNextIntlPlugin()`
- **Layout**: `src/app/layout.tsx` — added `NextIntlClientProvider`, dynamic `lang` attribute
- **New files**: `messages/en.json`, `messages/zh.json`, `src/i18n/request.ts`, `src/app/api/locale/route.ts`
- **Modified files**: All 13 component/page files — replaced hardcoded text with translation keys
- **Settings panel**: Added language selection section
- **API layer**: Error message in `tasks/route.ts` changed to English
