import { useTheme } from '../context/useTheme.js'
import { useClock } from '../hooks/useClock.js'

export function Header({ totalTasks, completedCount, onReset }) {
  const { theme, toggleTheme } = useTheme()
  const now = useClock()

  return (
    <header className="app-header">
      <div className="brand-block">
        <h2>React Concepts Playground</h2>
        <p className="meta-line">
          {completedCount} of {totalTasks} tasks complete
        </p>
        <p className="meta-line">
          {now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </p>
      </div>

      <div className="header-actions">
        <button type="button" className="theme-toggle" onClick={toggleTheme}>
          {theme === 'night' ? 'Switch to sunrise' : 'Switch to night'}
        </button>
        <button type="button" className="ghost-button" onClick={onReset}>
          Reset demo data
        </button>
      </div>
    </header>
  )
}
