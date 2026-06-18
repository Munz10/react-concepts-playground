import { memo, useLayoutEffect, useRef, useState } from 'react'

function EditableTitle({ initialValue, onSave }) {
  const [value, setValue] = useState(initialValue)

  function commit() {
    onSave(value.trim() || initialValue)
  }

  return (
    <input
      className="edit-title-input"
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') commit()
        if (e.key === 'Escape') onSave(initialValue)
      }}
    />
  )
}

// React.memo: skips re-renders when props are shallowly equal.
// Works hand-in-hand with useCallback handlers in App.
export const TaskList = memo(function TaskList({
  tasks,
  editingId,
  onToggleTask,
  onRemoveTask,
  onStartEdit,
  onSaveEdit,
}) {
  const renderCount = useRef(0)
  renderCount.current += 1

  const listRef = useRef(null)
  const prevLengthRef = useRef(tasks.length)

  // useLayoutEffect fires synchronously after the DOM is mutated but before
  // the browser paints — ideal for scroll adjustments that must not flicker.
  useLayoutEffect(() => {
    if (tasks.length > prevLengthRef.current && listRef.current) {
      listRef.current.firstElementChild?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
    prevLengthRef.current = tasks.length
  }, [tasks.length])

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>No tasks match the current filters</h3>
        <p>Try changing the search or status filter to reveal more items.</p>
      </div>
    )
  }

  return (
    <>
      <p className="memo-badge" title="React.memo render counter">
        <strong>React.memo</strong> render count: <strong>{renderCount.current}</strong>
        <span className="memo-hint"> — type in the form; this number should stay frozen</span>
      </p>
      <ul className="task-list" ref={listRef}>
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`task-card ${task.completed ? 'completed' : ''}`}
          >
            <div className="task-topline">
              {editingId === task.id ? (
                <EditableTitle
                  initialValue={task.title}
                  onSave={(newTitle) => onSaveEdit(task.id, newTitle)}
                />
              ) : (
                <h4>{task.title}</h4>
              )}
              <div className="task-meta">
                <span
                  className={`status-badge priority-badge priority-${task.priority.toLowerCase()}`}
                >
                  {task.priority}
                </span>
                <span className="status-badge">{task.category}</span>
                <span className="status-badge">{task.estimate} min</span>
              </div>
            </div>
            <p>{task.notes || 'No extra notes for this task yet.'}</p>
            <div className="task-actions">
              <button
                type="button"
                className="task-button primary"
                onClick={() => onToggleTask(task.id)}
              >
                {task.completed ? 'Mark active' : 'Mark complete'}
              </button>
              <button
                type="button"
                className="task-button secondary"
                onClick={() =>
                  editingId === task.id
                    ? onSaveEdit(task.id, task.title)
                    : onStartEdit(task.id)
                }
              >
                {editingId === task.id ? 'Cancel edit' : 'Edit title'}
              </button>
              <button
                type="button"
                className="task-button secondary"
                onClick={() => onRemoveTask(task.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
})
