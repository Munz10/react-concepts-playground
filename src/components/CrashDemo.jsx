import { useState } from 'react'

function BuggyWidget({ shouldCrash }) {
  if (shouldCrash) {
    throw new Error("Cannot read properties of null (reading 'map')")
  }
  return (
    <p className="panel-copy crash-stable">
      Component is rendering normally. Click the button to simulate a crash and
      watch the boundary catch it — without taking down the rest of the app.
    </p>
  )
}

export function CrashDemo() {
  const [crashed, setCrashed] = useState(false)

  return (
    <div className="header-stack">
      <div>
        <p className="eyebrow">Error Boundary</p>
        <h3>Crash demo</h3>
        <p className="panel-copy">
          Wrap any subtree in an{' '}
          <code className="inline-code">{'<ErrorBoundary>'}</code> to catch
          render errors and show a fallback instead of a blank screen.
        </p>
      </div>
      <BuggyWidget shouldCrash={crashed} />
      {!crashed && (
        <button
          type="button"
          className="ghost-button"
          style={{ justifySelf: 'start' }}
          onClick={() => setCrashed(true)}
        >
          Throw an error →
        </button>
      )}
    </div>
  )
}
