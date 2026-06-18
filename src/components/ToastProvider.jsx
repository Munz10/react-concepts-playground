import { createContext, useCallback, useContext, useState } from 'react'
import { createPortal } from 'react-dom'

const ToastContext = createContext(null)

// createPortal: the toast stack is rendered as a direct child of document.body,
// completely outside the React tree's DOM position — that's the whole point.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {createPortal(
        <div className="toast-stack" aria-live="polite" aria-atomic="false">
          {toasts.map((t) => (
            <div key={t.id} className={`toast toast-${t.type}`}>
              {t.message}
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
