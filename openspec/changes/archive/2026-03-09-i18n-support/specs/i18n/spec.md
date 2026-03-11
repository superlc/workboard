## ADDED Requirements

### Requirement: Locale detection and default language
The system SHALL default to English (`en`) when no locale preference is stored. The system SHALL read locale preference from the `NEXT_LOCALE` cookie.

#### Scenario: First visit with no cookie
- **WHEN** a user visits the application for the first time
- **THEN** the UI SHALL render in English and `<html lang="en">` SHALL be set

#### Scenario: Returning visit with cookie
- **WHEN** a user visits with `NEXT_LOCALE=zh` cookie set
- **THEN** the UI SHALL render in Chinese and `<html lang="zh">` SHALL be set

### Requirement: Language switching
The system SHALL provide a language switcher in the settings panel allowing users to switch between English and Chinese.

#### Scenario: Switch from English to Chinese
- **WHEN** a user selects "中文" in the settings panel
- **THEN** the system SHALL set `NEXT_LOCALE=zh` cookie and refresh the page to display Chinese UI

#### Scenario: Switch from Chinese to English
- **WHEN** a user selects "English" in the settings panel
- **THEN** the system SHALL set `NEXT_LOCALE=en` cookie and refresh the page to display English UI

### Requirement: All UI text translated
The system SHALL translate all user-facing text including navigation labels, page titles, form labels, placeholders, button text, empty states, error messages, tooltips, and date-related labels.

#### Scenario: Navigation labels in English
- **WHEN** locale is `en`
- **THEN** sidebar navigation SHALL show "Input", "Calendar", "Stats"

#### Scenario: Navigation labels in Chinese
- **WHEN** locale is `zh`
- **THEN** sidebar navigation SHALL show "录入", "日历", "统计"

### Requirement: Date formatting follows locale
The system SHALL format dates according to the active locale, including weekday names, month names, and date patterns.

#### Scenario: Calendar weekday headers in English
- **WHEN** locale is `en`
- **THEN** calendar weekday headers SHALL display "Sun", "Mon", "Tue", etc.

#### Scenario: Calendar weekday headers in Chinese
- **WHEN** locale is `zh`
- **THEN** calendar weekday headers SHALL display "日", "一", "二", etc.

### Requirement: AI prompt isolation
The AI parsing system prompt SHALL remain in Chinese regardless of the UI locale to preserve parsing quality for Chinese language input.

#### Scenario: English UI does not affect AI prompt
- **WHEN** locale is `en` and user submits a task via natural language input
- **THEN** the AI system prompt sent to the parsing API SHALL be in Chinese

### Requirement: Translation file structure
The system SHALL maintain translation files at `messages/en.json` and `messages/zh.json` using namespaced keys compatible with `next-intl`.

#### Scenario: Translation key coverage
- **WHEN** a new UI string is added to any component
- **THEN** corresponding keys SHALL exist in both `en.json` and `zh.json`
