# React Concepts Playground

A hands-on task planner that demonstrates **20 React concepts** in one working app. Every concept listed below is actually used in the code — not just imported, but wired into a real feature you can interact with.

## Concepts covered

| Concept | Where / What it does |
|---|---|
| `useState` | Form fields, filter state, editing state |
| `useReducer` | Task list managed by a reducer with add / toggle / remove / edit actions |
| `useEffect` | Sync tasks to localStorage, update the document title |
| `useLayoutEffect` | Scroll the new task into view **before** the browser paints |
| `useRef` | Focus the title input after submit; render-count badge in TaskList |
| `useContext` | Theme (light/dark) shared without prop drilling |
| `useId` | Accessible label/input pairs in the task form |
| `useMemo` | Filtered + sorted task list recomputed only when inputs change |
| `useCallback` | Stable handler references so `React.memo` can skip renders |
| `useTransition` | Marks search updates as non-urgent to keep the UI responsive |
| `useDeferredValue` | Defers the displayed search query behind the input value |
| `useDebugValue` | Shows a readable label for `useLocalStorage` in React DevTools |
| `useImperativeHandle` | `SearchInput` exposes a `{ focus, clear }` API instead of a raw DOM node |
| `forwardRef` | `SearchInput` accepts a ref passed down from App |
| `React.memo` | `TaskList` skips re-renders while you type in the form |
| `React.lazy` | `StatsPanel` is code-split into its own JS chunk |
| `Suspense` | Shows a fallback while the lazy `StatsPanel` chunk loads |
| `createPortal` | Toast notifications render directly into `document.body` |
| `Error Boundary` | Class component catches render crashes; try the crash demo panel |
| Custom hook | `useLocalStorage`, `useClock` |

## Things to try

- **Press `/`** anywhere on the page to focus the search box (forwardRef + useImperativeHandle)
- **Add a task** and watch the list scroll to it before paint (useLayoutEffect) and a toast appear (createPortal)
- **Type in the form** and watch the React.memo render counter stay frozen (useCallback + React.memo)
- **Click "Throw an error"** in the crash demo panel — the boundary catches it, the rest of the app keeps running
- **Open React DevTools → Components** and inspect `useLocalStorage` to see the useDebugValue label
- **Sort by Priority or Estimate** in the filter bar (useMemo)
- **Click "Edit title"** on any task card to edit inline
- **Press Ctrl+Enter** in the Notes field to submit the form

## Running locally

```bash
npm install
npm run dev
```

## Stack

- React 19
- Vite 8
- No UI library — all styles are hand-written CSS with CSS custom properties for theming
