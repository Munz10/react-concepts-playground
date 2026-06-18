import { useId, useState } from 'react'

const initialForm = {
  title: '',
  category: 'Coding',
  priority: 'Medium',
  estimate: 30,
  notes: '',
}

export function TaskForm({ onAddTask, titleInputRef }) {
  const [formState, setFormState] = useState(initialForm)
  const titleId = useId()
  const categoryId = useId()
  const priorityId = useId()
  const estimateId = useId()
  const notesId = useId()

  function updateField(event) {
    const { name, value } = event.target
    setFormState((currentForm) => ({
      ...currentForm,
      [name]: name === 'estimate' ? Number(value) : value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (formState.title.trim().length === 0) {
      titleInputRef.current?.focus()
      return
    }

    onAddTask({
      ...formState,
      title: formState.title.trim(),
      notes: formState.notes.trim(),
    })
    setFormState(initialForm)
    titleInputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">Controlled form</p>
        <h3>Add a new task</h3>
        <p className="panel-copy">
          This form uses local component state, generated ids, and a ref that
          returns focus to the title field after submit.
        </p>
      </div>

      <label className="field" htmlFor={titleId}>
        <span>Task title</span>
        <input
          ref={titleInputRef}
          id={titleId}
          name="title"
          value={formState.title}
          onChange={updateField}
          placeholder="Example: Create a reusable card component"
        />
      </label>

      <div className="field-grid">
        <label className="field" htmlFor={categoryId}>
          <span>Category</span>
          <select
            id={categoryId}
            name="category"
            value={formState.category}
            onChange={updateField}
          >
            <option>Coding</option>
            <option>Learning</option>
            <option>Planning</option>
            <option>Debugging</option>
          </select>
        </label>

        <label className="field" htmlFor={priorityId}>
          <span>Priority</span>
          <select
            id={priorityId}
            name="priority"
            value={formState.priority}
            onChange={updateField}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </label>

        <label className="field" htmlFor={estimateId}>
          <span>Estimate (minutes)</span>
          <input
            id={estimateId}
            name="estimate"
            type="number"
            min="5"
            step="5"
            value={formState.estimate}
            onChange={updateField}
          />
        </label>
      </div>

      <label className="field" htmlFor={notesId}>
        <span>Notes</span>
        <textarea
          id={notesId}
          name="notes"
          value={formState.notes}
          onChange={updateField}
          placeholder="Add a short note about what you want to practice."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit(e)
          }}
        />
      </label>

      <button className="submit-button" type="submit">
        Save task <span className="shortcut-hint">Ctrl+Enter</span>
      </button>
    </form>
  )
}
