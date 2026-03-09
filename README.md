# TaskTracker

A focused, production-quality task management app built with React Native and Expo.

## Setup

```bash
npm install
npx expo start
```

Scan the QR code with [Expo Go](https://expo.dev/client) on your device, or press `i` for iOS simulator / `a` for Android emulator.

## Features

- **Add tasks** — input validation prevents empty submissions
- **Toggle completion** — tap the checkbox or task text to toggle; completed tasks show strikethrough
- **Delete tasks** — per-task delete button with visual confirmation styling
- **Filter views** — All / Active / Done filters with live counts
- **Clear completed** — bulk-remove all finished tasks in one tap
- **Persistent storage** — tasks survive app restarts via AsyncStorage
- **Empty states** — contextual messaging per filter (not a generic fallback)

## Architecture

```
src/
├── components/
│   ├── TaskInput.tsx    # Controlled input with validation and error state
│   ├── TaskItem.tsx     # Individual task row with animated toggle
│   ├── FilterBar.tsx    # All/Active/Done tab selector with counts
│   └── EmptyState.tsx   # Context-aware empty list messaging
├── hooks/
│   └── useTasks.ts      # All task logic and AsyncStorage persistence
├── types/
│   └── index.ts         # Task interface and FilterType
└── constants/
    └── index.ts         # Design tokens: colors, spacing, radii, fonts
```

### Key Technical Decisions

**`AsyncStorage` for persistence** — Lightweight, zero-config local storage appropriate for this scope. It integrates naturally with React's `useEffect` pattern: load on mount, save on every mutation. No network, no backend, no complexity overhead.

**`FlatList` over `ScrollView`** — Even for a modest task list, `FlatList` is the right default. It virtualizes off-screen rows, which means the list stays performant as data grows. Using `ScrollView` with `.map()` would be simpler but wouldn't demonstrate production awareness.

**Custom `useTasks` hook** — All state and side-effects live in one place, making `App.tsx` a thin coordinator. This makes the logic independently testable and keeps components purely presentational.

**`uuid` for IDs** — Avoids timestamp-based ID collisions (two tasks added in rapid succession would share an ID if using `Date.now()`). Required `react-native-get-random-values` polyfill for the crypto API in the React Native environment.

**TypeScript strict mode** — Enabled via `tsconfig.json`. The `Task` interface and `FilterType` union type eliminate an entire class of runtime bugs.

### Edge Cases Handled

| Case | Handling |
|---|---|
| Empty input submission | Button disabled + inline error message with auto-dismiss |
| Rapid task additions | `uuid` prevents ID collisions |
| AsyncStorage load failure | `try/catch` with graceful fallback to empty state |
| Long task text | `numberOfLines={3}` with ellipsis, avoids unbounded layout |
| Filter with no results | Per-filter empty state copy, not a generic "no data" |
| App backgrounded/killed | Tasks reload from storage on next mount |

## Future Improvements

Given more time, I would prioritize:

1. **Unit tests** — Jest + React Native Testing Library for the `useTasks` hook. The hook's pure functions (`addTask`, `toggleTask`, `deleteTask`) are easy to test in isolation by mocking `AsyncStorage`.

2. **Swipe-to-delete** — `react-native-gesture-handler` + `Reanimated` for a swipe-left gesture on `TaskItem`. More intuitive than the explicit delete button.

3. **Optimistic updates + error recovery** — Currently, AsyncStorage write failures are silently logged. A production app would revert state on write failure and surface an error toast.

4. **State management** — For a larger feature set (labels, priorities, due dates, multiple lists), Zustand would be a clean fit. The `useTasks` hook already isolates state logic, making migration straightforward.

5. **Accessibility audit** — `accessibilityLabel` and `accessibilityRole` are set on interactive elements. A full audit would add `accessibilityHint`, test with VoiceOver/TalkBack, and verify tap target sizes meet WCAG guidelines.

6. **Animations** — `react-native-reanimated` for task entry/exit transitions and a spring animation on checkbox toggle. Currently uses a simple `Animated.sequence` scale pulse.

7. **Due dates and sorting** — A date picker on task creation, with sort-by-due-date and overdue highlighting.
