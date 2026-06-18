import { Component } from 'react'

// Error Boundary must be a class component — hooks cannot catch render errors.
// getDerivedStateFromError fires when any child throws during render.
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <p className="error-title">Error boundary caught a crash</p>
          <code className="error-message">{this.state.error?.message}</code>
          <button
            type="button"
            className="ghost-button"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Reset boundary
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
