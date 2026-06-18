import { useDeferredValue } from 'react'
import { SearchInput } from './SearchInput.jsx'

const filters = [
  { label: 'All tasks', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'done' },
]

const sorts = [
  { label: 'Default', value: 'default' },
  { label: 'Priority', value: 'priority' },
  { label: 'Estimate', value: 'estimate' },
]

export function FilterBar({
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  searchInput,
  onSearchChange,
  isPending,
  searchRef,
}) {
  const deferredSearch = useDeferredValue(searchInput)

  return (
    <div className="filters">
      <div className="filter-row">
        <div className="filter-group" aria-label="Task status filters">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={`filter-chip ${statusFilter === filter.value ? 'active' : ''}`}
              onClick={() => onStatusChange(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="filter-group" aria-label="Sort tasks">
          <span className="sort-label">Sort:</span>
          {sorts.map((sort) => (
            <button
              key={sort.value}
              type="button"
              className={`filter-chip ${sortBy === sort.value ? 'active' : ''}`}
              onClick={() => onSortChange(sort.value)}
            >
              {sort.label}
            </button>
          ))}
        </div>
      </div>

      <label className="search-wrap">
        <span className="eyebrow">
          Search tasks{' '}
          <span className="shortcut-hint">— press / to focus</span>
        </span>
        {/* SearchInput uses forwardRef + useImperativeHandle so the parent
            can call searchRef.current.focus() / .clear() */}
        <SearchInput
          ref={searchRef}
          value={searchInput}
          onChange={onSearchChange}
          placeholder="Search by title, category, notes, or priority"
        />
      </label>

      <p className="search-note">
        {isPending ? 'Updating…' : `useDeferredValue query: "${deferredSearch}"`}
      </p>
    </div>
  )
}
