import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useTransition,
} from 'react'
import './App.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ToastProvider, useToast } from './components/ToastProvider.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import { CrashDemo } from './components/CrashDemo.jsx'
import { FilterBar } from './components/FilterBar.jsx'
import { Header } from './components/Header.jsx'
import { TaskForm } from './components/TaskForm.jsx'
import { TaskList } from './components/TaskList.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'

// React.lazy: StatsPanel is code-split — Vite emits a separate JS chunk
// that is only fetched when this component first renders.
const StatsPanel = lazy(() => import('./components/StatsPanel.jsx'))

const initialTasks = [
  {
    id: 1,
    title: 'Read React component structure',
    category: 'Learning',
    priority: 'High',
    estimate: 25,
    completed: true,
    notes: 'Focus on props, JSX, and one-way data flow.',
  },
  {
    id: 2,
    title: 'Build a controlled form',
    category: 'Coding',
    priority: 'Medium',
    estimate: 40,
    completed: false,
    notes: 'Use multiple inputs and store them in component state.',
  },
  {
    id: 3,
    title: 'Practice useEffect cleanup',
    category: 'Debugging',
    priority: 'Low',
    estimate: 15,
    completed: false,
    notes: 'Try an interval or event listener example.',
  },
]

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 }

function taskReducer(tasks, action) {
  switch (action.type) {
    case 'add':
      return [action.task, ...tasks]
    case 'toggle':
      return tasks.map((t) =>
        t.id === action.id ? { ...t, completed: !t.completed } : t,
      )
    case 'remove':
      return tasks.filter((t) => t.id !== action.id)
    case 'edit':
      return tasks.map((t) =>
        t.id === action.id ? { ...t, title: action.title } : t,
      )
    case 'seed':
      return action.tasks
    default:
      return tasks
  }
}

function AppContent() {
  const toast = useToast()

  const [storedTasks, setStoredTasks] = useLocalStorage(
    'react-concepts-playground.tasks',
    initialTasks,
  )
  const [tasks, dispatch] = useReducer(taskReducer, storedTasks)
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [editingId, setEditingId] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  const titleInputRef = useRef(null)
  // searchRef holds the imperative handle exposed by SearchInput (forwardRef +
  // useImperativeHandle). Pressing "/" calls searchRef.current.focus().
  const searchRef = useRef(null)

  useEffect(() => {
    dispatch({ type: 'seed', tasks: storedTasks })
  }, [storedTasks])

  useEffect(() => {
    setStoredTasks(tasks)
  }, [tasks, setStoredTasks])

  useEffect(() => {
    const completed = tasks.filter((t) => t.completed).length
    document.title = `React Concept Lab (${completed}/${tasks.length})`
  }, [tasks])

  // "/" keyboard shortcut — calls the imperative API on SearchInput
  useEffect(() => {
    function onKeyDown(e) {
      const tag = document.activeElement?.tagName
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const filteredTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'done' ? task.completed : !task.completed)
      const q = query.trim().toLowerCase()
      const matchesQuery =
        q.length === 0 ||
        [task.title, task.category, task.priority, task.notes]
          .join(' ')
          .toLowerCase()
          .includes(q)
      return matchesStatus && matchesQuery
    })
    if (sortBy === 'priority')
      return [...filtered].sort(
        (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
      )
    if (sortBy === 'estimate')
      return [...filtered].sort((a, b) => a.estimate - b.estimate)
    return filtered
  }, [tasks, statusFilter, query, sortBy])

  const completedCount = tasks.filter((t) => t.completed).length
  const remainingCount = tasks.length - completedCount
  const completionRate =
    tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100)

  // useCallback keeps handler references stable across renders so
  // React.memo(TaskList) can skip re-renders when the form changes.
  const handleToggleTask = useCallback((id) => {
    dispatch({ type: 'toggle', id })
    toast('Task status updated', 'info')
  }, [toast])

  const handleRemoveTask = useCallback((id) => {
    dispatch({ type: 'remove', id })
    toast('Task removed', 'error')
  }, [toast])

  const handleSaveEdit = useCallback((id, newTitle) => {
    dispatch({ type: 'edit', id, title: newTitle })
    setEditingId(null)
    toast('Title saved')
  }, [toast])

  function handleAddTask(taskInput) {
    dispatch({
      type: 'add',
      task: { id: Date.now(), ...taskInput, completed: false },
    })
    toast(`"${taskInput.title.slice(0, 28)}" added`)
  }

  function handleSearchChange(value) {
    setSearchInput(value)
    startTransition(() => setQuery(value))
  }

  function handleReset() {
    setStoredTasks(initialTasks)
    setStatusFilter('all')
    setSortBy('default')
    setEditingId(null)
    setSearchInput('')
    setQuery('')
    titleInputRef.current?.focus()
    toast('Demo data reset', 'info')
  }

  return (
    <main className="app-shell">
      <Header
        totalTasks={tasks.length}
        completedCount={completedCount}
        onReset={handleReset}
      />

      <section className="hero-card">
        <div>
          <p className="eyebrow">React project starter</p>
          <h1>Concept board</h1>
          <p className="hero-copy">
            A task planner that demonstrates 20 React concepts in one app —
            hooks, memoisation, code splitting, portals, error boundaries,
            imperative refs, and local persistence.
          </p>
        </div>
        <div className="concept-grid" aria-label="React concepts used">
          {[
            'useState',
            'useReducer',
            'useEffect',
            'useLayoutEffect',
            'useRef',
            'useContext',
            'useId',
            'useMemo',
            'useCallback',
            'useTransition',
            'useDeferredValue',
            'useDebugValue',
            'useImperativeHandle',
            'forwardRef',
            'React.memo',
            'React.lazy',
            'Suspense',
            'createPortal',
            'Error Boundary',
            'Custom hook',
          ].map((concept) => (
            <span key={concept} className="concept-pill">
              {concept}
            </span>
          ))}
        </div>
      </section>

      <div className="workspace-grid">
        <section className="panel panel-form">
          <TaskForm onAddTask={handleAddTask} titleInputRef={titleInputRef} />
        </section>

        {/* Suspense: shows fallback while the lazy StatsPanel chunk loads */}
        <section className="panel panel-stats">
          <Suspense
            fallback={<div className="suspense-fallback">Loading stats…</div>}
          >
            <StatsPanel
              completionRate={completionRate}
              completedCount={completedCount}
              remainingCount={remainingCount}
              totalTasks={tasks.length}
            />
          </Suspense>
        </section>
      </div>

      {/* Error Boundary wraps CrashDemo — a crash inside is caught here,
          leaving the rest of the app fully functional */}
      <section className="panel" style={{ marginBottom: '24px' }}>
        <ErrorBoundary>
          <CrashDemo />
        </ErrorBoundary>
      </section>

      <section className="panel">
        {/* searchRef threads down to SearchInput via forwardRef so the "/"
            keyboard shortcut can call searchRef.current.focus() */}
        <FilterBar
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchInput={searchInput}
          onSearchChange={handleSearchChange}
          isPending={isPending}
          searchRef={searchRef}
        />

        <TaskList
          tasks={filteredTasks}
          editingId={editingId}
          onToggleTask={handleToggleTask}
          onRemoveTask={handleRemoveTask}
          onStartEdit={setEditingId}
          onSaveEdit={handleSaveEdit}
        />
      </section>
    </main>
  )
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
