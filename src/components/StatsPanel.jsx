// Default export required for React.lazy()
export default function StatsPanel({
  completionRate,
  completedCount,
  remainingCount,
  totalTasks,
}) {
  return (
    <div className="header-stack">
      <div>
        <p className="eyebrow">Derived state</p>
        <h3>Project snapshot</h3>
        <p className="panel-copy">
          These cards are calculated from the task list rather than stored
          separately, which is a useful React pattern.
        </p>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <span>Completion</span>
          <strong>{completionRate}%</strong>
        </article>
        <article className="stat-card">
          <span>Remaining</span>
          <strong>{remainingCount}</strong>
        </article>
        <article className="stat-card">
          <span>Completed</span>
          <strong>{completedCount}</strong>
        </article>
        <article className="stat-card">
          <span>Total tasks</span>
          <strong>{totalTasks}</strong>
        </article>
      </div>

      <div>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={completionRate}
          aria-label="Task completion rate"
        >
          <div
            className="progress-bar"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="panel-copy">Progress bar rendered from computed values.</p>
      </div>
    </div>
  )
}
